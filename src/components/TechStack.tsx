"use client";

import { motion } from "motion/react";
import { Atom, Browser, Palette, Code, Terminal, Cpu, Database, Cloud, Globe, GitBranch, Gear, Robot, Brain, ArrowsClockwise, Link, Sparkle } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface TechItem {
  name: string;
  level: string;
  icon: React.ReactNode;
}

interface Category {
  title: string;
  items: TechItem[];
}

export default function TechStack() {
  const { language, t } = useLanguage();

  const categories: Category[] = [
    {
      title: t.techStack.categories.frontend[language],
      items: [
        { name: "React", level: t.techStack.levels.solid[language], icon: <Atom size={18} /> },
        { name: "Next.js", level: t.techStack.levels.advanced[language], icon: <Browser size={18} /> },
        { name: "JavaScript", level: t.techStack.levels.advanced[language], icon: <Code size={18} /> },
        { name: "Angular", level: t.techStack.levels.solid[language], icon: <Code size={18} /> },
        { name: "Tailwind CSS", level: t.techStack.levels.solid[language], icon: <Palette size={18} /> },
        { name: "TypeScript", level: t.techStack.levels.advanced[language], icon: <Code size={18} /> },
        { name: "WordPress", level: t.techStack.levels.solid[language], icon: <Globe size={18} /> },
      ],
    },
    {
      title: t.techStack.categories.backend[language],
      items: [
        { name: "Node.js", level: t.techStack.levels.solid[language], icon: <Terminal size={18} /> },
        { name: "Express.js", level: t.techStack.levels.solid[language], icon: <Cpu size={18} /> },
        { name: "Java", level: t.techStack.levels.solid[language], icon: <Cpu size={18} /> },
        { name: "Python", level: t.techStack.levels.solid[language], icon: <Code size={18} /> },
        { name: "MySQL", level: t.techStack.levels.solid[language], icon: <Database size={18} /> },
        { name: "PostgreSQL", level: t.techStack.levels.solid[language], icon: <Database size={18} /> },
        { name: "Prisma", level: t.techStack.levels.solid[language], icon: <Database size={18} /> },
        { name: "Supabase", level: t.techStack.levels.solid[language], icon: <Database size={18} /> },
      ],
    },
    {
      title: t.techStack.categories.infra[language],
      items: [
        { name: "Cloudflare R2", level: t.techStack.levels.solid[language], icon: <Cloud size={18} /> },
        { name: "Vercel", level: t.techStack.levels.advanced[language], icon: <Globe size={18} /> },
        { name: "Firebase", level: t.techStack.levels.advanced[language], icon: <Database size={18} /> },
        { name: "Git / GitHub", level: t.techStack.levels.advanced[language], icon: <GitBranch size={18} /> },
        { name: "CI/CD Pipelines", level: t.techStack.levels.solid[language], icon: <ArrowsClockwise size={18} /> },
      ],
    },
    {
      title: t.techStack.categories.automation[language],
      items: [
        { name: "n8n", level: t.techStack.levels.solid[language], icon: <Gear size={18} /> },
        { name: "ThinköAI", level: t.techStack.levels.advanced[language], icon: <Brain size={18} /> },
        { name: "Claude (Anthropic)", level: t.techStack.levels.advanced[language], icon: <Sparkle size={18} /> },
        { name: "Integraciones API", level: t.techStack.levels.solid[language], icon: <Link size={18} /> },
        { name: "Agentes de IA", level: t.techStack.levels.solid[language], icon: <Robot size={18} /> },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="relative overflow-hidden py-24 px-6 bg-transparent border-t border-zinc-200 dark:border-zinc-900/50 font-sans">
      {/* Ambient glass glowing decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/[0.012] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-3"
          >
            {t.techStack.title[language]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-[60ch]"
          >
            {t.techStack.subtitle[language]}
          </motion.p>
        </div>

        {/* Visual Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-card p-6 rounded-2xl flex flex-col gap-5 hover:scale-[1.005]"
            >
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-white/[0.04] pb-2 font-semibold">
                {category.title}
              </h3>
              <div className="flex flex-col gap-2.5">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200/80 dark:border-white/[0.04] bg-white/70 dark:bg-zinc-950/40 hover:border-blue-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-300 shadow-2xs"
                  >
                    <div className="text-blue-600 dark:text-accent shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">{item.name}</span>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono tracking-wider uppercase font-medium">
                        {item.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
