"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  Plus,
  Trash,
  ArrowCounterClockwise,
  CheckCircle,
  CaretDown,
  CaretUp,
  PaperPlaneTilt,
  Warning,
  Database,
  WhatsappLogo,
  Copy,
  Check,
  Sparkle,
  Cpu,
  ShieldCheck,
  CreditCard,
  Cube,
  Globe,
  Rocket,
  Fire,
  Clock,
  ChartPie,
  ListChecks,
  Folder,
  X
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { useDesign } from "@/context/DesignContext";

export interface CustomFeature {
  id: string;
  name: string;
  complexity: "simple" | "medium" | "complex";
  estimatedHours: number;
}

interface SavedDbEstimate {
  id: string;
  project_type: string;
  total_hours: number;
  estimated_days: number;
  modules_json: string;
  custom_features_json: string;
  raw_specification?: string;
  created_at: string;
  status: string;
}

const baseHoursMap: Record<"web" | "pwa" | "cloud" | "custom", number> = {
  web: 35,
  pwa: 50,
  cloud: 45,
  custom: 60,
};

const moduleHoursMap = {
  database: 15,
  auth: 10,
  payments: 14,
  threeJs: 20,
  customUi: 12,
  i18n: 8,
  ciCd: 12,
  aiIntegration: 18,
  adminCms: 16,
  seoPerformance: 8,
};

const complexityHoursMap: Record<"simple" | "medium" | "complex", number> = {
  simple: 4,
  medium: 8,
  complex: 16,
};

const rateMap: Record<"startup" | "standard" | "enterprise", { USD: number; EUR: number }> = {
  startup: { USD: 25, EUR: 23 },
  standard: { USD: 35, EUR: 32 },
  enterprise: { USD: 50, EUR: 46 },
};

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


export default function ProjectEstimator() {
  const { language } = useLanguage();
  const { designMode } = useDesign();

  // 1. Architecture & Delivery Mode
  const [projectType, setProjectType] = useState<"web" | "pwa" | "cloud" | "custom">("web");
  const [deliveryMode, setDeliveryMode] = useState<"mvp" | "standard" | "rush">("standard");

  // 2. Budget & Currency settings
  const [budgetTier, setBudgetTier] = useState<"startup" | "standard" | "enterprise">("standard");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");

  // 3. Modular Engineering Capabilities
  const [modules, setModules] = useState({
    // Backend & Data
    database: true,
    auth: true,
    payments: false,
    // Frontend & UX
    threeJs: false,
    customUi: true,
    i18n: false,
    // Cloud, AI & DevOps
    ciCd: true,
    aiIntegration: false,
    adminCms: false,
    seoPerformance: true,
  });

  // Active category tab for module configuration
  const [moduleCategoryTab, setModuleCategoryTab] = useState<"all" | "backend" | "frontend" | "cloud">("all");

  // 4. Dynamic Custom Nodes
  const [customFeatures, setCustomFeatures] = useState<CustomFeature[]>([
    { id: "feat-1", name: "Autenticación OAuth 2.0 / Google", complexity: "medium", estimatedHours: 8 },
    { id: "feat-2", name: "Integración de Pasarela de Pagos", complexity: "complex", estimatedHours: 14 },
  ]);

  const [customFeatureInput, setCustomFeatureInput] = useState<string>("");
  const [customComplexity, setCustomComplexity] = useState<"simple" | "medium" | "complex">("medium");
  const [featureError, setFeatureError] = useState<string | null>(null);

  // 5. UI Toggles & Drawers
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [savedDbEstimates, setSavedDbEstimates] = useState<SavedDbEstimate[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // 6. Feedback Alerts
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSavingDb, setIsSavingDb] = useState<boolean>(false);

  const dynamicListRef = useRef<HTMLDivElement>(null);

  // Calculations
  const calculatedStats = useMemo(() => {
    let base = baseHoursMap[projectType];
    if (deliveryMode === "mvp") {
      base = Math.round(base * 0.85); // 15% lighter scope
    }

    // Sum active modules
    let modulesTotal = 0;
    (Object.keys(modules) as Array<keyof typeof modules>).forEach((key) => {
      if (modules[key]) {
        modulesTotal += moduleHoursMap[key];
      }
    });

    // Sum custom features
    const customTotal = customFeatures.reduce((acc, feat) => acc + feat.estimatedHours, 0);

    const totalHours = base + modulesTotal + customTotal;

    // Delivery days calculation
    let estimatedDays = Math.ceil(totalHours / 6);
    if (deliveryMode === "rush") {
      estimatedDays = Math.max(3, Math.ceil(estimatedDays * 0.6)); // Fast-track with parallel resources
    }

    // Cost estimation
    const rate = rateMap[budgetTier][currency];
    const rushMultiplier = deliveryMode === "rush" ? 1.2 : 1.0;
    const minBudget = Math.round(totalHours * rate * 0.95 * rushMultiplier);
    const maxBudget = Math.round(totalHours * rate * 1.15 * rushMultiplier);

    // Effort distribution percentages
    const feHours = (modules.threeJs ? 20 : 0) + (modules.customUi ? 12 : 0) + (modules.i18n ? 8 : 0) + (projectType === "web" || projectType === "pwa" ? 20 : 10);
    const beHours = (modules.database ? 15 : 0) + (modules.auth ? 10 : 0) + (modules.payments ? 14 : 0) + (projectType === "cloud" ? 25 : 15);
    const infraHours = (modules.ciCd ? 12 : 0) + (modules.aiIntegration ? 18 : 0) + (modules.adminCms ? 16 : 0) + (modules.seoPerformance ? 8 : 0) + 10;
    const customH = customTotal;

    const sumDistribution = feHours + beHours + infraHours + customH;
    const fePercent = Math.round((feHours / sumDistribution) * 100);
    const bePercent = Math.round((beHours / sumDistribution) * 100);
    const infraPercent = Math.round((infraHours / sumDistribution) * 100);
    const customPercent = Math.max(0, 100 - (fePercent + bePercent + infraPercent));

    return {
      baseHours: base,
      modulesTotal,
      customTotal,
      totalHours,
      estimatedDays,
      minBudget,
      maxBudget,
      distribution: {
        frontend: fePercent,
        backend: bePercent,
        infra: infraPercent,
        custom: customPercent,
      },
    };
  }, [projectType, deliveryMode, modules, customFeatures, budgetTier, currency]);

  // Fetch Database Estimates History
  const fetchDbHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/estimates");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setSavedDbEstimates(json.data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch database estimates", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchDbHistory();
  }, [fetchDbHistory]);

  // Auto-clear feedback after 4.5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add Custom Feature Node
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
      complexity: customComplexity,
      estimatedHours: complexityHoursMap[customComplexity],
    };

    setCustomFeatures((prev) => [...prev, newFeature]);
    setCustomFeatureInput("");

    if (dynamicListRef.current) {
      dynamicListRef.current.classList.add("ring-2", "ring-cyan-500/50");
      setTimeout(() => {
        dynamicListRef.current?.classList.remove("ring-2", "ring-cyan-500/50");
      }, 500);
    }
  };

  const handleRemoveCustomFeature = (id: string) => {
    setCustomFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  // Generate structured payload
  const getSpecificationPayload = useCallback(() => {
    return {
      project_type: projectType,
      total_hours: calculatedStats.totalHours,
      estimated_days: calculatedStats.estimatedDays,
      modules: {
        ...modules,
        deliveryMode,
        budgetTier,
        currency,
        minBudget: calculatedStats.minBudget,
        maxBudget: calculatedStats.maxBudget,
      },
      custom_features: customFeatures,
      raw_specification: {
        project: "NexusWeb Technologies Architecture Spec",
        timestamp: new Date().toISOString(),
        details: {
          projectType,
          deliveryMode,
          budgetTier,
          currency,
          totalHours: calculatedStats.totalHours,
          estimatedDays: calculatedStats.estimatedDays,
        },
      },
    };
  }, [projectType, calculatedStats, modules, deliveryMode, budgetTier, currency, customFeatures]);

  // SAVE TO DATABASE
  const handleSaveToDatabase = async () => {
    setIsSavingDb(true);
    const payload = getSpecificationPayload();

    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      localStorage.setItem("nexus_saved_estimate", JSON.stringify(payload));

      if (res.ok) {
        setFeedback({
          type: "success",
          message:
            language === "es"
              ? "¡Cotización guardada exitosamente en la base de datos SQLite!"
              : "Estimate successfully saved to the SQLite database!",
        });
        fetchDbHistory();
      } else {
        setFeedback({
          type: "success",
          message:
            language === "es"
              ? "Cotización guardada en el almacenamiento local."
              : "Estimate saved to local browser storage.",
        });
      }
    } catch {
      localStorage.setItem("nexus_saved_estimate", JSON.stringify(payload));
      setFeedback({
        type: "success",
        message:
          language === "es"
            ? "Cotización respaldada en almacenamiento local."
            : "Estimate backed up to local storage.",
      });
    } finally {
      setIsSavingDb(false);
    }
  };

  // RESTORE FROM SAVED SPEC
  const restoreSpecification = (savedData: {
    project_type?: "web" | "pwa" | "cloud" | "custom";
    modules?: Record<string, unknown>;
    custom_features?: CustomFeature[];
  }) => {
    if (savedData.project_type) {
      setProjectType(savedData.project_type);
    }

    if (savedData.modules) {
      const m = savedData.modules;
      setModules({
        database: Boolean(m.database),
        auth: Boolean(m.auth),
        payments: Boolean(m.payments),
        threeJs: Boolean(m.threeJs),
        customUi: Boolean(m.customUi),
        i18n: Boolean(m.i18n),
        ciCd: Boolean(m.ciCd),
        aiIntegration: Boolean(m.aiIntegration),
        adminCms: Boolean(m.adminCms),
        seoPerformance: Boolean(m.seoPerformance),
      });

      if (m.deliveryMode === "mvp" || m.deliveryMode === "standard" || m.deliveryMode === "rush") {
        setDeliveryMode(m.deliveryMode);
      }
      if (m.budgetTier === "startup" || m.budgetTier === "standard" || m.budgetTier === "enterprise") {
        setBudgetTier(m.budgetTier);
      }
      if (m.currency === "USD" || m.currency === "EUR") {
        setCurrency(m.currency);
      }
    }

    if (Array.isArray(savedData.custom_features)) {
      setCustomFeatures(
        savedData.custom_features.map((item) => ({
          id: item.id || `feat-${Math.random()}`,
          name: item.name || "Módulo Personalizado",
          complexity: item.complexity || "medium",
          estimatedHours: item.estimatedHours || 8,
        }))
      );
    }

    setFeedback({
      type: "success",
      message:
        language === "es"
          ? "¡Cotización restaurada con éxito!"
          : "Estimate successfully restored!",
    });
  };

  // RESTORE LATEST FROM DATABASE OR LOCALSTORAGE
  const handleRestoreLatest = async () => {
    try {
      const res = await fetch("/api/estimates?latest=true");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const row: SavedDbEstimate = json.data;
          restoreSpecification({
            project_type: row.project_type as "web" | "pwa" | "cloud" | "custom",
            modules: JSON.parse(row.modules_json || "{}"),
            custom_features: JSON.parse(row.custom_features_json || "[]"),
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Could not restore from DB API", e);
    }

    // Local fallback
    const rawLocal = localStorage.getItem("nexus_saved_estimate");
    if (rawLocal) {
      try {
        const parsed = JSON.parse(rawLocal);
        restoreSpecification(parsed);
        return;
      } catch (err) {
        console.warn("Failed parsing localStorage estimate", err);
      }
    }

    setFeedback({
      type: "error",
      message:
        language === "es"
          ? "No se encontró ninguna cotización guardada previamente."
          : "No previously saved estimate found.",
    });
  };

  // DELETE ESTIMATE FROM DATABASE
  const handleDeleteDbEstimate = async (id: string) => {
    try {
      await fetch(`/api/estimates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setSavedDbEstimates((prev) => prev.filter((item) => item.id !== id));
      setFeedback({
        type: "success",
        message: language === "es" ? "Registro eliminado de la base de datos." : "Record deleted from database.",
      });
    } catch (e) {
      console.error("Error deleting estimate from DB", e);
    }
  };

  // FORMAT SUMMARY FOR EXPORT & SHARING
  const formattedQuoteText = useMemo(() => {
    const activeModuleNames = [
      modules.database ? "Base de Datos & ORM (15h)" : null,
      modules.auth ? "Autenticación & RBAC (10h)" : null,
      modules.payments ? "Pasarela de Pagos (14h)" : null,
      modules.threeJs ? "Gráficos 3D WebGL (20h)" : null,
      modules.customUi ? "UI/UX & Micro-interacciones (12h)" : null,
      modules.i18n ? "Multilenguaje i18n (8h)" : null,
      modules.ciCd ? "Pipelines CI/CD & Cloudflare (12h)" : null,
      modules.aiIntegration ? "Integración de IA & LLMs (18h)" : null,
      modules.adminCms ? "Panel CMS Admin (16h)" : null,
      modules.seoPerformance ? "Optimización SEO Core Web Vitals (8h)" : null,
    ].filter(Boolean);

    return `🏛️ NEXUSWEB TECHNOLOGIES - ESPECIFICACIÓN DE PROYECTO
--------------------------------------------------
• Tipo de Solución: ${projectType.toUpperCase()}
• Modalidad: ${deliveryMode.toUpperCase()}
• Nivel de Tarifa: ${budgetTier.toUpperCase()}
• Horas de Ingeniería: ${calculatedStats.totalHours} horas estimadas
• Plazo de Entrega: ~${calculatedStats.estimatedDays} días hábiles
• Inversión Estimada: ${currency === "USD" ? "$" : "€"}${formatNumber(calculatedStats.minBudget)} - ${currency === "USD" ? "$" : "€"}${formatNumber(calculatedStats.maxBudget)} ${currency}

📦 Módulos Seleccionados:
${activeModuleNames.map((m) => `  ✓ ${m}`).join("\n")}
${customFeatures.length > 0 ? `\n🧩 Módulos Personalizados:\n${customFeatures.map((f) => `  + ${f.name} (+${f.estimatedHours}h)`).join("\n")}` : ""}
--------------------------------------------------
Generado en: https://nexusweb.dev`;
  }, [projectType, deliveryMode, budgetTier, currency, calculatedStats, modules, customFeatures]);

  // ACTION: Transfer to Contact Form
  const handleTransferToContact = () => {
    const contactTextarea = document.querySelector<HTMLTextAreaElement>("#message");
    if (contactTextarea) {
      contactTextarea.value = formattedQuoteText;
      contactTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      const contactSection = document.querySelector("#contacto");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        contactTextarea.focus();
      }
    }
  };

  // ACTION: Open WhatsApp with Quote
  const handleSendToWhatsApp = () => {
    const phoneNumber = "584246434673"; // From public/datos
    const encoded = encodeURIComponent(
      `¡Hola Omar y equipo de NexusWeb! 👋\nAcabo de configurar una solución en su Cotizador en Vivo y me gustaría agendar una llamada:\n\n${formattedQuoteText}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
  };

  // ACTION: Copy to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedQuoteText);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2500);
    } catch (e) {
      console.warn("Could not copy quote to clipboard", e);
    }
  };

  return (
    <section id="cotizador" className="relative py-28 px-6 bg-transparent border-t border-zinc-200 dark:border-zinc-900/60 font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-blue-600/[0.03] dark:bg-blue-600/[0.025] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-cyan-600/[0.03] dark:bg-cyan-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-4 font-semibold">
            <Calculator size={14} weight="fill" />
            <span>{language === "es" ? "CONFIGURADOR & COTIZADOR EN VIVO" : "LIVE SOLUTION ESTIMATOR"}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
            {language === "es" ? (
              <>
                Arquitectura de Software & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400">Presupuesto en Tiempo Real</span>
              </>
            ) : (
              <>
                Software Architecture & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400">Real-Time Scope</span>
              </>
            )}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            {language === "es"
              ? "Modela el alcance técnico de tu producto. Añade capacidades modulares, ajusta el ritmo de entrega y obtén estimaciones precisas de horas de ingeniería e inversión con persistencia en base de datos."
              : "Model the technical scope of your product. Add modular capabilities, adjust delivery pace, and calculate engineering hours and investment ranges with database persistence."}
          </p>
        </div>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-4 rounded-xl text-xs font-mono flex items-center justify-between shadow-lg ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-emerald-950/10"
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 shadow-rose-950/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {feedback.type === "success" ? (
                  <CheckCircle size={18} weight="fill" className="text-emerald-500 shrink-0" />
                ) : (
                  <Warning size={18} weight="fill" className="text-rose-500 shrink-0" />
                )}
                <span className="font-medium">{feedback.message}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Controls & Architectural Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Solution Architecture & Delivery Mode */}
            <div className={`${designMode === "neo" ? "neo-card" : "glass-card"} p-6 rounded-2xl space-y-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                    {language === "es" ? "Tipo de Solución & Arquitectura Base" : "Solution Type & Architecture"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                  Base: {calculatedStats.baseHours}h
                </span>
              </div>

              {/* 4 Architecture Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "web", name: "Web App / SPA", hours: "35h", desc: "Next.js 16 + React 19" },
                  { id: "pwa", name: "PWA & Móvil", hours: "50h", desc: "Offline + App Móvil" },
                  { id: "cloud", name: "Cloud & APIs", hours: "45h", desc: "Microservicios Edge" },
                  { id: "custom", name: "Enterprise Suite", hours: "60h", desc: "SaaS Completo" },
                ].map((type) => {
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id as "web" | "pwa" | "cloud" | "custom")}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                        isSelected
                          ? "bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-200 font-semibold shadow-xs"
                          : "bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block leading-tight">{type.name}</span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">{type.desc}</span>
                      </div>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">+{type.hours}</span>
                    </button>
                  );
                })}
              </div>

              {/* Delivery Rhythm / Timeline Urgency Selector */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/70">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-2 font-medium">
                  {language === "es" ? "Modalidad de Entrega:" : "Delivery Pace:"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "mvp", label: "MVP Ágil", icon: Rocket, note: "-15% alcance", color: "text-amber-500" },
                    { id: "standard", label: "Estándar", icon: Clock, note: "Recomendado", color: "text-blue-500" },
                    { id: "rush", label: "Acelerado", icon: Fire, note: "+20% recursos", color: "text-rose-500" },
                  ].map((mode) => {
                    const isSelected = deliveryMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setDeliveryMode(mode.id as "mvp" | "standard" | "rush")}
                        className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white font-bold shadow-xs"
                            : "bg-white/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <Icon size={14} className={mode.color} weight="fill" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 2: Modular Engineering Capabilities */}
            <div className={`${designMode === "neo" ? "neo-card" : "glass-card"} p-6 rounded-2xl space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">2</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
                    {language === "es" ? "Módulos & Capacidades de Ingeniería" : "Engineering Modules & Features"}
                  </span>
                </div>
                {/* Category filters */}
                <div className="flex items-center gap-1 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {(["all", "backend", "frontend", "cloud"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModuleCategoryTab(tab)}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        moduleCategoryTab === tab
                          ? "bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 font-semibold shadow-2xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  {
                    key: "database" as const,
                    category: "backend",
                    label: "Base de Datos & ORM (Postgres/SQLite)",
                    desc: "Modelado relacional y migraciones",
                    hours: "+15h",
                    icon: Database,
                  },
                  {
                    key: "auth" as const,
                    category: "backend",
                    label: "Autenticación Segura & Roles RBAC",
                    desc: "OAuth 2.0, JWT, sesiones y permisos",
                    hours: "+10h",
                    icon: ShieldCheck,
                  },
                  {
                    key: "payments" as const,
                    category: "backend",
                    label: "Pasarela de Pagos (Stripe / PayPal)",
                    desc: "Checkouts y webhooks de cobro",
                    hours: "+14h",
                    icon: CreditCard,
                  },
                  {
                    key: "threeJs" as const,
                    category: "frontend",
                    label: "Gráficos 3D Interactivos (Three.js)",
                    desc: "Renderizado WebGL acelerado por GPU",
                    hours: "+20h",
                    icon: Cube,
                  },
                  {
                    key: "customUi" as const,
                    category: "frontend",
                    label: "Diseño UI/UX a Medida & Motion",
                    desc: "Micro-interacciones y design system",
                    hours: "+12h",
                    icon: Sparkle,
                  },
                  {
                    key: "i18n" as const,
                    category: "frontend",
                    label: "Internacionalización Multilingüe (i18n)",
                    desc: "Selector dinámico de idiomas",
                    hours: "+8h",
                    icon: Globe,
                  },
                  {
                    key: "ciCd" as const,
                    category: "cloud",
                    label: "Pipeline CI/CD & CDN Cloudflare R2",
                    desc: "Despliegues automatizados sin caída",
                    hours: "+12h",
                    icon: Rocket,
                  },
                  {
                    key: "aiIntegration" as const,
                    category: "cloud",
                    label: "Integración de IA / LLMs & Agentes",
                    desc: "Asistentes y análisis inteligente",
                    hours: "+18h",
                    icon: Cpu,
                  },
                  {
                    key: "adminCms" as const,
                    category: "cloud",
                    label: "Panel Administrativo / CMS a Medida",
                    desc: "Gestión de usuarios y métricas",
                    hours: "+16h",
                    icon: ListChecks,
                  },
                  {
                    key: "seoPerformance" as const,
                    category: "cloud",
                    label: "Auditoría SEO & Core Web Vitals 95+",
                    desc: "Optimización extrema de carga",
                    hours: "+8h",
                    icon: CheckCircle,
                  },
                ]
                  .filter((item) => moduleCategoryTab === "all" || item.category === moduleCategoryTab)
                  .map((item) => {
                    const active = modules[item.key];
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleModule(item.key)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between select-none ${
                          active
                            ? "bg-cyan-500/10 border-cyan-500/60 text-cyan-950 dark:text-cyan-200 font-medium shadow-xs"
                            : "bg-white/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={18} className={active ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-400"} weight={active ? "fill" : "regular"} />
                          <div>
                            <span className="text-xs font-semibold block leading-tight">{item.label}</span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">{item.desc}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold shrink-0 ml-2">
                          {active ? item.hours : "--"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* STEP 3: Dynamic Custom Node Creation with Complexity Selector */}
            <div
              ref={dynamicListRef}
              className={`${designMode === "neo" ? "neo-card" : "glass-card"} p-6 rounded-2xl space-y-4 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center justify-center">3</span>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                      {language === "es" ? "Módulos a Medida (Nodos Dinámicos)" : "Custom Nodes & Features"}
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {language === "es" ? "Agrega requerimientos específicos y calibra su complejidad." : "Add specific requirements with customizable complexity."}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-semibold">
                  {customFeatures.length} nodo(s)
                </span>
              </div>

              {/* Form to insert custom node */}
              <form onSubmit={handleAddCustomFeature} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  placeholder="Ej. Integración con WhatsApp API, Notificaciones Push..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <div className="flex gap-1.5">
                  {(["simple", "medium", "complex"] as const).map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setCustomComplexity(comp)}
                      className={`px-2.5 py-2 rounded-xl text-[10px] font-mono border cursor-pointer transition-colors ${
                        customComplexity === comp
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {comp === "simple" ? "4h" : comp === "medium" ? "8h" : "16h"}
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                  >
                    <Plus size={14} weight="bold" />
                    <span>{language === "es" ? "Añadir" : "Add"}</span>
                  </button>
                </div>
              </form>

              {featureError && (
                <p className="text-xs font-mono text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <Warning size={14} weight="fill" />
                  {featureError}
                </p>
              )}

              {/* Active custom nodes */}
              <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
                <AnimatePresence>
                  {customFeatures.map((feat) => (
                    <motion.div
                      key={feat.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-zinc-800 dark:text-zinc-200 font-medium">{feat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+{feat.estimatedHours}h</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomFeature(feat.id)}
                          title="Eliminar nodo"
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
                    {language === "es" ? "No hay módulos personalizados añadidos." : "No custom modules added yet."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Metrics Engine & Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Scope & Investment Card */}
            <div className={`${designMode === "neo" ? "neo-card" : "glass-card"} p-7 rounded-2xl relative overflow-hidden shadow-xl space-y-6`}>
              <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                    {language === "es" ? "MÉTRICAS DEL PROYECTO EN VIVO" : "LIVE PROJECT METRICS"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrency(currency === "USD" ? "EUR" : "USD")}
                      className="cursor-pointer text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold hover:border-blue-500 transition-colors"
                    >
                      {currency}
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  {language === "es" ? "Resumen de Estimación" : "Estimation Summary"}
                </h3>
              </div>

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white/90 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase block font-semibold">
                    {language === "es" ? "Horas de Ingeniería" : "Engineering Hours"}
                  </span>
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1 block">
                    {calculatedStats.totalHours}h
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/90 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase block font-semibold">
                    {language === "es" ? "Plazo Estimado" : "Estimated Timeline"}
                  </span>
                  <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">
                    ~{calculatedStats.estimatedDays}d
                  </span>
                </div>
              </div>

              {/* Financial Range Card with Tier Selector */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                    {language === "es" ? "Inversión Estimada" : "Estimated Budget"}
                  </span>
                  {/* Budget tier selector */}
                  <div className="flex gap-1 text-[9px] font-mono">
                    {(["startup", "standard", "enterprise"] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setBudgetTier(tier)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          budgetTier === tier
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {tier === "startup" ? "Tier 1" : tier === "standard" ? "Tier 2" : "Tier 3"}
                      </button>
                    ))}
                  </div>
                </div>

                <div suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">
                  {currency === "USD" ? "$" : "€"}{formatNumber(calculatedStats.minBudget)} &ndash; {currency === "USD" ? "$" : "€"}{formatNumber(calculatedStats.maxBudget)} <span className="text-xs font-normal text-zinc-500">{currency}</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  {language === "es"
                    ? "*Cálculo referencial según complejidad y tarifas del estudio."
                    : "*Indicative estimate based on project scope and studio rates."}
                </p>
              </div>

              {/* Effort Distribution Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <ChartPie size={13} className="text-blue-500" />
                    {language === "es" ? "Distribución del Esfuerzo:" : "Effort Distribution:"}
                  </span>
                </div>

                {/* Segmented bar */}
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex">
                  <div style={{ width: `${calculatedStats.distribution.frontend}%` }} className="bg-blue-500 h-full" title={`Frontend: ${calculatedStats.distribution.frontend}%`} />
                  <div style={{ width: `${calculatedStats.distribution.backend}%` }} className="bg-cyan-500 h-full" title={`Backend: ${calculatedStats.distribution.backend}%`} />
                  <div style={{ width: `${calculatedStats.distribution.infra}%` }} className="bg-purple-500 h-full" title={`Infra & IA: ${calculatedStats.distribution.infra}%`} />
                  <div style={{ width: `${calculatedStats.distribution.custom}%` }} className="bg-emerald-500 h-full" title={`Personalizados: ${calculatedStats.distribution.custom}%`} />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 pt-0.5">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> FE ({calculatedStats.distribution.frontend}%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> BE ({calculatedStats.distribution.backend}%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Cloud/IA ({calculatedStats.distribution.infra}%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Custom ({calculatedStats.distribution.custom}%)</span>
                </div>
              </div>

              {/* Architecture Breakdown Accordion */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white/70 dark:bg-zinc-900/40">
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className="cursor-pointer w-full p-3.5 flex items-center justify-between text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850/60 transition-colors"
                >
                  <span className="font-semibold">{language === "es" ? "Desglose Detallado" : "Detailed Breakdown"}</span>
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
                        <span>Base {projectType.toUpperCase()} ({deliveryMode}):</span>
                        <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{calculatedStats.baseHours}h</span>
                      </div>
                      {modules.database && <div className="flex justify-between"><span>Base de Datos & ORM:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">15h</span></div>}
                      {modules.auth && <div className="flex justify-between"><span>Autenticación & RBAC:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">10h</span></div>}
                      {modules.payments && <div className="flex justify-between"><span>Pasarela de Pagos:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">14h</span></div>}
                      {modules.threeJs && <div className="flex justify-between"><span>Three.js / WebGL 3D:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">20h</span></div>}
                      {modules.customUi && <div className="flex justify-between"><span>UI/UX & Animaciones:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">12h</span></div>}
                      {modules.i18n && <div className="flex justify-between"><span>Multilenguaje i18n:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">8h</span></div>}
                      {modules.ciCd && <div className="flex justify-between"><span>CI/CD & Cloudflare:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">12h</span></div>}
                      {modules.aiIntegration && <div className="flex justify-between"><span>Integración de IA:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">18h</span></div>}
                      {modules.adminCms && <div className="flex justify-between"><span>Panel CMS Admin:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">16h</span></div>}
                      {modules.seoPerformance && <div className="flex justify-between"><span>SEO & Core Web Vitals:</span><span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">8h</span></div>}
                      {customFeatures.map((f) => (
                        <div key={f.id} className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span className="truncate pr-2 font-medium">• {f.name}:</span>
                          <span className="font-mono font-bold">+{f.estimatedHours}h</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTION ENGINE: Transfer, WhatsApp, Copy, Save to DB */}
              <div className="space-y-2.5 pt-1">
                {/* Primary: Transfer to Contact Form */}
                <button
                  type="button"
                  onClick={handleTransferToContact}
                  className="tap-feedback cursor-pointer w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                  <span>{language === "es" ? "Transferir a Formulario de Contacto" : "Transfer to Contact Form"}</span>
                </button>

                {/* Secondary: WhatsApp Direct */}
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="tap-feedback cursor-pointer w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <WhatsappLogo size={17} weight="fill" />
                  <span>{language === "es" ? "Cotizar Directo por WhatsApp" : "Instant Quote on WhatsApp"}</span>
                </button>

                {/* Row of Secondary Actions: Copy & Database Save/Restore */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="cursor-pointer py-2 px-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedQuote ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copiedQuote ? (language === "es" ? "Copiado!" : "Copied!") : (language === "es" ? "Copiar" : "Copy")}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingDb}
                    onClick={handleSaveToDatabase}
                    className="cursor-pointer py-2 px-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Database size={14} className="text-cyan-600 dark:text-cyan-400" weight="duotone" />
                    <span>{isSavingDb ? "..." : (language === "es" ? "Guardar BD" : "Save DB")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestoreLatest}
                    className="cursor-pointer py-2 px-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowCounterClockwise size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>{language === "es" ? "Restaurar" : "Restore"}</span>
                  </button>
                </div>

                {/* History Drawer Trigger */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      fetchDbHistory();
                      setIsHistoryModalOpen(true);
                    }}
                    className="cursor-pointer text-[11px] font-mono text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Folder size={13} />
                    <span>{language === "es" ? `Ver Historial de Cotizaciones en BD (${savedDbEstimates.length})` : `View Database Estimates History (${savedDbEstimates.length})`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATABASE ESTIMATES HISTORY MODAL */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col font-sans"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Database size={16} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      {language === "es" ? "Historial de Cotizaciones (SQLite DB)" : "Saved Estimates (SQLite DB)"}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {savedDbEstimates.length} {language === "es" ? "registros almacenados" : "stored records"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {loadingHistory ? (
                  <p className="text-xs text-zinc-500 font-mono py-8 text-center">{language === "es" ? "Cargando registros..." : "Loading records..."}</p>
                ) : savedDbEstimates.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs">
                    <Folder size={32} className="mx-auto mb-2 opacity-50" />
                    <p>{language === "es" ? "Aún no hay cotizaciones guardadas en la base de datos." : "No estimates saved in database yet."}</p>
                  </div>
                ) : (
                  savedDbEstimates.map((item) => {
                    let parsedModules: Record<string, unknown> = {};
                    let parsedCustom: CustomFeature[] = [];
                    try {
                      parsedModules = JSON.parse(item.modules_json || "{}");
                      parsedCustom = JSON.parse(item.custom_features_json || "[]");
                    } catch {}

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {item.project_type.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {new Date(item.created_at).toLocaleString(language === "es" ? "es-ES" : "en-US")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                            <span><strong>{item.total_hours}h</strong> de ingeniería</span>
                            <span>&bull;</span>
                            <span>~<strong>{item.estimated_days}d</strong> hábiles</span>
                            {parsedCustom.length > 0 && (
                              <>
                                <span>&bull;</span>
                                <span className="text-emerald-600 dark:text-emerald-400">+{parsedCustom.length} a medida</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              restoreSpecification({
                                project_type: item.project_type as "web" | "pwa" | "cloud" | "custom",
                                modules: parsedModules,
                                custom_features: parsedCustom,
                              });
                              setIsHistoryModalOpen(false);
                            }}
                            className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                          >
                            {language === "es" ? "Cargar" : "Load"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDbEstimate(item.id)}
                            title="Eliminar de la base de datos"
                            className="cursor-pointer p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {language === "es" ? "Cerrar" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
