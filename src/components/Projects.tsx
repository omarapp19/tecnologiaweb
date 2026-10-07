"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useDesign } from "@/context/DesignContext";

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  tags: string[];
  link?: string;
  colSpan: string;
  isWide: boolean;
  url: string;
  objectFit?: "cover" | "contain";
}

export default function Projects() {
  const { language, t } = useLanguage();
  const { designMode } = useDesign();

  const projectsList: Project[] = [
    {
      id: "01",
      category: language === "es" ? t.projects.categories.website.es : t.projects.categories.website.en,
      title: "ASP Worship (Landing)",
      description: language === "es"
        ? "Landing page oficial y presentación de la plataforma para coordinación musical."
        : "Official landing page and presentation of the platform for musical coordination.",
      image: "/projects/worship-app-v2.png",
      tags: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
      link: "https://www.aspworship.online/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "aspworship.online",
      objectFit: "contain",
    },
    {
      id: "02",
      category: language === "es" ? t.projects.categories.pwa.es : t.projects.categories.pwa.en,
      title: "ASP Worship App APP",
      description: language === "es"
        ? "Aplicación interactiva para coordinar repertorios y acordes en tiempo real."
        : "Interactive application to coordinate repertoires and chords in real time.",
      image: "/projects/aspworship.png",
      mobileImage: "/projects/aspworship-mobil.png",
      tags: ["TypeScript", "React", "Node.js", "Firebase", "Cloudflare R2"],
      link: "https://app.aspworship.online/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "app.aspworship.online",
    },
    {
      id: "03",
      category: language === "es" ? t.projects.categories.webapp.es : t.projects.categories.webapp.en,
      title: "Pizza Builder",
      description: language === "es"
        ? "Constructor interactivo en tiempo real para personalización de ingredientes y pedidos."
        : "Interactive real-time constructor for ingredient customization and ordering.",
      image: "/projects/pizza-builder-v2.png",
      tags: ["JavaScript", "React", "Tailwind CSS", "Framer Motion"],
      link: "https://pizzabuilder.vercel.app/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "pizzabuilder.vercel.app",
    },
    {
      id: "04",
      category: language === "es" ? t.projects.categories.website.es : t.projects.categories.website.en,
      title: "Arma tu Antojo",
      description: language === "es"
        ? "Catálogo interactivo y Progressive Web App optimizada para pedidos móviles."
        : "Interactive catalog and Progressive Web App optimized for mobile orders.",
      image: "/projects/armatuantojo-v2.png",
      tags: ["JavaScript", "React", "Tailwind CSS", "Netlify"],
      link: "https://armatuantojo.netlify.app/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "armatuantojo.netlify.app",
    },
    {
      id: "05",
      category: language === "es" ? t.projects.categories.corporate.es : t.projects.categories.corporate.en,
      title: "Grupo Serex",
      description: language === "es"
        ? "Portal corporativo de consultoría integral optimizado para SEO y alto rendimiento."
        : "Corporate portal for comprehensive consulting optimized for SEO and high performance.",
      image: "/projects/gruposerex.png",
      tags: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
      link: "https://gruposerex.com/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "gruposerex.com",
    },
    {
      id: "06",
      category: language === "es" ? t.projects.categories.pwa.es : t.projects.categories.pwa.en,
      title: "Super Samán App",
      description: language === "es"
        ? "Catálogo digital y aplicación interactiva optimizada para automatización de servicios."
        : "Digital catalog and interactive application optimized for service automation.",
      image: "/projects/supersaman.png",
      mobileImage: "/projects/saman mobil.png",
      tags: ["JavaScript", "React", "Tailwind CSS", "Netlify"],
      link: "#",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "#",
    },
    {
      id: "07",
      category: language === "es" ? t.projects.categories.impact.es : t.projects.categories.impact.en,
      title: "Proyecto Nehemías",
      description: language === "es"
        ? "Plataforma de gestión humanitaria y transparencia radical para comunidades afectadas por los terremotos en Venezuela, con balance público auditable, comprobantes y fotos de cada entrega."
        : "Humanitarian management platform with radical transparency for communities affected by Venezuela's earthquakes, featuring a publicly auditable balance, receipts, and delivery photos.",
      image: "/projects/nehemias2026.png",
      tags: ["Next.js", "Express", "PostgreSQL", "Prisma", "Turborepo"],
      link: "https://nehemias2026.com/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "nehemias2026.com",
      objectFit: "contain",
    },
    {
      id: "08",
      category: language === "es" ? t.projects.categories.impact.es : t.projects.categories.impact.en,
      title: "Unidos (Centros de Acopio)",
      description: language === "es"
        ? "Plataforma cívica sin fines de lucro que conecta a la ciudadanía con los centros de acopio activos tras el terremoto de junio 2026, con mapa geolocalizado y estadísticas de donación en tiempo real."
        : "Nonprofit civic platform connecting citizens with active donation centers after the June 2026 earthquake, featuring a geolocated map and real-time donation statistics.",
      image: "/projects/unidos-centros-acopio.png",
      tags: ["React", "TypeScript", "Supabase", "Vercel"],
      link: "https://centrodeacopiovenezuela.com/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "centrodeacopiovenezuela.com",
      objectFit: "contain",
    },
    {
      id: "09",
      category: language === "es" ? t.projects.categories.website.es : t.projects.categories.website.en,
      title: "Kabod 102.1 FM",
      description: language === "es"
        ? "Landing page y plataforma web de transmisión radial en vivo 24/7 para Kabod 102.1 FM, con reproductor en tiempo real, parrilla de programación y contenido devocional."
        : "Official landing page and 24/7 live streaming web platform for Kabod 102.1 FM, featuring a real-time audio player, weekly schedule, and devotional content.",
      image: "/projects/Macbook-Air-kabod1021.vercel.app.png",
      mobileImage: "/projects/Samsung-Galaxy-S20-kabod1021.vercel.app.png",
      tags: ["React", "TypeScript", "Tailwind CSS", "Vite", "Audio Streaming"],
      link: "https://kabod1021.vercel.app/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "kabod1021.vercel.app",
    },
    {
      id: "10",
      category: language === "es" ? t.projects.categories.android.es : t.projects.categories.android.en,
      title: "Radio Kabod 102.1 FM App",
      description: language === "es"
        ? "Aplicación móvil Android para sintonizar la señal radial en directo en alta calidad (128 kbps), con temporizador de apagado, acceso a WhatsApp de cabina y peticiones de oración."
        : "Native Android mobile app for streaming live radio in high quality (128 kbps), featuring a sleep timer, direct studio WhatsApp access, and prayer requests.",
      image: "/projects/kabod app.png",
      tags: ["Android", "Audio Streaming", "Mobile UI", "Radio Player"],
      link: "https://kabod1021.vercel.app/",
      colSpan: "lg:col-span-1",
      isWide: false,
      url: "kabod1021.vercel.app",
      objectFit: "contain",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projectsList.length);
  }, [projectsList.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projectsList.length) % projectsList.length);
  }, [projectsList.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, handleNext]);

  return (
    <section id="proyectos" className="relative overflow-hidden py-24 px-6 bg-transparent border-t border-zinc-900/50 font-sans">
      {/* Ambient glass glowing decorations */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-3"
          >
            {t.projects.title[language]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-455 text-sm leading-relaxed max-w-[60ch]"
          >
            {t.projects.subtitle[language]}
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative overflow-hidden w-full max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              const swipe = info.offset.x;
              const threshold = 50;
              if (swipe < -threshold) {
                handleNext();
              } else if (swipe > threshold) {
                handlePrev();
              }
            }}
          >
            {projectsList.map((project) => (
              <div key={project.id} className="w-full shrink-0 px-2 sm:px-4">
                <div className={`${designMode === "neo" ? "neo-card" : "glass-card"} group p-6 sm:p-8 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[460px] lg:min-h-[360px] hover:scale-[1.002] transition-transform duration-300`}>
                  {/* Clean Image Container with Glass Vibe */}
                  <div className="lg:col-span-7 relative aspect-[16/10] w-full">
                    {/* Main Background Image */}
                    <div className="absolute inset-0 overflow-hidden bg-zinc-950 border border-zinc-900/50 rounded-xl">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className={`opacity-85 group-hover:opacity-100 transition-all duration-500 ease-out ${project.objectFit === "contain"
                            ? "object-contain p-4"
                            : "object-cover object-top"
                          }`}
                      />
                    </div>

                    {/* Overlapping Mobile Mockup */}
                    {project.mobileImage && (
                      <div className="absolute right-4 sm:right-6 bottom-[-12px] sm:bottom-[-20px] w-[24%] min-w-[70px] max-w-[120px] aspect-[9/19.5] z-20 transition-all duration-500 ease-out group-hover:translate-y-[-10px] group-hover:scale-105 group-hover:rotate-[-2deg] filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                        <div className="relative w-full h-full rounded-[12px] sm:rounded-[20px] overflow-hidden border-[3px] sm:border-[5px] border-zinc-900 bg-zinc-950">
                          <Image
                            src={project.mobileImage}
                            alt={`${project.title} responsive`}
                            fill
                            sizes="15vw"
                            className="object-cover object-top"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text metadata and info */}
                  <div className="lg:col-span-5 flex flex-col gap-3.5">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-550 uppercase">
                      {project.id} &mdash; {project.category}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-zinc-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Link */}
                    {project.link && (
                      <div className="pt-2">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                        >
                          {t.projects.visit[language]}
                          <ArrowUpRight size={13} weight="bold" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicators and Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 max-w-5xl mx-auto px-4">
          {/* Dot indicators with loading animation */}
          <div className="flex gap-2.5">
            {projectsList.map((project, index) => (
              <button
                key={project.id}
                onClick={() => {
                  setCurrentIndex(index);
                }}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{
                  width: currentIndex === index ? "2.5rem" : "0.5rem",
                  backgroundColor: currentIndex === index ? "rgba(59,130,246,0.2)" : "rgba(var(--white-rgb), 0.1)",
                }}
              >
                {currentIndex === index && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                    }}
                    key={currentIndex}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-white/[0.05] bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all duration-300 active:scale-95"
              aria-label={t.projects.prev[language]}
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-white/[0.05] bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all duration-300 active:scale-95"
              aria-label={t.projects.next[language]}
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

