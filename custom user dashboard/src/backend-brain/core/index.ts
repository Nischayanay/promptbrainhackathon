// Backend Brain Core Infrastructure Exports

// Container and Dependency Injection
export {
  BackendBrainContainer,
  ContainerBuilder,
  SERVICE_IDENTIFIERS,
  getGlobalContainer,
  setGlobalContainer,
  resetGlobalContainer,
} from './container';

export type {
  ServiceIdentifier,
  ServiceDefinition,
  ContainerOptions,
} from './container';

// Module Registry and Lifecycle
export {
  ModuleRegistry,
  BackendBrainModuleRegistry,
} from './registry';

export type {
  ModuleLifecycle,
  ModuleMetadata,
  RegisteredModule,
  ModuleStatus,
} from './registry';

// Configuration Management
export {
  BackendBrainConfigManager,
  EnvironmentConfigSource,
  FileConfigSource,
  DefaultConfigSource,
  DEFAULT_CONFIG,
  createConfigManager,
  createFileConfigManager,
  getGlobalConfig,
  setGlobalConfig,
  initializeGlobalConfig,
} from './config';

export type {
  ConfigSource,
  ConfigManager,
} from './config';

// Re-export types
export * from '../types';
export * from '../types/errors';
export * from '../types/validation';