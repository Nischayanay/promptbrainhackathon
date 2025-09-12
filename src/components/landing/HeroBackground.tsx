import { motion, useScroll, useTransform } from "motion/react";

export function HeroBackground() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle grid pattern */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 opacity-[0.03]"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </motion.div>

      {/* Gradient bloom effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-landing-gradient-start to-landing-gradient-end rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-landing-gradient-end to-landing-gradient-start rounded-full blur-3xl opacity-15" />
      
      {/* Soft particles - optional subtle effect */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-landing-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}