import React from "react";

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
}

export function BrowserFrame({ children, url = "localhost:3000", className = "" }: BrowserFrameProps) {
  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/60 shadow-2xl ${className}`}>
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80 select-none">
        {/* Window dots */}
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/90" />
        </div>
        {/* URL Bar */}
        <div className="flex-1 max-w-[200px] mx-auto bg-zinc-950/80 border border-zinc-800/60 rounded-md py-0.5 px-3 text-[10px] text-zinc-500 text-center font-mono truncate tracking-wide">
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="relative flex-1 overflow-hidden bg-zinc-950/10">
        {children}
      </div>
    </div>
  );
}
