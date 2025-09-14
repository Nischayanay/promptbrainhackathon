import { CinematicDashboard } from "./cinematic/CinematicDashboard";

interface DashboardProps {
  selectedRole?: string | null;
  onNavigateToProfile?: () => void;
  onNavigateBack?: () => void;
  showBackToProfile?: boolean;
}

export function Dashboard({ onNavigateToProfile }: DashboardProps) {
  return (
    <CinematicDashboard 
      onNavigateToProfile={onNavigateToProfile}
    />
  );
}