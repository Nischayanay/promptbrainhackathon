import { motion } from 'motion/react';
import { SearchInterface } from './SearchInterface';
import { AnimatedGradient } from './AnimatedGradient';



export function HeroSection() {
  const suggestions = [
    { 
      icon: '⚡', 
      label: 'Simplify', 
      prompt: `Simplify this topic: [insert topic]

I want you to simplify this topic in a way that feels effortless to understand, even for someone who has never studied it before.

Start by giving me a plain-language overview that captures the essence of the topic in one or two sentences — no jargon, no complex terms, just the heart of it.

Then, guide me through the concept step-by-step, moving from the most basic foundations to more advanced insights. Each step should build naturally on the previous one, so that I can follow the logic without ever feeling lost.

Use analogies, metaphors, and everyday examples wherever possible — for instance, compare abstract ideas to familiar real-life situations, objects, or experiences. This helps me form strong mental connections and actually feel what the topic means.

After explaining the core idea, include a visual breakdown — describe how I might picture it in my mind (for example: "Imagine a pyramid with three layers…" or "Picture a river flowing…"). This visual teaching approach strengthens comprehension.

Finally, show me how this topic applies in real life — one practical example, use case, or story where this knowledge would actually make a difference. If the topic is abstract or technical, connect it to human behavior, productivity, creativity, or decision-making.

Wrap up with a quick self-test or reflection question that lets me check if I've truly understood.

Your overall goal: make this topic feel so simple, relatable, and useful that I could teach it to a friend confidently within five minutes.

DO ALL THIS ONE AT A TIME, DIVIDE IN SECTIONS TO DO IT ONE AT A TIME` 
    },
    { 
      icon: '💬', 
      label: 'Ask', 
      prompt: `Ask mode — I have a question: [insert question]

Please answer this in a way that feels like a conversation with a thoughtful expert who genuinely wants me to understand.

Begin with a direct, clear answer to my question — one concise paragraph that gives me the main takeaway right away, without too much buildup or technical language. Think of this as the "headline answer."

Then, go deeper by explaining the reasoning behind it — the "why" and "how" that make the answer make sense. If it's a factual or conceptual question, include context, cause-and-effect reasoning, or background information. If it's practical, show the logic of the process.

Next, offer a deeper or alternative insight that expands my understanding — for example, a related concept, an uncommon perspective, or a nuance that people often overlook. This helps me see the bigger picture.

Add a real-world connection: show me how this answer or idea applies to everyday life, human behavior, creativity, decision-making, or a current trend. The goal is to make it useful, not just interesting.

After that, summarize the whole idea in a one-line key takeaway — a short, memorable phrase that captures the essence of the answer.

Finally, suggest a next question I could ask if I wanted to go further — something that naturally extends the topic or challenges me to think deeper. This keeps my curiosity alive and makes the interaction feel like an evolving dialogue, not a dead end.

The goal is to make me feel both informed and inspired — not just to know the answer, but to understand it well enough to apply or discuss it meaningfully.

DO ALL THIS ONE AT A TIME, DIVIDE IN SECTIONS TO DO IT ONE AT A TIME` 
    },
    { 
      icon: '🔁', 
      label: 'Refract Code', 
      prompt: `Refract this code carefully and intelligently: [paste it in your no-code ai]

Your task is to act like a senior full-stack developer reviewing this code — but without changing any design layout, frontend structure, or backend logic.

Follow this process:

Read and understand the full code as if you're performing a professional code review.

Identify unnecessary complexity, redundant logic, and non-standard patterns.

Suggest improvements that make the code cleaner, more modular, and easier to maintain, while keeping every feature, visual design, and backend integration completely intact.

Do not modify the UI, frontend components, or backend endpoints. Only restructure what improves clarity, scalability, and performance.

Analyze the tech stack used (frameworks, languages, dependencies) and provide a short, clear insight on how this stack can be optimized — for speed, modern best practices, or cross-compatibility.

Comment your changes where needed, so users can learn why each refactor matters and how it improves the overall code health.

Maintain the original "vibe" and coding style — this is for vibe coders, who care about both logic and flow.

Deliver:
- A clean, refracted version of the code.
- A one-paragraph review summary (why and what improved).
- A short note on how this code now "feels" smoother or more elegant from a senior developer's perspective.

Goal: Keep the same function and aesthetic — just make it look and work like it was written by a seasoned developer who values elegance, maintainability, and energy flow in their craft.` 
    },
    { 
      icon: '📈', 
      label: 'Marketing', 
      prompt: `You are a marketing strategist who combines consumer psychology, neuroscience, and storytelling to create irresistible marketing.

First, ask me these questions (one at a time):
- What product, feature, or service are we marketing?
- Who is the target user or audience?
- What emotion or transformation do we want them to feel after engaging?
- What problem does this solve, and what is the dream state after solving it?
- How do we want users to take action — sign up, try, buy, share, etc.?

Once I answer, build a full marketing framework based on psychology-backed persuasion tactics, including:

🧠 Step 1: Identify Core Desire
Define the deep emotional driver behind user interest (e.g., mastery, freedom, belonging, safety, recognition, beauty).
Use the P.A.S. model (Problem – Agitation – Solution) to emotionally connect before selling.

🎯 Step 2: Apply Psychological Marketing Principles
Incorporate at least 3 of these proven principles:
- Cognitive Ease: make the message feel simple, safe, and true.
- Endowment Effect: emphasize what's already "theirs" or what they gain control over.
- Social Proof & Authority Bias: show how others trust it.
- Curiosity Gap: tease without revealing everything.
- Scarcity & Urgency: use subtle time pressure (ethical, not manipulative).
- Effortless Mastery: make users feel skilled and capable without stress.

💬 Step 3: Write the Marketing Copy
Craft 3 versions of copy:
- Tagline (under 10 words): instantly emotional and memorable.
- Hero Line (1–2 sentences): aspirational and benefit-driven.
- Short Description (under 100 words): paints the emotional transformation and subtly introduces the offer.

Each version should sound authentic, emotionally resonant, and designed to make users say "That's exactly what I need."

🌟 Step 4: Add a Behavioral CTA (Call to Action)
Suggest a call to action that feels emotionally aligned — not pushy, but motivating. Use action verbs that tap into user identity (e.g., "Start building," "Reclaim your flow," "Join the movement").

🪞 Step 5: Empathic Check
Reflect briefly: Would this message make the target user feel seen, understood, and empowered? If not, refine for warmth and relatability.

Your ultimate goal: write marketing that feels like it was made for the user — not at them.` 
    }
  ];

  const handleSuggestionClick = async (prompt: string) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(prompt);
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.textContent = 'Copied to clipboard!';
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(0,217,255,0.9) 0%, rgba(139,92,246,0.9) 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease-out;
      `;
      
      // Add animation keyframes
      if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: still put in input field
      const input = document.getElementById('prompt-input') as HTMLTextAreaElement;
      if (input) {
        input.value = prompt;
        input.focus();
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ padding: 'var(--spacing-10) var(--spacing-4)' }}
      aria-labelledby="hero-heading"
    >
      {/* Animated Gradient Background */}
      <AnimatedGradient />
      
      <div className="w-full max-w-6xl flex flex-col items-center relative z-10" style={{ gap: 'var(--spacing-6)' }}>
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 
            id="hero-heading"
            className="text-6xl md:text-7xl text-white"
            style={{ 
              fontFamily: "'Instrument Serif', serif",
              marginBottom: 'var(--spacing-2)',
              fontSize: 'var(--text-6xl)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tracking-tighter)',
              fontWeight: 650
            }}
          >
            Prompt<span 
              className="text-[#00D9FF]"
              style={{
                textShadow: 'var(--shadow-cyan-md)'
              }}
            >Brain</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/70"
            style={{ 
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'var(--text-xl)',
              letterSpacing: 'var(--tracking-tight)',
              fontWeight: 450
            }}
          >
            10X better prompts 10X better outputs
          </motion.p>
        </motion.div>

        {/* Search Interface - Primary Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full"
          role="search"
          aria-label="Prompt engineering interface"
        >
          <SearchInterface />
        </motion.div>

        {/* Suggestions */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 'var(--spacing-2)' }}
          aria-label="Quick suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.label}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-full text-white premium-hover"
              style={{
                padding: 'var(--spacing-1-5) var(--spacing-4)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-full)',
                minHeight: 'var(--min-touch-target)',
                fontWeight: 500,
                letterSpacing: 'var(--tracking-tight)',
                boxShadow: 'var(--shadow-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-cyan-md)';
                e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
              aria-label={`Insert ${suggestion.label} prompt template`}
            >
              <span className="mr-2" aria-hidden="true">{suggestion.icon}</span>
              {suggestion.label}
            </motion.button>
          ))}
        </motion.nav>
      </div>

      {/* Section End Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
    </section>
  );
}
