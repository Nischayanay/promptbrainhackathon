import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface PBAuthFormProps {
  onAuthSuccess?: () => void;
}

export function PBAuthForm({ onAuthSuccess }: PBAuthFormProps) {
  const [] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { signIn, signInWithGoogle, signInWithGitHub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      let result;

      result = await signIn(email, password);
      if (result.success) {
        console.log("Login successful:", result.user);
        setMessage("✅ Welcome back!");
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1000);
      } else {
        console.error("Login failed:", result.error);
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(
        `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        setMessage("✅ Redirecting to Google...");
      } else {
        setMessage(`❌ ${result.error}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setMessage(
        `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signInWithGitHub();
      if (result.success) {
        setMessage("✅ Redirecting to GitHub...");
      } else {
        setMessage(`❌ ${result.error}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("GitHub auth error:", error);
      setMessage(
        `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-full px-8 bg-white"
      style={{
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Main Card */}
        <motion.div
          className="bg-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Welcome Title */}
          <h2 className="text-center mb-8 text-xl font-semibold text-gray-900">
            Welcome Back
          </h2>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200 text-sm font-normal rounded justify-center"
                style={{ backgroundColor: "#FEFEFE" }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubAuth}
                disabled={isLoading}
                className="w-full h-12 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200 text-sm font-normal rounded justify-center"
                style={{ backgroundColor: "#FEFEFE" }}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </motion.div>
          </div>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-normal text-gray-700 mb-1 block"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border border-gray-300 rounded text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-gray-700"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-normal text-gray-700 mb-1 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border border-gray-300 rounded text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-white text-sm font-medium rounded transition-all duration-200 border-0"
                style={{
                  backgroundColor: isLoading ? "#9CA3AF" : "#FF5722",
                  boxShadow: "none",
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>

            {/* Status Message */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 rounded-lg text-sm text-center"
                  style={{
                    backgroundColor: message.includes("✅")
                      ? "#F0FDF4"
                      : "#FEF2F2",
                    color: message.includes("✅") ? "#166534" : "#DC2626",
                    border: `1px solid ${
                      message.includes("✅") ? "#BBF7D0" : "#FECACA"
                    }`,
                  }}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-blue-600 hover:underline cursor-pointer font-normal">
              New here? Sign up instead
            </p>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer font-normal">
              Forget password?
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
