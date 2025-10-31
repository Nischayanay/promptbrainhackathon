import { useState } from "react";
import { motion } from "framer-motion";
import { NeuralBackground } from "../visual/NeuralBackground";
import { AnimatedBubble } from "../visual/AnimatedBubble";
import { InteractiveBubbles, getRandomAffirmation, getRandomEmoji } from "../visual/InteractiveBubbles";

interface Bubble {
  id: number;
  x: number;
  y: number;
  text: string;
  type: "affirmation" | "emoji";
}

export function PBCreativeZone() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // 1 in 3 clicks generates an emoji, others generate affirmations
    const isEmoji = newClickCount % 3 === 0;
    
    const newBubble: Bubble = {
      id: Date.now(),
      x,
      y,
      text: isEmoji ? getRandomEmoji() : getRandomAffirmation(),
      type: isEmoji ? "emoji" : "affirmation",
    };
    
    setBubbles((prev) => [...prev, newBubble]);
    
    // Remove bubble after animation completes
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 3000);
  };

  return (
    <motion.div
      className="relative h-full flex items-center justify-center p-8 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onClick={handleClick}
    >
      <NeuralBackground />
      
      <div className="relative z-10">
        <AnimatedBubble />
      </div>
      
      <InteractiveBubbles bubbles={bubbles} />
    </motion.div>
  );
}