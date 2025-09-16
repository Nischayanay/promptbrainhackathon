import { useState } from 'react'
import { motion } from 'framer-motion'

export function Dashboard2ProSimple() {
  const [input, setInput] = useState('')
  const [activeMode, setActiveMode] = useState<'ideate' | 'flow'>('ideate')

  console.log('Dashboard2ProSimple rendering...') // Debug log

  return (
    <div className="min-h-screen bg-[#020203] text-white">
      {/* Simple Layout */}
      <div className="flex">
        {/* Simple Sidebar */}
        <div className="w-16 h-screen bg-[#0f1113] border-r border-[#FFD34D]/20 flex flex-col items-center py-4">
          <div className="w-8 h-8 bg-[#FFD34D] rounded-lg flex items-center justify-center mb-4">
            <span className="text-black font-bold text-sm">P</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">PromptBrain</h1>
              <p className="text-gray-400">Premium dashboard redesign</p>
            </motion.div>

            {/* Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-[#0f1113] rounded-xl p-1 border border-[#FFD34D]/20">
                <button
                  onClick={() => setActiveMode('ideate')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === 'ideate' 
                      ? 'bg-[#FFD34D] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ideate
                </button>
                <button
                  onClick={() => setActiveMode('flow')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === 'flow' 
                      ? 'bg-[#30C4C8] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Flow
                </button>
              </div>
            </div>

            {/* Input Console */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f1113] rounded-2xl p-6 border border-[#FFD34D]/20"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Start typing your ${activeMode} prompt...`}
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[120px] text-base"
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-500">
                  Mode: {activeMode} • {input.length}/2000 chars
                </div>
                <button
                  className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                    input.trim() 
                      ? 'bg-gradient-to-r from-[#FFD34D] to-yellow-500 text-black hover:scale-105' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!input.trim()}
                >
                  Enhance
                </button>
              </div>
            </motion.div>

            {/* Status */}
            <div className="mt-8 text-center text-gray-500">
              <p>✅ Basic dashboard is working!</p>
              <p className="text-sm mt-2">Current mode: <span className="text-[#FFD34D]">{activeMode}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Orb */}
      <div className="fixed top-4 right-4 w-12 h-12 bg-[#30C4C8] rounded-full flex items-center justify-center text-black font-bold">
        42
      </div>
    </div>
  )
}