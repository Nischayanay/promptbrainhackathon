import { useEffect } from 'react'

interface KeyboardShortcutsConfig {
  onEnhance?: () => void
  onCopy?: () => void
  onEscape?: () => void
  onModeSwitch?: (mode: 'ideate' | 'flow') => void
  onToggleSidebar?: () => void
}

export function useKeyboardShortcuts({
  onEnhance,
  onCopy,
  onEscape,
  onModeSwitch,
  onToggleSidebar
}: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, altKey, shiftKey } = event
      const isModifierPressed = metaKey || ctrlKey

      // Prevent shortcuts when typing in input fields
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow specific shortcuts even in input fields
        if (key === 'Enter' && isModifierPressed && onEnhance) {
          event.preventDefault()
          onEnhance()
          return
        }
        if (key === 'Escape' && onEscape) {
          event.preventDefault()
          onEscape()
          return
        }
        return
      }

      // Global shortcuts
      switch (key) {
        case 'Enter':
          if (isModifierPressed && onEnhance) {
            event.preventDefault()
            onEnhance()
          }
          break

        case 'c':
          if (isModifierPressed && onCopy) {
            event.preventDefault()
            onCopy()
          }
          break

        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break

        case '1':
          if (isModifierPressed && onModeSwitch) {
            event.preventDefault()
            onModeSwitch('ideate')
          }
          break

        case '2':
          if (isModifierPressed && onModeSwitch) {
            event.preventDefault()
            onModeSwitch('flow')
          }
          break

        case 'b':
          if (isModifierPressed && onToggleSidebar) {
            event.preventDefault()
            onToggleSidebar()
          }
          break

        case '/':
          // Focus on input (if available)
          if (!isModifierPressed) {
            event.preventDefault()
            const textarea = document.querySelector('textarea')
            if (textarea) {
              textarea.focus()
            }
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEnhance, onCopy, onEscape, onModeSwitch, onToggleSidebar])
}

// Helper hook for displaying keyboard shortcuts
export function useKeyboardShortcutsHelp() {
  const shortcuts = [
    { key: 'Cmd/Ctrl + Enter', description: 'Enhance prompt' },
    { key: 'Cmd/Ctrl + 1', description: 'Switch to Ideate mode' },
    { key: 'Cmd/Ctrl + 2', description: 'Switch to Flow mode' },
    { key: 'Cmd/Ctrl + B', description: 'Toggle sidebar' },
    { key: 'Cmd/Ctrl + C', description: 'Copy last output' },
    { key: 'Escape', description: 'Close dialogs/clear focus' },
    { key: '/', description: 'Focus input' }
  ]

  return shortcuts
}