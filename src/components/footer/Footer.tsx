import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Instagram, Twitter, Linkedin, FileText, Shield, ArrowUp } from "lucide-react";

interface FooterProps {
  onNavigateToLogin?: () => void;
}

export function Footer({ onNavigateToLogin }: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const manifestoControls = useAnimation();
  const [typedText, setTypedText] = useState("");
  const copyrightText = "© PromptBrain 2025";

  // Word-by-word stagger animation for manifesto
  const manifestoWords = ["We", "architect", "prompts."];
  
  // Typewriter effect for copyright
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      const typewriter = async () => {
        // Wait for manifesto and links to appear first
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (let i = 0; i <= copyrightText.length; i++) {
          setTypedText(copyrightText.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };
      
      typewriter();
    } else if (isInView) {
      // If reduced motion, show full text immediately
      setTimeout(() => setTypedText(copyrightText), 1500);
    }
  }, [isInView, prefersReducedMotion]);

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://www.instagram.com/promptbrain.io/",
      color: "hover:text-pink-400"
    },
    { 
      name: "X", 
      icon: Twitter, 
      href: "https://x.com/anaybauskar",
      color: "hover:text-landing-blue"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/anay-bauskar",
      color: "hover:text-blue-400"
    }
  ];

  const legalLinks = [
    { 
      name: "About", 
      icon: FileText, 
      href: "#",
      color: "hover:text-cyan-400"
    },
    { 
      name: "Privacy", 
      icon: Shield, 
      href: "#",
      color: "hover:text-green-400"
    }
  ];

  return (
    <footer 
      ref={containerRef}
      className="relative py-20 bg-landing-black overflow-hidden landing-theme"
    >
      {/* Architectural Grid Lines Background */}
      <div className="absolute inset-0 opacity-5">
        {/* Horizontal Grid Lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-landing-blue/30 to-transparent"
            style={{ top: `${12.5 * (i + 1)}%` }}
            animate={!prefersReducedMotion ? {
              opacity: [0.05, 0.15, 0.05],
              scaleX: [0.8, 1.2, 0.8],
            } : {}}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
        
        {/* Vertical Grid Lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-landing-blue/20 to-transparent"
            style={{ left: `${16.67 * (i + 1)}%` }}
            animate={!prefersReducedMotion ? {
              opacity: [0.03, 0.1, 0.03],
              scaleY: [0.9, 1.1, 0.9],
            } : {}}
            transition={{
              duration: 10 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}

        {/* Diagonal Accent Lines */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, transparent 49%, rgba(59, 130, 246, 0.02) 50%, transparent 51%),
                        linear-gradient(-45deg, transparent 49%, rgba(0, 255, 247, 0.02) 50%, transparent 51%)`,
            backgroundSize: '100px 100px'
          }}
          animate={!prefersReducedMotion ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Bold Closing Statement - Manifesto */}
        <div className="text-center mb-16">
          <div className="inline-block">
            {manifestoWords.map((word, index) => (
              <motion.span
                key={word}
                className="inline-block mr-6 text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', 'Inter Tight', 'Inter', sans-serif",
                  textShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <span className={`${
                  word === "architect" 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-landing-blue to-cyan-400"
                    : "text-landing-white"
                }`}>
                  {word}
                </span>
              </motion.span>
            ))}
          </div>
          
          {/* Subtitle */}
          <motion.p
            className="mt-6 subhead text-landing-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Transforming chaos into clarity, one prompt at a time.
          </motion.p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Social Links */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h4 className="text-landing-white/80 font-semibold mb-6 text-lg">Connect</h4>
            <div className="flex justify-center md:justify-start gap-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 text-landing-white/60 transition-all duration-300 ${link.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="relative">
                    {link.name}
                    {/* Notion-style slide-in underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-px bg-current"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h4 className="text-landing-white/80 font-semibold mb-6 text-lg">Legal</h4>
            <div className="flex flex-col gap-4">
              {legalLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`group inline-flex items-center justify-center md:justify-end gap-2 text-landing-white/60 transition-all duration-300 ${link.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="relative">
                    {link.name}
                    {/* Notion-style slide-in underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-px bg-current"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Back to Top Arrow */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-landing-blue/20 to-cyan-400/20 border border-landing-blue/40 rounded-full text-landing-white hover:border-landing-blue/60 transition-all duration-300"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Separator */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-landing-white/20 to-transparent mb-12"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 2, ease: "easeOut" }}
        />

        {/* Brandmark + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brandmark */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Minimalistic Logo Mark */}
            <div className="relative w-12 h-12">
              {/* Core Orb */}
              <div className="absolute inset-2 bg-gradient-to-r from-landing-blue to-cyan-400 rounded-full" />
              
              {/* Architectural Frame */}
              <div className="absolute inset-0 border-2 border-landing-blue/40 rounded-lg rotate-45" />
              <div className="absolute inset-1 border border-cyan-400/30 rounded-lg rotate-45" />
            </div>
            
            <div>
              <div 
                className="text-xl font-bold text-landing-white"
                style={{ fontFamily: "'Space Grotesk', 'Inter Tight', 'Inter', sans-serif" }}
              >
                PromptBrain
              </div>
              <div className="text-sm text-landing-white/60">
                We architect prompts
              </div>
            </div>
          </motion.div>

          {/* Copyright with Typewriter Effect */}
          <motion.div
            className="text-landing-white/40 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 2.4 }}
          >
            {typedText}
            {/* Blinking cursor */}
            {typedText.length < copyrightText.length && (
              <motion.span
                className="inline-block w-px h-4 bg-landing-blue ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Final Glow Effect */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-radial from-landing-blue/10 to-transparent"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 2, delay: 3, ease: "easeOut" }}
        />
      </div>
    </footer>
  );
}