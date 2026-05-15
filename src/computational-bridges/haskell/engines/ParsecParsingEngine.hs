{-
𓂀 HASKELL ENGINE 1: PARSEC PARSING ENGINE 𓂀
Parser Combinators for Domain-Specific Languages
Attribution: Alfredo Medina Hernandez | Medina Tech | May 2026
-}

{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE FlexibleContexts #-}

module ParsecParsingEngine
    ( -- * Engine Info
      engineId
    , engineCapabilities
      -- * Core Parsers
    , parseMedinaExpr
    , parseSymbolic
    , parseLambda
    , parseContract
      -- * DSL Support
    , parseDSL
    , compileDSL
      -- * Integration
    , initEngine
    ) where

import Text.Parsec
import Text.Parsec.String (Parser)
import Text.Parsec.Expr
import qualified Text.Parsec.Token as Token
import Text.Parsec.Language (emptyDef)
import Data.Text (Text)
import qualified Data.Text as T
import Control.Monad.IO.Class

import MedinaBridge

-- ═══════════════════════════════════════════════════════════════════════════
-- ENGINE METADATA
-- ═══════════════════════════════════════════════════════════════════════════

engineId :: Text
engineId = "HAS-PA-001"

engineName :: Text
engineName = "ParsecParsingEngine"

engineCapabilities :: [Text]
engineCapabilities =
    [ "parser_combinators"
    , "dsl_parsing"
    , "symbolic_expression_parsing"
    , "lambda_calculus_parsing"
    , "contract_language_parsing"
    , "error_recovery"
    ]

-- ═══════════════════════════════════════════════════════════════════════════
-- MEDINA EXPRESSION AST
-- ═══════════════════════════════════════════════════════════════════════════

data MedinaExpr
    = MVar Text                      -- Variable
    | MNum Double                    -- Number
    | MStr Text                      -- String
    | MBool Bool                     -- Boolean
    | MLam Text MedinaExpr           -- Lambda abstraction
    | MApp MedinaExpr MedinaExpr     -- Application
    | MBinOp Op MedinaExpr MedinaExpr -- Binary operation
    | MIf MedinaExpr MedinaExpr MedinaExpr -- Conditional
    | MList [MedinaExpr]             -- List
    | MPhi MedinaExpr                -- φ-harmonic wrapper
    deriving (Show, Eq)

data Op = Add | Sub | Mul | Div | Mod | Eq | Lt | Gt | And | Or
    deriving (Show, Eq)

-- ═══════════════════════════════════════════════════════════════════════════
-- LEXER DEFINITION
-- ═══════════════════════════════════════════════════════════════════════════

medinaLexer :: Token.TokenParser ()
medinaLexer = Token.makeTokenParser emptyDef
    { Token.commentStart    = "{-"
    , Token.commentEnd      = "-}"
    , Token.commentLine     = "--"
    , Token.identStart      = letter <|> char '_'
    , Token.identLetter     = alphaNum <|> char '_' <|> char '\''
    , Token.opStart         = oneOf "+-*/%=<>&|"
    , Token.opLetter        = oneOf "+-*/%=<>&|"
    , Token.reservedNames   = ["if", "then", "else", "let", "in", 
                               "true", "false", "phi", "lambda", "λ"]
    , Token.reservedOpNames = ["+", "-", "*", "/", "%", "==", "<", ">", 
                               "&&", "||", "->", "=>"]
    }

-- Lexer components
identifier :: Parser String
identifier = Token.identifier medinaLexer

reserved :: String -> Parser ()
reserved = Token.reserved medinaLexer

reservedOp :: String -> Parser ()
reservedOp = Token.reservedOp medinaLexer

parens :: Parser a -> Parser a
parens = Token.parens medinaLexer

brackets :: Parser a -> Parser a
brackets = Token.brackets medinaLexer

braces :: Parser a -> Parser a
braces = Token.braces medinaLexer

natural :: Parser Integer
natural = Token.natural medinaLexer

float :: Parser Double
float = Token.float medinaLexer

stringLiteral :: Parser String
stringLiteral = Token.stringLiteral medinaLexer

whiteSpace :: Parser ()
whiteSpace = Token.whiteSpace medinaLexer

comma :: Parser String
comma = Token.comma medinaLexer

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPRESSION PARSER
-- ═══════════════════════════════════════════════════════════════════════════

-- | Parse a complete MEDINA expression
parseMedinaExpr :: String -> Either ParseError MedinaExpr
parseMedinaExpr = parse (whiteSpace >> expr <* eof) "medina"

-- | Main expression parser
expr :: Parser MedinaExpr
expr = buildExpressionParser operators term

operators :: [[Operator String () Identity MedinaExpr]]
operators =
    [ [Infix (reservedOp "*"  >> return (MBinOp Mul)) AssocLeft,
       Infix (reservedOp "/"  >> return (MBinOp Div)) AssocLeft]
    , [Infix (reservedOp "+"  >> return (MBinOp Add)) AssocLeft,
       Infix (reservedOp "-"  >> return (MBinOp Sub)) AssocLeft]
    , [Infix (reservedOp "==" >> return (MBinOp Eq))  AssocNone,
       Infix (reservedOp "<"  >> return (MBinOp Lt))  AssocNone,
       Infix (reservedOp ">"  >> return (MBinOp Gt))  AssocNone]
    , [Infix (reservedOp "&&" >> return (MBinOp And)) AssocRight]
    , [Infix (reservedOp "||" >> return (MBinOp Or))  AssocRight]
    ]

term :: Parser MedinaExpr
term = parens expr
   <|> ifExpr
   <|> lamExpr
   <|> phiExpr
   <|> listExpr
   <|> boolLit
   <|> numLit
   <|> strLit
   <|> var

-- | Variable
var :: Parser MedinaExpr
var = MVar . T.pack <$> identifier

-- | Number literal
numLit :: Parser MedinaExpr
numLit = MNum <$> (try float <|> fromIntegral <$> natural)

-- | String literal
strLit :: Parser MedinaExpr
strLit = MStr . T.pack <$> stringLiteral

-- | Boolean literal
boolLit :: Parser MedinaExpr
boolLit = (reserved "true" >> return (MBool True))
      <|> (reserved "false" >> return (MBool False))

-- | Lambda expression
lamExpr :: Parser MedinaExpr
lamExpr = do
    reserved "lambda" <|> reserved "λ"
    param <- identifier
    reservedOp "->"
    body <- expr
    return $ MLam (T.pack param) body

-- | Conditional expression
ifExpr :: Parser MedinaExpr
ifExpr = do
    reserved "if"
    cond <- expr
    reserved "then"
    thenBranch <- expr
    reserved "else"
    elseBranch <- expr
    return $ MIf cond thenBranch elseBranch

-- | φ-harmonic expression
phiExpr :: Parser MedinaExpr
phiExpr = do
    reserved "phi"
    inner <- parens expr
    return $ MPhi inner

-- | List expression
listExpr :: Parser MedinaExpr
listExpr = MList <$> brackets (expr `sepBy` comma)

-- ═══════════════════════════════════════════════════════════════════════════
-- SYMBOLIC EXPRESSION PARSING
-- ═══════════════════════════════════════════════════════════════════════════

data SymbolicExpr
    = SVar String
    | SNum Double
    | SAdd SymbolicExpr SymbolicExpr
    | SMul SymbolicExpr SymbolicExpr
    | SPow SymbolicExpr SymbolicExpr
    | SDiff SymbolicExpr String
    | SInt SymbolicExpr String
    deriving (Show, Eq)

-- | Parse symbolic mathematical expression
parseSymbolic :: String -> Either ParseError SymbolicExpr
parseSymbolic = parse symbolicExpr "symbolic"

symbolicExpr :: Parser SymbolicExpr
symbolicExpr = buildExpressionParser symbolicOps symbolicTerm

symbolicOps :: [[Operator String () Identity SymbolicExpr]]
symbolicOps =
    [ [Infix (reservedOp "^" >> return SPow) AssocRight]
    , [Infix (reservedOp "*" >> return SMul) AssocLeft]
    , [Infix (reservedOp "+" >> return SAdd) AssocLeft]
    ]

symbolicTerm :: Parser SymbolicExpr
symbolicTerm = parens symbolicExpr
           <|> diffExpr
           <|> intExpr
           <|> (SNum <$> (try float <|> fromIntegral <$> natural))
           <|> (SVar <$> identifier)

diffExpr :: Parser SymbolicExpr
diffExpr = do
    _ <- string "diff"
    e <- parens symbolicExpr
    _ <- comma
    v <- identifier
    return $ SDiff e v

intExpr :: Parser SymbolicExpr
intExpr = do
    _ <- string "int"
    e <- parens symbolicExpr
    _ <- comma
    v <- identifier
    return $ SInt e v

-- ═══════════════════════════════════════════════════════════════════════════
-- LAMBDA CALCULUS PARSING
-- ═══════════════════════════════════════════════════════════════════════════

data LambdaTerm
    = LVar String
    | LAbs String LambdaTerm
    | LApp LambdaTerm LambdaTerm
    deriving (Show, Eq)

-- | Parse lambda calculus term
parseLambda :: String -> Either ParseError LambdaTerm
parseLambda = parse lambdaTerm "lambda"

lambdaTerm :: Parser LambdaTerm
lambdaTerm = chainl1 atomicTerm (return LApp)

atomicTerm :: Parser LambdaTerm
atomicTerm = parens lambdaTerm <|> abstraction <|> variable

variable :: Parser LambdaTerm
variable = LVar <$> identifier

abstraction :: Parser LambdaTerm
abstraction = do
    _ <- char 'λ' <|> char '\\'
    param <- identifier
    _ <- char '.'
    body <- lambdaTerm
    return $ LAbs param body

-- ═══════════════════════════════════════════════════════════════════════════
-- CONTRACT LANGUAGE PARSING
-- ═══════════════════════════════════════════════════════════════════════════

data ContractAST
    = Contract Text [ContractClause]
    deriving (Show, Eq)

data ContractClause
    = Obligation Text MedinaExpr
    | Permission Text MedinaExpr
    | Prohibition Text MedinaExpr
    deriving (Show, Eq)

-- | Parse MEDINA contract
parseContract :: String -> Either ParseError ContractAST
parseContract = parse contractParser "contract"

contractParser :: Parser ContractAST
contractParser = do
    whiteSpace
    _ <- string "contract"
    name <- T.pack <$> stringLiteral
    clauses <- braces (many clause)
    return $ Contract name clauses

clause :: Parser ContractClause
clause = obligationClause <|> permissionClause <|> prohibitionClause

obligationClause :: Parser ContractClause
obligationClause = do
    _ <- string "obligation"
    name <- T.pack <$> stringLiteral
    _ <- string ":"
    condition <- expr
    return $ Obligation name condition

permissionClause :: Parser ContractClause
permissionClause = do
    _ <- string "permission"
    name <- T.pack <$> stringLiteral
    _ <- string ":"
    condition <- expr
    return $ Permission name condition

prohibitionClause :: Parser ContractClause
prohibitionClause = do
    _ <- string "prohibition"
    name <- T.pack <$> stringLiteral
    _ <- string ":"
    condition <- expr
    return $ Prohibition name condition

-- ═══════════════════════════════════════════════════════════════════════════
-- DSL SUPPORT
-- ═══════════════════════════════════════════════════════════════════════════

-- | Parse domain-specific language
parseDSL :: String -> String -> Either ParseError [MedinaExpr]
parseDSL dslName input = parse (many expr) dslName input

-- | Compile DSL to executable form
compileDSL :: [MedinaExpr] -> Text
compileDSL exprs = T.intercalate "\n" (map showExpr exprs)
  where
    showExpr (MVar v) = v
    showExpr (MNum n) = T.pack (show n)
    showExpr _ = "<expr>"

-- ═══════════════════════════════════════════════════════════════════════════
-- ENGINE INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════════

initEngine :: MonadIO m => m ()
initEngine = do
    liftIO $ putStrLn $ "Initializing " ++ T.unpack engineName
    registerEngine engineId engineCapabilities
