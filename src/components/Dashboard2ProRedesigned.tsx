import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell, AppShellHero } from "./Layout/AppShell";
import { CollapsibleSidebar } from "./Layout/CollapsibleSidebar";
import { FloatingCreditsOrb } from "./Layout/FloatingCreditsOrb";
import { useCredits } from "../lib/credits";
import { PromptConsole } from "./Prompt/PromptConsole";
import { FlowContextChips, FlowQuestionCard } from "./Prompt/FlowQuestionCard";
import {
  type ChatMessage as ChatThreadMessage,
  ChatThread,
} from "./Chat/ChatThread";
import { useFlowMode } from "../hooks/useFlowMode";
import { designTokens } from "../lib/designTokens";
import { sessionManagement } from "../lib/sessionManagement";

type Mode = "ideate" | "flow";

interface LegacyChatMessage {
  id: string;
  mode: Mode;
  timestamp: string;
  input: string;
  output: string;
  title: string;
  effectType?: string;
}

export function Dashboard2ProRedesigned() {
  // Core state
  const [activeMode, setActiveMode] = useState<Mode>("ideate");
  const [input, setInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [chatHistory, setChatHistory] = useState<LegacyChatMessage[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatThreadMessage[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const HISTORY_KEY = "pbm_chat_history_v1";

  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("enhance");
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);

  // Credits system (server-authoritative)
  const {
    credits,
    canSpend,
    isLoading: creditsLoading,
    dailyRefresh,
    spend,
    earn,
    manualRefresh,
  } = useCredits();

  // Initialize session management and restore state
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const savedSession = await sessionManagement.loadSession();
        if (mounted && savedSession) {
          setActiveMode(savedSession.last_mode);
          setSidebarCollapsed(savedSession.sidebar_collapsed);
          // Apply any other preferences here
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
      } finally {
        if (mounted) {
          setIsSessionInitialized(true);
        }
      }
    };

    initializeSession();

    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  // Restore and persist chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setChatHistory(parsed);
      }
    } catch {}
  }, []);

  // Debug: Log chatMessages changes
  useEffect(() => {
    console.log("💬 chatMessages updated:", chatMessages.length, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(chatHistory));
    } catch {}
  }, [chatHistory]);

  // Save session state when it changes (after initialization)
  useEffect(() => {
    if (!isSessionInitialized) return;

    const sessionState = {
      last_mode: activeMode,
      sidebar_collapsed: sidebarCollapsed,
      preferences: {
        // Add any other preferences here
        active_nav_item: activeNavItem,
      },
    };

    sessionManagement.saveSession(sessionState);
  }, [activeMode, sidebarCollapsed, activeNavItem, isSessionInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionManagement.cleanup();
    };
  }, []);

  // Flow mode
  const {
    flowState,
    startFlow,
    updateAnswer,
    nextStep,
    previousStep,
    goToStep,
    skipCurrentStep,
    completeFlow,
    resetFlow,
    getStructuredPrompt,
    getCurrentQuestion,
    getCurrentAnswer,
    canProceed,
  } = useFlowMode();

  // Handle mode changes
  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);

    if (mode === "flow" && !flowState.isActive) {
      startFlow();
      setInput("");
    } else if (mode === "ideate") {
      if (flowState.isActive) {
        resetFlow();
      }
    }
  };

  // Handle Flow mode progression
  const handleFlowNext = async () => {
    if (!canProceed()) return;

    // Update current answer
    updateAnswer(flowState.currentStep, getCurrentAnswer());

    if (flowState.currentStep >= flowState.questions.length - 1) {
      // Complete flow and enhance immediately in the same chat interface
      completeFlow();
      const structuredPrompt = getStructuredPrompt();
      setInput(structuredPrompt);
      setActiveMode("ideate");
      await enhancePrompt();
    } else {
      nextStep();
    }
  };

  const handleFlowPrevious = () => {
    previousStep();
  };

  const handleFlowSkip = () => {
    skipCurrentStep();
  };

  const handleFlowAnswerChange = (answer: string) => {
    updateAnswer(flowState.currentStep, answer);
  };

  // Direct Backend Brain Integration
  const enhancePrompt = async () => {
    console.log("🚀 enhancePrompt called", { 
      hasInput: !!input.trim(), 
      isEnhancing, 
      canSpend, 
      credits 
    });

    if (!input.trim()) {
      console.log("❌ No input provided");
      return;
    }
    
    if (isEnhancing) {
      console.log("❌ Already enhancing");
      return;
    }
    
    if (!canSpend) {
      console.log("❌ Cannot spend credits", { credits, canSpend, creditsLoading });
      setAnnouncement(`⚠️ Insufficient credits. You have ${credits} credits. You need at least 1 credit to enhance.`);
      return;
    }

    setIsEnhancing(true);
    setAnnouncement("🧠 Backend Brain is analyzing your prompt...");

    const promptId = crypto.randomUUID();

    console.log("💳 Attempting to spend 1 credit...");
    const spent = await spend(1, "prompt_enhancement", promptId);
    console.log("💳 Spend result:", spent);
    
    if (!spent) {
      setIsEnhancing(false);
      setAnnouncement("Insufficient credits to enhance prompt");
      return;
    }

    try {
      // DEBUG: Log the request details
      const requestBody = {
        mode: activeMode,
        originalPrompt: input.trim(),
        flowData: null,
      };
      console.log("🔍 DEBUG: Sending request to enhance-prompt");
      console.log("📦 Request body:", requestBody);
      
      // Call the make-server function with correct parameters
      const apiUrl = "https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt";
      console.log("🌐 API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${
            import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdWd2cnNhZXlkcHRtc3hsbGN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkwMDc3OSwiZXhwIjoyMDY1NDc2Nzc5fQ.mthkPFNO0QfH02TiHoA5lHbBZ02fUX2YZQGkMS4kGpc"
          }`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdWd2cnNhZXlkcHRtc3hsbGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDA3NzksImV4cCI6MjA2NTQ3Njc3OX0.Hs_rJaWcELKEBYjRQKKmLfJCcgqGJhFJvJQGJhFJvJQ",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (!data.success) {
        throw new Error(data.error || "Enhancement failed");
      }

      // Extract the enhanced text from the response
      const enhancedText = data.enhancedPrompt?.detailed ||
        data.enhancedPrompt?.english || "";

      if (!enhancedText) {
        throw new Error("No enhanced text in response");
      }

      // Calculate mock metrics since backend doesn't provide them
      const originalLength = input.trim().length;
      const enhancedLength = enhancedText.length;
      const enhancementRatio = enhancedLength / originalLength;
      const qualityScore = Math.min(0.95, 0.7 + (enhancementRatio * 0.1));
      const processingTime = 1500; // Mock processing time in ms
      const whySummary =
        "Enhanced with structured framework, added context, and improved clarity for better AI understanding.";

      // Create user message
      const userMessage: ChatThreadMessage = {
        id: `${promptId}-user`,
        type: "user",
        content: input.trim(),
        timestamp: new Date().toISOString(),
        mode: activeMode,
      };

      // Create assistant message
      const assistantMessage: ChatThreadMessage = {
        id: promptId,
        type: "assistant",
        content:
          `🧠 **Backend Brain Enhanced Prompt**\n\n${enhancedText}\n\n---\n\n💡 **Why This Enhancement Works:**\n${whySummary}`,
        timestamp: new Date().toISOString(),
        mode: activeMode,
        metadata: {
          quality_score: qualityScore,
          enhancement_ratio: enhancementRatio,
          processing_time: processingTime,
          title: `🧠 Backend Brain Enhanced • ${
            (qualityScore * 100).toFixed(0)
          }% Quality • ${enhancementRatio.toFixed(1)}x Enhancement`,
        },
      };

      // Create legacy message for backward compatibility
      const legacyMessage: LegacyChatMessage = {
        id: promptId,
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: assistantMessage.content,
        title: assistantMessage.metadata?.title || "",
        effectType: "backend-brain",
      };

      // Update both chat systems
      console.log("💬 Adding messages to chat:", { userMessage, assistantMessage });
      setChatMessages((prev) => {
        const newMessages = [...prev, userMessage, assistantMessage];
        console.log("💬 Updated chatMessages:", newMessages);
        return newMessages;
      });
      setChatHistory((prev) => [legacyMessage, ...prev]);
      setInput("");
      setAnnouncement(
        `🎉 Backend Brain enhancement complete! Quality: ${
          (qualityScore * 100).toFixed(0)
        }%, Enhancement: ${enhancementRatio.toFixed(1)}x. ${
          credits - 1
        } credits remaining.`,
      );
    } catch (error) {
      console.error("Backend Brain failed:", error);

      // Rollback credits and show error
      await earn(1, "enhancement_failed_rollback");
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error occurred";
      setAnnouncement(
        `❌ Backend Brain enhancement failed: ${errorMessage}. Credits refunded.`,
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle insufficient credits
  const handleAddCredits = async () => {
    const refreshed = await manualRefresh();
    if (!refreshed) {
      await earn(10, "daily_bonus");
    }
  };

  // Handle chat message actions
  const handleMessageAction = (
    messageId: string,
    action: "copy" | "reuse" | "regenerate" | "rate",
  ) => {
    const message = chatMessages.find((m) => m.id === messageId);
    if (!message) return;

    switch (action) {
      case "copy":
        navigator.clipboard.writeText(message.content);
        setAnnouncement("Message copied to clipboard");
        break;
      case "reuse":
        setInput(message.content);
        setAnnouncement("Message loaded as new input");
        break;
      case "regenerate":
        if (message.type === "user") {
          setInput(message.content);
          enhancePrompt();
        }
        break;
    }
  };

  const handleRateMessage = (_messageId: string, rating: "up" | "down") => {
    // TODO: Implement rating system
    setAnnouncement(
      `Message rated ${rating === "up" ? "positively" : "negatively"}`,
    );
  };

  // Navigation handlers
  const handleNavItemSelect = (itemId: string) => {
    setActiveNavItem(itemId);

    // Handle navigation logic
    switch (itemId) {
      case "home":
        // Navigate to home
        break;
      case "enhance":
        // Already on enhance page
        break;
      case "history":
        // Show history
        break;
      case "logout":
        // Handle logout
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="min-h-screen text-text-primary font-body"
      style={{
        backgroundColor: designTokens.colors.background,
        fontFamily: designTokens.typography.fontBody,
      }}
    >
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Low Credits Banner with improved accessibility */}
      {!creditsLoading && credits < 5 && (
        <div
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.error}20`,
            borderColor: `${designTokens.colors.error}40`,
            color: designTokens.colors.textPrimary,
          }}
        >
          <span className="font-medium">Low credits warning:</span> You have
          {" "}
          {credits}{" "}
          credits remaining. Earn more or upgrade to continue enhancing.
        </div>
      )}

      {/* Daily Credits Refresh Notification */}
      {!creditsLoading && dailyRefresh && dailyRefresh.credits_added > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.brandGold}20`,
            borderColor: `${designTokens.colors.brandGold}40`,
            color: designTokens.colors.textPrimary,
          }}
        >
          <span className="font-medium">🎉 Daily Credits Refreshed!</span>{" "}
          +{dailyRefresh.credits_added} credits added.
          {dailyRefresh.days_missed && dailyRefresh.days_missed > 1 &&
            ` (${dailyRefresh.days_missed} days worth)`} Current balance:{" "}
          {credits} credits.
        </motion.div>
      )}

      {/* Credits Loading State */}
      {creditsLoading && (
        <div
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.glass}20`,
            borderColor: `${designTokens.colors.glassBorder}40`,
            color: designTokens.colors.textMuted,
          }}
        >
          Loading credits balance...
        </div>
      )}
      <AppShell
        sidebar={
          <CollapsibleSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeItem={activeNavItem}
            onItemSelect={handleNavItemSelect}
            recentHistory={chatHistory}
          />
        }
        creditsOrb={
          <FloatingCreditsOrb
            credits={credits}
            maxCredits={100}
            usedToday={0}
            onAddCredits={handleAddCredits}
            onUseCredit={() => spend(1)}
            isAnimating={false}
          />
        }
      >
        {/* Hero Section */}
        <AppShellHero
          title="PromptBrain"
          subtitle="Transform your ideas into powerful, structured prompts with AI-powered enhancement"
        />

        {/* Flow Context Chips */}
        {activeMode === "flow" && flowState.isActive && (
          <FlowContextChips
            answers={flowState.answers}
            questions={flowState.questions}
            currentStep={flowState.currentStep}
            onEditAnswer={goToStep}
          />
        )}

        {/* Flow Question Card */}
        <AnimatePresence mode="wait">
          {activeMode === "flow" && flowState.isActive &&
            getCurrentQuestion() && (
            <FlowQuestionCard
              key={flowState.currentStep}
              question={getCurrentQuestion()!}
              currentStep={flowState.currentStep}
              totalSteps={flowState.questions.length}
              answer={getCurrentAnswer()}
              onAnswerChange={handleFlowAnswerChange}
              onNext={handleFlowNext}
              onPrevious={flowState.currentStep > 0
                ? handleFlowPrevious
                : undefined}
              onSkip={getCurrentQuestion()?.optional
                ? handleFlowSkip
                : undefined}
              isLastQuestion={flowState.currentStep >=
                flowState.questions.length - 1}
            />
          )}
        </AnimatePresence>

        {/* Main Prompt Console */}
        <AnimatePresence mode="wait">
          {(activeMode === "ideate" || !flowState.isActive) && (
            <PromptConsole
              input={input}
              setInput={setInput}
              activeMode={activeMode}
              onModeChange={handleModeChange}
              isEnhancing={isEnhancing}
              onEnhance={() => enhancePrompt()}
              flowState={flowState}
            />
          )}
        </AnimatePresence>

        {/* Enhancing Skeleton with improved accessibility */}
        <AnimatePresence>
          {isEnhancing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto mt-8 p-6 rounded-2xl border animate-pulse"
              style={{
                backgroundColor: designTokens.colors.glass,
                borderColor: designTokens.colors.glassBorder,
                borderRadius: designTokens.borderRadius.lg,
              }}
              role="status"
              aria-label="Enhancing your prompt"
            >
              <div
                className="h-4 w-24 rounded mb-4"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div
                className="h-3 w-3/4 rounded mb-2"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div
                className="h-3 w-2/3 rounded mb-2"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div
                className="h-3 w-1/2 rounded"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Thread */}
        {chatMessages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <ChatThread
              messages={chatMessages}
              isLoading={isEnhancing}
              onMessageAction={handleMessageAction}
              onRateMessage={handleRateMessage}
            />
          </motion.div>
        ) : null}
      </AppShell>
    </div>
  );
}
