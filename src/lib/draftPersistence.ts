import { supabase } from './supabase'

export type Mode = 'ideate' | 'flow'

export interface DraftData {
  content: string
  mode: Mode
  metadata?: Record<string, any>
}

export interface SavedDraft extends DraftData {
  id: string
  last_updated: string
}

export interface DraftSyncStatus {
  status: 'idle' | 'syncing' | 'synced' | 'error'
  lastSynced?: string
  error?: string
}

class DraftPersistenceService {
  private readonly STORAGE_KEY = 'promptbrain_draft'
  private readonly DEBOUNCE_DELAY = 500
  private debounceTimer: NodeJS.Timeout | null = null
  private syncStatus: DraftSyncStatus = { status: 'idle' }
  private statusCallbacks: Set<(status: DraftSyncStatus) => void> = new Set()

  // Save to localStorage immediately
  saveToLocal(data: DraftData): void {
    try {
      const draftWithTimestamp = {
        ...data,
        last_updated: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draftWithTimestamp))
    } catch (error) {
      console.warn('Failed to save draft to localStorage:', error)
    }
  }

  // Load from localStorage
  loadFromLocal(): (DraftData & { last_updated: string }) | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      
      // Validate the structure
      if (typeof parsed.content !== 'string' || !['ideate', 'flow'].includes(parsed.mode)) {
        return null
      }
      
      return parsed
    } catch (error) {
      console.warn('Failed to load draft from localStorage:', error)
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
  saveDraft(data: DraftData): void {
    // Save to localStorage immediately
    this.saveToLocal(data)

    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    // Set new debounce timer for server sync
    this.debounceTimer = setTimeout(() => {
      this.syncToServer(data)
    }, this.DEBOUNCE_DELAY)
  }

  // Sync to server
  private async syncToServer(data: DraftData): Promise<void> {
    try {
      this.updateSyncStatus({ status: 'syncing' })

      const { data: result, error } = await supabase.functions.invoke('save-draft', {
        body: {
          content: data.content,
          mode: data.mode,
          metadata: data.metadata || {}
        }
      })

      if (error) {
        throw error
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to save draft')
      }

      this.updateSyncStatus({ 
        status: 'synced', 
        lastSynced: new Date().toISOString() 
      })
    } catch (error) {
      console.error('Failed to sync draft to server:', error)
      this.updateSyncStatus({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  // Load draft with conflict resolution
  async loadDraft(): Promise<DraftData | null> {
    try {
      const localDraft = this.loadFromLocal()
      
      // Try to get server draft
      const { data: result, error } = await supabase.functions.invoke('get-draft')
      
      if (error) {
        console.warn('Failed to load draft from server, using local:', error)
        return localDraft ? {
          content: localDraft.content,
          mode: localDraft.mode,
          metadata: localDraft.metadata
        } : null
      }

      const serverDraft = result?.data

      // If no server draft, return local
      if (!serverDraft) {
        return localDraft ? {
          content: localDraft.content,
          mode: localDraft.mode,
          metadata: localDraft.metadata
        } : null
      }

      // If no local draft, return server
      if (!localDraft) {
        // Update localStorage with server data
        this.saveToLocal({
          content: serverDraft.content,
          mode: serverDraft.mode,
          metadata: serverDraft.metadata
        })
        return {
          content: serverDraft.content,
          mode: serverDraft.mode,
          metadata: serverDraft.metadata
        }
      }

      // Conflict resolution: use most recent
      const localTime = new Date(localDraft.last_updated).getTime()
      const serverTime = new Date(serverDraft.last_updated).getTime()

      if (serverTime > localTime) {
        // Server is newer, update local
        this.saveToLocal({
          content: serverDraft.content,
          mode: serverDraft.mode,
          metadata: serverDraft.metadata
        })
        return {
          content: serverDraft.content,
          mode: serverDraft.mode,
          metadata: serverDraft.metadata
        }
      } else {
        // Local is newer or same, sync to server
        this.syncToServer({
          content: localDraft.content,
          mode: localDraft.mode,
          metadata: localDraft.metadata
        })
        return {
          content: localDraft.content,
          mode: localDraft.mode,
          metadata: localDraft.metadata
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
      // Fallback to local only
      const localDraft = this.loadFromLocal()
      return localDraft ? {
        content: localDraft.content,
        mode: localDraft.mode,
        metadata: localDraft.metadata
      } : null
    }
  }

  // Subscribe to sync status updates
  onSyncStatusChange(callback: (status: DraftSyncStatus) => void): () => void {
    this.statusCallbacks.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback)
    }
  }

  // Get current sync status
  getSyncStatus(): DraftSyncStatus {
    return { ...this.syncStatus }
  }

  // Update sync status and notify subscribers
  private updateSyncStatus(status: Partial<DraftSyncStatus>): void {
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
}

// Export singleton instance
export const draftPersistence = new DraftPersistenceService()