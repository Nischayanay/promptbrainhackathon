/**
 * Utility functions for handling clipboard operations with fallbacks
 * Addresses common issues with Clipboard API permissions and security restrictions
 */

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Attempts to copy text to clipboard using modern API with fallback
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    // First try the modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      // Fallback for when Clipboard API is not available
      return fallbackCopyTextToClipboard(text);
    }
  } catch (error) {
    console.error('Clipboard API failed, using fallback:', error);
    // If clipboard API fails, use fallback method
    return fallbackCopyTextToClipboard(text);
  }
}

/**
 * Fallback method using deprecated execCommand for older browsers or restricted environments
 */
function fallbackCopyTextToClipboard(text: string): CopyResult {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom and make invisible
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Copy command was not successful' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Check if clipboard API is available in current environment
 */
export function isClipboardAPIAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}

/**
 * Enhanced copy function with user feedback
 */
export async function copyWithFeedback(
  text: string,
  onSuccess?: (message?: string) => void,
  onError?: (error: string) => void
): Promise<void> {
  const result = await copyToClipboard(text);
  
  if (result.success) {
    onSuccess?.('Text copied to clipboard!');
  } else {
    onError?.(result.error || 'Failed to copy text. Please select and copy manually.');
  }
}