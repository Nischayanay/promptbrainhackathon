import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  "Prompting isn't about magic words — it's about clarity.",
  "Context turns generic outputs into personalized intelligence.",
  "Great prompts don't command — they collaborate.",
  "The best AI responses start with the best human questions.",
  "Precision in input creates excellence in output.",
];

export function AnimatedBubble() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative backdrop-blur-md bg-white/15 rounded-3xl px-8 py-6 shadow-2xl border border-white/20 max-w-md"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center leading-relaxed"
          >
            {facts[currentIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-4">
          {facts.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}