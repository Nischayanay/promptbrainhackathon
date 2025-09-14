import { motion } from 'framer-motion'
import { User, ChevronDown } from 'lucide-react'

interface HeaderBarProps {
  credits: number
}

export function HeaderBar({ credits }: HeaderBarProps) {
  return (
    <header className="bg-[#0D0D0D]/80 backdrop-blur-md border-b border-[#FFD95A]/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#6E00FF] to-[#3B82F6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PB</span>
            </div>
            <h1 className="text-xl font-bold text-white">PromptBrain</h1>
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Credits Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A1A] border border-[#FFD95A]/20 rounded-full px-4 py-2 flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#6E00FF] to-[#3B82F6] rounded-full"></div>
              <span className="text-white font-medium">{credits}</span>
              <span className="text-[#A6A6A6] text-sm">credits</span>
            </motion.div>

            {/* Profile Dropdown */}
            <div className="relative group">
              <motion.button
                className="flex items-center space-x-2 p-2 text-[#A6A6A6] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#6E00FF] to-[#3B82F6] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-[#FFD95A]/20 rounded-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <a href="#" className="block px-4 py-2 text-sm text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10 transition-colors">
                  Profile Settings
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10 transition-colors">
                  Billing
                </a>
                <div className="border-t border-[#FFD95A]/10 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10 transition-colors">
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}