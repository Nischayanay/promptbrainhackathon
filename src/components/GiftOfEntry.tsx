import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GiftOfEntryProps {
  role: string;
  onEnterTemple: () => void;
}

const tourSlides = [
  {
    title: "Enhance broken prompts into brilliance",
    description: "Transform unclear ideas into crystal-clear commands that unlock AI's true potential.",
    icon: "✨",
    color: "from-royal-gold to-amber-500"
  },
  {
    title: "Store your ideas in the eternal library", 
    description: "Save your perfected prompts in the Mind Temple's archive for future use and inspiration.",
    icon: "📚",
    color: "from-electric-blue to-cyan-500"
  },
  {
    title: "Share sparks to inspire other seekers",
    description: "Connect with fellow temple dwellers and exchange wisdom through the community.",
    icon: "🌟",
    color: "from-violet to-purple-500"
  }
];

export function GiftOfEntry({ role, onEnterTemple }: GiftOfEntryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollAnimationComplete, setScrollAnimationComplete] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tourSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tourSlides.length) % tourSlides.length);
  };

  const handleEnterTemple = () => {
    onEnterTemple();
  };

  return (
    <div className="min-h-screen bg-temple-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic background with more particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/5 via-electric-blue/10 to-violet/5"></div>
        
        {/* Enhanced floating particles for celebration */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-royal-gold/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-light text-marble-white mb-4 tracking-wide"
            style={{ 
              fontFamily: '"Playfair Display", "Georgia", serif',
              textShadow: '0 0 25px rgba(255, 215, 0, 0.4)'
            }}
          >
            Welcome, Seeker.
          </h1>
          <p className="text-lg md:text-xl text-marble-white/80 mb-2">
            Your journey begins with gifts.
          </p>
          <div className="text-royal-gold font-medium text-lg">
            Path chosen: <span className="capitalize">{role}</span>
          </div>
        </motion.div>

        {/* Unfurling Scroll Container */}
        <motion.div
          className="relative"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ 
            scaleY: scrollAnimationComplete ? 1 : [0, 0.1, 0.3, 0.7, 1],
            opacity: 1 
          }}
          transition={{ 
            duration: 1.2,
            ease: "easeOut",
            onComplete: () => setScrollAnimationComplete(true)
          }}
          style={{ transformOrigin: "center top" }}
        >
          {/* Scroll Background */}
          <div 
            className="bg-gradient-to-b from-marble-white/5 to-marble-white/10 rounded-3xl border border-royal-gold/20 p-8 md:p-12 relative overflow-hidden"
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
            }}
          >
            {/* Decorative scroll edges */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent"></div>
            
            {/* Credits Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: scrollAnimationComplete ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Credits Badge */}
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-royal-gold/20 to-electric-blue/20 rounded-full px-8 py-4 mb-6 border border-royal-gold/30"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.2)',
                    '0 0 30px rgba(255, 215, 0, 0.4)',
                    '0 0 20px rgba(255, 215, 0, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-3xl">🗝️</div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-royal-gold mb-1">10</div>
                  <div className="text-sm text-marble-white/80">Temple Keys</div>
                </div>
              </motion.div>
              
              <p className="text-marble-white/70 text-lg">
                You receive 10 free Temple Keys (credits) to unlock ideas.
              </p>
            </motion.div>

            {/* Tour Slides */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: scrollAnimationComplete ? 1 : 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="bg-marble-white/5 rounded-2xl p-6 md:p-8 min-h-[280px] relative overflow-hidden">
                {/* Current slide content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="text-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Slide icon */}
                    <motion.div
                      className="text-6xl mb-6"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))'
                      }}
                    >
                      {tourSlides[currentSlide].icon}
                    </motion.div>

                    {/* Slide content */}
                    <h3 className="text-xl md:text-2xl font-medium text-marble-white mb-4">
                      {tourSlides[currentSlide].title}
                    </h3>
                    <p className="text-marble-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                      {tourSlides[currentSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-marble-white/10 hover:bg-marble-white/20 border border-marble-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-marble-white" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-marble-white/10 hover:bg-marble-white/20 border border-marble-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-marble-white" />
                </button>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {tourSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-royal-gold w-6' 
                        : 'bg-marble-white/30 hover:bg-marble-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Enter Temple CTA */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: scrollAnimationComplete ? 1 : 0, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Button
                onClick={handleEnterTemple}
                className="bg-gradient-to-r from-royal-gold to-amber-500 hover:from-royal-gold/90 hover:to-amber-500/90 text-temple-black font-medium text-lg px-12 py-4 rounded-xl transition-all duration-300 shadow-lg"
                style={{
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
                  textShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
                }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(10, 10, 10, 0.3)',
                      '0 0 20px rgba(10, 10, 10, 0.5)',
                      '0 0 10px rgba(10, 10, 10, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Enter the Temple
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-royal-gold/50 rounded-full"></div>
            <div className="w-2 h-2 bg-royal-gold rounded-full"></div>
          </div>
          <p className="text-marble-white/60 text-sm">Step 2 of 2</p>
        </motion.div>
      </div>
    </div>
  );
}