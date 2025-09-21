import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "PromptBrain turned my scattered ideas into laser-focused prompts. My AI outputs went from generic to genuinely useful.",
    author: "Sarah Chen",
    title: "Content Strategy Lead",
    company: "TechFlow"
  },
  {
    quote: "I was spending hours tweaking prompts. Now I get it right the first time. Game-changer for my workflow.",
    author: "Marcus Rodriguez", 
    title: "AI Product Manager",
    company: "InnovateLab"
  },
  {
    quote: "The Flow mode is incredible. It asks exactly the right questions to build the perfect prompt structure.",
    author: "Emily Park",
    title: "Marketing Director",
    company: "StartupHub"
  }
];

const partnerLogos = [
  { name: "TechFlow", width: "120px" },
  { name: "InnovateLab", width: "140px" },
  { name: "StartupHub", width: "130px" },
  { name: "DesignCo", width: "110px" },
  { name: "DataPro", width: "125px" },
  { name: "CloudSync", width: "135px" }
];

export function SocialProof() {
  return (
    <section className="relative py-32 bg-chronicle-black">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="chronicle-theme mb-6">
            Trusted by teams who need results
          </h2>
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-chronicle-gray-200/30 chronicle-radius-pill border border-chronicle-white/10 backdrop-blur-sm">
            <div className="w-3 h-3 bg-gradient-blue rounded-full"></div>
            <p className="text-chronicle-white/80 text-sm font-medium">
              Average <span className="text-gradient-blue">37% better</span> first outputs (internal tests)
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.2, 0.8, 0.2, 1]
              }}
              className="bg-chronicle-gray-200/30 chronicle-radius-card p-6 border border-chronicle-white/10 backdrop-blur-sm hover:border-chronicle-white/20 transition-colors duration-300"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg className="w-8 h-8 text-gradient-blue mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-chronicle-white/80 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gradient-blue to-gradient-purple rounded-full flex items-center justify-center text-chronicle-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-chronicle-white font-medium text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-chronicle-white/60 text-sm">
                    {testimonial.title}
                  </p>
                  <p className="text-gradient-blue text-sm font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-t border-chronicle-white/10 pt-16"
        >
          <p className="text-center text-chronicle-white/50 text-sm mb-12">
            Trusted by teams at
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {partnerLogos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.2, 0.8, 0.2, 1]
                }}
                className="flex items-center justify-center"
                style={{ minWidth: logo.width }}
              >
                {/* Placeholder logo - replace with actual logos */}
                <div className="h-8 bg-chronicle-white/10 chronicle-radius-card flex items-center px-4 py-2 hover:bg-chronicle-white/15 transition-colors duration-200" 
                     style={{ width: logo.width }}>
                  <span className="text-chronicle-white/60 text-sm font-medium w-full text-center">
                    {logo.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}