// Backend Brain React Component

import React, { useState, useCallback } from 'react';
import { enhancePrompt, EnhancePromptRequest, EnhancePromptResponse } from '../api/enhance-prompt';

interface PromptEnhancerProps {
  userId?: string;
  onEnhancementComplete?: (result: any) => void;
  className?: string;
}

interface EnhancementResult {
  enhancedText: string;
  enhancedJson: any;
  whySummary: string;
  qualityScore: number;
  metadata: {
    processingTime: number;
    enhancementRatio: number;
    domainConfidence: number;
    totalTokens: number;
  };
}

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({
  userId,
  onEnhancementComplete,
  className = ''
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleEnhance = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter a prompt to enhance');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: EnhancePromptRequest = {
        prompt: input.trim(),
        userId,
        options: {
          includeExamples: true
        }
      };

      const response: EnhancePromptResponse = await enhancePrompt(request);

      if (response.success && response.data) {
        setResult(response.data);
        onEnhancementComplete?.(response.data);
      } else {
        setError(response.error?.message || 'Enhancement failed');
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [input, userId, onEnhancementComplete]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
    setError(null);
    setShowDetails(false);
  }, []);

  return (
    <div className={`backend-brain-enhancer ${className}`}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your prompt to enhance:
            </label>
            <textarea
              id="prompt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write an email about our new product..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleEnhance}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enhancing...
                </>
              ) : (
                'Enhance Prompt'
              )}
            </button>
            
            {(result || error) && (
              <button
                onClick={handleClear}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-red-500">⚠️</div>
              <p className="text-red-700 font-medium">Enhancement Failed</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Quality Metrics */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800">Enhancement Complete</h3>
                <div className="flex gap-4 text-sm text-green-700">
                  <span>Quality: {(result.qualityScore * 100).toFixed(0)}%</span>
                  <span>Ratio: {result.metadata.enhancementRatio.toFixed(1)}x</span>
                  <span>Time: {result.metadata.processingTime}ms</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-green-600 font-medium">Quality Score</div>
                  <div className="text-green-800">{(result.qualityScore * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-green-600 font-medium">Enhancement</div>
                  <div className="text-green-800">{result.metadata.enhancementRatio.toFixed(1)}x</div>
                </div>
                <div>
                  <div className="text-green-600 font-medium">Domain Confidence</div>
                  <div className="text-green-800">{(result.metadata.domainConfidence * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-green-600 font-medium">Tokens</div>
                  <div className="text-green-800">{result.metadata.totalTokens}</div>
                </div>
              </div>
            </div>

            {/* Enhanced Prompt */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Enhanced Prompt</h3>
                <button
                  onClick={() => handleCopy(result.enhancedText)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1"
                >
                  📋 Copy
                </button>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {result.enhancedText}
                </pre>
              </div>
            </div>

            {/* Why Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Why This Enhancement Works</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-blue-800">
                  {result.whySummary}
                </div>
              </div>
            </div>

            {/* Advanced Details Toggle */}
            <div className="space-y-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <span className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`}>
                  ▶️
                </span>
                Advanced Details
              </button>

              {showDetails && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Structured JSON Output</h4>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-96">
                    {JSON.stringify(result.enhancedJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptEnhancer;