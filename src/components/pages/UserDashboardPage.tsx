import React, { ErrorInfo, ReactNode, useEffect } from "react";

// Import the current dashboard component
import { Dashboard2ProRedesigned } from "../Dashboard2ProRedesigned";

// Import dashboard styles
import "../../styles/user-dashboard-integration.css";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class DashboardErrorBoundary extends React.Component<
  {
    children: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  },
  ErrorBoundaryState
> {
  constructor(
    props: {
      children: ReactNode;
      onError?: (error: Error, errorInfo: ErrorInfo) => void;
    },
  ) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Dashboard Error Boundary caught an error:",
      error,
      errorInfo,
    );
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4 text-[#00D9FF]">
              Dashboard Error
            </h1>
            <p className="text-gray-300 mb-6">
              Something went wrong loading the dashboard. Please try refreshing
              the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#00D9FF] text-black rounded-lg font-medium hover:bg-[#00B8E6] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function UserDashboardPage() {

  useEffect(() => {
    // Set up dashboard-specific document properties
    document.documentElement.style.scrollBehavior = "smooth";

    // Add dashboard container class to body for scoped styling
    document.body.classList.add("dashboard-active");

    return () => {
      // Cleanup on unmount
      document.documentElement.style.scrollBehavior = "auto";
      document.body.classList.remove("dashboard-active");
    };
  }, []);

  const handleDashboardError = (error: Error, errorInfo: ErrorInfo) => {
    // Log error for debugging
    console.error("Dashboard integration error:", error, errorInfo);

    // Could send to error reporting service here
    // analytics.track('dashboard_error', { error: error.message });
  };

  return (
    <DashboardErrorBoundary onError={handleDashboardError}>
      <div className="user-dashboard-container">
        {
          /*
          The UserDashboardApp component is wrapped in our integration container
          This provides scoped styling and proper error boundaries
        */
        }
        <Dashboard2ProRedesigned />

        {
          /*
          Navigation integration could be added here if needed
          For now, the dashboard is self-contained
        */
        }
      </div>
    </DashboardErrorBoundary>
  );
}

export default UserDashboardPage;
