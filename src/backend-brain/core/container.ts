// Backend Brain Dependency Injection Container

import {
  InputAnalyzer,
  ContextArchitect,
  DomainTranslator,
  PromptCompiler,
  ConstraintValidator,
  FewShotOrchestrator,
  OutputFormatter,
  BackendBrainConfig,
} from '../types';
import { ErrorHandler, createError } from '../types/errors';

// ============================================================================
// DEPENDENCY INJECTION TYPES
// ============================================================================

export type ServiceIdentifier<T = any> = string | symbol | (new (...args: any[]) => T);

export interface ServiceDefinition<T = any> {
  identifier: ServiceIdentifier<T>;
  factory: (...args: any[]) => T | Promise<T>;
  dependencies?: ServiceIdentifier[];
  singleton?: boolean;
  lazy?: boolean;
}

export interface ContainerOptions {
  enableLogging?: boolean;
  enableCircularDependencyDetection?: boolean;
  maxResolutionDepth?: number;
}

// ============================================================================
// SERVICE IDENTIFIERS
// ============================================================================

export const SERVICE_IDENTIFIERS = {
  // Core modules
  INPUT_ANALYZER: Symbol('InputAnalyzer'),
  CONTEXT_ARCHITECT: Symbol('ContextArchitect'),
  DOMAIN_TRANSLATOR: Symbol('DomainTranslator'),
  PROMPT_COMPILER: Symbol('PromptCompiler'),
  CONSTRAINT_VALIDATOR: Symbol('ConstraintValidator'),
  FEW_SHOT_ORCHESTRATOR: Symbol('FewShotOrchestrator'),
  OUTPUT_FORMATTER: Symbol('OutputFormatter'),

  // Configuration
  CONFIG: Symbol('BackendBrainConfig'),

  // External services
  SUPABASE_CLIENT: Symbol('SupabaseClient'),
  GEMINI_CLIENT: Symbol('GeminiClient'),
  EMBEDDING_SERVICE: Symbol('EmbeddingService'),

  // Utilities
  ERROR_HANDLER: Symbol('ErrorHandler'),
  LOGGER: Symbol('Logger'),
  CACHE: Symbol('Cache'),
} as const;

// ============================================================================
// DEPENDENCY INJECTION CONTAINER
// ============================================================================

export class BackendBrainContainer {
  private services = new Map<ServiceIdentifier, ServiceDefinition>();
  private instances = new Map<ServiceIdentifier, any>();
  private resolutionStack: ServiceIdentifier[] = [];
  private options: ContainerOptions;

  constructor(options: ContainerOptions = {}) {
    this.options = {
      enableLogging: false,
      enableCircularDependencyDetection: true,
      maxResolutionDepth: 10,
      ...options,
    };

    this.registerDefaultServices();
  }

  // ============================================================================
  // SERVICE REGISTRATION
  // ============================================================================

  register<T>(definition: ServiceDefinition<T>): this {
    if (this.services.has(definition.identifier)) {
      throw createError.invalidInput(
        `Service ${String(definition.identifier)} is already registered`,
        { identifier: definition.identifier }
      );
    }

    this.services.set(definition.identifier, definition);
    this.log(`Registered service: ${String(definition.identifier)}`);
    return this;
  }

  registerSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...args: any[]) => T | Promise<T>,
    dependencies?: ServiceIdentifier[]
  ): this {
    return this.register({
      identifier,
      factory,
      dependencies,
      singleton: true,
      lazy: false,
    });
  }

  registerTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...args: any[]) => T | Promise<T>,
    dependencies?: ServiceIdentifier[]
  ): this {
    return this.register({
      identifier,
      factory,
      dependencies,
      singleton: false,
      lazy: false,
    });
  }

  registerLazy<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...args: any[]) => T | Promise<T>,
    dependencies?: ServiceIdentifier[]
  ): this {
    return this.register({
      identifier,
      factory,
      dependencies,
      singleton: true,
      lazy: true,
    });
  }

  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): this {
    this.instances.set(identifier, instance);
    this.log(`Registered instance: ${String(identifier)}`);
    return this;
  }

  // ============================================================================
  // SERVICE RESOLUTION
  // ============================================================================

  async resolve<T>(identifier: ServiceIdentifier<T>): Promise<T> {
    try {
      return await this.internalResolve(identifier);
    } catch (error) {
      this.resolutionStack = []; // Clear stack on error
      throw error;
    }
  }

  resolveSync<T>(identifier: ServiceIdentifier<T>): T {
    const instance = this.instances.get(identifier);
    if (instance !== undefined) {
      return instance;
    }

    const definition = this.services.get(identifier);
    if (!definition) {
      throw createError.invalidInput(
        `Service ${String(identifier)} is not registered`,
        { identifier }
      );
    }

    if (definition.lazy) {
      throw createError.invalidInput(
        `Cannot resolve lazy service ${String(identifier)} synchronously`,
        { identifier }
      );
    }

    // For sync resolution, we can only resolve services without async dependencies
    const dependencies = this.resolveDependenciesSync(definition.dependencies || []);
    const instance = definition.factory(...dependencies);

    if (definition.singleton) {
      this.instances.set(identifier, instance);
    }

    return instance;
  }

  private async internalResolve<T>(identifier: ServiceIdentifier<T>): Promise<T> {
    // Check for circular dependencies
    if (this.options.enableCircularDependencyDetection && this.resolutionStack.includes(identifier)) {
      throw createError.invalidInput(
        `Circular dependency detected: ${this.resolutionStack.map(String).join(' -> ')} -> ${String(identifier)}`,
        { resolutionStack: this.resolutionStack.map(String), identifier: String(identifier) }
      );
    }

    // Check resolution depth
    if (this.resolutionStack.length >= (this.options.maxResolutionDepth || 10)) {
      throw createError.invalidInput(
        `Maximum resolution depth exceeded: ${this.options.maxResolutionDepth}`,
        { resolutionStack: this.resolutionStack.map(String) }
      );
    }

    // Check if instance already exists (singleton)
    const existingInstance = this.instances.get(identifier);
    if (existingInstance !== undefined) {
      return existingInstance;
    }

    // Get service definition
    const definition = this.services.get(identifier);
    if (!definition) {
      throw createError.invalidInput(
        `Service ${String(identifier)} is not registered`,
        { identifier: String(identifier) }
      );
    }

    // Add to resolution stack
    this.resolutionStack.push(identifier);

    try {
      // Resolve dependencies
      const dependencies = await this.resolveDependencies(definition.dependencies || []);

      // Create instance
      const instance = await definition.factory(...dependencies);

      // Store singleton instance
      if (definition.singleton) {
        this.instances.set(identifier, instance);
      }

      this.log(`Resolved service: ${String(identifier)}`);
      return instance;
    } finally {
      // Remove from resolution stack
      this.resolutionStack.pop();
    }
  }

  private async resolveDependencies(dependencies: ServiceIdentifier[]): Promise<any[]> {
    return Promise.all(dependencies.map(dep => this.internalResolve(dep)));
  }

  private resolveDependenciesSync(dependencies: ServiceIdentifier[]): any[] {
    return dependencies.map(dep => this.resolveSync(dep));
  }

  // ============================================================================
  // CONTAINER MANAGEMENT
  // ============================================================================

  isRegistered(identifier: ServiceIdentifier): boolean {
    return this.services.has(identifier) || this.instances.has(identifier);
  }

  unregister(identifier: ServiceIdentifier): boolean {
    const hadService = this.services.delete(identifier);
    const hadInstance = this.instances.delete(identifier);
    
    if (hadService || hadInstance) {
      this.log(`Unregistered service: ${String(identifier)}`);
    }
    
    return hadService || hadInstance;
  }

  clear(): void {
    this.services.clear();
    this.instances.clear();
    this.resolutionStack = [];
    this.log('Container cleared');
  }

  getRegisteredServices(): ServiceIdentifier[] {
    return Array.from(this.services.keys());
  }

  getInstances(): ServiceIdentifier[] {
    return Array.from(this.instances.keys());
  }

  // ============================================================================
  // DEFAULT SERVICES
  // ============================================================================

  private registerDefaultServices(): void {
    // Register error handler
    this.registerSingleton(
      SERVICE_IDENTIFIERS.ERROR_HANDLER,
      () => ErrorHandler
    );

    // Register default configuration
    this.registerSingleton(
      SERVICE_IDENTIFIERS.CONFIG,
      () => this.createDefaultConfig()
    );
  }

  private createDefaultConfig(): BackendBrainConfig {
    return {
      performance: {
        maxProcessingTime: 1500, // 1.5 seconds
        maxTokens: 2000,
        cacheTimeout: 300000, // 5 minutes
      },
      quality: {
        minQualityScore: 0.7,
        minEnhancementRatio: 2.0,
        maxRetries: 3,
      },
      domains: {
        defaultDomain: 'general',
        supportedDomains: ['marketing', 'design', 'coding', 'psychology', 'business', 'creative', 'technical', 'academic', 'general'],
        confidenceThreshold: 0.8,
      },
      fewShot: {
        maxExamples: 5,
        similarityThreshold: 0.7,
        diversityWeight: 0.3,
      },
      validation: {
        enableSafetyFilter: true,
        maxViolations: 5,
        autoCorrect: true,
      },
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private log(message: string): void {
    if (this.options.enableLogging) {
      console.log(`[BackendBrainContainer] ${message}`);
    }
  }

  // ============================================================================
  // FACTORY METHODS
  // ============================================================================

  static create(options?: ContainerOptions): BackendBrainContainer {
    return new BackendBrainContainer(options);
  }

  static createWithDefaults(): BackendBrainContainer {
    const container = new BackendBrainContainer({
      enableLogging: process.env.NODE_ENV === 'development',
      enableCircularDependencyDetection: true,
      maxResolutionDepth: 10,
    });

    return container;
  }
}

// ============================================================================
// CONTAINER BUILDER
// ============================================================================

export class ContainerBuilder {
  private container: BackendBrainContainer;

  constructor(options?: ContainerOptions) {
    this.container = new BackendBrainContainer(options);
  }

  addSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...args: any[]) => T | Promise<T>,
    dependencies?: ServiceIdentifier[]
  ): this {
    this.container.registerSingleton(identifier, factory, dependencies);
    return this;
  }

  addTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...args: any[]) => T | Promise<T>,
    dependencies?: ServiceIdentifier[]
  ): this {
    this.container.registerTransient(identifier, factory, dependencies);
    return this;
  }

  addInstance<T>(identifier: ServiceIdentifier<T>, instance: T): this {
    this.container.registerInstance(identifier, instance);
    return this;
  }

  build(): BackendBrainContainer {
    return this.container;
  }
}

// ============================================================================
// GLOBAL CONTAINER INSTANCE
// ============================================================================

let globalContainer: BackendBrainContainer | null = null;

export function getGlobalContainer(): BackendBrainContainer {
  if (!globalContainer) {
    globalContainer = BackendBrainContainer.createWithDefaults();
  }
  return globalContainer;
}

export function setGlobalContainer(container: BackendBrainContainer): void {
  globalContainer = container;
}

export function resetGlobalContainer(): void {
  globalContainer = null;
}