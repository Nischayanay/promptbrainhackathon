import { supabase } from './supabase'

export type Mode = 'ideate' | 'flow'

export interface SessionState {
  last_mode: Mode
  sidebar_collapsed: boolean
  preferences: Record<string, any>
  last_active?: string
}

export interface SessionSyncStatus {
  status: 'idle' | 'syncing' | 'synced' | 'error'
  lastSynced?: string
  error?: string
}

class SessionManagementService {
  private readonly STORAGE_KEY = 'promptbrain_session'
  private readonly DEBOUNCE_DELAY = 1000 // 1 second for session data
  private debounceTimer: NodeJS.Timeout | null = null
  private syncStatus: SessionSyncStatus = { status: 'idle' }
  private statusCallbacks: Set<(status: SessionSyncStatus) => void> = new Set()

  // Save to localStorage immediately
  saveToLocal(sessionState: SessionState): void {
    try {
      const sessionWithTimestamp = {
        ...sessionState,
        last_active: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionWithTimestamp))
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error)
    }
  }

  // Load from localStorage
  loadFromLocal(): (SessionState & { last_active: string }) | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      
      // Validate the structure
      if (!['ideate', 'flow'].includes(parsed.last_mode) || typeof parsed.sidebar_collapsed !== 'boolean') {
        return null
      }
      
      return parsed
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error)
      return null
    }
  }

  // Clear localStorage
  clearLocal(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }

  // Debounced save to server
  saveSession(sessionState: SessionState): void {
    // Save to localStorage immediately
    this.saveToLocal(sessionState)

    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    // Set new debounce timer for server sync
    this.debounceTimer = setTimeout(() => {
      this.syncToServer(sessionState)
    }, this.DEBOUNCE_DELAY)
  }

  // Sync to server
  private async syncToServer(sessionState: SessionState): Promise<void> {
    try {
      this.updateSyncStatus({ status: 'syncing' })

      const { data: result, error } = await supabase.functions.invoke('save-session', {
        body: {
          last_mode: sessionState.last_mode,
          sidebar_collapsed: sessionState.sidebar_collapsed,
          preferences: sessionState.preferences || {}
        }
      })

      if (error) {
        throw error
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to save session')
      }

      this.updateSyncStatus({ 
        status: 'synced', 
        lastSynced: new Date().toISOString() 
      })
    } catch (error) {
      console.error('Failed to sync session to server:', error)
      this.updateSyncStatus({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  // Load session with conflict resolution
  async loadSession(): Promise<SessionState | null> {
    try {
      const localSession = this.loadFromLocal()
      
      // Try to get server session
      const { data: result, error } = await supabase.functions.invoke('get-session')
      
      if (error) {
        console.warn('Failed to load session from server, using local:', error)
        return localSession ? {
          last_mode: localSession.last_mode,
          sidebar_collapsed: localSession.sidebar_collapsed,
          preferences: localSession.preferences || {}
        } : this.getDefaultSession()
      }

      const serverSession = result?.data

      // If no server session, return local or default
      if (!serverSession || !serverSession.last_active) {
        const sessionToReturn = localSession ? {
          last_mode: localSession.last_mode,
          sidebar_collapsed: localSession.sidebar_collapsed,
          preferences: localSession.preferences || {}
        } : this.getDefaultSession()
        
        // Sync to server if we have local data
        if (localSession) {
          this.syncToServer(sessionToReturn)
        }
        
        return sessionToReturn
      }

      // If no local session, return server
      if (!localSession) {
        // Update localStorage with server data
        this.saveToLocal({
          last_mode: serverSession.last_mode,
          sidebar_collapsed: serverSession.sidebar_collapsed,
          preferences: serverSession.preferences || {}
        })
        return {
          last_mode: serverSession.last_mode,
          sidebar_collapsed: serverSession.sidebar_collapsed,
          preferences: serverSession.preferences || {}
        }
      }

      // Conflict resolution: use most recent
      const localTime = new Date(localSession.last_active).getTime()
      const serverTime = new Date(serverSession.last_active).getTime()

      if (serverTime > localTime) {
        // Server is newer, update local
        this.saveToLocal({
          last_mode: serverSession.last_mode,
          sidebar_collapsed: serverSession.sidebar_collapsed,
          preferences: serverSession.preferences || {}
        })
        return {
          last_mode: serverSession.last_mode,
          sidebar_collapsed: serverSession.sidebar_collapsed,
          preferences: serverSession.preferences || {}
        }
      } else {
        // Local is newer or same, sync to server
        const sessionToSync = {
          last_mode: localSession.last_mode,
          sidebar_collapsed: localSession.sidebar_collapsed,
          preferences: localSession.preferences || {}
        }
        this.syncToServer(sessionToSync)
        return sessionToSync
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      // Fallback to local only
      const localSession = this.loadFromLocal()
      return localSession ? {
        last_mode: localSession.last_mode,
        sidebar_collapsed: localSession.sidebar_collapsed,
        preferences: localSession.preferences || {}
      } : this.getDefaultSession()
    }
  }

  // Get default session state
  private getDefaultSession(): SessionState {
    return {
      last_mode: 'ideate',
      sidebar_collapsed: true,
      preferences: {}
    }
  }

  // Subscribe to sync status updates
  onSyncStatusChange(callback: (status: SessionSyncStatus) => void): () => void {
    this.statusCallbacks.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback)
    }
  }

  // Get current sync status
  getSyncStatus(): SessionSyncStatus {
    return { ...this.syncStatus }
  }

  // Update sync status and notify subscribers
  private updateSyncStatus(status: Partial<SessionSyncStatus>): void {
    this.syncStatus = { ...this.syncStatus, ...status }
    this.statusCallbacks.forEach(callback => {
      try {
        callback(this.getSyncStatus())
      } catch (error) {
        console.error('Error in sync status callback:', error)
      }
    })
  }

  // Cleanup method
  cleanup(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.statusCallbacks.clear()
  }

  // Session cleanup for inactive users (call this on app focus/blur)
  async cleanupInactiveSessions(): Promise<void> {
    try {
      // Mark session as inactive after 30 minutes of inactivity
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      
      // This would be implemented as a server-side cleanup job
      // For now, we just update the last_active timestamp
      const currentSession = this.loadFromLocal()
      if (currentSession) {
        this.saveSession({
          last_mode: currentSession.last_mode,
          sidebar_collapsed: currentSession.sidebar_collapsed,
          preferences: currentSession.preferences || {}
        })
      }
    } catch (error) {
      console.error('Failed to cleanup inactive sessions:', error)
    }
  }
}

// Export singleton instance
export const sessionManagement = new SessionManagementService()