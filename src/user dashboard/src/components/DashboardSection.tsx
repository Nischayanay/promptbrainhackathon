import { Logo } from './Logo';
import { ChatInterface } from './ChatInterface';

export function DashboardSection() {
  return (
    <section className="flex-1 flex flex-col items-center justify-start px-8 py-12 overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col h-full">
        {/* Logo Header */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <ChatInterface />
        </div>

        {/* Quick Actions / Suggestions */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all duration-200 hover:scale-105">
            💡 Creative Ideas
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all duration-200 hover:scale-105">
            📊 Data Analysis
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all duration-200 hover:scale-105">
            ✍️ Writing Help
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all duration-200 hover:scale-105">
            🎨 Design Ideas
          </button>
        </div>
      </div>
    </section>
  );
}
