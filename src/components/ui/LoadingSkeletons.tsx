import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'

// Chat message skeleton
export function ChatMessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 justify-start"
    >
      {/* Avatar skeleton */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      
      {/* Message content skeleton */}
      <div className="max-w-[80%] min-w-[200px] space-y-2">
        {/* Header skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        
        {/* Message bubble skeleton */}
        <div className="bg-glass border border-glass-border rounded-2xl px-4 py-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded ml-2" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </motion.div>
  )
}

// Sidebar item skeleton
export function SidebarItemSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center rounded-lg p-3 ${collapsed ? 'justify-center' : 'space-x-3'}`}>
      <Skeleton className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <Skeleton className="h-4 flex-1" />}
    </div>
  )
}

// Prompt console skeleton
export function PromptConsoleSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Description skeleton */}
        <div className="px-4 py-2 border-b border-glass-border/30">
          <Skeleton className="h-4 w-64" />
        </div>
        
        {/* Input area skeleton */}
        <div className="px-6 py-6">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        
        {/* Bottom bar skeleton */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-glass-border/50">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Credits orb skeleton
export function CreditsOrbSkeleton() {
  return (
    <div className="fixed top-6 right-6 z-50">
      <Skeleton className="w-12 h-12 rounded-full" />
    </div>
  )
}

// Enhancement card skeleton (for legacy history)
export function EnhancementCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 max-w-4xl mx-auto glass-panel border border-glass-border space-y-4"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      {/* Input section skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
      
      {/* Output section skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="rounded-lg border border-glass-border overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-glass-border">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        </div>
      </div>
      
      {/* Actions skeleton */}
      <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </motion.div>
  )
}

// Page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="text-center mb-8 lg:mb-12 space-y-4">
        <Skeleton className="h-16 w-64 mx-auto rounded-2xl" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      {/* Console skeleton */}
      <PromptConsoleSkeleton />
      
      {/* Chat skeleton */}
      <div className="mt-12 max-w-4xl mx-auto space-y-6">
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
      </div>
    </div>
  )
}

// Shimmer effect for enhanced loading
export function ShimmerSkeleton({ 
  className = '', 
  children 
}: { 
  className?: string
  children?: React.ReactNode 
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

// Add shimmer animation to global CSS
export const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`