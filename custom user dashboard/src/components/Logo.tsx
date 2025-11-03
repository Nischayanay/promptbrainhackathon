export function Logo() {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="flex items-center gap-4 mb-16 group transition-all duration-200 hover:scale-105 cursor-pointer"
      aria-label="PromptBrain Home"
    >
      {/* Orbital Icon */}
      <div className="relative w-12 h-12 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
        <div className="w-12 h-12 rounded-full border-[3px] border-white relative animate-in fade-in zoom-in duration-500">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -rotate-45 origin-center" />
        </div>
      </div>
      
      {/* PromptBrain Text */}
      <h1 className="text-6xl tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
        PromptBrain
      </h1>
    </button>
  );
}
