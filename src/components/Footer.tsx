"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Lightning, GithubLogo } from "@phosphor-icons/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-transparent border-t border-zinc-900/60 py-8 px-6 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightning size={14} className="text-blue-500" weight="fill" />
            <span className="font-semibold text-zinc-300">NexusWeb Technologies</span>
            <span className="text-zinc-700">|</span>
            <span>&copy; {currentYear} {t.footer.rights[language]}</span>
          </div>
          <span className="text-[10px] text-zinc-600 block font-mono">
            {t.footer.credits[language]}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/omarapp19/tecnologiaweb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <GithubLogo size={14} />
            <span>GitHub</span>
          </a>
          <a
            href="#inicio"
            className="hover:text-zinc-300 transition-colors font-mono text-[10px]"
          >
            ↑ TOP
          </a>
        </div>
      </div>
    </footer>
  );
}
