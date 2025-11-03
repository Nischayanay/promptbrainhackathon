import { Mic, ChevronDown, AudioWaveform } from 'lucide-react';
import { useState } from 'react';

export function SearchInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownOptions = ['Auto', 'Creative', 'Precise', 'Balanced'];

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <div 
        className={`
          relative flex items-center gap-3 w-full h-14 px-4
          bg-[#2B2B2B] rounded-[28px] border-[1.5px] transition-all duration-200
          ${isFocused 
            ? 'border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.3)] scale-[1.02]' 
            : 'border-[#333333] shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
          }
          ${!isFocused && 'hover:border-[#555555] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]'}
        `}
      >
        {/* Left Microphone Icon */}
        <button 
          onClick={handleVoiceInput}
          className={`
            flex-shrink-0 text-white transition-all duration-150
            hover:scale-110 active:scale-95
            ${isRecording ? 'text-[#00D9FF]' : ''}
          `}
          aria-label="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="What do you want to know?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            flex-1 bg-transparent text-white outline-none
            placeholder:text-[#666666] placeholder:transition-all
            ${isFocused ? 'placeholder:opacity-50 placeholder:translate-x-1' : 'placeholder:opacity-100'}
          `}
        />

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Auto Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-all duration-150 hover:bg-white/5 px-2 py-1 rounded-lg"
            >
              <span className="text-sm">Auto</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {dropdownOptions.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => {
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors duration-150"
                    style={{
                      animationDelay: `${index * 0.08}s`
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Circular Voice Button */}
          <button 
            onClick={handleVoiceInput}
            className={`
              flex-shrink-0 w-11 h-11 rounded-full bg-white 
              flex items-center justify-center 
              transition-all duration-200
              hover:scale-110 hover:shadow-lg active:scale-95
              ${isRecording ? 'animate-pulse bg-[#00D9FF]' : ''}
            `}
            aria-label="Start voice input"
          >
            <AudioWaveform className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-black'}`} />
          </button>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#00D9FF] text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          Listening...
        </div>
      )}
    </div>
  );
}
