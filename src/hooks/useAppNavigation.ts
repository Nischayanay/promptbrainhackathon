import { useNavigate } from "react-router-dom";
import { routeConfig } from "../routes/index";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToLanding: () => navigate(routeConfig.landing),
    goToLogin: () => navigate(routeConfig.login),
    goToSignup: () => navigate(routeConfig.signup),
    goToDashboard: () => navigate(routeConfig.dashboard),
    goToProfile: () => navigate(routeConfig.profile),
    goBack: () => navigate(-1),
    navigate, // For custom navigation
  };
};