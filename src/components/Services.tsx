"use client";

import { motion } from "motion/react";
import { 
  Code, 
  CloudArrowUp, 
  Palette, 
  Cpu, 
  CheckCircle, 
  ArrowUpRight,
  Lightning,
  ShieldCheck
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { useDesign } from "@/context/DesignContext";

export default function Services() {
  const { language, t } = useLanguage();
  const { designMode } = useDesign();

  const services = [
    {
      id: "01",
      icon: Code,
      accentColor: "from-blue-500/20 via-blue-500/5 to-transparent",
      iconColor: "text-blue-400",
      title: language === "es" ? "Desarrollo Web & Móvil" : "Web & Mobile Development",
      description: language === "es"
        ? "Construcción de aplicaciones web de última generación, arquitecturas full-stack modernas y plataformas de alto rendimiento centradas en la fluidez y velocidad."
        : "Building next-generation web applications, modern full-stack architectures, and high-performance platforms focused on speed and fluid interaction.",
      capabilities: language === "es"
        ? [
            "Arquitecturas Next.js y React 19",
            "Progressive Web Apps (PWAs) & Móvil",
            "APIs RESTful y GraphQL escalables",
            "Optimización extrema de rendimiento y SEO"
          ]
        : [
            "Next.js & React 19 Architectures",
            "Progressive Web Apps (PWAs) & Mobile",
            "Scalable RESTful & GraphQL APIs",
            "Extreme performance & SEO tuning"
          ],
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"]
    },
    {
      id: "02",
      icon: CloudArrowUp,
      accentColor: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      iconColor: "text-cyan-400",
      title: language === "es" ? "Arquitectura Cloud & DevOps" : "Cloud Architecture & DevOps",
      description: language === "es"
        ? "Implementación de infraestructura resiliente, pipelines de despliegue continuo automatizados, CDN global y almacenamiento distribuido seguro."
        : "Implementation of resilient infrastructure, automated continuous deployment pipelines, global CDN, and secure distributed storage.",
      capabilities: language === "es"
        ? [
            "Pipelines CI/CD automatizados (GitHub Actions)",
            "Almacenamiento y CDN con Cloudflare R2 / Workers",
            "Contenedores Docker y entornos reproducibles",
            "Seguridad de datos, SSL y alta disponibilidad"
          ]
        : [
            "Automated CI/CD Pipelines (GitHub Actions)",
            "Storage & CDN with Cloudflare R2 / Workers",
            "Docker containers & reproducible environments",
            "Data security, SSL & high availability"
          ],
      tags: ["Cloudflare R2", "Docker", "CI/CD", "AWS / Vercel", "Security"]
    },
    {
      id: "03",
      icon: Palette,
      accentColor: "from-purple-500/20 via-purple-500/5 to-transparent",
      iconColor: "text-purple-400",
      title: language === "es" ? "UI/UX & Sistemas de Diseño" : "UI/UX & Design Systems",
      description: language === "es"
        ? "Diseño visual de vanguardia, interfaces interactivas intuitivas y bibliotecas de componentes modulares alineadas a las mejores prácticas de experiencia de usuario."
        : "Cutting-edge visual design, intuitive interactive interfaces, and modular component libraries aligned with UX best practices.",
      capabilities: language === "es"
        ? [
            "Prototipado interactivo de alta fidelidad",
            "Sistemas de diseño modulares y Design Tokens",
            "Accesibilidad WCAG y navegación ergonómica",
            "Micro-interacciones y experiencias 3D fluidas"
          ]
        : [
            "High-fidelity interactive prototyping",
            "Modular design systems & design tokens",
            "WCAG accessibility & ergonomic navigation",
            "Micro-interactions & fluid 3D experiences"
          ],
      tags: ["Figma", "Design Systems", "Three.js", "WCAG", "Motion"]
    },
    {
      id: "04",
      icon: Cpu,
      accentColor: "from-amber-500/20 via-amber-500/5 to-transparent",
      iconColor: "text-amber-400",
      title: language === "es" ? "Automatización & Soluciones con IA" : "Automation & AI Solutions",
      description: language === "es"
        ? "Integración de inteligencia artificial en flujos empresariales, agentes autónomos, procesamiento inteligente y optimización de tareas repetitivas."
        : "Integration of artificial intelligence into business workflows, autonomous agents, intelligent processing, and repetitive task optimization.",
      capabilities: language === "es"
        ? [
            "Integración de LLMs (OpenAI, Anthropic, Gemini)",
            "Flujos automatizados y orquestación de tareas",
            "Extracción y análisis inteligente de datos",
            "Desarrollo de chatbots y asistentes contextuales"
          ]
        : [
            "LLM Integrations (OpenAI, Anthropic, Gemini)",
            "Automated workflows & task orchestration",
            "Intelligent data extraction & analytics",
            "Chatbots & context-aware assistant development"
          ],
      tags: ["AI Integration", "Python", "Automation", "LLM APIs", "Analytics"]
    }
  ];

  return (
    <section id="servicios" className="relative py-28 px-6 bg-transparent border-t border-zinc-900/50 font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
            <Lightning size={14} weight="fill" />
            <span>{language === "es" ? "NUESTRAS CAPACIDADES" : "OUR CAPABILITIES"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100">
            {language === "es" ? "Servicios & Soluciones" : "Services & Solutions"}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            {language === "es"
              ? "Diseñamos e implementamos software moderno de principio a fin, combinando arquitectura de nube, interfaces interactivas y tecnologías emergentes."
              : "We design and deploy modern software from start to finish, combining cloud architecture, interactive interfaces, and emerging technologies."}
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-2xl border p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  designMode === "glass"
                    ? "glass-card hover:border-zinc-700/60"
                    : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:shadow-2xl hover:shadow-blue-950/20"
                }`}
              >
                {/* Glow gradient accent on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Top Bar: Icon & ID */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <Icon className={`${service.iconColor}`} size={24} weight="duotone" />
                    </div>
                    <span className="font-mono text-xs text-zinc-600 font-semibold tracking-wider">
                      {service.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors tracking-tight mb-3">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Capabilities Checklist */}
                  <div className="space-y-2 mb-6">
                    {service.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <CheckCircle size={14} className="text-blue-400 shrink-0" weight="fill" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tags */}
                <div className="relative z-10 pt-4 border-t border-zinc-800/60 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-zinc-900/70 border border-zinc-800/80 rounded-md group-hover:border-zinc-700/60 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
