// CREDIT: Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './electric-border.css';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  speed?: number;
  className?: string;
}

export default function ElectricBorder({ 
  children, 
  color = "#00d4ff", 
  intensity = 1,
  speed = 1,
  className = "" 
}: ElectricBorderProps) {
  return (
    <motion.div
      className={`electric-border-container relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      style={{
        background: `
          linear-gradient(45deg, transparent 30%, ${color}15 50%, transparent 70%),
          linear-gradient(-45deg, transparent 30%, ${color}10 50%, transparent 70%)
        `,
        backgroundSize: '400% 400%, 400% 400%',
        animation: `electricFlow ${4 / speed}s ease-in-out infinite`,
        border: `2px solid transparent`,
        borderImage: `linear-gradient(45deg, ${color}60, transparent, ${color}60, transparent) 1`,
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `
          0 0 20px ${color}20,
          inset 0 0 20px ${color}10
        `
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          backgroundSize: '200% 100%',
          animation: `electricGlow ${3 / speed}s linear infinite`,
          opacity: 0.6
        }}
      />
      
      {/* Moving electric particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
              animation: `particleTrail ${2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              top: i % 2 === 0 ? '0%' : '100%',
              left: i < 2 ? '0%' : '100%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
      
      {/* Corner electric sparks */}
      {[
        { top: '-1px', left: '-1px' },
        { top: '-1px', right: '-1px' },
        { bottom: '-1px', left: '-1px' },
        { bottom: '-1px', right: '-1px' }
      ].map((position, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 pointer-events-none"
          style={position}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              boxShadow: `0 0 8px ${color}`,
              animation: `sparkle ${2 / speed}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`
            }}
          />
        </div>
      ))}

      {/* Content with electric text effect */}
      <div className="relative z-10 p-3">
        <div
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
            textShadow: `0 0 10px ${color}60`
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}