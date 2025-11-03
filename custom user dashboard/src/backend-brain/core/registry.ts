// Backend Brain Module Registry and Lifecycle Management

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
import { BackendBrainContainer, SERVICE_IDENTIFIERS } from './container';
import { ErrorHandler, createError } from '../types/errors';

// ============================================================================
// MODULE LIFECYCLE TYPES
// ============================================================================

export interface ModuleLifecycle {
  initialize?(): Promise<void> | void;
  start?(): Promise<void> | void;
  stop?(): Promise<void> | void;
  dispose?(): Promise<void> | void;
}

export interface ModuleMetadata {
  name: string;
  version: string;
  dependencies: string[];
  optional?: boolean;
  priority?: number;
}

export interface RegisteredModule {
  metadata: ModuleMetadata;
  instance: any;
  lifecycle?: ModuleLifecycle;
  status: ModuleStatus;
  error?: Error;
}

export type ModuleStatus = 'registered' | 'initializing' | 'initialized' | 'starting' | 'started' | 'stopping' | 'stopped' | 'error';

// ============================================================================
// MODULE REGISTRY
// ============================================================================

export class ModuleRegistry {
  private modules = new Map<string, RegisteredModule>();
  private container: BackendBrainContainer;
  private isStarted = false;

  constructor(container: BackendBrainContainer) {
    this.container = container;
  }

  // ============================================================================
  // MODULE REGISTRATION
  // ============================================================================

  registerModule<T>(
    metadata: ModuleMetadata,
    factory: () => T | Promise<T>,
    lifecycle?: ModuleLifecycle
  ): this {
    if (this.modules.has(metadata.name)) {
      throw createError.invalidInput(
        `Module ${metadata.name} is already registered`,
        { moduleName: metadata.name }
      );
    }

    // Validate dependencies
    this.validateDependencies(metadata);

    const module: RegisteredModule = {
      metadata,
      instance: null,
      lifecycle,
      status: 'registered',
    };

    this.modules.set(metadata.name, module);
    this.log(`Registered module: ${metadata.name} v${metadata.version}`);

    return this;
  }

  registerCoreModule<T>(
    name: string,
    serviceIdentifier: symbol,
    factory: () => T | Promise<T>,
    dependencies: string[] = [],
    lifecycle?: ModuleLifecycle
  ): this {
    const metadata: ModuleMetadata = {
      name,
      version: '1.0.0',
      dependencies,
      priority: 1,
    };

    // Register in container
    this.container.registerSingleton(serviceIdentifier, factory);

    // Register in module registry
    return this.registerModule(metadata, factory, lifecycle);
  }

  // ============================================================================
  // MODULE LIFECYCLE MANAGEMENT
  // ============================================================================

  async initializeAll(): Promise<void> {
    const modules = this.getModulesInDependencyOrder();
    
    for (const module of modules) {
      await this.initializeModule(module.metadata.name);
    }

    this.log('All modules initialized');
  }

  async startAll(): Promise<void> {
    if (this.isStarted) {
      this.log('Modules already started');
      return;
    }

    const modules = this.getModulesInDependencyOrder();
    
    for (const module of modules) {
      await this.startModule(module.metadata.name);
    }

    this.isStarted = true;
    this.log('All modules started');
  }

  async stopAll(): Promise<void> {
    if (!this.isStarted) {
      this.log('Modules not started');
      return;
    }

    const modules = this.getModulesInDependencyOrder().reverse();
    
    for (const module of modules) {
      await this.stopModule(module.metadata.name);
    }

    this.isStarted = false;
    this.log('All modules stopped');
  }

  async disposeAll(): Promise<void> {
    const modules = this.getModulesInDependencyOrder().reverse();
    
    for (const module of modules) {
      await this.disposeModule(module.metadata.name);
    }

    this.modules.clear();
    this.log('All modules disposed');
  }

  // ============================================================================
  // INDIVIDUAL MODULE LIFECYCLE
  // ============================================================================

  async initializeModule(name: string): Promise<void> {
    const module = this.getModule(name);
    
    if (module.status !== 'registered') {
      this.log(`Module ${name} already initialized (status: ${module.status})`);
      return;
    }

    try {
      module.status = 'initializing';
      
      // Initialize dependencies first
      for (const depName of module.metadata.dependencies) {
        const dep = this.modules.get(depName);
        if (dep && dep.status === 'registered') {
          await this.initializeModule(depName);
        }
      }

      // Initialize the module
      if (module.lifecycle?.initialize) {
        await module.lifecycle.initialize();
      }

      module.status = 'initialized';
      this.log(`Initialized module: ${name}`);
    } catch (error) {
      module.status = 'error';
      module.error = error as Error;
      this.log(`Failed to initialize module ${name}: ${(error as Error).message}`);
      
      if (!module.metadata.optional) {
        throw createError.processingError(
          `Failed to initialize required module: ${name}`,
          false,
          { moduleName: name, error: (error as Error).message }
        );
      }
    }
  }

  async startModule(name: string): Promise<void> {
    const module = this.getModule(name);
    
    if (module.status === 'started') {
      return;
    }

    if (module.status !== 'initialized') {
      await this.initializeModule(name);
    }

    try {
      module.status = 'starting';
      
      // Start dependencies first
      for (const depName of module.metadata.dependencies) {
        const dep = this.modules.get(depName);
        if (dep && dep.status === 'initialized') {
          await this.startModule(depName);
        }
      }

      // Start the module
      if (module.lifecycle?.start) {
        await module.lifecycle.start();
      }

      module.status = 'started';
      this.log(`Started module: ${name}`);
    } catch (error) {
      module.status = 'error';
      module.error = error as Error;
      this.log(`Failed to start module ${name}: ${(error as Error).message}`);
      
      if (!module.metadata.optional) {
        throw createError.processingError(
          `Failed to start required module: ${name}`,
          false,
          { moduleName: name, error: (error as Error).message }
        );
      }
    }
  }

  async stopModule(name: string): Promise<void> {
    const module = this.getModule(name);
    
    if (module.status !== 'started') {
      return;
    }

    try {
      module.status = 'stopping';
      
      if (module.lifecycle?.stop) {
        await module.lifecycle.stop();
      }

      module.status = 'stopped';
      this.log(`Stopped module: ${name}`);
    } catch (error) {
      module.status = 'error';
      module.error = error as Error;
      this.log(`Failed to stop module ${name}: ${(error as Error).message}`);
    }
  }

  async disposeModule(name: string): Promise<void> {
    const module = this.getModule(name);
    
    if (module.status === 'started') {
      await this.stopModule(name);
    }

    try {
      if (module.lifecycle?.dispose) {
        await module.lifecycle.dispose();
      }

      this.modules.delete(name);
      this.log(`Disposed module: ${name}`);
    } catch (error) {
      this.log(`Failed to dispose module ${name}: ${(error as Error).message}`);
    }
  }

  // ============================================================================
  // MODULE QUERIES
  // ============================================================================

  getModule(name: string): RegisteredModule {
    const module = this.modules.get(name);
    if (!module) {
      throw createError.invalidInput(
        `Module ${name} is not registered`,
        { moduleName: name }
      );
    }
    return module;
  }

  hasModule(name: string): boolean {
    return this.modules.has(name);
  }

  getModuleStatus(name: string): ModuleStatus {
    return this.getModule(name).status;
  }

  getModuleError(name: string): Error | undefined {
    return this.getModule(name).error;
  }

  getAllModules(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }

  getModulesByStatus(status: ModuleStatus): RegisteredModule[] {
    return this.getAllModules().filter(module => module.status === status);
  }

  // ============================================================================
  // DEPENDENCY MANAGEMENT
  // ============================================================================

  private validateDependencies(metadata: ModuleMetadata): void {
    for (const depName of metadata.dependencies) {
      if (!this.modules.has(depName)) {
        throw createError.invalidInput(
          `Module ${metadata.name} depends on unregistered module: ${depName}`,
          { moduleName: metadata.name, dependency: depName }
        );
      }
    }
  }

  private getModulesInDependencyOrder(): RegisteredModule[] {
    const modules = Array.from(this.modules.values());
    const sorted: RegisteredModule[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (module: RegisteredModule) => {
      if (visiting.has(module.metadata.name)) {
        throw createError.invalidInput(
          `Circular dependency detected involving module: ${module.metadata.name}`,
          { moduleName: module.metadata.name }
        );
      }

      if (visited.has(module.metadata.name)) {
        return;
      }

      visiting.add(module.metadata.name);

      // Visit dependencies first
      for (const depName of module.metadata.dependencies) {
        const dep = this.modules.get(depName);
        if (dep) {
          visit(dep);
        }
      }

      visiting.delete(module.metadata.name);
      visited.add(module.metadata.name);
      sorted.push(module);
    };

    // Sort by priority first, then by dependencies
    modules
      .sort((a, b) => (a.metadata.priority || 0) - (b.metadata.priority || 0))
      .forEach(visit);

    return sorted;
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  getHealthStatus(): {
    healthy: boolean;
    modules: Array<{
      name: string;
      status: ModuleStatus;
      error?: string;
    }>;
  } {
    const modules = this.getAllModules();
    const moduleStatuses = modules.map(module => ({
      name: module.metadata.name,
      status: module.status,
      error: module.error?.message,
    }));

    const healthy = modules.every(module => 
      module.status === 'started' || module.metadata.optional
    );

    return {
      healthy,
      modules: moduleStatuses,
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private log(message: string): void {
    console.log(`[ModuleRegistry] ${message}`);
  }
}

// ============================================================================
// BACKEND BRAIN MODULE REGISTRY
// ============================================================================

export class BackendBrainModuleRegistry extends ModuleRegistry {
  constructor(container: BackendBrainContainer) {
    super(container);
    this.registerCoreModules();
  }

  private registerCoreModules(): void {
    // Note: Actual implementations will be registered when modules are created
    // This sets up the registry structure

    this.log('Backend Brain module registry initialized');
  }

  async registerInputAnalyzer(factory: () => InputAnalyzer | Promise<InputAnalyzer>): Promise<void> {
    this.registerCoreModule(
      'InputAnalyzer',
      SERVICE_IDENTIFIERS.INPUT_ANALYZER,
      factory,
      []
    );
  }

  async registerContextArchitect(factory: () => ContextArchitect | Promise<ContextArchitect>): Promise<void> {
    this.registerCoreModule(
      'ContextArchitect',
      SERVICE_IDENTIFIERS.CONTEXT_ARCHITECT,
      factory,
      ['InputAnalyzer']
    );
  }

  async registerDomainTranslator(factory: () => DomainTranslator | Promise<DomainTranslator>): Promise<void> {
    this.registerCoreModule(
      'DomainTranslator',
      SERVICE_IDENTIFIERS.DOMAIN_TRANSLATOR,
      factory,
      ['ContextArchitect']
    );
  }

  async registerPromptCompiler(factory: () => PromptCompiler | Promise<PromptCompiler>): Promise<void> {
    this.registerCoreModule(
      'PromptCompiler',
      SERVICE_IDENTIFIERS.PROMPT_COMPILER,
      factory,
      ['DomainTranslator', 'FewShotOrchestrator']
    );
  }

  async registerConstraintValidator(factory: () => ConstraintValidator | Promise<ConstraintValidator>): Promise<void> {
    this.registerCoreModule(
      'ConstraintValidator',
      SERVICE_IDENTIFIERS.CONSTRAINT_VALIDATOR,
      factory,
      ['PromptCompiler']
    );
  }

  async registerFewShotOrchestrator(factory: () => FewShotOrchestrator | Promise<FewShotOrchestrator>): Promise<void> {
    this.registerCoreModule(
      'FewShotOrchestrator',
      SERVICE_IDENTIFIERS.FEW_SHOT_ORCHESTRATOR,
      factory,
      ['ContextArchitect']
    );
  }

  async registerOutputFormatter(factory: () => OutputFormatter | Promise<OutputFormatter>): Promise<void> {
    this.registerCoreModule(
      'OutputFormatter',
      SERVICE_IDENTIFIERS.OUTPUT_FORMATTER,
      factory,
      ['ConstraintValidator']
    );
  }
}