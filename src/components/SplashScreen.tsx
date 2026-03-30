import { Zap } from "lucide-react";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[hsl(222,28%,7%)] overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(22,100%,52%/0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(22,100%,52%/0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />

      <div className="flex flex-col items-center gap-6 animate-fade-in relative z-10">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl border border-primary/20 scale-125 animate-pulse" />
          <div className="absolute inset-0 rounded-3xl border border-primary/10 scale-150 animate-pulse" style={{ animationDelay: "200ms" }} />
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_0_40px_hsl(22,100%,52%/0.5)]">
            <Zap className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1
            className="text-2xl font-black text-white tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SINDSPAG
          </h1>
          <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Sistema de Gestão</p>
        </div>

        {/* Loading bar */}
        <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-primary to-orange-400 rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]" 
            style={{ animation: "loading-bar 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%) scaleX(0.5); }
          50% { transform: translateX(50%) scaleX(1); }
          100% { transform: translateX(300%) scaleX(0.5); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
