import { motion } from "framer-motion";

interface FooterProps {
  onNavigateToLogin: () => void;
}

export function Footer({ onNavigateToLogin }: FooterProps) {
  return (
    <footer className="relative py-16 bg-chronicle-black border-t border-chronicle-white/10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gradient-blue to-gradient-purple rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-chronicle-white">
                    <path
                      fill="currentColor"
                      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-chronicle-white">PromptBrain</span>
              </div>
              
              <p className="text-chronicle-white/60 leading-relaxed max-w-md">
                Turn half-baked ideas into world-class prompts. Direct or Flow modes for better AI outputs.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-4"
            >
              {[
                { 
                  name: 'X (Twitter)', 
                  icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                  url: 'https://x.com/anaybauskar'
                },
                { 
                  name: 'LinkedIn', 
                  icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                  url: 'https://www.linkedin.com/in/anay-bauskar'
                },
                { 
                  name: 'Instagram', 
                  icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.448 16.988c-1.297 0-2.448-.435-3.396-1.166-.631-.485-1.127-1.117-1.408-1.794-.28-.676-.42-1.391-.42-2.146 0-.755.14-1.47.42-2.146.281-.677.777-1.309 1.408-1.794.948-.731 2.099-1.166 3.396-1.166s2.448.435 3.396 1.166c.631.485 1.127 1.117 1.408 1.794.28.676.42 1.391.42 2.146 0 .755-.14 1.47-.42 2.146-.281.677-.777 1.309-1.408 1.794-.948.731-2.099 1.166-3.396 1.166zm7.265-7.025c-.269 0-.487-.218-.487-.487s.218-.487.487-.487.487.218.487.487-.218.487-.487.487zm-3.265 5.512c-.755 0-1.368-.613-1.368-1.368s.613-1.368 1.368-1.368 1.368.613 1.368 1.368-.613 1.368-1.368 1.368z',
                  url: 'https://www.instagram.com/promptbrain.io/'
                }
              ].map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-chronicle-white/5 hover:bg-chronicle-white/10 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chronicle-white/50"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 text-chronicle-white/60 hover:text-chronicle-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Product Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-chronicle-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  'Direct Mode',
                  'Flow Mode', 
                  'Archives',
                  'API Access',
                  'Pricing'
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-chronicle-white/60 hover:text-chronicle-white transition-colors duration-200 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chronicle-white/50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-chronicle-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {[
                  'About',
                  'Blog',
                  'Careers',
                  'Privacy',
                  'Terms'
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-chronicle-white/60 hover:text-chronicle-white transition-colors duration-200 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chronicle-white/50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-chronicle-white/10 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-chronicle-white/50 text-sm">
            © 2024 PromptBrain. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-chronicle-white/50 hover:text-chronicle-white text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chronicle-white/50"
            >
              Status
            </a>
            <button
              onClick={onNavigateToLogin}
              className="text-chronicle-white/50 hover:text-chronicle-white text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chronicle-white/50"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}