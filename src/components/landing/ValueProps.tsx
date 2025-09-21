import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface ValueCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  delay: number;
}

function ValueCard({ icon, title, description, delay }: ValueCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={prefersReducedMotion ? {} : { 
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-landing-white/[0.03] backdrop-blur-sm border border-landing-white/10 rounded-2xl p-8 hover:border-landing-blue/30 transition-all duration-300"
      style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-landing-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-landing-blue/10 border border-landing-blue/20 flex items-center justify-center group-hover:bg-landing-blue/20 group-hover:border-landing-blue/40 transition-all duration-300">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="landing-theme text-xl font-semibold text-landing-white mb-4 text-center">
          {title}
        </h3>

        {/* Description */}
        <p className="text-landing-white/70 text-center leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-landing-blue/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl" />
    </motion.div>
  );
}

export function ValueProps() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const valueCards = [
    {
      icon: (
        <svg className="w-8 h-8 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Enhance Any Prompt",
      description: "Raw input to structured brilliance. Transform vague ideas into precise, actionable prompts that get results."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      title: "Multi-Mode Intelligence",
      description: "General, Product Specs, Research. Specialized modes tailored for different use cases and industries."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Save Time",
      description: "Spend seconds, not hours, on prompt crafting. Get professional-quality prompts instantly with AI-powered enhancement."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Trusted Infrastructure",
      description: "Backed by Supabase + Gemini AI. Enterprise-grade security and Google's most advanced language model."
    }
  ];

  return (
    <section className="py-24 bg-landing-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header with semantic heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="landing-theme text-3xl md:text-4xl lg:text-5xl font-bold text-landing-white mb-6">
            What makes PromptBrain different
          </h2>
          <p className="subhead text-landing-white/80 max-w-3xl mx-auto">
            Stop struggling with prompt engineering. Get professional-quality results from day one with our intelligent enhancement system.
          </p>
        </motion.div>

        {/* Value cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueCards.map((card, index) => (
            <ValueCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={prefersReducedMotion ? 0 : index * 0.1}
            />
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 flex justify-center"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-landing-blue to-transparent rounded-full" />
        </motion.div>
      </div>

      {/* Ambient particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-landing-blue/30 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}