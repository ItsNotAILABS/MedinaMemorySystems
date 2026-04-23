// MIT License — Copyright (c) 2026 ItsNotAILABS

/**
 * medina-translate
 * ─────────────────────────────────────────────────────────────────────────────
 * Cross-ecosystem translation engine.
 *
 * Translates ItsNotAILABS packages and protocols into target ecosystem
 * artifacts automatically:
 *
 *   NPM       → JavaScript/TypeScript packages (Node.js)
 *   Maven     → Java/Kotlin packages (JVM)
 *   NuGet     → .NET/C# packages (Microsoft platform)
 *   RubyGems  → Ruby packages
 *   Docker    → Container images (sovereign image registry)
 *   PyPI      → Python packages
 *
 * The same sovereign package, built once, distributed everywhere.
 *
 * MIT License — ItsNotAILABS
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type TargetEcosystem =
  | 'npm'       // JavaScript/TypeScript — Node.js
  | 'maven'     // Java/Kotlin — JVM
  | 'nuget'     // C#/F#/VB — .NET
  | 'rubygems'  // Ruby
  | 'docker'    // Container image
  | 'pypi'      // Python
  | 'medina';   // Native ItsNotAILABS sovereign package

export interface TranslationSource {
  /** Source package name */
  packageName: string;
  /** Source version */
  version: string;
  /** Source ecosystem (almost always 'medina' for ItsNotAILABS packages) */
  sourceEcosystem: TargetEcosystem;
  /** Exported symbols to translate */
  exports: ExportSymbol[];
  /** Package metadata */
  metadata: PackageMetadata;
}

export interface ExportSymbol {
  name: string;
  kind: 'class' | 'interface' | 'function' | 'constant' | 'type';
  /** Docstring to carry forward */
  doc?: string;
  /** Type signature (TypeScript) */
  typeSignature?: string;
}

export interface PackageMetadata {
  description: string;
  license: string;
  author: string;
  homepage?: string;
  keywords: string[];
}

export interface TranslationResult {
  target: TargetEcosystem;
  packageName: string;
  version: string;
  /** Generated manifest file content (pom.xml, .csproj, Gemspec, Dockerfile, etc.) */
  manifest: string;
  /** Translation notes */
  notes: string[];
  /** Any symbols that could not be translated */
  untranslatable: string[];
}

export interface TranslationOptions {
  targetNamespace?: string;
  includeComments?: boolean;
  preserveLicense?: boolean;
}

// ─── Ecosystem Translators ────────────────────────────────────────────────────

export abstract class EcosystemTranslator {
  abstract readonly ecosystem: TargetEcosystem;
  abstract translate(source: TranslationSource, opts?: TranslationOptions): TranslationResult;
  protected mapVersion(v: string): string { return v; }
  protected sanitizeName(name: string): string {
    return name.replace(/[@/]/g, '').replace(/-/g, '_').toLowerCase();
  }
}

export class MavenTranslator extends EcosystemTranslator {
  readonly ecosystem: TargetEcosystem = 'maven';
  translate(source: TranslationSource, opts: TranslationOptions = {}): TranslationResult {
    const groupId = opts.targetNamespace ?? 'com.itsnotailabs';
    const artifactId = this.sanitizeName(source.packageName);
    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>${groupId}</groupId>
  <artifactId>${artifactId}</artifactId>
  <version>${source.version}</version>
  <packaging>jar</packaging>
  <name>${source.packageName}</name>
  <description>${source.metadata.description}</description>
  <licenses>
    <license><name>${source.metadata.license}</name></license>
  </licenses>
  <dependencies/>
</project>`;
    return { target: 'maven', packageName: `${groupId}:${artifactId}`, version: source.version,
             manifest, notes: ['JVM target: Java 17+'], untranslatable: [] };
  }
}

export class NuGetTranslator extends EcosystemTranslator {
  readonly ecosystem: TargetEcosystem = 'nuget';
  translate(source: TranslationSource, opts: TranslationOptions = {}): TranslationResult {
    const ns = opts.targetNamespace ?? 'ItsNotAILABS';
    const id = source.packageName.replace(/[^a-zA-Z0-9.]/g, '.');
    const manifest = `<package xmlns="http://schemas.microsoft.com/packaging/2013/05/nuspec.xsd">
  <metadata>
    <id>${ns}.${id}</id>
    <version>${source.version}</version>
    <description>${source.metadata.description}</description>
    <authors>${source.metadata.author}</authors>
    <license type="expression">${source.metadata.license}</license>
    <tags>${source.metadata.keywords.join(' ')}</tags>
  </metadata>
</package>`;
    return { target: 'nuget', packageName: `${ns}.${id}`, version: source.version,
             manifest, notes: ['.NET 8+ target'], untranslatable: [] };
  }
}

export class RubyGemsTranslator extends EcosystemTranslator {
  readonly ecosystem: TargetEcosystem = 'rubygems';
  translate(source: TranslationSource, opts: TranslationOptions = {}): TranslationResult {
    const name = this.sanitizeName(source.packageName);
    const manifest = `Gem::Specification.new do |spec|
  spec.name          = "${name}"
  spec.version       = "${source.version}"
  spec.summary       = "${source.metadata.description}"
  spec.description   = "${source.metadata.description}"
  spec.license       = "${source.metadata.license}"
  spec.authors       = ["${source.metadata.author}"]
  spec.required_ruby_version = ">= 3.0"
end`;
    return { target: 'rubygems', packageName: name, version: source.version,
             manifest, notes: ['Ruby 3.0+ target'], untranslatable: [] };
  }
}

export class DockerTranslator extends EcosystemTranslator {
  readonly ecosystem: TargetEcosystem = 'docker';
  translate(source: TranslationSource, _opts: TranslationOptions = {}): TranslationResult {
    const imgName = this.sanitizeName(source.packageName);
    const manifest = `FROM node:20-alpine
LABEL org.opencontainers.image.title="${source.packageName}"
LABEL org.opencontainers.image.version="${source.version}"
LABEL org.opencontainers.image.description="${source.metadata.description}"
LABEL org.opencontainers.image.vendor="ItsNotAILABS"
LABEL org.opencontainers.image.licenses="${source.metadata.license}"
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index.js"]`;
    return { target: 'docker', packageName: `itsnotailabs/${imgName}:${source.version}`,
             version: source.version, manifest, notes: ['Alpine-based Node.js 20 image'], untranslatable: [] };
  }
}

// ─── Translation Engine ───────────────────────────────────────────────────────

export class MedinaTranslationEngine {
  private translators = new Map<TargetEcosystem, EcosystemTranslator>([
    ['maven', new MavenTranslator()],
    ['nuget', new NuGetTranslator()],
    ['rubygems', new RubyGemsTranslator()],
    ['docker', new DockerTranslator()],
  ]);

  /** Register a custom ecosystem translator */
  registerTranslator(translator: EcosystemTranslator): void {
    this.translators.set(translator.ecosystem, translator);
  }

  /** Translate a package to one target ecosystem */
  translate(source: TranslationSource, target: TargetEcosystem,
            opts?: TranslationOptions): TranslationResult {
    const translator = this.translators.get(target);
    if (!translator) throw new Error(`No translator registered for ecosystem: ${target}`);
    return translator.translate(source, opts);
  }

  /** Translate to all registered ecosystems at once */
  translateAll(source: TranslationSource, opts?: TranslationOptions): TranslationResult[] {
    return Array.from(this.translators.values()).map(t => t.translate(source, opts));
  }

  /** List registered target ecosystems */
  getTargets(): TargetEcosystem[] { return Array.from(this.translators.keys()); }
}
