import React from 'react';
import { Dashboard2ProRedesigned } from '../Dashboard2ProRedesigned';

interface DashboardPageProps {
  onNavigateToProfile?: () => void;
  onNavigateToLanding?: () => void;
  onLogout?: () => void;
}

export function DashboardPage({ 
  onNavigateToProfile, 
  onNavigateToLanding, 
  onLogout 
}: DashboardPageProps) {
  return (
    <div className="cinematic-theme">
      <Dashboard2ProRedesigned />
    </div>
  );
}