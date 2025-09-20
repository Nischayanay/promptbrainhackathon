// Analytics utility for tracking user interactions and feature usage
// Supports multiple analytics providers and respects user privacy preferences

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
}

interface AnalyticsConfig {
  enabled: boolean
  provider: 'mixpanel' | 'amplitude' | 'custom' | 'none'
  apiKey?: string
  endpoint?: string
  debug?: boolean
}

class Analytics {
  private config: AnalyticsConfig
  private queue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor(config: AnalyticsConfig) {
    this.config = config
    this.initialize()
  }

  private initialize() {
    if (!this.config.enabled || this.config.provider === 'none') {
      return
    }

    // Check for user consent (GDPR/CCPA compliance)
    const hasConsent = this.checkUserConsent()
    if (!hasConsent) {
      this.config.enabled = false
      return
    }

    // Initialize provider-specific tracking
    switch (this.config.provider) {
      case 'mixpanel':
        this.initializeMixpanel()
        break
      case 'amplitude':
        this.initializeAmplitude()
        break
      case 'custom':
        this.initializeCustom()
        break
    }

    this.isInitialized = true
    this.flushQueue()
  }

  private checkUserConsent(): boolean {
    // Check localStorage for user consent
    const consent = localStorage.getItem('analytics_consent')
    return consent === 'true'
  }

  private initializeMixpanel() {
    if (typeof window !== 'undefined' && this.config.apiKey) {
      // Initialize Mixpanel
      // @ts-ignore
      window.mixpanel = window.mixpanel || []
      // @ts-ignore
      window.mixpanel.init(this.config.apiKey)
    }
  }

  private initializeAmplitude() {
    if (typeof window !== 'undefined' && this.config.apiKey) {
      // Initialize Amplitude
      // @ts-ignore
      window.amplitude = window.amplitude || []
      // @ts-ignore
      window.amplitude.init(this.config.apiKey)
    }
  }

  private initializeCustom() {
    // Custom analytics implementation
    if (this.config.debug) {
      console.log('Analytics initialized with custom provider')
    }
  }

  private flushQueue() {
    if (!this.isInitialized) return

    while (this.queue.length > 0) {
      const event = this.queue.shift()
      if (event) {
        this.trackEvent(event)
      }
    }
  }

  private trackEvent(event: AnalyticsEvent) {
    if (!this.config.enabled) return

    const eventData = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    switch (this.config.provider) {
      case 'mixpanel':
        // @ts-ignore
        if (window.mixpanel) {
          // @ts-ignore
          window.mixpanel.track(event.event, eventData.properties)
        }
        break
      case 'amplitude':
        // @ts-ignore
        if (window.amplitude) {
          // @ts-ignore
          window.amplitude.getInstance().logEvent(event.event, eventData.properties)
        }
        break
      case 'custom':
        this.sendToCustomEndpoint(eventData)
        break
    }

    if (this.config.debug) {
      console.log('Analytics event:', eventData)
    }
  }

  private sendToCustomEndpoint(eventData: AnalyticsEvent) {
    if (this.config.endpoint) {
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }).catch(error => {
        if (this.config.debug) {
          console.error('Analytics error:', error)
        }
      })
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  // Public API
  public track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    }

    if (this.isInitialized) {
      this.trackEvent(analyticsEvent)
    } else {
      this.queue.push(analyticsEvent)
    }
  }

  public identify(userId: string, properties?: Record<string, any>) {
    if (!this.config.enabled) return

    switch (this.config.provider) {
      case 'mixpanel':
        // @ts-ignore
        if (window.mixpanel) {
          // @ts-ignore
          window.mixpanel.identify(userId)
          if (properties) {
            // @ts-ignore
            window.mixpanel.people.set(properties)
          }
        }
        break
      case 'amplitude':
        // @ts-ignore
        if (window.amplitude) {
          // @ts-ignore
          window.amplitude.getInstance().setUserId(userId)
          if (properties) {
            // @ts-ignore
            window.amplitude.getInstance().setUserProperties(properties)
          }
        }
        break
    }
  }

  public setConsent(consent: boolean) {
    localStorage.setItem('analytics_consent', consent.toString())
    this.config.enabled = consent
    if (consent) {
      this.initialize()
    }
  }

  public reset() {
    this.queue = []
    sessionStorage.removeItem('analytics_session_id')
  }
}

// Create analytics instance
const analytics = new Analytics({
  enabled: process.env.NODE_ENV === 'production',
  provider: 'custom',
  debug: process.env.NODE_ENV === 'development',
  endpoint: process.env.VITE_ANALYTICS_ENDPOINT,
})

// Event tracking functions for common actions
export const trackEnhancementStarted = (mode: 'ideate' | 'flow', inputLength: number) => {
  analytics.track('enhancement_started', {
    mode,
    input_length: inputLength,
    timestamp: Date.now(),
  })
}

export const trackEnhancementCompleted = (mode: 'ideate' | 'flow', success: boolean, duration: number) => {
  analytics.track('enhancement_completed', {
    mode,
    success,
    duration,
    timestamp: Date.now(),
  })
}

export const trackEnhancementFailed = (mode: 'ideate' | 'flow', error: string) => {
  analytics.track('enhancement_failed', {
    mode,
    error,
    timestamp: Date.now(),
  })
}

export const trackModeSwitch = (fromMode: 'ideate' | 'flow', toMode: 'ideate' | 'flow') => {
  analytics.track('mode_switch', {
    from_mode: fromMode,
    to_mode: toMode,
    timestamp: Date.now(),
  })
}

export const trackFlowStepCompleted = (step: number, totalSteps: number, skipped: boolean) => {
  analytics.track('flow_step_completed', {
    step,
    total_steps: totalSteps,
    skipped,
    timestamp: Date.now(),
  })
}

export const trackFlowCompleted = (totalSteps: number, duration: number) => {
  analytics.track('flow_completed', {
    total_steps: totalSteps,
    duration,
    timestamp: Date.now(),
  })
}

export const trackFlowAbandoned = (step: number, totalSteps: number) => {
  analytics.track('flow_abandoned', {
    step,
    total_steps: totalSteps,
    timestamp: Date.now(),
  })
}

export const trackCopyAction = (contentType: 'output' | 'input', length: number) => {
  analytics.track('copy_action', {
    content_type: contentType,
    content_length: length,
    timestamp: Date.now(),
  })
}

export const trackReuseAction = (contentType: 'output' | 'input') => {
  analytics.track('reuse_action', {
    content_type: contentType,
    timestamp: Date.now(),
  })
}

export const trackLowCreditsViewed = (credits: number) => {
  analytics.track('low_credits_viewed', {
    credits,
    timestamp: Date.now(),
  })
}

export const trackCreditsEarned = (amount: number, source: string) => {
  analytics.track('credits_earned', {
    amount,
    source,
    timestamp: Date.now(),
  })
}

export const trackCreditsSpent = (amount: number, purpose: string) => {
  analytics.track('credits_spent', {
    amount,
    purpose,
    timestamp: Date.now(),
  })
}

export const trackNavigation = (from: string, to: string) => {
  analytics.track('navigation', {
    from,
    to,
    timestamp: Date.now(),
  })
}

export const trackAuthentication = (method: 'email' | 'google' | 'logout', success: boolean) => {
  analytics.track('authentication', {
    method,
    success,
    timestamp: Date.now(),
  })
}

export const trackError = (error: string, context: string) => {
  analytics.track('error', {
    error,
    context,
    timestamp: Date.now(),
  })
}

export const trackFeatureUsage = (feature: string, action: string) => {
  analytics.track('feature_usage', {
    feature,
    action,
    timestamp: Date.now(),
  })
}

export default analytics
