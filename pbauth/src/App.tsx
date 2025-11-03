import { CreativeZone } from "./components/CreativeZone";
import { AuthForm } from "./components/AuthForm";

interface PBAuthAppProps {
  onAuthSuccess?: () => void;
}

export default function App({ onAuthSuccess }: PBAuthAppProps) {
  console.log('🔧 PBAuthApp props:', { onAuthSuccess: !!onAuthSuccess });
  
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Creative Zone */}
      <div className="w-full lg:w-1/2 h-64 lg:h-full overflow-hidden">
        <CreativeZone />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 h-full overflow-hidden">
        <AuthForm onAuthSuccess={onAuthSuccess} />
      </div>
    </div>
  );
}
