interface MinimalFooterProps {
  onNavigateToLogin: () => void;
}

export function MinimalFooter({ onNavigateToLogin }: MinimalFooterProps) {
  return (
    <footer className="bg-landing-black border-t border-landing-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Brand */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-landing-white rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-landing-black">
                  <path
                    fill="currentColor"
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-landing-white">PromptBrain</span>
            </div>
            <p className="text-landing-white/60 max-w-md">
              Intelligent prompt enhancement for better AI results.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-landing-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">Direct Mode</a></li>
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">Flow Mode</a></li>
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-landing-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">Privacy</a></li>
                <li><a href="#" className="text-landing-white/60 hover:text-landing-white transition-colors text-sm">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-landing-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-landing-white/50 text-sm">
            © 2024 PromptBrain. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateToLogin}
              className="text-landing-white/60 hover:text-landing-white text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-white/50"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}