// Performance utilities for cinematic 60fps experience

export const useIsMobileGPU = () => {
  if (typeof window === 'undefined') return false;
  
  // Detect low-power devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isLowPowerMobile = /mobile|android|iphone|ipad|ipod|blackberry|webos/.test(userAgent);
  
  // Check hardware acceleration
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const renderer = gl?.getParameter(gl.RENDERER)?.toLowerCase() || '';
  const isLowEndGPU = renderer.includes('adreno 3') || renderer.includes('mali-4');
  
  return isLowPowerMobile || isLowEndGPU;
};

export const throttleAnimation = (callback: () => void, fps = 60) => {
  let lastTime = 0;
  const interval = 1000 / fps;
  
  return () => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      callback();
    }
  };
};

export const optimizeForPerformance = () => {
  // Enable CSS containment for better performance
  const style = document.createElement('style');
  style.textContent = `
    .gpu-layer {
      transform: translateZ(0);
      will-change: transform;
    }
    
    .contain-layout {
      contain: layout;
    }
    
    .contain-paint {
      contain: paint;
    }
    
    .contain-style {
      contain: style;
    }
  `;
  document.head.appendChild(style);
};

// Cinematic easing functions
export const CINEMATIC_EASING = {
  smooth: [0.22, 1, 0.36, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  dramatic: [0.25, 0.46, 0.45, 0.94] as const,
  subtle: [0.4, 0, 0.2, 1] as const,
};

// Animation timing constants
export const CINEMATIC_TIMING = {
  micro: 150,    // Button hover, small interactions
  quick: 300,    // Card animations, mode switches
  smooth: 500,   // Page transitions, reveal animations
  dramatic: 800, // Hero transitions, major state changes
  epic: 1200,    // Full page transforms, story moments
} as const;

// Stagger delays for cinematic reveals
export const CINEMATIC_STAGGER = {
  cards: 0.1,    // Dashboard cards appearing
  text: 0.05,    // Text lines revealing
  elements: 0.15 // Different UI sections
} as const;