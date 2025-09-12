import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const roles: Role[] = [
  {
    id: "creator",
    title: "Creator",
    description: "Craft words, art, and vision.",
    icon: "✍️",
    gradient: "from-royal-gold to-amber-500"
  },
  {
    id: "founder",
    title: "Founder", 
    description: "Build products, pitch, and scale ideas.",
    icon: "⚙️",
    gradient: "from-electric-blue to-cyan-500"
  },
  {
    id: "researcher",
    title: "Researcher",
    description: "Unravel knowledge, sharpen clarity.",
    icon: "📜",
    gradient: "from-violet to-purple-500"
  }
];

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleRoleClick = (roleId: string) => {
    setSelectedRole(roleId);
    // Add a small delay for visual feedback before proceeding
    setTimeout(() => {
      onRoleSelect(roleId);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-temple-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-violet/10 to-royal-gold/5"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-royal-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-light text-marble-white mb-6 tracking-wide"
            style={{ 
              fontFamily: '"Playfair Display", "Georgia", serif',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
            }}
          >
            Every seeker enters the Mind Temple with a purpose.
          </h1>
          <p className="text-lg md:text-xl text-marble-white/70 max-w-2xl mx-auto">
            What brings you here?
          </p>
        </motion.div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2 
              }}
              onHoverStart={() => setHoveredRole(role.id)}
              onHoverEnd={() => setHoveredRole(null)}
              onClick={() => handleRoleClick(role.id)}
            >
              {/* Temple Doorway/Pillar */}
              <div className="relative">
                {/* Doorway Background */}
                <motion.div
                  className={`relative h-72 sm:h-80 md:h-96 bg-gradient-to-b ${role.gradient} rounded-2xl border border-white/10 overflow-hidden`}
                  style={{
                    background: hoveredRole === role.id || selectedRole === role.id
                      ? `linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(58, 134, 255, 0.1))`
                      : 'rgba(10, 10, 10, 0.7)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: hoveredRole === role.id || selectedRole === role.id
                      ? '0 25px 50px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                  }}
                  animate={{
                    scale: hoveredRole === role.id ? 1.05 : selectedRole === role.id ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Glow effect */}
                  {(hoveredRole === role.id || selectedRole === role.id) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-royal-gold/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Temple pillars decoration */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-royal-gold/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-royal-gold/30 to-transparent"></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
                    {/* Icon */}
                    <motion.div
                      className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6"
                      animate={{
                        scale: hoveredRole === role.id ? 1.2 : selectedRole === role.id ? 1.1 : 1,
                        rotate: hoveredRole === role.id ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ 
                        scale: { duration: 0.2 },
                        rotate: { duration: 0.5 }
                      }}
                      style={{
                        filter: hoveredRole === role.id || selectedRole === role.id
                          ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))'
                          : 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                      }}
                    >
                      {role.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 
                      className="text-xl sm:text-2xl md:text-3xl font-medium text-marble-white mb-3 sm:mb-4"
                      style={{
                        textShadow: hoveredRole === role.id || selectedRole === role.id
                          ? '0 0 15px rgba(255, 215, 0, 0.4)'
                          : '0 0 10px rgba(255, 215, 0, 0.2)',
                      }}
                    >
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-marble-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                      {role.description}
                    </p>

                    {/* Selection indicator */}
                    {selectedRole === role.id && (
                      <motion.div
                        className="absolute inset-0 border-2 border-royal-gold rounded-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>

                  {/* Mystic beam effect on hover */}
                  {hoveredRole === role.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-full bg-gradient-to-t from-royal-gold/60 to-transparent"
                      style={{ transform: 'translateX(-50%)' }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </motion.div>

                {/* Doorway opening animation for selected role */}
                {selectedRole === role.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-royal-gold/20 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-royal-gold rounded-full"></div>
            <div className="w-2 h-2 bg-royal-gold/30 rounded-full"></div>
          </div>
          <p className="text-marble-white/60 text-sm">Step 1 of 2</p>
        </motion.div>
      </div>
    </div>
  );
}