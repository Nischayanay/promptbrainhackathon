// Backend Brain Configuration Management

import { BackendBrainConfig, Domain } from '../types';
import { createError } from '../types/errors';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface ConfigSource {
  name: string;
  priority: number;
  load(): Promise<Partial<BackendBrainConfig>> | Partial<BackendBrainConfig>;
}

export interface ConfigManager {
  get<T = any>(key: string): T;
  set<T = any>(key: string, value: T): void;
  has(key: string): boolean;
  getConfig(): BackendBrainConfig;
  reload(): Promise<void>;
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_CONFIG: BackendBrainConfig = {
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
    supportedDomains: [
      'marketing',
      'design',
      'coding',
      'psychology',
      'business',
      'creative',
      'technical',
      'academic',
      'general',
    ],
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

// ============================================================================
// CONFIGURATION SOURCES
// ============================================================================

export class EnvironmentConfigSource implements ConfigSource {
  name = 'environment';
  priority = 100;

  load(): Partial<BackendBrainConfig> {
    const config: Partial<BackendBrainConfig> = {};

    // Performance settings
    if (process.env.BB_MAX_PROCESSING_TIME) {
      config.performance = {
        ...config.performance,
        maxProcessingTime: parseInt(process.env.BB_MAX_PROCESSING_TIME, 10),
      };
    }

    if (process.env.BB_MAX_TOKENS) {
      config.performance = {
        ...config.performance,
        maxTokens: parseInt(process.env.BB_MAX_TOKENS, 10),
      };
    }

    if (process.env.BB_CACHE_TIMEOUT) {
      config.performance = {
        ...config.performance,
        cacheTimeout: parseInt(process.env.BB_CACHE_TIMEOUT, 10),
      };
    }

    // Quality settings
    if (process.env.BB_MIN_QUALITY_SCORE) {
      config.quality = {
        ...config.quality,
        minQualityScore: parseFloat(process.env.BB_MIN_QUALITY_SCORE),
      };
    }

    if (process.env.BB_MIN_ENHANCEMENT_RATIO) {
      config.quality = {
        ...config.quality,
        minEnhancementRatio: parseFloat(process.env.BB_MIN_ENHANCEMENT_RATIO),
      };
    }

    if (process.env.BB_MAX_RETRIES) {
      config.quality = {
        ...config.quality,
        maxRetries: parseInt(process.env.BB_MAX_RETRIES, 10),
      };
    }

    // Domain settings
    if (process.env.BB_DEFAULT_DOMAIN) {
      config.domains = {
        ...config.domains,
        defaultDomain: process.env.BB_DEFAULT_DOMAIN as Domain,
      };
    }

    if (process.env.BB_CONFIDENCE_THRESHOLD) {
      config.domains = {
        ...config.domains,
        confidenceThreshold: parseFloat(process.env.BB_CONFIDENCE_THRESHOLD),
      };
    }

    // Few-shot settings
    if (process.env.BB_MAX_EXAMPLES) {
      config.fewShot = {
        ...config.fewShot,
        maxExamples: parseInt(process.env.BB_MAX_EXAMPLES, 10),
      };
    }

    if (process.env.BB_SIMILARITY_THRESHOLD) {
      config.fewShot = {
        ...config.fewShot,
        similarityThreshold: parseFloat(process.env.BB_SIMILARITY_THRESHOLD),
      };
    }

    if (process.env.BB_DIVERSITY_WEIGHT) {
      config.fewShot = {
        ...config.fewShot,
        diversityWeight: parseFloat(process.env.BB_DIVERSITY_WEIGHT),
      };
    }

    // Validation settings
    if (process.env.BB_ENABLE_SAFETY_FILTER) {
      config.validation = {
        ...config.validation,
        enableSafetyFilter: process.env.BB_ENABLE_SAFETY_FILTER === 'true',
      };
    }

    if (process.env.BB_MAX_VIOLATIONS) {
      config.validation = {
        ...config.validation,
        maxViolations: parseInt(process.env.BB_MAX_VIOLATIONS, 10),
      };
    }

    if (process.env.BB_AUTO_CORRECT) {
      config.validation = {
        ...config.validation,
        autoCorrect: process.env.BB_AUTO_CORRECT === 'true',
      };
    }

    return config;
  }
}

export class FileConfigSource implements ConfigSource {
  name = 'file';
  priority = 50;

  constructor(private filePath: string) {}

  async load(): Promise<Partial<BackendBrainConfig>> {
    try {
      // In a real implementation, this would read from a file
      // For now, return empty config
      return {};
    } catch (error) {
      console.warn(`Failed to load config from ${this.filePath}:`, error);
      return {};
    }
  }
}

export class DefaultConfigSource implements ConfigSource {
  name = 'default';
  priority = 1;

  load(): BackendBrainConfig {
    return { ...DEFAULT_CONFIG };
  }
}

// ============================================================================
// CONFIGURATION MANAGER IMPLEMENTATION
// ============================================================================

export class BackendBrainConfigManager implements ConfigManager {
  private config: BackendBrainConfig;
  private sources: ConfigSource[] = [];

  constructor(sources: ConfigSource[] = []) {
    this.sources = sources.sort((a, b) => a.priority - b.priority);
    this.config = { ...DEFAULT_CONFIG };
  }

  async initialize(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    let mergedConfig: Partial<BackendBrainConfig> = {};

    // Load from all sources in priority order
    for (const source of this.sources) {
      try {
        const sourceConfig = await source.load();
        mergedConfig = this.mergeConfig(mergedConfig, sourceConfig);
      } catch (error) {
        console.warn(`Failed to load config from source ${source.name}:`, error);
      }
    }

    // Merge with default config
    this.config = this.mergeConfig(DEFAULT_CONFIG, mergedConfig) as BackendBrainConfig;
    
    // Validate configuration
    this.validateConfig();
  }

  get<T = any>(key: string): T {
    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        throw createError.invalidInput(
          `Configuration key not found: ${key}`,
          { key }
        );
      }
    }

    return value as T;
  }

  set<T = any>(key: string, value: T): void {
    const keys = key.split('.');
    let target: any = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }

    target[keys[keys.length - 1]] = value;
    this.validateConfig();
  }

  has(key: string): boolean {
    try {
      this.get(key);
      return true;
    } catch {
      return false;
    }
  }

  getConfig(): BackendBrainConfig {
    return { ...this.config };
  }

  addSource(source: ConfigSource): void {
    this.sources.push(source);
    this.sources.sort((a, b) => a.priority - b.priority);
  }

  removeSource(name: string): boolean {
    const index = this.sources.findIndex(source => source.name === name);
    if (index >= 0) {
      this.sources.splice(index, 1);
      return true;
    }
    return false;
  }

  // ============================================================================
  // CONFIGURATION UTILITIES
  // ============================================================================

  private mergeConfig(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeConfig(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  private validateConfig(): void {
    // Validate performance settings
    if (this.config.performance.maxProcessingTime <= 0) {
      throw createError.invalidInput('maxProcessingTime must be positive');
    }

    if (this.config.performance.maxTokens <= 0) {
      throw createError.invalidInput('maxTokens must be positive');
    }

    if (this.config.performance.cacheTimeout < 0) {
      throw createError.invalidInput('cacheTimeout cannot be negative');
    }

    // Validate quality settings
    if (this.config.quality.minQualityScore < 0 || this.config.quality.minQualityScore > 1) {
      throw createError.invalidInput('minQualityScore must be between 0 and 1');
    }

    if (this.config.quality.minEnhancementRatio <= 1) {
      throw createError.invalidInput('minEnhancementRatio must be greater than 1');
    }

    if (this.config.quality.maxRetries < 0) {
      throw createError.invalidInput('maxRetries cannot be negative');
    }

    // Validate domain settings
    if (!this.config.domains.supportedDomains.includes(this.config.domains.defaultDomain)) {
      throw createError.invalidInput('defaultDomain must be in supportedDomains');
    }

    if (this.config.domains.confidenceThreshold < 0 || this.config.domains.confidenceThreshold > 1) {
      throw createError.invalidInput('confidenceThreshold must be between 0 and 1');
    }

    // Validate few-shot settings
    if (this.config.fewShot.maxExamples <= 0) {
      throw createError.invalidInput('maxExamples must be positive');
    }

    if (this.config.fewShot.similarityThreshold < 0 || this.config.fewShot.similarityThreshold > 1) {
      throw createError.invalidInput('similarityThreshold must be between 0 and 1');
    }

    if (this.config.fewShot.diversityWeight < 0 || this.config.fewShot.diversityWeight > 1) {
      throw createError.invalidInput('diversityWeight must be between 0 and 1');
    }

    // Validate validation settings
    if (this.config.validation.maxViolations < 0) {
      throw createError.invalidInput('maxViolations cannot be negative');
    }
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export function createConfigManager(additionalSources: ConfigSource[] = []): BackendBrainConfigManager {
  const sources = [
    new DefaultConfigSource(),
    new EnvironmentConfigSource(),
    ...additionalSources,
  ];

  return new BackendBrainConfigManager(sources);
}

export function createFileConfigManager(filePath: string): BackendBrainConfigManager {
  return createConfigManager([new FileConfigSource(filePath)]);
}

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

let globalConfigManager: BackendBrainConfigManager | null = null;

export function getGlobalConfig(): BackendBrainConfigManager {
  if (!globalConfigManager) {
    globalConfigManager = createConfigManager();
  }
  return globalConfigManager;
}

export function setGlobalConfig(configManager: BackendBrainConfigManager): void {
  globalConfigManager = configManager;
}

export async function initializeGlobalConfig(): Promise<void> {
  const configManager = getGlobalConfig();
  await configManager.initialize();
}