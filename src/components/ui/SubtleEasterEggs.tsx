"use client";

import React from "react";

// 1. Laura Heart
export function LauraHeart() {
  return (
    <span className="inline-flex items-center justify-center group relative cursor-pointer mx-1 vertical-middle">
      <svg
        viewBox="0 0 32 32"
        className="w-4 h-4 text-rose-500 fill-current transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-pulse"
        style={{ animationDuration: "2s" }}
      >
        <path d="M16 28 C16 28, 3 20, 3 11 C3 6.5, 6.5 3, 11 3 C13.5 3, 15 4.5, 16 5.5 C17 4.5, 18.5 3, 21 3 C25.5 3, 29 6.5, 29 11 C29 20, 16 28, 16 28 Z" />
      </svg>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Laura's Love
      </span>
    </span>
  );
}

// 2. Catatumbo Bridge (Maracaibo)
export function CatatumboBridge() {
  return (
    <span className="inline-flex items-center justify-center group relative cursor-pointer mx-1 vertical-middle">
      <svg
        viewBox="0 0 32 32"
        className="w-5 h-5 text-zinc-400 transition-all duration-300 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_4px_rgba(96,165,250,0.6)]"
      >
        {/* Water */}
        <line x1="2" y1="26" x2="30" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
        {/* Bridge pillars */}
        <path d="M10 26 L12 16 L14 16 L16 26 Z" fill="currentColor" className="opacity-80" />
        <path d="M16 26 L18 16 L20 16 L22 26 Z" fill="currentColor" className="opacity-80" />
        {/* Roadway */}
        <line x1="2" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.5" />
        {/* Cable stays */}
        <line x1="13" y1="16" x2="6" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
        <line x1="13" y1="16" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
        <line x1="19" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
        <line x1="19" y1="16" x2="26" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />

        {/* Lightning bolt (Catatumbo) */}
        <path
          d="M20 2 L13 11 L17 11 L12 21 L22 9 L17 9 Z"
          fill="#3b82f6"
          className="opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"
          style={{ transformOrigin: "16px 10px" }}
        />
      </svg>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Maracaibo & Catatumbo
      </span>
    </span>
  );
}

// 3. Music Guitar
export function MusicGuitar() {
  return (
    <span className="inline-flex items-center justify-center group relative cursor-pointer mx-1 vertical-middle">
      <svg
        viewBox="0 0 32 32"
        className="w-5 h-5 text-zinc-400 transition-all duration-300 group-hover:text-emerald-400 group-hover:rotate-12"
      >
        {/* Guitar neck */}
        <line x1="6" y1="26" x2="24" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Headstock */}
        <path d="M23 7 L26 4 L28 6 L25 9 Z" fill="currentColor" />
        {/* Tuning pegs */}
        <circle cx="27" cy="5" r="1" fill="#94a3b8" />
        <circle cx="25" cy="4" r="1" fill="#94a3b8" />
        {/* Guitar body */}
        <path
          d="M4 22 C3 25, 6 29, 10 28 C13 27, 12 21, 14 18 C13 16, 9 17, 7 19 C5 21, 5 20, 4 22 Z"
          fill="currentColor"
          className="group-hover:fill-emerald-500 transition-colors"
        />
        {/* Sound hole */}
        <circle cx="9" cy="23" r="1.5" fill="#0f172a" />
      </svg>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Músico & Adorador
      </span>
    </span>
  );
}

// 4. Crossed Lightsabers (Star Wars)
export function CrossedLightsabers() {
  return (
    <div className="inline-flex items-center justify-center group relative cursor-pointer select-none">
      <svg viewBox="0 0 32 32" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110">
        {/* Blue Saber (glowing blue on hover) */}
        <g className="transition-all duration-300">
          <line
            x1="8"
            y1="24"
            x2="24"
            y2="8"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-20 group-hover:opacity-100 transition-opacity duration-300"
            style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }}
          />
          <line
            x1="8"
            y1="24"
            x2="24"
            y2="8"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="opacity-80 group-hover:opacity-100"
          />
          {/* Hilt */}
          <rect x="6.5" y="22.5" width="3" height="3" transform="rotate(45 8 24)" fill="#64748b" stroke="#334155" strokeWidth="0.5" />
        </g>

        {/* Green Saber (glowing green on hover) */}
        <g className="transition-all duration-300">
          <line
            x1="24"
            y1="24"
            x2="8"
            y2="8"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-20 group-hover:opacity-100 transition-opacity duration-300"
            style={{ filter: "drop-shadow(0 0 4px #10b981)" }}
          />
          <line
            x1="24"
            y1="24"
            x2="8"
            y2="8"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="opacity-80 group-hover:opacity-100"
          />
          {/* Hilt */}
          <rect x="22.5" y="22.5" width="3" height="3" transform="rotate(45 24 24)" fill="#64748b" stroke="#334155" strokeWidth="0.5" />
        </g>
      </svg>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Star Wars Fan
      </span>
    </div>
  );
}

// 5. Minecraft Grass Block
export function MinecraftBlock() {
  return (
    <div className="inline-flex items-center justify-center group relative cursor-pointer select-none">
      {/* Container with hover squish/bounce effect */}
      <div className="w-7 h-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Top Face (Green Grass) */}
          <path d="M16 2 L29 8.5 L16 15 L3 8.5 Z" fill="#22c55e" />
          <path d="M3 8.5 L16 15 L29 8.5 L29 11 L24 13 L21 11 L16 16 L11 12.5 L8 14.5 L3 11 Z" fill="#16a34a" />
          
          {/* Left Side (Dirt) */}
          <path d="M3 11 L16 17.5 L16 30 L3 23.5 Z" fill="#78350f" />
          <path d="M3 11 L8 14.5 L11 12.5 L16 17.5 L16 22 L11 19.5 L8 21.5 L3 18 Z" fill="#a16207" opacity="0.3" />
          {/* Left dirt pixels */}
          <rect x="6" y="16" width="2" height="2" fill="#451a03" transform="skewY(22.5)" />
          <rect x="10" y="20" width="2" height="2" fill="#f59e0b" opacity="0.15" transform="skewY(22.5)" />
          
          {/* Right Side (Dirt Shadow) */}
          <path d="M16 17.5 L29 11 L29 23.5 L16 30 Z" fill="#451a03" />
          {/* Right dirt pixels */}
          <rect x="20" y="15" width="2" height="2" fill="#78350f" transform="skewY(-22.5)" />
          <rect x="24" y="18" width="2" height="2" fill="#a16207" opacity="0.2" transform="skewY(-22.5)" />
        </svg>
      </div>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Minecraft
      </span>
    </div>
  );
}

// 6. Master Chief Helmet
export function MasterChiefHelmet() {
  return (
    <div className="inline-flex items-center justify-center group relative cursor-pointer select-none">
      <div className="w-7 h-7 transition-all duration-300 group-hover:scale-110">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {/* Outer dark helmet silhouette */}
          <path d="M6 14 C6 8, 10 5, 16 5 C22 5, 26 8, 26 14 L25 23 L22 28 L16 30 L10 28 L7 23 Z" fill="#14532d" />
          
          {/* Main green helmet frame */}
          <path d="M7 14 C7 9, 10 6.5, 16 6.5 C22 6.5, 25 9, 25 14 L24 22 L21 27 L16 29 L11 27 L8 22 Z" fill="#16a34a" />
          {/* Darker green inner sections */}
          <path d="M9 14 C9 10.5, 11 8.5, 16 8.5 C21 8.5, 23 10.5, 23 14 L22 21 L19 25 L16 27 L13 25 L10 21 Z" fill="#15803d" />

          {/* Visor Background */}
          <path d="M10 12.5 C10 11.5, 11 10.5, 16 10.5 C21 10.5, 22 11.5, 22 12.5 L21.5 17 C21.5 18, 19.5 19, 16 19 C12.5 19, 10.5 18, 10.5 17 Z" fill="#78350f" />
          
          {/* Visor Gold Gradient (shines on hover) */}
          <path
            d="M10.5 13 C10.5 12, 11.5 11, 16 11 C20.5 11, 21.5 12, 21.5 13 L21 16.5 C21 17.5, 19 18.5, 16 18.5 C13 18.5, 11 17.5, 11 16.5 Z"
            fill="url(#visorGrad)"
            className="transition-all duration-300 group-hover:brightness-125"
          />
          
          {/* Visor Glint Reflection */}
          <path d="M12 13 L15 13 L14.5 15.5 L12.5 15.5 Z" fill="#ffffff" opacity="0.45" className="transition-transform duration-300 group-hover:translate-x-1" />

          {/* Jaw Details */}
          <path d="M13 22 L19 22 L18 24.5 L14 24.5 Z" fill="#1e293b" />
          <path d="M15 25.5 L17 25.5 L17 28.5 L15 28.5 Z" fill="#0f172a" />
          
          {/* Helmet side vents */}
          <rect x="5.5" y="16" width="1.5" height="4" fill="#334155" rx="0.5" />
          <rect x="25" y="16" width="1.5" height="4" fill="#334155" rx="0.5" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-0.5 rounded font-mono whitespace-nowrap z-50">
        Halo Master Chief
      </span>
    </div>
  );
}
