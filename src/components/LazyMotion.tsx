import { LazyMotion, domAnimation, m } from 'framer-motion'
import { ReactNode } from 'react'

interface LazyMotionWrapperProps {
  children: ReactNode
}

// Optimized motion wrapper that only loads animations when needed
export function LazyMotionWrapper({ children }: LazyMotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

// Lightweight motion component for better performance
export const MotionDiv = m.div
export const MotionButton = m.button
export const MotionTextarea = m.textarea