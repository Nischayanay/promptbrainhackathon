import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  impact: string;
  category: 'founder' | 'creator' | 'student';
}

const testimonialsData: Testimonial[] = [
  {
    id: 'founder-1',
    name: 'Sarah Chen',
    role: 'CEO & Founder',
    company: 'TechFlow Dynamics',
    avatar: 'SC',
    quote: "PromptBrain turned our chaotic AI workflows into precision instruments. What used to take our team hours of prompt refinement now happens in minutes.",
    impact: "3x faster AI workflows",
    category: 'founder'
  },
  {
    id: 'creator-1', 
    name: 'Marcus Rivera',
    role: 'Content Creator',
    company: '@CreativeMinds',
    avatar: 'MR',
    quote: "The clarity is incredible. PromptBrain doesn't just enhance prompts—it unlocks creative possibilities I never knew existed. My content quality skyrocketed.",
    impact: "10x creative output quality",
    category: 'creator'
  },
  {
    id: 'student-1',
    name: 'Elena Kovalenko',
    role: 'PhD Researcher', 
    company: 'MIT Media Lab',
    avatar: 'EK',
    quote: "Research breakthroughs happen when AI truly understands what you need. PromptBrain transformed my research process—faster insights, deeper analysis.",
    impact: "5x research efficiency",
    category: 'student'
  },
  {
    id: 'founder-2',
    name: 'David Park',
    role: 'Head of Product',
    company: 'InnovateLab',
    avatar: 'DP',
    quote: "We've integrated PromptBrain into our entire product development cycle. The consistency and quality of AI outputs has revolutionized how we build.",
    impact: "Reduced dev time by 40%",
    category: 'founder'
  },
  {
    id: 'creator-2',
    name: 'Maya Thompson',
    role: 'Digital Artist',
    company: 'Independent',
    avatar: 'MT',
    quote: "PromptBrain is like having an AI whisperer. My creative vision translates perfectly into AI instructions—no more lost ideas or unclear outputs.",
    impact: "Perfect creative translation",
    category: 'creator'
  },
  {
    id: 'student-2',
    name: 'Alex Petrov',
    role: 'Computer Science Student',
    company: 'Stanford University',
    avatar: 'AP',
    quote: "Learning complex topics became effortless. PromptBrain helps me ask the right questions and get exactly the explanations I need to understand.",
    impact: "Faster learning curve",
    category: 'student'
  }
];

const stats = [
  { number: "500+", label: "Early Users" },
  { number: "95%", label: "Save Hours Weekly" },
  { number: "10x", label: "Faster AI Workflows" },
  { number: "99%", label: "Would Recommend" }
];

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(!prefersReducedMotion);

  // Auto-scroll testimonials
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getCategoryIcon = (category: Testimonial['category']) => {
    switch (category) {
      case 'founder':
        return '⚡';
      case 'creator':
        return '✨';
      case 'student':
        return '🔬';
      default:
        return '💡';
    }
  };

  const getCategoryColor = (category: Testimonial['category']) => {
    switch (category) {
      case 'founder':
        return 'from-landing-blue/20 to-purple-500/20';
      case 'creator':
        return 'from-cyan-400/20 to-landing-blue/20';
      case 'student':
        return 'from-purple-500/20 to-magenta/20';
      default:
        return 'from-landing-blue/20 to-cyan-400/20';
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-landing-black via-gray-950 to-landing-black overflow-hidden landing-theme"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 255, 247, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-landing-blue/10 to-cyan-400/10 border border-landing-blue/20 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="subhead text-landing-white/80 text-sm font-medium">Social Proof</span>
          </motion.div>

          <motion.h2
            className="landing-theme text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            See how PromptBrain already{" "}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-landing-blue to-cyan-400"
            >
              transforms workflows
            </span>
          </motion.h2>

          <motion.p
            className="subhead text-landing-white/70 max-w-3xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From founders to creators to researchers—real people achieving extraordinary results with enhanced AI workflows.
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-20">
          
          {/* Navigation Arrows */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              onClick={prevTestimonial}
              className="p-3 bg-landing-white/5 hover:bg-landing-white/10 border border-landing-white/10 rounded-full text-landing-white/60 hover:text-landing-white transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              onClick={nextTestimonial}
              className="p-3 bg-landing-white/5 hover:bg-landing-white/10 border border-landing-white/10 rounded-full text-landing-white/60 hover:text-landing-white transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Testimonial Cards Container */}
          <div className="mx-12 overflow-hidden">
            <motion.div
              className="flex transition-transform duration-700 ease-out"
              animate={{ x: `-${currentIndex * 100}%` }}
            >
              {testimonialsData.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div 
                    className={`relative group bg-gradient-to-br ${getCategoryColor(testimonial.category)} backdrop-blur-xl border border-landing-white/10 rounded-3xl p-8 md:p-12 hover:border-landing-blue/30 transition-all duration-500 hover:shadow-2xl hover:shadow-landing-blue/10`}
                  >
                    {/* Category Icon & Hover Glow */}
                    <div className="absolute top-6 right-6 text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {getCategoryIcon(testimonial.category)}
                    </div>

                    {/* Electric Blue Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-landing-blue/0 via-landing-blue/5 to-landing-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-8 h-8 text-landing-blue/60" />
                    </div>

                    {/* Testimonial Quote */}
                    <blockquote className="text-xl md:text-2xl text-landing-white/90 mb-8 leading-relaxed font-medium">
                      {testimonial.quote}
                    </blockquote>

                    {/* Impact Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-landing-blue/10 border border-landing-blue/20 rounded-full mb-6">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-cyan-400 text-sm font-medium">{testimonial.impact}</span>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-landing-blue to-cyan-400 rounded-full flex items-center justify-center text-landing-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-landing-white font-semibold text-lg">{testimonial.name}</div>
                        <div className="text-landing-white/60">{testimonial.role}</div>
                        <div className="text-landing-blue text-sm">{testimonial.company}</div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-landing-blue text-landing-blue" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-landing-blue shadow-lg shadow-landing-blue/50'
                    : 'bg-landing-white/20 hover:bg-landing-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Band */}
        <motion.div
          className="relative bg-gradient-to-r from-landing-blue/10 via-cyan-400/10 to-landing-blue/10 backdrop-blur-xl border border-landing-white/10 rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Animated Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-landing-blue/20 to-transparent opacity-0 animate-pulse rounded-3xl" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-landing-blue to-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-landing-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-landing-white/60 hover:text-landing-white/80 transition-colors duration-300"
          >
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-landing-white/30'}`} />
            {isAutoPlaying ? 'Auto-playing' : 'Paused'}
          </button>
        </div>
      </div>
    </section>
  );
}