import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, User } from "lucide-react";

type AuthMode = "login" | "signup";

interface PBAuthFormWrapperProps {
  onAuthSuccess?: () => void;
}

export function PBAuthFormWrapper({ onAuthSuccess }: PBAuthFormWrapperProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Auth attempt:", { name, email, password, mode });
    // Simulate successful auth for demo
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  return (
    <div className="flex items-center justify-center h-full px-6 lg:px-10 bg-white pbauth-container">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Logo & Tagline Stack */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            PromptBrain
          </h1>
          <p className="text-base font-normal text-slate-500 mb-0.5">Architecting Context</p>
          <p className="text-base font-normal text-slate-500 mb-0.5">Welcome back</p>
          <p className="text-base font-normal text-slate-500">Ideas → Implementations</p>
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-7 py-6 auth-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Dynamic Title */}
          <h2 className="text-center mb-4 text-xl font-semibold text-slate-800">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h2>

          {/* Tactile Pill-Shaped Sliding Toggle */}
          <div className="relative mb-5 p-1.5 bg-gray-100 rounded-full auth-toggle">
            <motion.div
              className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] rounded-full shadow-md"
              style={{ backgroundColor: "#1E40AF" }}
              animate={{
                x: mode === "signup" ? "calc(100% + 6px)" : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
            <div className="relative flex gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-full transition-all duration-300 z-10 text-sm font-medium text-center ${
                  mode === "login" ? "text-white auth-toggle-active" : "text-slate-600"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-full transition-all duration-300 z-10 text-sm font-medium text-center ${
                  mode === "signup" ? "text-white auth-toggle-active" : "text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2.5 mb-5">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border-2 transition-all duration-300 relative overflow-hidden group text-sm font-medium text-slate-700"
                style={{ borderColor: "#E5E7EB" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#60A5FA] to-[#1E40AF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border-2 transition-all duration-300 relative overflow-hidden group text-sm font-medium text-slate-700"
                style={{ borderColor: "#E5E7EB" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#60A5FA] to-[#1E40AF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </motion.div>
          </div>

          {/* Simplified Separator */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Label htmlFor="name" className="text-xs font-medium text-slate-600 mb-1 block">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-10 bg-[#E5E7EB] border border-gray-300 text-sm font-normal text-slate-900 transition-all duration-150"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email" className="text-xs font-medium text-slate-600 mb-1 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 bg-[#E5E7EB] border border-gray-300 text-sm font-normal text-slate-900 transition-all duration-150"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-medium text-slate-600 mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 bg-[#E5E7EB] border border-gray-300 text-sm font-normal text-slate-900 transition-all duration-150"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="pt-1"
            >
              <Button
                type="submit"
                className="w-full h-10 text-white text-sm font-semibold relative overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300"
                style={{ backgroundColor: "#1E40AF" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#60A5FA] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">
                  {mode === "signup" ? "Create Account" : "Sign In"}
                </span>
              </Button>
            </motion.div>

            {/* Benefit-Driven Microcopy for Sign Up */}
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-center text-xs font-normal text-slate-500 pt-0.5"
                >
                  Join 10,000+ architects building smarter prompts.
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          {/* Footer Links */}
          {mode === "login" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-xs font-medium hover:underline transition-colors text-orange-600"
              >
                Forgot password?
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}