import { useState } from 'react';
import { Mic, ChevronDown, AudioWaveform, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m PromptBrain. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownOptions = ['Auto', 'Creative', 'Precise', 'Balanced'];

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
  };

  const handleSend = () => {
    if (!value.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: value,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setValue('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I\'m processing your request. This is a demo response showing how the chat interface works.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 px-4 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-5 py-3.5
                ${message.type === 'user'
                  ? 'bg-gradient-to-br from-[#00D9FF] to-[#0099FF] text-white'
                  : 'bg-[#1A1A1A] text-white border border-white/10'
                }
              `}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#00D9FF]" />
                  <span className="text-xs text-white/60">PromptBrain</span>
                </div>
              )}
              <p className="leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-50 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 px-4 py-6">
        <div className="relative w-full max-w-3xl mx-auto">
          <div 
            className={`
              relative flex items-center gap-3 w-full min-h-[56px] px-4
              bg-[#1A1A1A] rounded-[28px] border-[1.5px] transition-all duration-200
              ${isFocused 
                ? 'border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.3)]' 
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
            <textarea
              placeholder="What do you want to know?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              rows={1}
              className={`
                flex-1 bg-transparent text-white outline-none resize-none py-3
                placeholder:text-[#666666] placeholder:transition-all max-h-32
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
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
                    {dropdownOptions.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors duration-150"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send/Voice Button */}
              {value.trim() ? (
                <button 
                  onClick={handleSend}
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#0099FF]
                           flex items-center justify-center 
                           transition-all duration-200
                           hover:scale-110 hover:shadow-lg active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              ) : (
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
              )}
            </div>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#00D9FF] text-sm animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
