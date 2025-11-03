// Backend Brain Monitoring and Analytics Service

import { getDatabase } from '../database/client';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  healthy: boolean;
  services: Record<string, {
    healthy: boolean;
    latency: number;
    lastCheck: Date;
  }>;
  metrics: {
    averageProcessingTime: number;
    successRate: number;
    errorRate: number;
    totalEnhancements: number;
  };
}

export interface UserBehaviorEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export class MonitoringService {
  private database = getDatabase();
  private metrics: PerformanceMetric[] = [];
  private maxMetricsHistory = 1000;

  // Performance Monitoring
  async recordMetric(name: string, value: number, unit: string = 'ms', metadata?: Record<string, any>): Promise<void> {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      metadata
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Log important metrics
    if (name === 'enhancement_processing_time' && value > 2000) {
      console.warn(`Slow enhancement processing: ${value}ms`, metadata);
    }

    if (name === 'enhancement_quality_score' && value < 0.7) {
      console.warn(`Low quality enhancement: ${value}`, metadata);
    }
  }

  async getMetrics(name?: string, since?: Date): Promise<PerformanceMetric[]> {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAverageMetric(name: string, since?: Date): Promise<number> {
    const metrics = await this.getMetrics(name, since);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((total, metric) => total + metric.value, 0);
    return sum / metrics.length;
  }

  // System Health Monitoring
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      // Check database health
      const dbHealth = await this.database.healthCheck();
      
      // Get recent metrics
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentMetrics = await this.getMetrics(undefined, last24Hours);
      
      // Calculate performance metrics
      const processingTimes = recentMetrics.filter(m => m.name === 'enhancement_processing_time');
      const qualityScores = recentMetrics.filter(m => m.name === 'enhancement_quality_score');
      const errors = recentMetrics.filter(m => m.name === 'enhancement_error');
      const successes = recentMetrics.filter(m => m.name === 'enhancement_success');

      const averageProcessingTime = processingTimes.length > 0 ? 
        processingTimes.reduce((sum, m) => sum + m.value, 0) / processingTimes.length : 0;

      const totalRequests = successes.length + errors.length;
      const successRate = totalRequests > 0 ? successes.length / totalRequests : 1;
      const errorRate = totalRequests > 0 ? errors.length / totalRequests : 0;

      return {
        healthy: dbHealth.healthy && successRate > 0.95 && averageProcessingTime < 2000,
        services: {
          database: {
            healthy: dbHealth.healthy,
            latency: dbHealth.latency,
            lastCheck: new Date()
          },
          backendBrain: {
            healthy: successRate > 0.95,
            latency: averageProcessingTime,
            lastCheck: new Date()
          }
        },
        metrics: {
          averageProcessingTime,
          successRate,
          errorRate,
          totalEnhancements: successes.length
        }
      };

    } catch (error) {
      console.error('Failed to get system health:', error);
      return {
        healthy: false,
        services: {
          database: { healthy: false, latency: 0, lastCheck: new Date() },
          backendBrain: { healthy: false, latency: 0, lastCheck: new Date() }
        },
        metrics: {
          averageProcessingTime: 0,
          successRate: 0,
          errorRate: 1,
          totalEnhancements: 0
        }
      };
    }
  }

  // Error Tracking
  async recordError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.recordMetric('enhancement_error', 1, 'count', {
      error: error.message,
      stack: error.stack,
      context
    });

    console.error('Backend Brain Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }

  async recordSuccess(processingTime: number, qualityScore: number, metadata?: Record<string, any>): Promise<void> {
    await this.recordMetric('enhancement_success', 1, 'count', metadata);
    await this.recordMetric('enhancement_processing_time', processingTime, 'ms', metadata);
    await this.recordMetric('enhancement_quality_score', qualityScore, 'score', metadata);
  }

  // User Behavior Analytics
  async trackUserBehavior(userId: string, event: string, properties: Record<string, any> = {}): Promise<void> {
    const behaviorEvent: UserBehaviorEvent = {
      userId,
      event,
      properties,
      timestamp: new Date()
    };

    // Store in database for analytics
    try {
      await this.database.createFeedback({
        enhanced_prompt_id: properties.enhancedPromptId || '',
        user_id: userId,
        action: event as any,
        rating: properties.rating,
        metadata: {
          event,
          properties,
          timestamp: behaviorEvent.timestamp.toISOString()
        }
      });
    } catch (error) {
      console.warn('Failed to track user behavior:', error);
    }

    console.log('User Behavior:', behaviorEvent);
  }

  // Analytics Dashboard Data
  async getAnalyticsDashboard(days: number = 7): Promise<{
    overview: {
      totalEnhancements: number;
      averageQuality: number;
      averageProcessingTime: number;
      successRate: number;
    };
    trends: {
      enhancementsPerDay: Array<{ date: string; count: number }>;
      qualityTrend: Array<{ date: string; score: number }>;
      processingTimeTrend: Array<{ date: string; time: number }>;
    };
    domains: Array<{ domain: string; count: number; averageQuality: number }>;
    errors: Array<{ error: string; count: number; lastOccurred: Date }>;
  }> {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const metrics = await this.getMetrics(undefined, since);

      // Overview metrics
      const successes = metrics.filter(m => m.name === 'enhancement_success');
      const qualityScores = metrics.filter(m => m.name === 'enhancement_quality_score');
      const processingTimes = metrics.filter(m => m.name === 'enhancement_processing_time');
      const errors = metrics.filter(m => m.name === 'enhancement_error');

      const totalEnhancements = successes.length;
      const averageQuality = qualityScores.length > 0 ? 
        qualityScores.reduce((sum, m) => sum + m.value, 0) / qualityScores.length : 0;
      const averageProcessingTime = processingTimes.length > 0 ? 
        processingTimes.reduce((sum, m) => sum + m.value, 0) / processingTimes.length : 0;
      const successRate = (successes.length + errors.length) > 0 ? 
        successes.length / (successes.length + errors.length) : 1;

      // Trends (simplified - would be more sophisticated in production)
      const enhancementsPerDay = this.groupMetricsByDay(successes, days);
      const qualityTrend = this.groupMetricsByDay(qualityScores, days, 'average');
      const processingTimeTrend = this.groupMetricsByDay(processingTimes, days, 'average');

      // Domain analysis (from metadata)
      const domainCounts: Record<string, { count: number; totalQuality: number }> = {};
      successes.forEach(metric => {
        const domain = metric.metadata?.domain || 'general';
        if (!domainCounts[domain]) {
          domainCounts[domain] = { count: 0, totalQuality: 0 };
        }
        domainCounts[domain].count++;
        
        // Find corresponding quality score
        const qualityMetric = qualityScores.find(q => 
          Math.abs(q.timestamp.getTime() - metric.timestamp.getTime()) < 1000
        );
        if (qualityMetric) {
          domainCounts[domain].totalQuality += qualityMetric.value;
        }
      });

      const domains = Object.entries(domainCounts).map(([domain, data]) => ({
        domain,
        count: data.count,
        averageQuality: data.count > 0 ? data.totalQuality / data.count : 0
      }));

      // Error analysis
      const errorCounts: Record<string, { count: number; lastOccurred: Date }> = {};
      errors.forEach(metric => {
        const errorMsg = metric.metadata?.error || 'Unknown error';
        if (!errorCounts[errorMsg]) {
          errorCounts[errorMsg] = { count: 0, lastOccurred: metric.timestamp };
        }
        errorCounts[errorMsg].count++;
        if (metric.timestamp > errorCounts[errorMsg].lastOccurred) {
          errorCounts[errorMsg].lastOccurred = metric.timestamp;
        }
      });

      const errorsList = Object.entries(errorCounts).map(([error, data]) => ({
        error,
        count: data.count,
        lastOccurred: data.lastOccurred
      }));

      return {
        overview: {
          totalEnhancements,
          averageQuality,
          averageProcessingTime,
          successRate
        },
        trends: {
          enhancementsPerDay,
          qualityTrend,
          processingTimeTrend
        },
        domains,
        errors: errorsList
      };

    } catch (error) {
      console.error('Failed to get analytics dashboard:', error);
      return {
        overview: { totalEnhancements: 0, averageQuality: 0, averageProcessingTime: 0, successRate: 0 },
        trends: { enhancementsPerDay: [], qualityTrend: [], processingTimeTrend: [] },
        domains: [],
        errors: []
      };
    }
  }

  private groupMetricsByDay(
    metrics: PerformanceMetric[], 
    days: number, 
    aggregation: 'count' | 'average' = 'count'
  ): Array<{ date: string; count?: number; score?: number; time?: number }> {
    const result: Array<{ date: string; count?: number; score?: number; time?: number }> = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMetrics = metrics.filter(m => 
        m.timestamp.toISOString().split('T')[0] === dateStr
      );

      if (aggregation === 'count') {
        result.unshift({ date: dateStr, count: dayMetrics.length });
      } else {
        const average = dayMetrics.length > 0 ? 
          dayMetrics.reduce((sum, m) => sum + m.value, 0) / dayMetrics.length : 0;
        
        if (metrics[0]?.name === 'enhancement_quality_score') {
          result.unshift({ date: dateStr, score: average });
        } else {
          result.unshift({ date: dateStr, time: average });
        }
      }
    }

    return result;
  }

  // Alerting
  async checkAlerts(): Promise<Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>> {
    const alerts = [];
    const health = await this.getSystemHealth();

    // High error rate alert
    if (health.metrics.errorRate > 0.1) {
      alerts.push({
        type: 'high_error_rate',
        message: `Error rate is ${(health.metrics.errorRate * 100).toFixed(1)}% (threshold: 10%)`,
        severity: 'high' as const
      });
    }

    // Slow processing alert
    if (health.metrics.averageProcessingTime > 2000) {
      alerts.push({
        type: 'slow_processing',
        message: `Average processing time is ${health.metrics.averageProcessingTime.toFixed(0)}ms (threshold: 2000ms)`,
        severity: 'medium' as const
      });
    }

    // Database health alert
    if (!health.services.database.healthy) {
      alerts.push({
        type: 'database_unhealthy',
        message: 'Database health check failed',
        severity: 'high' as const
      });
    }

    return alerts;
  }

  // Cleanup old metrics
  async cleanup(): Promise<void> {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
    console.log(`Cleaned up old metrics, ${this.metrics.length} metrics remaining`);
  }
}

// Singleton instance
let monitoringServiceInstance: MonitoringService | null = null;

export function getMonitoringService(): MonitoringService {
  if (!monitoringServiceInstance) {
    monitoringServiceInstance = new MonitoringService();
  }
  return monitoringServiceInstance;
}

export function setMonitoringService(service: MonitoringService): void {
  monitoringServiceInstance = service;
}