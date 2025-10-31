import { motion, AnimatePresence } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  text: string;
  type: "affirmation" | "emoji";
}

interface InteractiveBubblesProps {
  bubbles: Bubble[];
}

const affirmations = [
  "You're protecting 7+ hours this week.",
  "Easy. Optimizing time and effort.",
  "Smarter workflows, fewer clicks.",
  "Context is your superpower.",
  "Intelligence meets efficiency.",
];

export const ecosystemEmojis = ["🤖", "🎨", "🔍", "💡", "⚡", "🎯", "🚀", "✨"];

export function InteractiveBubbles({ bubbles }: InteractiveBubblesProps) {
  return (
    <AnimatePresence>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: bubble.x,
            top: bubble.y,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: [0, 1, 1, 0],
            y: [0, -120],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        >
          {bubble.type === "emoji" ? (
            <div className="text-4xl">{bubble.text}</div>
          ) : (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 shadow-2xl">
              <p className="text-white text-sm whitespace-nowrap">
                {bubble.text}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export function getRandomAffirmation(): string {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

export function getRandomEmoji(): string {
  return ecosystemEmojis[Math.floor(Math.random() * ecosystemEmojis.length)];
}
