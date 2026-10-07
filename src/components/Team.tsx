"use client";

import { motion } from "motion/react";
import { 
  UsersThree, 
  Code, 
  Database, 
  FigmaLogo, 
  GitBranch,
  ShieldCheck,
  CheckCircle,
  Sparkle
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { useDesign } from "@/context/DesignContext";

export default function Team() {
  const { language } = useLanguage();
  const { designMode } = useDesign();

  const teamRoles = [
    {
      id: "01",
      role: language === "es" ? "Frontend Engineering" : "Frontend Engineering",
      badge: language === "es" ? "Arquitectura de Interfaz" : "UI Architecture",
      icon: Code,
      iconColor: "text-blue-400",
      description: language === "es"
        ? "Desarrollo de interfaces reactivas, renderizado de componentes de alto rendimiento, animaciones fluidas y experiencias 3D interactivas."
        : "Development of reactive interfaces, high-performance component rendering, fluid animations, and interactive 3D experiences.",
      skills: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
      focus: language === "es" ? "Rendimiento web, diseño responsivo y accesibilidad." : "Web performance, responsive design & accessibility."
    },
    {
      id: "02",
      role: language === "es" ? "Backend & Cloud Architecture" : "Backend & Cloud Architecture",
      badge: language === "es" ? "Sistemas & APIs" : "Systems & APIs",
      icon: Database,
      iconColor: "text-emerald-400",
      description: language === "es"
        ? "Diseño de modelos de datos, desarrollo de servicios REST y GraphQL, gestión de autenticación segura y optimización de consultas."
        : "Data modeling, REST & GraphQL service development, secure authentication management, and query optimization.",
      skills: ["Node.js", "PostgreSQL", "Cloudflare R2", "REST / GraphQL", "Python"],
      focus: language === "es" ? "Seguridad, escalabilidad e integridad de datos." : "Security, scalability & data integrity."
    },
    {
      id: "03",
      role: language === "es" ? "UI/UX & Product Design" : "UI/UX & Product Design",
      badge: language === "es" ? "Experiencia & Diseño" : "Experience & Design",
      icon: FigmaLogo,
      iconColor: "text-purple-400",
      description: language === "es"
        ? "Investigación de usuarios, diseño de sistemas de componentes modulares, maquetación de flujos de interacción y prototipado dinámico."
        : "User research, modular design systems development, interaction flows mapping, and dynamic prototyping.",
      skills: ["Design Systems", "Figma", "Micro-interacciones", "Wireframing", "WCAG"],
      focus: language === "es" ? "Usabilidad intuitiva, consistencia visual y ergonomía digital." : "Intuitive usability, visual consistency & digital ergonomics."
    },
    {
      id: "04",
      role: language === "es" ? "DevOps & Quality Assurance" : "DevOps & Quality Assurance",
      badge: language === "es" ? "CI/CD & Calidad" : "CI/CD & Quality",
      icon: GitBranch,
      iconColor: "text-amber-400",
      description: language === "es"
        ? "Automatización del ciclo de vida del software, pipelines de integración continua, pruebas automáticas y monitorización en producción."
        : "Software lifecycle automation, continuous integration pipelines, automated testing, and production monitoring.",
      skills: ["GitHub Actions", "Docker", "Vercel", "Unit Testing", "Auditorías Lighthouse"],
      focus: language === "es" ? "Despliegues sin interrupciones, estabilidad y monitoreo constante." : "Zero-downtime deploys, stability & continuous monitoring."
    }
  ];

  return (
    <section id="equipo" className="relative py-28 px-6 bg-transparent border-t border-zinc-900/50 font-sans">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
            <UsersThree size={14} weight="fill" />
            <span>{language === "es" ? "EQUIPO MULTIDISCIPLINARIO" : "MULTIDISCIPLINARY TEAM"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100">
            {language === "es" ? "Estructura del Equipo" : "Team Structure"}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            {language === "es"
              ? "Cada área del proyecto está respaldada por roles especializados que colaboran de manera integrada para garantizar calidad técnica, diseño coherente y entregas estables."
              : "Each area of the project is supported by specialized roles collaborating seamlessly to ensure technical excellence, coherent design, and stable deliveries."}
          </p>
        </div>

        {/* Team Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamRoles.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  designMode === "glass"
                    ? "glass-card hover:border-zinc-700/60"
                    : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:shadow-2xl"
                }`}
              >
                {/* Header: Icon, ID & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-xl shadow-inner">
                      <Icon className={member.iconColor} size={24} weight="duotone" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">
                        {member.badge}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">
                        {member.role}
                      </h3>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-600 font-semibold">
                    {member.id}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Focus / Value */}
                <div className="flex items-center gap-2 text-xs text-zinc-300 mb-6 bg-zinc-900/40 border border-zinc-850/60 px-3.5 py-2.5 rounded-lg">
                  <Sparkle size={14} className="text-blue-400 shrink-0" weight="fill" />
                  <span>
                    <strong className="text-zinc-200">{language === "es" ? "Enfoque:" : "Focus:"}</strong> {member.focus}
                  </span>
                </div>

                {/* Technology Skills */}
                <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-zinc-900/70 border border-zinc-800/80 rounded-md"
                    >
                      {skill}
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
