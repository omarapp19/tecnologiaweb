"use client";

import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Sparkle, Cube, CaretRight, CaretLeft } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useDesign } from "@/context/DesignContext";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpen, setIsOpen] = useState(false);
  const { designMode, setDesignMode } = useDesign();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    // Close when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // 300ms grace period to prevent flickering / accidental closing
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const toggleTheme = (newTheme: "dark" | "light") => {
    if (newTheme === theme) return;
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  if (!mounted) return null;

  const isNeo = designMode === "neo";
  const isLight = theme === "light";

  return (
    <div
      ref={containerRef}
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center select-none transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%-2.25rem)]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Control Panel */}
      <div
        className={`py-3.5 px-3 flex flex-col items-center gap-4 transition-colors duration-300 ${
          isLight
            ? "bg-white/95 text-zinc-900 border border-l-0 border-zinc-200/80 shadow-[10px_0_35px_rgba(0,0,0,0.08)]"
            : "bg-zinc-950/95 text-zinc-100 border border-l-0 border-zinc-800/80 shadow-[10px_0_40px_rgba(0,0,0,0.5)]"
        } ${
          isNeo
            ? isLight
              ? "bg-[#e6ecf2] text-slate-800 border-none shadow-[10px_10px_25px_rgba(166,180,200,0.7),-4px_-4px_15px_rgba(255,255,255,0.95)]"
              : "bg-[#141519] text-slate-100 border-none shadow-[10px_10px_25px_rgba(0,0,0,0.9),-4px_-4px_15px_rgba(255,255,255,0.04)]"
            : "backdrop-blur-xl"
        }`}
      >
        {/* SECTION 1: THEME (Light / Dark) */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Modo
          </span>
          <div
            className={`relative flex flex-col gap-2 p-1 rounded-full border items-center ${
              isLight
                ? "bg-zinc-100/90 border-zinc-200/70"
                : "bg-zinc-900/70 border-white/[0.06]"
            } ${
              isNeo
                ? isLight
                  ? "bg-[#e6ecf2] border-none shadow-[inset_2px_2px_5px_rgba(166,180,200,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]"
                  : "bg-[#141519] border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.85),inset_-2px_-2px_5px_rgba(255,255,255,0.04)]"
                : ""
            }`}
          >
            {/* Sliding Capsule indicator */}
            <motion.div
              className={`absolute w-7 h-7 rounded-full ${
                isNeo
                  ? isLight
                    ? "bg-[#e6ecf2] shadow-[2px_2px_5px_rgba(166,180,200,0.7),-2px_-2px_5px_rgba(255,255,255,0.95)]"
                    : "bg-[#1e2129] shadow-[2px_2px_5px_rgba(0,0,0,0.85),-2px_-2px_5px_rgba(255,255,255,0.06)]"
                  : "bg-blue-500/20 border border-blue-500/40"
              }`}
              animate={{
                y: isLight ? 0 : 36,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />

            {/* Sun Button */}
            <button
              onClick={() => toggleTheme("light")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors z-10 cursor-pointer ${
                isLight ? "text-blue-600" : "text-zinc-500 hover:text-zinc-300"
              }`}
              aria-label="Modo claro"
              title="Modo Claro"
            >
              <Sun size={15} weight={isLight ? "fill" : "regular"} />
            </button>

            {/* Moon Button */}
            <button
              onClick={() => toggleTheme("dark")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors z-10 cursor-pointer ${
                !isLight ? "text-blue-400" : "text-zinc-400 hover:text-zinc-600"
              }`}
              aria-label="Modo oscuro"
              title="Modo Oscuro"
            >
              <Moon size={15} weight={!isLight ? "fill" : "regular"} />
            </button>
          </div>
        </div>

        {/* Subtle Divider */}
        <div
          className={`w-5 h-[1px] ${
            isLight ? "bg-zinc-200" : "bg-zinc-800"
          }`}
        />

        {/* SECTION 2: STYLE (Glassmorphism / Neomorphism) */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Estilo
          </span>
          <div
            className={`relative flex flex-col gap-2 p-1 rounded-full border items-center ${
              isLight
                ? "bg-zinc-100/90 border-zinc-200/70"
                : "bg-zinc-900/70 border-white/[0.06]"
            } ${
              isNeo
                ? isLight
                  ? "bg-[#e6ecf2] border-none shadow-[inset_2px_2px_5px_rgba(166,180,200,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]"
                  : "bg-[#141519] border-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.85),inset_-2px_-2px_5px_rgba(255,255,255,0.04)]"
                : ""
            }`}
          >
            {/* Sliding Capsule indicator */}
            <motion.div
              className={`absolute w-7 h-7 rounded-full ${
                isNeo
                  ? isLight
                    ? "bg-[#e6ecf2] shadow-[2px_2px_5px_rgba(166,180,200,0.7),-2px_-2px_5px_rgba(255,255,255,0.95)]"
                    : "bg-[#1e2129] shadow-[2px_2px_5px_rgba(0,0,0,0.85),-2px_-2px_5px_rgba(255,255,255,0.06)]"
                  : "bg-indigo-500/20 border border-indigo-500/40"
              }`}
              animate={{
                y: !isNeo ? 0 : 36,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />

            {/* Glassmorphism Button */}
            <button
              onClick={() => setDesignMode("glass")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors z-10 cursor-pointer ${
                !isNeo ? "text-indigo-500 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              aria-label="Estilo Glassmorphism"
              title="Estilo Glassmorphism"
            >
              <Sparkle size={15} weight={!isNeo ? "fill" : "regular"} />
            </button>

            {/* Neomorphism Button */}
            <button
              onClick={() => setDesignMode("neo")}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors z-10 cursor-pointer ${
                isNeo ? "text-indigo-500 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              aria-label="Estilo Neomorphism"
              title="Estilo Neomorphism"
            >
              <Cube size={15} weight={isNeo ? "fill" : "regular"} />
            </button>
          </div>
        </div>
      </div>

      {/* Permanently Attached Handle Tab */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-9 h-24 rounded-r-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md ${
          isLight
            ? "bg-white/95 border border-l-0 border-zinc-200/90 text-zinc-700 shadow-zinc-300/50"
            : "bg-zinc-950/95 border border-l-0 border-zinc-800/90 text-zinc-300 shadow-black/70"
        } ${
          isNeo
            ? isLight
              ? "bg-[#e6ecf2] border-none text-slate-700 shadow-[4px_4px_12px_rgba(166,180,200,0.6),-2px_-2px_8px_rgba(255,255,255,0.95)]"
              : "bg-[#141519] border-none text-slate-200 shadow-[4px_4px_12px_rgba(0,0,0,0.85),-2px_-2px_8px_rgba(255,255,255,0.04)]"
            : "backdrop-blur-xl"
        }`}
        aria-label={isOpen ? "Cerrar panel de tema y estilo" : "Abrir panel de tema y estilo"}
        title={isOpen ? "Cerrar panel" : "Abrir tema y estilo"}
      >
        {isOpen ? (
          <CaretLeft size={16} weight="bold" className="text-zinc-400 hover:text-zinc-200 transition-colors" />
        ) : (
          <>
            <span className="text-blue-500 text-[11px]">
              {isLight ? <Sun size={12} weight="fill" /> : <Moon size={12} weight="fill" />}
            </span>
            <span className="text-indigo-400 text-[11px]">
              {isNeo ? <Cube size={12} weight="fill" /> : <Sparkle size={12} weight="fill" />}
            </span>
            <CaretRight size={11} className="text-zinc-500 mt-1" />
          </>
        )}
      </button>
    </div>
  );
}
