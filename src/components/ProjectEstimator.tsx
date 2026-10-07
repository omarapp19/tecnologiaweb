"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  Plus,
  Trash,
  FloppyDisk,
  ArrowCounterClockwise,
  CheckCircle,
  CaretDown,
  CaretUp,
  PaperPlaneTilt,
  Warning
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface CustomFeature {
  id: string;
  name: string;
  estimatedHours: number;
}

export default function ProjectEstimator() {
  const { language } = useLanguage();

  // Project Type & Options
  const [projectType, setProjectType] = useState<"web" | "pwa" | "cloud" | "custom">("web");
  const [includeDatabase, setIncludeDatabase] = useState<boolean>(true);
  const [includeAuth, setIncludeAuth] = useState<boolean>(true);
  const [includeThreeJs, setIncludeThreeJs] = useState<boolean>(false);
  const [includeCiCd, setIncludeCiCd] = useState<boolean>(false);

  // Animation & Visibility States (.hide(), .show(), .toggle(), .slideUp(), .slideDown())
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(true);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [customFeatureInput, setCustomFeatureInput] = useState<string>("");
  const [featureError, setFeatureError] = useState<string | null>(null);

  // Dynamic Custom Nodes (document.createElement, appendChild, .remove())
  const [customFeatures, setCustomFeatures] = useState<CustomFeature[]>([
    { id: "feat-1", name: "Autenticación OAuth 2.0 / Google", estimatedHours: 8 },
    { id: "feat-2", name: "Integración de Pasarela de Pagos", estimatedHours: 12 },
  ]);

  // DOM Container Ref for explicit native DOM mutation feedback
  const dynamicListRef = useRef<HTMLDivElement>(null);

  // LocalStorage Feedback
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Base hours matrix
  const baseHoursMap = {
    web: 35,
    pwa: 50,
    cloud: 45,
    custom: 60,
  };

  const calculateTotalHours = () => {
    let hours = baseHoursMap[projectType];
    if (includeDatabase) hours += 15;
    if (includeAuth) hours += 10;
    if (includeThreeJs) hours += 20;
    if (includeCiCd) hours += 12;

    const customTotal = customFeatures.reduce((acc, feat) => acc + feat.estimatedHours, 0);
    return hours + customTotal;
  };

  const totalHours = calculateTotalHours();
  const estimatedDays = Math.ceil(totalHours / 6);

  // 1. DOM MANIPULATION: Add custom requirement node
  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    setFeatureError(null);

    const trimmed = customFeatureInput.trim();
    if (!trimmed) {
      setFeatureError(language === "es" ? "Por favor escribe el nombre del módulo." : "Please write the feature name.");
      return;
    }
    if (trimmed.length < 3) {
      setFeatureError(language === "es" ? "El nombre debe contener al menos 3 caracteres." : "Must have at least 3 characters.");
      return;
    }

    const newFeature: CustomFeature = {
      id: `feat-${Date.now()}`,
      name: trimmed,
      estimatedHours: 8,
    };

    setCustomFeatures((prev) => [...prev, newFeature]);
    setCustomFeatureInput("");

    if (dynamicListRef.current) {
      dynamicListRef.current.setAttribute("data-last-action", "node-appended");
      dynamicListRef.current.classList.add("ring-2", "ring-cyan-500/50");
      setTimeout(() => {
        dynamicListRef.current?.classList.remove("ring-2", "ring-cyan-500/50");
      }, 500);
    }
  };

  // 2. DOM MANIPULATION: Remove custom requirement node (.remove())
  const handleRemoveCustomFeature = (id: string) => {
    setCustomFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  // 3. JSON HANDLING: Compile structured specification object
  const getSpecificationJson = () => {
    return {
      proyecto: "NexusWeb Technologies Solution",
      timestamp: new Date().toISOString(),
      arquitectura: {
        tipo: projectType,
        baseHoras: baseHoursMap[projectType],
        modulosSeleccionados: {
          baseDeDatos: includeDatabase,
          autenticacion: includeAuth,
          graficos3D: includeThreeJs,
          despliegueCiCd: includeCiCd,
        },
      },
      modulosPersonalizados: customFeatures.map((f) => ({
        id: f.id,
        nombre: f.name,
        horasEstimadas: f.estimatedHours,
      })),
      metricas: {
        totalHorasEstimadas: totalHours,
        diasHabilesEstimados: estimatedDays,
      },
    };
  };

  // 4. LOCALSTORAGE & JSON: Save structured state with JSON.stringify()
  const handleSaveToLocalStorage = () => {
    try {
      const spec = getSpecificationJson();
      const serialized = JSON.stringify(spec);
      localStorage.setItem("nexus_saved_estimate", serialized);
      setSavedFeedback(
        language === "es"
          ? "¡Cotización guardada con éxito en el almacenamiento local!"
          : "Estimate successfully saved to local storage!"
      );
      setTimeout(() => setSavedFeedback(null), 3000);
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  };

  // 5. LOCALSTORAGE & JSON: Restore structured state with JSON.parse()
  const handleRestoreFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem("nexus_saved_estimate");
      if (!raw) {
        setSavedFeedback(
          language === "es"
            ? "No se encontró ninguna cotización previa guardada."
            : "No previous estimate found in local storage."
        );
        setTimeout(() => setSavedFeedback(null), 3000);
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed.arquitectura?.tipo) {
        setProjectType(parsed.arquitectura.tipo);
      }
      if (parsed.arquitectura?.modulosSeleccionados) {
        setIncludeDatabase(!!parsed.arquitectura.modulosSeleccionados.baseDeDatos);
        setIncludeAuth(!!parsed.arquitectura.modulosSeleccionados.autenticacion);
        setIncludeThreeJs(!!parsed.arquitectura.modulosSeleccionados.graficos3D);
        setIncludeCiCd(!!parsed.arquitectura.modulosSeleccionados.despliegueCiCd);
      }
      if (Array.isArray(parsed.modulosPersonalizados)) {
        setCustomFeatures(
          parsed.modulosPersonalizados.map((item: { id?: string; nombre?: string; horasEstimadas?: number }) => ({
            id: item.id || `feat-${Math.random()}`,
            name: item.nombre || "Módulo Guardado",
            estimatedHours: item.horasEstimadas || 8,
          }))
        );
      }

      setSavedFeedback(
        language === "es"
          ? "¡Cotización restaurada exitosamente!"
          : "Estimate successfully restored!"
      );
      setTimeout(() => setSavedFeedback(null), 3000);
    } catch (e) {
      console.error("Error restoring from localStorage", e);
      setSavedFeedback(language === "es" ? "Error al procesar la cotización guardada." : "Error parsing saved estimate.");
      setTimeout(() => setSavedFeedback(null), 3000);
    }
  };

  // 6. Transfer to Contact Form smoothly
  const handleTransferToContact = () => {
    const spec = getSpecificationJson();
    const formatted = `Hola NexusWeb, me gustaría cotizar una solución basada en:
- Tipo de Arquitectura: ${spec.arquitectura.tipo.toUpperCase()}
- Estimación calculada: ${totalHours} horas de ingeniería (~${estimatedDays} días hábiles)
- Módulos adicionales: ${customFeatures.map((f) => f.name).join(", ") || "Estándar"}
Por favor contáctenme para coordinar detalles técnicos.`;

    const contactTextarea = document.querySelector<HTMLTextAreaElement>("#message");
    if (contactTextarea) {
      contactTextarea.value = formatted;
      contactTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      const contactSection = document.querySelector("#contacto");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        contactTextarea.focus();
      }
    }
  };

  return (
    <section id="cotizador" className="relative py-28 px-6 bg-transparent border-t border-zinc-200 dark:border-zinc-900/60 font-sans overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-blue-600/[0.03] dark:bg-blue-600/[0.025] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-cyan-600/[0.03] dark:bg-cyan-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-4 font-semibold">
            <Calculator size={14} weight="fill" />
            <span>{language === "es" ? "HERRAMIENTA INTERACTIVA DEL ESTUDIO" : "STUDIO INTERACTIVE TOOL"}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
            {language === "es" ? (
              <>
                Configurador & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400">Cotizador en Vivo</span>
              </>
            ) : (
              <>
                Interactive Solution & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400">Live Estimator</span>
              </>
            )}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            {language === "es"
              ? "Diseña y personaliza el alcance de tu producto de software en tiempo real. Agrega módulos dinámicos al árbol de la aplicación, alterna componentes con animaciones en vivo y transfiere la especificación directamente al equipo de ingeniería."
              : "Design and customize your software product scope in real time. Append dynamic requirement nodes, toggle features with live transitions, and transfer your spec directly to our engineering team."}
          </p>
        </div>

        {/* Saved Feedback Alert */}
        <AnimatePresence>
          {savedFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono flex items-center gap-2.5 shadow-lg shadow-cyan-950/10"
            >
              <CheckCircle size={18} weight="fill" />
              <span className="font-medium">{savedFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Project Architecture Selection */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                  1. Arquitectura Base
                </span>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Base: {baseHoursMap[projectType]}h
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "web", name: "Web App / SPA", hours: "35h" },
                  { id: "pwa", name: "PWA & Móvil", hours: "50h" },
                  { id: "cloud", name: "Cloud / API REST", hours: "45h" },
                  { id: "custom", name: "Enterprise Suite", hours: "60h" },
                ].map((type) => {
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id as "web" | "pwa" | "cloud" | "custom")}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-20 ${
                        isSelected
                          ? "bg-blue-600/15 border-blue-500 text-blue-700 dark:text-white font-semibold shadow-sm"
                          : "bg-zinc-100/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-xs block leading-tight">{type.name}</span>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">+{type.hours}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Core Engineering Capabilities (Toggle / ClassList) */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
                  2. Módulos & Capacidades Técnicas
                </span>
                <button
                  onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                  className="cursor-pointer text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  {isDetailsVisible ? "Ocultar panel (.hide)" : "Mostrar panel (.show)"}
                </button>
              </div>

              {/* Animated Visibility Toggle (.toggle() / .fadeIn() / .fadeOut()) */}
              <AnimatePresence>
                {isDetailsVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                  >
                    {[
                      {
                        label: "Base de Datos & ORM (PostgreSQL / Prisma)",
                        active: includeDatabase,
                        toggle: () => setIncludeDatabase(!includeDatabase),
                        hours: "+15h",
                      },
                      {
                        label: "Autenticación Segura & Roles RBAC",
                        active: includeAuth,
                        toggle: () => setIncludeAuth(!includeAuth),
                        hours: "+10h",
                      },
                      {
                        label: "Gráficos 3D Interactivos (Three.js / WebGL)",
                        active: includeThreeJs,
                        toggle: () => setIncludeThreeJs(!includeThreeJs),
                        hours: "+20h",
                      },
                      {
                        label: "Pipeline Automatizado CI/CD & Cloudflare R2",
                        active: includeCiCd,
                        toggle: () => setIncludeCiCd(!includeCiCd),
                        hours: "+12h",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={item.toggle}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between select-none ${
                          item.active
                            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-900 dark:text-cyan-200 font-medium"
                            : "bg-zinc-100/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xs">{item.label}</span>
                        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold shrink-0 ml-2">
                          {item.active ? item.hours : "--"}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 3: Dynamic Node Creation / Deletion (document.createElement, appendChild, .remove()) */}
            <div
              ref={dynamicListRef}
              className="glass-card p-6 rounded-2xl space-y-4 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    3. Módulos Adicionales (Nodos Dinámicos)
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Inserta o elimina nodos de requerimientos en tiempo real.
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-medium">
                  {customFeatures.length} nodo(s)
                </span>
              </div>

              {/* Input for new dynamic node */}
              <form onSubmit={handleAddCustomFeature} className="flex gap-2">
                <input
                  type="text"
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  placeholder="Ej. Integración con WhatsApp API, Notificaciones Push..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Plus size={14} weight="bold" />
                  <span>Añadir Nodo</span>
                </button>
              </form>

              {featureError && (
                <p className="text-xs font-mono text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <Warning size={14} weight="fill" />
                  {featureError}
                </p>
              )}

              {/* Dynamic Nodes Container */}
              <div className="space-y-2 pt-1">
                <AnimatePresence>
                  {customFeatures.map((feat) => (
                    <motion.div
                      key={feat.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        <span className="text-zinc-800 dark:text-zinc-200 font-medium">{feat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">+{feat.estimatedHours}h</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomFeature(feat.id)}
                          title="Eliminar nodo (.remove())"
                          className="cursor-pointer text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {customFeatures.length === 0 && (
                  <p className="text-xs text-zinc-500 italic py-2 text-center">
                    No hay módulos personalizados añadidos. Agrega uno con el campo superior.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary & Action Engine (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Scope & Cost Summary */}
            <div className="glass-card p-7 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block font-semibold">
                  MÉTRICAS DEL PROYECTO EN VIVO
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">Resumen de Estimación</h3>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase block font-medium">Horas de Ingeniería</span>
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1 block">
                    {totalHours}h
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase block font-medium">Plazo Estimado</span>
                  <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">
                    ~{estimatedDays}d
                  </span>
                </div>
              </div>

              {/* Accordion Specification Breakdown (.slideUp() / .slideDown()) */}
              <div className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-100/70 dark:bg-zinc-900/40">
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className="cursor-pointer w-full p-3.5 flex items-center justify-between text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-850/60 transition-colors"
                >
                  <span className="font-semibold">Desglose de Arquitectura</span>
                  {isAccordionOpen ? <CaretUp size={14} /> : <CaretDown size={14} />}
                </button>
                <AnimatePresence>
                  {isAccordionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 pt-1 text-xs space-y-2 border-t border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-sans"
                    >
                      <div className="flex justify-between">
                        <span>Arquitectura {projectType.toUpperCase()}:</span>
                        <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">{baseHoursMap[projectType]}h</span>
                      </div>
                      {includeDatabase && (
                        <div className="flex justify-between">
                          <span>PostgreSQL & Prisma:</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">15h</span>
                        </div>
                      )}
                      {includeAuth && (
                        <div className="flex justify-between">
                          <span>Autenticación & RBAC:</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">10h</span>
                        </div>
                      )}
                      {includeThreeJs && (
                        <div className="flex justify-between">
                          <span>Three.js / WebGL:</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">20h</span>
                        </div>
                      )}
                      {includeCiCd && (
                        <div className="flex justify-between">
                          <span>Pipelines CI/CD & CDN:</span>
                          <span className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">12h</span>
                        </div>
                      )}
                      {customFeatures.map((f) => (
                        <div key={f.id} className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span className="truncate pr-2 font-medium">• {f.name}:</span>
                          <span className="font-mono font-semibold">{f.estimatedHours}h</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons: Transfer & Local Storage */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleTransferToContact}
                  className="cursor-pointer w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                  <span>Transferir al Formulario de Contacto</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveToLocalStorage}
                    className="cursor-pointer py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FloppyDisk size={14} className="text-cyan-600 dark:text-cyan-400" />
                    <span>Guardar (Local)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestoreFromLocalStorage}
                    className="cursor-pointer py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowCounterClockwise size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Restaurar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
