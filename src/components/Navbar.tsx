"use client";

import { useState, useEffect } from "react";
import { List, X, Sparkle, Cube, Lightning } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useDesign } from "@/context/DesignContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { designMode, setDesignMode } = useDesign();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t.navbar.inicio[language], href: "#inicio" },
    { name: t.navbar.servicios[language], href: "#servicios" },
    { name: t.navbar.proyectos[language], href: "#proyectos" },
    { name: t.navbar.techStack[language], href: "#tech-stack" },
    { name: t.navbar.equipo[language], href: "#equipo" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 ${
        scrolled
          ? "h-16 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900/60"
          : "h-16 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#inicio"
          onClick={(e) => handleLinkClick(e, "#inicio")}
          className="flex items-center gap-2.5 group text-white font-medium text-base tracking-tight"
        >
          <div className="relative w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-500/60 group-hover:bg-blue-500/20 transition-all shadow-sm">
            <Lightning size={18} weight="fill" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-lg tracking-tight">
              NexusWeb<span className="text-blue-500 font-bold">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded tracking-widest font-semibold">
              STUDIO
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={(e) => handleLinkClick(e, "#contacto")}
            className="tap-feedback inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-zinc-200 hover:text-white bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 rounded-md transition-all duration-300"
          >
            {t.navbar.contactanos[language]}
          </a>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 border-l border-zinc-800 pl-4 h-4 text-[10px] font-mono select-none">
            <button
              onClick={() => setLanguage("es")}
              className={`transition-colors cursor-pointer ${
                language === "es" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ES
            </button>
            <span className="text-zinc-800">/</span>
            <button
              onClick={() => setLanguage("en")}
              className={`transition-colors cursor-pointer ${
                language === "en" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              EN
            </button>
          </div>

          {/* Design Mode Switcher (Glass / Neo) */}
          <div className="flex items-center gap-1 border-l border-zinc-800 pl-3 text-[10px] font-mono select-none">
            <button
              onClick={() => setDesignMode("glass")}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                designMode === "glass"
                  ? "text-blue-400 bg-zinc-800/80 font-semibold shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Estilo Glassmorphism"
            >
              <Sparkle size={11} weight={designMode === "glass" ? "fill" : "regular"} />
              <span>Glass</span>
            </button>
            <button
              onClick={() => setDesignMode("neo")}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                designMode === "neo"
                  ? "text-blue-400 bg-zinc-800/80 font-semibold shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Estilo Neomorphism"
            >
              <Cube size={11} weight={designMode === "neo" ? "fill" : "regular"} />
              <span>Neo</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 bg-zinc-950/95 border-b border-zinc-900/60 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 py-1.5 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={(e) => handleLinkClick(e, "#contacto")}
                className="tap-feedback w-full inline-flex items-center justify-center py-2 text-xs font-medium text-blue-300 hover:text-white bg-blue-600/10 border border-blue-500/30 rounded-md transition-colors mt-2"
              >
                {t.navbar.contactanos[language]}
              </a>

              {/* Mobile Design Mode Switcher */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-900/65 text-xs font-mono">
                <button
                  onClick={() => {
                    setDesignMode("glass");
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                    designMode === "glass"
                      ? "bg-zinc-900 border-zinc-800 text-blue-400 font-medium"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Sparkle size={13} weight={designMode === "glass" ? "fill" : "regular"} />
                  <span>GLASS</span>
                </button>
                <button
                  onClick={() => {
                    setDesignMode("neo");
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                    designMode === "neo"
                      ? "bg-zinc-900 border-zinc-800 text-blue-400 font-medium"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Cube size={13} weight={designMode === "neo" ? "fill" : "regular"} />
                  <span>NEO</span>
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-zinc-900/40 text-xs font-mono">
                <button
                  onClick={() => {
                    setLanguage("es");
                    setIsOpen(false);
                  }}
                  className={`flex-1 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                    language === "es"
                      ? "bg-zinc-900 border-zinc-800 text-white font-medium"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  ESPAÑOL
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setIsOpen(false);
                  }}
                  className={`flex-1 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                    language === "en"
                      ? "bg-zinc-900 border-zinc-800 text-white font-medium"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
