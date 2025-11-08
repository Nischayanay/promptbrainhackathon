import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface SessionConfig {
  maxInactiveTime: number // 5 days in milliseconds
  warningTime: number // Show warning 30 minutes before logout
  checkInterval: number // Check every 5 minutes
}

const DEFAULT_CONFIG: SessionConfig = {
  maxInactiveTime: 5 * 24 * 60 * 60 * 1000, // 5 days
  warningTime: 30 * 60 * 1000, // 30 minutes
  checkInterval: 5 * 60 * 1000, // 5 minutes
}

export function useSessionManager(config: Partial<SessionConfig> = {}) {
  const { user, signOut } = useAuth()
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const lastActivityRef = useRef<number>(Date.now())
  const warningShownRef = useRef<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    warningShownRef.current = false
    
    // Store in localStorage for persistence across tabs
    if (user) {
      localStorage.setItem('pb_last_activity', lastActivityRef.current.toString())
    }
  }, [user])

  // Handle auto logout
  const handleAutoLogout = useCallback(async () => {
    localStorage.removeItem('pb_last_activity')
    localStorage.removeItem('pb_auth_method')
    
    // Show logout notification
    const logoutDiv = document.createElement('div')
    logoutDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(185,28,28,0.95) 100%);
        color: white;
        padding: 24px 32px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        backdrop-filter: blur(20px);
        z-index: 10001;
        font-family: 'Inter', sans-serif;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
        <div style="font-weight: 600; margin-bottom: 8px;">Session Expired</div>
        <div style="opacity: 0.9; font-size: 14px;">You've been logged out due to inactivity</div>
      </div>
    `
    
    document.body.appendChild(logoutDiv)
    
    setTimeout(() => {
      if (document.body.contains(logoutDiv)) {
        document.body.removeChild(logoutDiv)
      }
    }, 3000)
    
    await signOut()
  }, [signOut])

  // Show graceful logout warning
  const showLogoutWarning = useCallback(() => {
    const timeLeft = Math.ceil(finalConfig.warningTime / (60 * 1000)) // minutes
    
    // Create a beautiful warning toast
    const warningDiv = document.createElement('div')
    warningDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(255,193,7,0.95) 0%, rgba(255,152,0,0.95) 100%);
        color: #000;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 320px;
        border: 1px solid rgba(255,255,255,0.2);
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <div style="font-size: 20px;">⏰</div>
          <div style="font-weight: 600;">Session Expiring Soon</div>
        </div>
        <div style="margin-bottom: 12px; opacity: 0.8;">
          You'll be logged out in ${timeLeft} minutes due to inactivity.
        </div>
        <button onclick="this.parentElement.parentElement.remove(); window.pbUpdateActivity?.()" style="
          background: rgba(0,0,0,0.8);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          font-size: 12px;
        ">Stay Logged In</button>
      </div>
    `
    
    document.body.appendChild(warningDiv)
    
    // Expose update activity function globally for the button
    ;(window as any).pbUpdateActivity = updateActivity
    
    // Auto remove after 5 seconds if no interaction
    setTimeout(() => {
      if (document.body.contains(warningDiv)) {
        document.body.removeChild(warningDiv)
      }
    }, 30000)
  }, [finalConfig.warningTime, updateActivity])

  // Check session validity
  const checkSession = useCallback(() => {
    if (!user) return

    const now = Date.now()
    const storedActivity = localStorage.getItem('pb_last_activity')
    const lastActivity = storedActivity ? parseInt(storedActivity) : lastActivityRef.current
    const timeSinceActivity = now - lastActivity

    // Show warning if approaching logout time
    if (timeSinceActivity > (finalConfig.maxInactiveTime - finalConfig.warningTime) && !warningShownRef.current) {
      warningShownRef.current = true
      showLogoutWarning()
    }

    // Auto logout if exceeded max inactive time
    if (timeSinceActivity > finalConfig.maxInactiveTime) {
      handleAutoLogout()
    }
  }, [user, finalConfig, showLogoutWarning, handleAutoLogout])

  // Set up activity listeners
  useEffect(() => {
    if (!user) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    // Throttled activity update (max once per minute)
    let lastUpdate = 0
    const throttledUpdate = () => {
      const now = Date.now()
      if (now - lastUpdate > 60000) { // 1 minute throttle
        updateActivity()
        lastUpdate = now
      }
    }

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate, { passive: true })
    })

    // Set up periodic session check
    intervalRef.current = setInterval(checkSession, finalConfig.checkInterval)

    // Initial activity update
    updateActivity()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledUpdate)
      })
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [user, updateActivity, checkSession, finalConfig.checkInterval])

  return {
    updateActivity,
    checkSession,
    lastActivity: lastActivityRef.current
  }
}