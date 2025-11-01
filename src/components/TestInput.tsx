import { useState } from 'react'

// Simple test component to verify input functionality
export function TestInput() {
  const [value, setValue] = useState('')

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Input Test Component</h1>
      
      {/* Simple input test */}
      <div className="mb-6">
        <label className="block mb-2">Simple Input:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded"
          placeholder="Type here to test..."
        />
        <p className="mt-2 text-gray-400">Value: "{value}"</p>
      </div>

      {/* Textarea test */}
      <div className="mb-6">
        <label className="block mb-2">Textarea Test:</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded min-h-[120px]"
          placeholder="Type here to test textarea..."
        />
        <p className="mt-2 text-gray-400">Character count: {value.length}</p>
      </div>

      {/* Styled like PromptConsole */}
      <div className="mb-6">
        <label className="block mb-2">PromptConsole Style Test:</label>
        <div className="relative glass-panel rounded-2xl border border-gray-600 overflow-hidden">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="
              w-full bg-transparent text-white placeholder-gray-400
              px-6 py-6 text-base leading-relaxed resize-none 
              focus:outline-none min-h-[120px] max-h-[200px]
              font-body tracking-normal
            "
            style={{ 
              fontSize: '16px',
              lineHeight: '1.6'
            }}
            placeholder="PromptConsole style test..."
          />
        </div>
        <p className="mt-2 text-gray-400">This should work like the main input</p>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="text-lg mb-2">Debug Info:</h3>
        <p>React state working: {value ? '✅ Yes' : '❌ No input detected'}</p>
        <p>onChange firing: {value.length > 0 ? '✅ Yes' : '⏳ Waiting for input'}</p>
        <p>Component rendered: ✅ Yes (you can see this)</p>
      </div>
    </div>
  )
}