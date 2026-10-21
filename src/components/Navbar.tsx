"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X, Lightning, ShieldCheck } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
    { name: t.navbar.cotizador[language], href: "#cotizador" },
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
          ? "h-16 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-900/80 shadow-xs"
          : "h-16 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#inicio"
          onClick={(e) => handleLinkClick(e, "#inicio")}
          className="flex items-center gap-2.5 group text-zinc-900 dark:text-white font-medium text-base tracking-tight"
        >
          <div className="relative w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:border-blue-500/60 group-hover:bg-blue-500/20 transition-all shadow-xs">
            <Lightning size={18} weight="fill" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-lg tracking-tight">
              NexusWeb<span className="text-blue-600 dark:text-blue-500 font-bold">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded tracking-widest font-semibold">
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
              className="text-xs text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={(e) => handleLinkClick(e, "#contacto")}
            className="tap-feedback inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-blue-600 dark:text-zinc-200 hover:text-blue-700 dark:hover:text-white bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 rounded-md transition-all duration-300"
          >
            {t.navbar.contactanos[language]}
          </a>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-4 h-4 text-[10px] font-mono select-none">
            <button
              onClick={() => setLanguage("es")}
              className={`transition-colors cursor-pointer ${
                language === "es"
                  ? "text-zinc-900 dark:text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              ES
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <button
              onClick={() => setLanguage("en")}
              className={`transition-colors cursor-pointer ${
                language === "en"
                  ? "text-zinc-900 dark:text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin Portal Quick Button */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all shadow-xs"
            title="Panel Administrativo Privado"
          >
            <ShieldCheck size={14} className="text-blue-500" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-lg transition-colors cursor-pointer"
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
            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-900/80 backdrop-blur-lg md:hidden overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 py-1.5 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={(e) => handleLinkClick(e, "#contacto")}
                className="tap-feedback w-full inline-flex items-center justify-center py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors mt-2 shadow-sm"
              >
                {t.navbar.contactanos[language]}
              </a>

              {/* Mobile Admin Portal Button */}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-blue-500/40 transition-colors"
              >
                <ShieldCheck size={15} className="text-blue-500" />
                <span>Panel Administrativo</span>
              </Link>

              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/60 text-xs font-mono">
                <button
                  onClick={() => {
                    setLanguage("es");
                    setIsOpen(false);
                  }}
                  className={`flex-1 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                    language === "es"
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
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
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
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
