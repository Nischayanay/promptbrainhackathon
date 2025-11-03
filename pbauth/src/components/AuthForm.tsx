import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, Mail, User } from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Import local Supabase auth functions
      const { signIn, signUp } = await import("../lib/supabase");

      if (mode === "signup") {
        const result = await signUp(email, password, name);
        if (result.success) {
          console.log("Signup successful:", result.user);
          setMessage(
            "✅ Account created successfully! Welcome to PromptBrain!",
          );
          // Use callback instead of hardcoded redirect
          setTimeout(() => {
            if (onAuthSuccess) {
              onAuthSuccess();
            } else {
              window.location.href = "/dashboard";
            }
          }, 2000);
        } else {
          console.error("Signup failed:", result.error);
          setMessage(`❌ Signup failed: ${result.error}`);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          console.log("Login successful:", result.user);
          setMessage("✅ Login successful! Redirecting...");
          // Force page reload to ensure main app detects auth state
          setTimeout(() => {
            if (onAuthSuccess) {
              onAuthSuccess();
            } else {
              // Force reload to sync auth state
              window.location.href = "/dashboard";
              window.location.reload();
            }
          }, 1000);
        } else {
          console.error("Login failed:", result.error);
          setMessage(`❌ Login failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(
        `❌ Authentication error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const { signInWithGoogle } = await import("../lib/supabase");
      const result = await signInWithGoogle();

      if (result.success) {
        setMessage("✅ Redirecting to Google...");
      } else {
        setMessage(`❌ Google auth failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setMessage(
        `❌ Google auth error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full px-6 lg:px-10 bg-white">
      <motion.div
        className="w-full"
        style={{ maxWidth: "400px" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Main Container: Auth Card */}
        <motion.div
          className="bg-white"
          style={{
            borderRadius: "16px",
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
            padding: "32px",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Section 1: Branding Header */}
          <div className="text-center" style={{ marginBottom: "24px" }}>
            {/* Logo & Brand Name */}
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0",
                }}
              >
                PromptBrain
              </h1>
            </div>
            {/* Tagline */}
            <p
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "#6B7280",
                margin: "4px 0 0 0",
              }}
            >
              Smarter Prompts, Sharper Minds
            </p>
          </div>

          {/* Section 2: Form Header */}
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#111827",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            Welcome Back
          </h2>

          {/* Section 3: OAuth (SSO) Buttons */}
          <div style={{ marginBottom: "20px" }}>
            {/* Google Button */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              style={{ marginBottom: "12px" }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
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

            {/* GitHub Button */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  setIsLoading(true);
                  setMessage("");
                  try {
                    const { signInWithGitHub } = await import("../lib/supabase");
                    const result = await signInWithGitHub();
                    if (result.success) {
                      setMessage("✅ Redirecting to GitHub...");
                    } else {
                      setMessage(`❌ GitHub auth failed: ${result.error}`);
                    }
                  } catch (error) {
                    console.error("GitHub auth error:", error);
                    setMessage(`❌ GitHub auth error: ${error instanceof Error ? error.message : "Unknown error"}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                <svg className="w-5 h-5 mr-3" fill="#333" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </motion.div>
          </div>

          {/* Section 4: Separator */}
          <div className="text-center" style={{ margin: "20px 0" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "400",
                color: "#9CA3AF",
              }}
            >
              or continue with email
            </span>
          </div>

          {/* Section 5: Email & Password Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ marginBottom: "16px" }}
                >
                  <Label
                    htmlFor="name"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "6px",
                      display: "block",
                    }}
                  >
                    Name
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ left: "12px", color: "#9CA3AF" }}
                    />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      style={{
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        padding: "10px 12px 10px 36px",
                      }}
                      placeholder="Your name"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div style={{ marginBottom: "16px" }}>
              <Label
                htmlFor="email"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ left: "12px", color: "#9CA3AF" }}
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    padding: "10px 12px 10px 36px",
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "24px" }}>
              <Label
                htmlFor="password"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ left: "12px", color: "#9CA3AF" }}
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    padding: "10px 12px 10px 36px",
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Section 6: Primary CTA */}
            <motion.div
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                style={{
                  backgroundColor: isLoading ? "#9CA3AF" : "#EA580C",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading
                  ? "Processing..."
                  : (mode === "signup" ? "Create Account" : "Sign In")}
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

            {/* Benefit text for signup */}
            <AnimatePresence mode="wait">
              {mode === "signup" && !message && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-center text-xs font-normal text-slate-500 pt-2"
                >
                  Join 10,000+ architects building smarter prompts.
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          {/* Section 7: Secondary & Tertiary Links */}
          <div className="text-center" style={{ marginTop: "24px" }}>
            {/* Sign Up Link */}
            {mode === "login" && (
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#6B7280" }}>
                  New here?
                </span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2563EB",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign up instead
                </button>
              </div>
            )}

            {/* Forgot Password Link */}
            <button
              type="button"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#EA580C",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Forgot password?
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
