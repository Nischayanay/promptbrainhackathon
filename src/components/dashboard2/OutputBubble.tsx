import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Copy } from "lucide-react";

type Mode = "ideate" | "flow";
type OutputFormat = "english" | "json";

interface ChatMessage {
  id: string;
  mode: Mode;
  timestamp: string;
  input: string;
  output: string;
  title: string;
}

interface OutputBubbleProps {
  message: ChatMessage;
  index: number;
}

export function OutputBubble({ message, index }: OutputBubbleProps) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("english");
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      let textToCopy = message.output;

      if (outputFormat === "json") {
        textToCopy = JSON.stringify(
          {
            mode: message.mode,
            input: message.input,
            output: message.output,
            timestamp: message.timestamp,
            title: message.title,
          },
          null,
          2,
        );
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModeColor = (mode: Mode) => {
    return mode === "ideate" ? "#6E00FF" : "#1D4ED8";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.32,
        ease: [0.2, 0.9, 0.2, 1],
        delay: index * 0.1,
      }}
      className="bg-[#1A1A1A] rounded-2xl border border-[#FFD95A]/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[#FFD95A]/20 transition-all group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{
              background: `linear-gradient(90deg, ${
                getModeColor(message.mode)
              }, #3B82F6)`,
            }}
          >
            {message.mode === "ideate" ? "⚡ Ideate" : "🌊 Flow"}
          </div>
          <span className="text-[#A6A6A6] text-sm">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Copy Button */}
          <motion.button
            onClick={copyToClipboard}
            className="p-2 text-[#A6A6A6] hover:text-white rounded-lg hover:bg-[#FFD95A]/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Copy as ${outputFormat.toUpperCase()}`}
          >
            {copied
              ? <Check className="w-4 h-4 text-green-400" />
              : <Copy className="w-4 h-4" />}
          </motion.button>

          {/* Format Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-[#A6A6A6] hover:text-white rounded-lg hover:bg-[#FFD95A]/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="capitalize">{outputFormat}</span>
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-1 bg-[#0D0D0D] border border-[#FFD95A]/20 rounded-lg py-1 z-10 min-w-[100px]"
              >
                <button
                  onClick={() => {
                    setOutputFormat("english");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1 text-sm text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10 transition-colors"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setOutputFormat("json");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1 text-sm text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10 transition-colors"
                >
                  JSON
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Original Input */}
      <div className="mb-4 p-3 bg-[#0D0D0D] rounded-lg border border-[#FFD95A]/10">
        <div className="text-xs text-[#A6A6A6] mb-1">Original:</div>
        <div className="text-white text-sm">{message.input}</div>
      </div>

      {/* Enhanced Output */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white whitespace-pre-wrap leading-relaxed"
      >
        {message.output}
      </motion.div>
    </motion.div>
  );
}
