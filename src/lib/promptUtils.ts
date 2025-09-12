// Utility functions for handling enhanced prompts

export interface EnhancedPromptResponse {
  short?: string;
  detailed?: string;
}

export type EnhancedPrompt = string | EnhancedPromptResponse;

/**
 * Extracts the main content from an enhanced prompt response
 */
export function getPromptContent(enhancedPrompt: EnhancedPrompt): string {
  if (typeof enhancedPrompt === 'string') {
    return enhancedPrompt;
  }
  
  // For object responses, prefer detailed over short
  return enhancedPrompt.detailed || enhancedPrompt.short || '';
}

/**
 * Generates a title from prompt content (first 5-6 meaningful words)
 */
export function generatePromptTitle(content: string): string {
  const words = content
    .split(' ')
    .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word.toLowerCase()))
    .slice(0, 6)
    .join(' ');
  
  return words || 'Enhanced Prompt';
}

/**
 * Formats content for display with proper structure
 */
export function formatPromptContent(content: string): string {
  let formatted = content;
  
  // Clean up any existing HTML
  formatted = formatted.replace(/<[^>]*>/g, '');
  
  // Add proper spacing and structure
  formatted = formatted.replace(/\n{3,}/g, '\n\n'); // Normalize multiple line breaks
  formatted = formatted.replace(/^([A-Z][^:]*:)\s*/gm, '\n## $1\n'); // Convert headers
  formatted = formatted.replace(/^\s*[-•]\s*/gm, '- '); // Normalize bullet points
  
  return formatted.trim();
}

/**
 * Estimates reading time for content
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Checks if prompt content appears to be well-structured
 */
export function isWellStructured(content: string): boolean {
  const hasHeaders = /##|#+|\*\*[^*]+\*\*/.test(content);
  const hasBullets = /^[-•*]\s/m.test(content);
  const hasGoodLength = content.length > 100;
  
  return hasHeaders || hasBullets || hasGoodLength;
}