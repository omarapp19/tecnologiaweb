"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Lightning, GithubLogo, ShieldCheck } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-transparent border-t border-zinc-200 dark:border-zinc-900/60 py-8 px-6 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600 dark:text-zinc-400">
        <div>
          <div className="flex items-center gap-2">
            <Lightning size={14} className="text-blue-500" weight="fill" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">NexusWeb Technologies</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>&copy; {currentYear} {t.footer.rights[language]}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors font-mono text-[10px]"
            title="Panel Administrativo Privado"
          >
            <ShieldCheck size={13} />
            <span>Admin</span>
          </Link>
          <a
            href="https://github.com/omarapp19/tecnologiaweb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <GithubLogo size={14} />
            <span>GitHub</span>
          </a>
          <a
            href="#inicio"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-mono text-[10px]"
          >
            ↑ TOP
          </a>
        </div>
      </div>
    </footer>
  );
}
