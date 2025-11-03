import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackSection() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !feedback) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you for your feedback!');
      setEmail('');
      setFeedback('');
    }, 1000);
  };

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative bg-black"
      style={{ padding: 'var(--spacing-16) var(--spacing-4)' }}
      aria-labelledby="feedback-heading"
    >
      {/* Subtle top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-5xl relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
          style={{ marginBottom: 'var(--spacing-8)' }}
        >
          <h2 
            id="feedback-heading"
            className="text-white"
            style={{
              fontSize: 'var(--text-5xl)',
              marginBottom: 'var(--spacing-4)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em'
            }}
          >
            Help Us Improve
          </h2>
        </motion.div>

        {/* Feedback Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}
          aria-label="User feedback form"
        >
          {/* Side by Side Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
            {/* Email Input */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}
            >
              <label 
                htmlFor="email" 
                className="block text-white/70"
                style={{ 
                  fontSize: 'var(--text-sm)',
                  marginLeft: 'var(--spacing-1)'
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white 
                         placeholder:text-white/30 outline-none
                         focus:border-[#00D9FF] focus:shadow-[0_0_30px_rgba(0,217,255,0.2)]"
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-base) var(--ease-out)'
                }}
                required
                aria-required="true"
              />
            </motion.div>

            {/* Feedback Input */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}
            >
              <label 
                htmlFor="feedback" 
                className="block text-white/70"
                style={{ 
                  fontSize: 'var(--text-sm)',
                  marginLeft: 'var(--spacing-1)'
                }}
              >
                Your Feedback
              </label>
              <input
                id="feedback"
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white 
                         placeholder:text-white/30 outline-none
                         focus:border-[#00D9FF] focus:shadow-[0_0_30px_rgba(0,217,255,0.2)]"
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-base) var(--ease-out)'
                }}
                required
                aria-required="true"
              />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#00D9FF] to-[#0099FF] 
                       text-white rounded-2xl
                       hover:shadow-[0_0_40px_rgba(0,217,255,0.5)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center min-w-[200px]"
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                gap: 'var(--spacing-2)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                transition: 'all var(--transition-base) var(--ease-out)'
              }}
              aria-label={isSubmitting ? 'Submitting feedback' : 'Submit feedback'}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Submit Feedback
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>

      {/* Section End Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
    </section>
  );
}
