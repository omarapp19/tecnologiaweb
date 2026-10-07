import React from "react";

interface MobileFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileFrame({ children, className = "" }: MobileFrameProps) {
  return (
    <div className={`relative mx-auto w-[240px] h-[480px] rounded-[38px] border-[7px] border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden ${className}`}>
      {/* Dynamic Island / Camera Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-full bg-zinc-900 z-30 flex items-center justify-end px-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
      </div>
      
      {/* Speaker grill */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-zinc-800/40 z-30" />

      {/* Screen contents */}
      <div className="w-full h-full relative overflow-hidden bg-zinc-950 rounded-[30px]">
        {children}
      </div>

      {/* Home Indicator line */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-0.5 rounded-full bg-zinc-750/70 z-30" />
    </div>
  );
}
