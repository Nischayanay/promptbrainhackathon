import { motion } from 'framer-motion'
import { User, Settings, CreditCard } from 'lucide-react'
import { Button } from '../ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'

interface HeaderProProps {
  credits: number
}

export function HeaderPro({ credits }: HeaderProProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-white/80 flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">PromptBrain</h1>
            <div className="text-xs text-white/40 -mt-1">AI Prompt Enhancement</div>
          </div>
        </motion.div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Credits Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-white">{credits}</span>
            <span className="text-xs text-white/60">credits</span>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-white/10 text-white text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-[#1a1a1a] border-white/10" 
              align="end"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-white/60">john@example.com</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}