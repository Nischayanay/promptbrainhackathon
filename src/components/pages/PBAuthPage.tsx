import React from 'react';
// Import the pbauth styles
import '../../../pbauth/src/index.css';
import '../../../pbauth/src/styles/globals.css';

// Import the actual pbauth component
import PBAuthApp from '../../../pbauth/src/App';

interface PBAuthPageProps {
  onNavigateToLanding?: () => void;
  onAuthSuccess?: () => void;
}

export function PBAuthPage({ onNavigateToLanding, onAuthSuccess }: PBAuthPageProps) {
  console.log('🔧 PBAuthPage props:', { onAuthSuccess: !!onAuthSuccess });
  
  return (
    <div className="pbauth-container h-screen w-full relative">
      <PBAuthApp onAuthSuccess={onAuthSuccess} />
      
      {/* Navigation overlay */}
      {onNavigateToLanding && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onNavigateToLanding}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );
}