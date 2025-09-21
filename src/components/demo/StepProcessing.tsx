import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface StepProcessingProps {
  isActive: boolean;
  isReplaying: boolean;
}

export function StepProcessing({ isActive, isReplaying }: StepProcessingProps) {
  const [showOrb, setShowOrb] = useState(false);
  const [showNeuralNetwork, setShowNeuralNetwork] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Neural network animation
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Neural network nodes
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [] as number[],
      pulse: Math.random() * Math.PI * 2,
      active: false,
    }));

    // Create connections
    nodes.forEach((node, i) => {
      const nearbyNodes = nodes
        .map((other, j) => ({ index: j, distance: Math.hypot(other.x - node.x, other.y - node.y) }))
        .filter(({ distance, index }) => distance < 80 && index !== i)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(({ index }) => index);
      
      node.connections = nearbyNodes;
    });

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      time += 0.02;

      // Update nodes
      nodes.forEach((node, i) => {
        // Gentle movement
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 10 || node.x > rect.width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > rect.height - 10) node.vy *= -1;
        
        // Keep in bounds
        node.x = Math.max(10, Math.min(rect.width - 10, node.x));
        node.y = Math.max(10, Math.min(rect.height - 10, node.y));

        // Pulse animation
        node.pulse += 0.05;
        node.active = Math.sin(node.pulse + i * 0.3) > 0.7;
      });

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connIndex => {
          const connNode = nodes[connIndex];
          if (!connNode) return;

          const alpha = (node.active || connNode.active) ? 0.6 : 0.2;
          const width = (node.active || connNode.active) ? 2 : 1;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connNode.x, connNode.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = width;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const radius = node.active ? 6 : 4;
        const alpha = node.active ? 1 : 0.6;

        // Glow effect for active nodes
        if (node.active) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, 0.2)`;
          ctx.fill();
        }

        // Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation with delay
    setTimeout(() => {
      setShowNeuralNetwork(true);
      animate();
    }, 500);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, prefersReducedMotion]);

  // Show orb animation
  useEffect(() => {
    if (!isActive) {
      setShowOrb(false);
      setShowNeuralNetwork(false);
      return;
    }

    // Sequence: text collapses -> orb appears -> neural network
    setTimeout(() => setShowOrb(true), 200);
  }, [isActive, isReplaying]);

  // Reset on replay
  useEffect(() => {
    if (isReplaying) {
      setShowOrb(false);
      setShowNeuralNetwork(false);
    }
  }, [isReplaying]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Step Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
            isActive 
              ? 'bg-landing-blue text-landing-white shadow-lg shadow-landing-blue/50' 
              : 'bg-landing-white/20 text-landing-white/60'
          }`}>
            2
          </div>
          <h3 className="landing-theme text-xl font-semibold text-landing-white">
            The Magic
          </h3>
        </div>
        <p className="text-landing-white/70 text-sm">
          We process it through PromptBrain
        </p>
      </motion.div>

      {/* Processing Container */}
      <motion.div
        className={`relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${
          isActive
            ? 'bg-gradient-to-br from-landing-blue/10 to-landing-blue/5 border-landing-blue/30 shadow-lg shadow-landing-blue/20'
            : 'bg-landing-white/[0.01] border-landing-white/10'
        }`}
        style={{ height: '200px' }}
      >
        {/* Central Processing Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {showOrb && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.8,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="relative w-16 h-16 bg-gradient-radial from-landing-blue to-landing-blue/50 rounded-full"
              >
                {/* Orb Core */}
                <motion.div
                  className="absolute inset-2 bg-landing-white rounded-full"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Orb Rings */}
                {!prefersReducedMotion && (
                  <>
                    <motion.div
                      className="absolute inset-0 border-2 border-landing-blue/40 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 border-2 border-landing-blue/30 rounded-full"
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.5
                      }}
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Neural Network Canvas */}
        <AnimatePresence>
          {showNeuralNetwork && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </AnimatePresence>

        {/* Processing Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="text-xs text-landing-white/40 mb-2 font-mono">
            STATUS:
          </div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-landing-blue rounded-full"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-landing-blue font-medium">
              Powered by Gemini + structured logic
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Energy Particles */}
      {isActive && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-landing-blue/60 rounded-full"
              style={{
                left: `${25 + (i * 8)}%`,
                top: `${30 + (i % 3) * 15}%`,
              }}
              animate={{
                x: [0, Math.sin(i) * 30, 0],
                y: [0, Math.cos(i) * 30, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}