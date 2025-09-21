import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card } from "../ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechFlow",
      avatar: "SC",
      content: "PromptBrain turned my 5-word requests into comprehensive prompts that actually get results. My productivity with AI tools has tripled.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "Content Creator",
      avatar: "MR",
      content: "I was struggling with vague prompts that gave me generic content. Now I get exactly what I need, every single time.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Scientist",
      avatar: "EW", 
      content: "The systematic approach to prompt engineering has revolutionized how I interact with AI for research. Highly recommended.",
      rating: 5
    }
  ];

  const trustedBy = [
    "Early Founders", "Content Creators", "Researchers", "Product Managers", "Marketing Teams"
  ];

  return (
    <section className="py-24 bg-chronicle-white text-chronicle-black">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Trusted by section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-6">
            Trusted by
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {trustedBy.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-lg font-semibold text-gray-400 hover:text-gradient-blue transition-colors cursor-default"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Loved by creators
            <span className="block bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their AI workflow with PromptBrain.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 bg-white border border-gray-200 hover:border-gradient-blue/30 transition-all duration-300 hover:shadow-lg group">
                <div className="space-y-4">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-gradient-blue/30" />
                  
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.content}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-gradient-blue to-gradient-purple rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-chronicle-black">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-gray-200"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-sm text-gray-500 mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-sm text-gray-500 mt-1">Prompts Enhanced</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                99%
              </div>
              <div className="text-sm text-gray-500 mt-1">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}