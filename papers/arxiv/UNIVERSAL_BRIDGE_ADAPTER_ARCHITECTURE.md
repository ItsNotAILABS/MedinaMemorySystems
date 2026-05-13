# Universal Bridge & Adapter Architecture

## Complete Integration Layer for Bridges, Adapters, Wrappers, and Embeddings

**Paper ID:** BRIDGE-001  
**Version:** 1.0  
**Status:** ACTIVE RESEARCH  
**Date:** May 2026  
**Domain:** Integration Architecture, Adapters, Wrappers, Interoperability

---

## Abstract

This paper defines the complete **Universal Bridge and Adapter Architecture** for MEDINA/NOVA, enabling seamless integration with any external system, API, protocol, or data format. We establish a unified framework for bridges, adapters, wrappers, and embedding layers that allow sovereign intelligence to interface with the entire technological ecosystem.

---

## 1. The Integration Imperative

### 1.1 Why Universal Integration

| Challenge | Solution |
|-----------|----------|
| **Heterogeneous systems** | Unified adapter layer |
| **Different protocols** | Protocol bridges |
| **Incompatible data formats** | Format transformers |
| **Legacy systems** | Wrapper libraries |
| **Real-time requirements** | Streaming bridges |

### 1.2 Integration Landscape

```
INTEGRATION LANDSCAPE:

                    MEDINA/NOVA
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌───────────┐     ┌───────────┐     ┌───────────┐
│  EXTERNAL │     │   CLOUD   │     │  LEGACY   │
│   APIs    │     │ SERVICES  │     │  SYSTEMS  │
├───────────┤     ├───────────┤     ├───────────┤
│ REST      │     │ AWS       │     │ Mainframe │
│ GraphQL   │     │ Azure     │     │ COBOL     │
│ gRPC      │     │ GCP       │     │ SOAP      │
│ WebSocket │     │ ICP       │     │ FTP       │
└───────────┘     └───────────┘     └───────────┘
    │                    │                    │
    └────────────────────┴────────────────────┘
                         │
                  BRIDGE LAYER
```

---

## 2. Bridge Architecture

### 2.1 Bridge Types

| Bridge Type | Description | Use Case |
|-------------|-------------|----------|
| **Protocol Bridge** | Connect different protocols | REST ↔ gRPC |
| **Data Bridge** | Transform data formats | JSON ↔ XML ↔ Protobuf |
| **Event Bridge** | Propagate events | Kafka ↔ Pub/Sub ↔ RabbitMQ |
| **Auth Bridge** | Translate authentication | OAuth ↔ JWT ↔ API Key |
| **State Bridge** | Synchronize state | In-memory ↔ Database |

### 2.2 Bridge Architecture

```
BRIDGE ARCHITECTURE:

┌─────────────────────────────────────────────────────────────┐
│                      BRIDGE CORE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────┐              ┌───────────────┐           │
│  │   SOURCE      │              │   TARGET      │           │
│  │   CONNECTOR   │              │   CONNECTOR   │           │
│  └───────┬───────┘              └───────┬───────┘           │
│          │                              ▲                    │
│          ▼                              │                    │
│  ┌───────────────┐              ┌───────────────┐           │
│  │   INBOUND     │              │   OUTBOUND    │           │
│  │   TRANSFORM   │──────────────│   TRANSFORM   │           │
│  └───────────────┘              └───────────────┘           │
│          │                              ▲                    │
│          └──────────┬───────────────────┘                   │
│                     │                                        │
│          ┌──────────▼──────────┐                            │
│          │  CANONICAL FORMAT   │                            │
│          │  (MEDINA Internal)  │                            │
│          └─────────────────────┘                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Protocol Bridges

```typescript
// Protocol Bridge Interface
interface ProtocolBridge {
  source_protocol: Protocol;
  target_protocol: Protocol;
  
  // Bidirectional conversion
  forward(request: SourceRequest): TargetRequest;
  backward(response: TargetResponse): SourceResponse;
  
  // Metadata mapping
  map_headers(source: Headers): Headers;
  map_status(source: Status): Status;
  
  // Error translation
  translate_error(error: SourceError): TargetError;
}

// Example: REST to gRPC Bridge
class RESTToGRPCBridge implements ProtocolBridge {
  forward(rest_request: RESTRequest): GRPCRequest {
    return {
      service: this.map_path_to_service(rest_request.path),
      method: this.map_verb_to_method(rest_request.method),
      message: this.json_to_protobuf(rest_request.body),
      metadata: this.headers_to_metadata(rest_request.headers)
    };
  }
  
  backward(grpc_response: GRPCResponse): RESTResponse {
    return {
      status: this.grpc_status_to_http(grpc_response.status),
      body: this.protobuf_to_json(grpc_response.message),
      headers: this.metadata_to_headers(grpc_response.metadata)
    };
  }
}
```

---

## 3. Adapter Architecture

### 3.1 Adapter Types

| Adapter Type | Description | Pattern |
|--------------|-------------|---------|
| **API Adapter** | Wrap external APIs | Facade |
| **Data Adapter** | Transform data models | Transformer |
| **Service Adapter** | Adapt service interfaces | Decorator |
| **Legacy Adapter** | Wrap legacy systems | Anti-corruption |
| **Stream Adapter** | Convert stream formats | Pipe |

### 3.2 Adapter Structure

```
ADAPTER STRUCTURE:

┌─────────────────────────────────────────────────────────────┐
│                     MEDINA INTERFACE                         │
│              (Standard MEDINA API contract)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      ADAPTER LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              INTERFACE TRANSLATION                    │    │
│  │  • Method signature mapping                          │    │
│  │  • Parameter conversion                              │    │
│  │  • Return value adaptation                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              DATA MODEL MAPPING                       │    │
│  │  • Schema transformation                             │    │
│  │  • Type conversion                                   │    │
│  │  • Null handling                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              ERROR TRANSLATION                        │    │
│  │  • Error code mapping                                │    │
│  │  • Exception conversion                              │    │
│  │  • Retry logic                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEM                           │
│              (Third-party API/Service)                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Adapter Examples

```typescript
// API Adapter Example: OpenAI Integration
class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI;
  
  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
  }
  
  // Adapt to MEDINA LLM interface
  async generate(request: MedinaGenerateRequest): Promise<MedinaGenerateResponse> {
    // Transform MEDINA format to OpenAI format
    const openai_request = {
      model: this.map_model(request.model),
      messages: this.transform_messages(request.messages),
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      stream: request.stream
    };
    
    // Call external API
    const response = await this.client.chat.completions.create(openai_request);
    
    // Transform back to MEDINA format
    return {
      content: response.choices[0].message.content,
      model: request.model,
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens
      },
      metadata: {
        finishReason: response.choices[0].finish_reason,
        externalId: response.id
      }
    };
  }
  
  private map_model(medina_model: string): string {
    const mapping = {
      'medina-fast': 'gpt-4o-mini',
      'medina-quality': 'gpt-4o',
      'medina-reasoning': 'o1-preview'
    };
    return mapping[medina_model] || medina_model;
  }
}

// Database Adapter Example: PostgreSQL
class PostgresAdapter implements DatabaseAdapter {
  async query<T>(request: MedinaQuery): Promise<QueryResult<T>> {
    // Transform MEDINA query to SQL
    const sql = this.medina_to_sql(request);
    
    // Execute
    const result = await this.pool.query(sql.text, sql.values);
    
    // Transform result
    return {
      rows: result.rows.map(row => this.transform_row<T>(row, request.mapping)),
      count: result.rowCount,
      metadata: {
        executionTime: result.duration,
        plan: result.explain
      }
    };
  }
}
```

---

## 4. Wrapper Architecture

### 4.1 Wrapper Types

| Wrapper Type | Purpose | Example |
|--------------|---------|---------|
| **SDK Wrapper** | Simplify SDK usage | AWS SDK wrapper |
| **Library Wrapper** | Provide MEDINA interface | NumPy wrapper |
| **Service Wrapper** | Encapsulate service calls | Email service wrapper |
| **Resource Wrapper** | Manage resources | Connection pool wrapper |
| **Security Wrapper** | Add security layers | Encryption wrapper |

### 4.2 Wrapper Pattern

```
WRAPPER PATTERN:

External Library/SDK
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                       WRAPPER                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SIMPLIFICATION:                                            │
│  • Hide complexity                                          │
│  • Provide sensible defaults                                │
│  • Reduce boilerplate                                       │
│                                                              │
│  STANDARDIZATION:                                           │
│  • Consistent interface                                     │
│  • MEDINA naming conventions                                │
│  • Unified error handling                                   │
│                                                              │
│  AUGMENTATION:                                              │
│  • Add logging                                              │
│  • Add metrics                                              │
│  • Add caching                                              │
│  • Add retry logic                                          │
│                                                              │
│  PROTECTION:                                                │
│  • Input validation                                         │
│  • Output sanitization                                      │
│  • Rate limiting                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
   MEDINA Application Code
```

### 4.3 Wrapper Examples

```typescript
// AWS S3 Wrapper
class MedinaStorage implements StorageInterface {
  private s3: S3Client;
  private metrics: MetricsCollector;
  private cache: Cache;
  
  async store(key: string, data: Buffer, options?: StoreOptions): Promise<StoreResult> {
    // Validate input
    this.validateKey(key);
    this.validateData(data);
    
    // Add MEDINA metadata
    const metadata = {
      'x-medina-timestamp': Date.now().toString(),
      'x-medina-content-hash': await hash(data),
      ...options?.metadata
    };
    
    // Log operation
    this.logger.info('Storing object', { key, size: data.length });
    
    try {
      // Execute with retry
      const result = await this.retry(async () => {
        return await this.s3.send(new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: data,
          Metadata: metadata
        }));
      }, 3);
      
      // Record metrics
      this.metrics.record('storage.store', {
        size: data.length,
        duration: Date.now() - startTime
      });
      
      // Update cache
      await this.cache.set(key, data, options?.ttl);
      
      return {
        key,
        etag: result.ETag,
        version: result.VersionId
      };
      
    } catch (error) {
      // Translate error
      throw new MedinaStorageError(
        'Failed to store object',
        this.translateS3Error(error)
      );
    }
  }
}

// Email Service Wrapper
class MedinaEmail implements EmailInterface {
  private providers: Map<string, EmailProvider>;
  
  async send(email: MedinaEmailRequest): Promise<SendResult> {
    // Validate
    this.validateEmail(email);
    
    // Select provider based on configuration
    const provider = this.selectProvider(email);
    
    // Transform to provider format
    const providerRequest = this.transformRequest(email, provider);
    
    // Send with fallback
    try {
      return await provider.send(providerRequest);
    } catch (primaryError) {
      this.logger.warn('Primary provider failed, trying fallback');
      const fallback = this.getFallbackProvider(provider);
      return await fallback.send(this.transformRequest(email, fallback));
    }
  }
}
```

---

## 5. Embedding Architecture

### 5.1 Embedding Types

| Embedding Type | Purpose | Use Case |
|----------------|---------|----------|
| **Code Embedding** | Embed external code | Plugin systems |
| **Runtime Embedding** | Embed interpreters | Python in Rust |
| **Component Embedding** | Embed UI components | React in MEDINA |
| **Model Embedding** | Embed ML models | ONNX runtime |
| **Protocol Embedding** | Embed protocols | WASM modules |

### 5.2 Embedding Architecture

```
EMBEDDING ARCHITECTURE:

┌─────────────────────────────────────────────────────────────┐
│                     MEDINA HOST                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              EMBEDDING RUNTIME                        │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │                                                      │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐       │    │
│  │  │  Python   │  │   WASM    │  │   ONNX    │       │    │
│  │  │  Runtime  │  │  Runtime  │  │  Runtime  │       │    │
│  │  └───────────┘  └───────────┘  └───────────┘       │    │
│  │       │              │              │               │    │
│  │       └──────────────┼──────────────┘               │    │
│  │                      │                              │    │
│  │         ┌────────────▼────────────┐                │    │
│  │         │   ISOLATION BOUNDARY    │                │    │
│  │         │   (Memory, Resources)   │                │    │
│  │         └─────────────────────────┘                │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  HOST ←→ EMBEDDED INTERFACE:                                │
│  • Function calls                                           │
│  • Memory sharing                                           │
│  • Event propagation                                        │
│  • Resource management                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Embedding Examples

```typescript
// Python Embedding
class PythonEmbedding implements EmbeddingRuntime {
  private interpreter: PyO3Interpreter;
  
  async execute(code: string, context: ExecutionContext): Promise<ExecutionResult> {
    // Create isolated environment
    const env = await this.createEnvironment(context);
    
    // Set up context
    env.set('medina_input', context.input);
    env.set('medina_memory', this.createMemoryInterface(context));
    
    // Execute with timeout
    const result = await Promise.race([
      this.interpreter.execute(code, env),
      timeout(context.timeout)
    ]);
    
    // Extract results
    return {
      output: env.get('medina_output'),
      returnValue: result,
      logs: env.get('medina_logs'),
      metrics: this.collectMetrics(env)
    };
  }
}

// WASM Module Embedding
class WASMEmbedding implements EmbeddingRuntime {
  private runtime: WASMRuntime;
  private modules: Map<string, WASMModule>;
  
  async loadModule(wasm: ArrayBuffer, imports: Imports): Promise<ModuleInstance> {
    // Validate WASM binary
    this.validateWASM(wasm);
    
    // Compile and instantiate
    const module = await this.runtime.compile(wasm);
    const instance = await this.runtime.instantiate(module, {
      ...this.standardImports(),
      ...imports
    });
    
    // Register for management
    const id = generateId();
    this.modules.set(id, instance);
    
    return {
      id,
      exports: this.wrapExports(instance.exports),
      memory: instance.memory
    };
  }
}

// ML Model Embedding
class ONNXEmbedding implements ModelRuntime {
  private session: InferenceSession;
  
  async infer(inputs: TensorMap): Promise<TensorMap> {
    // Validate input shapes
    this.validateInputs(inputs);
    
    // Create ONNX tensors
    const onnxInputs = Object.entries(inputs).reduce((acc, [name, tensor]) => {
      acc[name] = new Tensor(tensor.type, tensor.data, tensor.dims);
      return acc;
    }, {});
    
    // Run inference
    const results = await this.session.run(onnxInputs);
    
    // Convert back to MEDINA format
    return Object.entries(results).reduce((acc, [name, tensor]) => {
      acc[name] = {
        type: tensor.type,
        data: tensor.data,
        dims: tensor.dims
      };
      return acc;
    }, {});
  }
}
```

---

## 6. Integration Registry

### 6.1 Registry Structure

```
INTEGRATION REGISTRY:

┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION CATALOG                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLOUD INTEGRATIONS:                                        │
│  ├─ AWS (S3, Lambda, DynamoDB, SQS, SNS, ...)             │
│  ├─ Azure (Blob, Functions, CosmosDB, Service Bus, ...)   │
│  ├─ GCP (GCS, Cloud Functions, BigQuery, Pub/Sub, ...)    │
│  ├─ ICP (Canisters, II, Ledger, ...)                      │
│  └─ Cloudflare (Workers, R2, D1, ...)                     │
│                                                              │
│  AI SERVICES:                                               │
│  ├─ OpenAI (GPT, Embeddings, Whisper, DALL-E)             │
│  ├─ Anthropic (Claude)                                     │
│  ├─ Google (Gemini, Vertex AI)                            │
│  ├─ Hugging Face (Models, Datasets)                       │
│  └─ Replicate (Open source models)                        │
│                                                              │
│  DATABASES:                                                 │
│  ├─ PostgreSQL, MySQL, SQLite                              │
│  ├─ MongoDB, Redis, Elasticsearch                          │
│  ├─ Pinecone, Weaviate, Qdrant (Vector)                   │
│  └─ Neo4j, ArangoDB (Graph)                                │
│                                                              │
│  MESSAGING:                                                 │
│  ├─ Kafka, RabbitMQ, Redis Streams                         │
│  ├─ WebSocket, Server-Sent Events                          │
│  └─ Email (SendGrid, SES, Mailgun)                         │
│                                                              │
│  EXTERNAL APIS:                                             │
│  ├─ Payment (Stripe, PayPal)                               │
│  ├─ Communication (Twilio, Slack, Discord)                 │
│  ├─ Social (Twitter, LinkedIn, GitHub)                     │
│  └─ Data (Weather, Finance, Maps)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Integration Definition Format

```yaml
# Integration Definition Example

integration:
  name: stripe-payments
  version: "1.0"
  category: payment
  
  connection:
    auth_type: api_key
    credentials:
      - name: STRIPE_API_KEY
        required: true
        secret: true
      - name: STRIPE_WEBHOOK_SECRET
        required: false
        secret: true
    base_url: "https://api.stripe.com/v1"
    
  capabilities:
    - create_payment
    - create_subscription
    - create_customer
    - handle_webhook
    
  rate_limits:
    requests_per_second: 100
    burst: 200
    
  retry_policy:
    max_retries: 3
    backoff: exponential
    retryable_codes: [429, 500, 502, 503, 504]
    
  health_check:
    endpoint: /health
    interval: 60s
    timeout: 10s
    
  mapping:
    MedinaPaymentRequest:
      to: StripePaymentIntent
      fields:
        amount: amount
        currency: currency
        customerId: customer
        metadata: metadata
```

---

## 7. Data Format Transformers

### 7.1 Format Support Matrix

| Format | Read | Write | Stream | Schema |
|--------|------|-------|--------|--------|
| **JSON** | ✓ | ✓ | ✓ | JSON Schema |
| **XML** | ✓ | ✓ | ✓ | XSD |
| **YAML** | ✓ | ✓ | - | JSON Schema |
| **Protobuf** | ✓ | ✓ | ✓ | .proto |
| **Avro** | ✓ | ✓ | ✓ | Avro Schema |
| **Parquet** | ✓ | ✓ | ✓ | Arrow |
| **CSV/TSV** | ✓ | ✓ | ✓ | Inferred |
| **MessagePack** | ✓ | ✓ | ✓ | - |
| **CBOR** | ✓ | ✓ | ✓ | - |

### 7.2 Transformer Interface

```typescript
interface DataTransformer {
  // Transform between formats
  transform<S, T>(
    data: S,
    sourceFormat: Format,
    targetFormat: Format,
    options?: TransformOptions
  ): T;
  
  // Schema conversion
  convertSchema(
    schema: Schema,
    sourceFormat: Format,
    targetFormat: Format
  ): Schema;
  
  // Streaming transform
  createTransformStream(
    sourceFormat: Format,
    targetFormat: Format
  ): TransformStream;
}

// Example usage
const transformer = new DataTransformer();

// JSON to Protobuf
const protobuf = transformer.transform(
  jsonData,
  Format.JSON,
  Format.PROTOBUF,
  { schema: 'user.proto' }
);

// CSV to Parquet with schema inference
const parquet = transformer.transform(
  csvData,
  Format.CSV,
  Format.PARQUET,
  { inferSchema: true }
);
```

---

## 8. Protocol Definitions

### 8.1 Bridge Protocol Suite

```
BRIDGE-001: Universal Bridge Architecture
├── BRIDGE-PROTO: Protocol bridges
├── BRIDGE-DATA: Data format bridges
├── BRIDGE-EVENT: Event bridges
├── BRIDGE-AUTH: Authentication bridges
└── BRIDGE-STATE: State synchronization bridges

ADAPTER-001: Adapter Framework
├── ADAPTER-API: API adapters
├── ADAPTER-DB: Database adapters
├── ADAPTER-MSG: Messaging adapters
├── ADAPTER-CLOUD: Cloud service adapters
└── ADAPTER-LEGACY: Legacy system adapters

WRAP-001: Wrapper Framework
├── WRAP-SDK: SDK wrappers
├── WRAP-LIB: Library wrappers
├── WRAP-SVC: Service wrappers
└── WRAP-RES: Resource wrappers

EMBED-001: Embedding Framework
├── EMBED-CODE: Code embedding (Python, JS, etc.)
├── EMBED-WASM: WebAssembly embedding
├── EMBED-MODEL: ML model embedding
└── EMBED-COMP: Component embedding
```

### 8.2 Integration with Sovereign Protocols

| Protocol | Bridge Integration |
|----------|-------------------|
| **PLI-001** | Bridges enable cross-language calling |
| **NLP-001** | API adapters for external NLP services |
| **DSL-001** | DSL for integration definitions |
| **AIML-001** | Model embedding for inference |
| **WORLD-001** | Bridges connect VR worlds to external services |

---

## 9. Quality & Reliability

### 9.1 Circuit Breaker Pattern

```typescript
class IntegrationCircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failures: number = 0;
  private lastFailure: Date | null = null;
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new CircuitOpenError('Circuit is open');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailure = new Date();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

### 9.2 Health Monitoring

```yaml
health_monitoring:
  checks:
    - name: connectivity
      interval: 30s
      timeout: 10s
      
    - name: latency
      interval: 60s
      threshold_ms: 500
      
    - name: error_rate
      interval: 60s
      threshold_percent: 5
      
  alerts:
    - condition: "health.score < 0.8"
      severity: warning
      notify: [ops_team]
      
    - condition: "health.score < 0.5"
      severity: critical
      notify: [ops_team, on_call]
      
  dashboards:
    - integration_health_overview
    - latency_percentiles
    - error_breakdown
```

---

## 10. Conclusion

The Universal Bridge & Adapter Architecture enables MEDINA/NOVA to:

1. **Connect** to any external system through bridges
2. **Adapt** any interface to MEDINA standards
3. **Wrap** any library for consistent usage
4. **Embed** any runtime for extended capabilities
5. **Transform** any data format seamlessly

Integration is not complexity—it is **extensibility**. BRIDGE-001 makes the entire technological ecosystem accessible.

---

*This paper is part of the Sovereign Protocol Canon.*  
*Extends: PLI-001, DSL-001*  
*Protocol: BRIDGE-001 (Universal Bridge Architecture)*  
*© 2026 ItsNotAILABS. Released under ISIL-1.1.*
