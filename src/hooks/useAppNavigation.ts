import { useState } from "react";
import { getCurrentSession, completeOnboarding } from "../utils/auth";
import { toast } from "sonner@2.0.3";

type AppPage = 'landing' | 'login' | 'signup' | 'temple' | 'profile' | 'enhance';

export function useAppNavigation() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [previousPage, setPreviousPage] = useState<AppPage | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const navigateToSignup = () => {
    setPreviousPage(currentPage);
    setCurrentPage('signup');
  };
  const navigateToLogin = () => {
    setPreviousPage(currentPage);
    setCurrentPage('login');
  };
  const navigateToLanding = () => {
    setPreviousPage(currentPage);
    setCurrentPage('landing');
  };
  const navigateToPage = (page: AppPage) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };
  
  const navigateToEnhance = async () => {
    console.log('PromptBrain: Navigating to enhance tool...');
    
    // Complete onboarding and grant credits for new users
    try {
      const session = await getCurrentSession();
      console.log('PromptBrain: Enhance navigation session check:', session);
      
      if (session.success && session.access_token) {
        setAccessToken(session.access_token);
        console.log('PromptBrain: Attempting to complete onboarding...');
        
        const result = await completeOnboarding(session.access_token);
        if (result.success) {
          toast.success('Welcome to PromptBrain! 50 free credits granted.');
          console.log('PromptBrain: Onboarding completed successfully');
        } else {
          console.log('PromptBrain: Onboarding already completed or error occurred');
        }
      } else {
        console.log('PromptBrain: No session available for onboarding');
      }
    } catch (error) {
      console.error('PromptBrain: Error completing onboarding:', error);
    }
    
    console.log('PromptBrain: Setting current page to enhance (Dashboard 2.0)');
    setPreviousPage(currentPage);
    setCurrentPage('enhance');
  };

  const navigateToTemple = async () => {
    console.log('PromptBrain: Navigating to temple...');
    setPreviousPage(currentPage);
    setCurrentPage('temple');
  };

  const navigateToProfile = () => {
    setPreviousPage(currentPage);
    setCurrentPage('profile');
  };

  const navigateBack = () => {
    if (previousPage) {
      const tempPrevious = currentPage;
      setCurrentPage(previousPage);
      setPreviousPage(tempPrevious);
    } else {
      // Default fallback
      setCurrentPage('temple');
    }
  };

  return {
    currentPage,
    previousPage,
    navigateToSignup,
    navigateToLogin,
    navigateToLanding,
    navigateToPage,
    navigateToTemple,
    navigateToEnhance,
    navigateToProfile,
    navigateBack,
  };
}