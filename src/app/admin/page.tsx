"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Fire,
  Lightning,
  Lock,
  Key,
  SignOut,
  MagnifyingGlass,
  Trash,
  WhatsappLogo,
  EnvelopeSimple,
  CheckCircle,
  Clock,
  ArrowLeft,
  Sparkle,
  Database,
  ChartPie,
  Funnel,
  FileCsv,
  X,
  Check,
} from "@phosphor-icons/react";

interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  status: "unread" | "contacted" | "qualified" | "won" | "archived" | string;
  score: number;
  score_tier: "hot" | "warm" | "cold";
  score_reasons_json: string;
  admin_notes?: string;
}

interface SavedEstimate {
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

interface AdminStats {
  engine?: "firebase" | "sqlite";
  totalContacts: number;
  unreadContacts: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  wonLeads: number;
  totalEstimates: number;
  totalEstimatedHours: number;
  projectTypeBreakdown: Record<string, number>;
}

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Filtering & View State
  const [activeTab, setActiveTab] = useState<"leads" | "estimates" | "export">("leads");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Contact Notes Editing State
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const json = await res.json();
        setIsAuthenticated(!!json.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load Dashboard Data
  const loadDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.stats) setStats(statsJson.stats);
      }

      // 2. Fetch Contacts with current filters
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (tierFilter !== "all") params.append("tier", tierFilter);
      if (searchQuery.trim()) params.append("query", searchQuery.trim());

      const contactsRes = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (contactsRes.ok) {
        const contactsJson = await contactsRes.json();
        if (Array.isArray(contactsJson.data)) {
          setContacts(contactsJson.data);
        }
      }

      // 3. Fetch Estimates
      const estimatesRes = await fetch("/api/estimates");
      if (estimatesRes.ok) {
        const estJson = await estimatesRes.json();
        if (Array.isArray(estJson.data)) {
          setEstimates(estJson.data);
        }
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoadingData(false);
    }
  }, [statusFilter, tierFilter, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  // Auto-clear action toast feedback
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
        setPinInput("");
      } else {
        setAuthError(json.error || "Clave de acceso incorrecta.");
      }
    } catch {
      setAuthError("Error al contactar el servidor de autenticación.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Update Contact Status
  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      });

      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
        );
        setActionFeedback(`Estado actualizado a: ${newStatus}`);
        // Refresh stats in background
        const statsRes = await fetch("/api/admin/stats");
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.stats) setStats(statsJson.stats);
        }
      }
    } catch {
      setActionFeedback("Error al actualizar el estado.");
    }
  };

  // Save Contact Note
  const handleSaveNote = async (contactId: string) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, notes: noteDraft }),
      });

      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, admin_notes: noteDraft } : c))
        );
        setEditingNotesId(null);
        setNoteDraft("");
        setActionFeedback("Nota interna guardada.");
      }
    } catch {
      setActionFeedback("Error al guardar la nota.");
    }
  };

  // Delete Contact
  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este prospecto de la base de datos?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/contacts?id=${contactId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        setActionFeedback("Prospecto eliminado de la base de datos.");
      }
    } catch {
      setActionFeedback("Error al eliminar el prospecto.");
    }
  };

  // Export Contacts to CSV (Compatible with Excel UTF-8 with BOM)
  const handleExportCSV = () => {
    if (contacts.length === 0) {
      alert("No hay prospectos para exportar con los filtros actuales.");
      return;
    }

    const headers = [
      "ID",
      "Fecha",
      "Nombre",
      "Email",
      "Teléfono",
      "Calificación (Pts)",
      "Nivel Prioridad",
      "Estado",
      "Factores de Calificación",
      "Notas Internas",
      "Mensaje",
    ];

    const rows = contacts.map((c) => {
      let reasons: string[] = [];
      try {
        reasons = JSON.parse(c.score_reasons_json || "[]");
      } catch {}

      return [
        `"${c.id}"`,
        `"${new Date(c.created_at).toLocaleString("es-ES")}"`,
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${c.score}"`,
        `"${c.score_tier.toUpperCase()}"`,
        `"${c.status.toUpperCase()}"`,
        `"${reasons.join(" | ").replace(/"/g, '""')}"`,
        `"${(c.admin_notes || "").replace(/"/g, '""')}"`,
        `"${(c.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexusweb-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActionFeedback("Archivo CSV descargado con éxito.");
  };

  // Quick summary counts
  const leadsCountByTier = useMemo(() => {
    return {
      hot: stats?.hotLeads ?? 0,
      warm: stats?.warmLeads ?? 0,
      cold: stats?.coldLeads ?? 0,
    };
  }, [stats]);

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-sm">
        <Clock className="animate-spin mr-2" size={18} />
        Verificando sesión de administrador...
      </div>
    );
  }

  // 1. GATEWAY LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle cyber background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-blue-500/5"
        >
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={14} /> Volver a la web
            </Link>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database size={10} /> SQLite WAL
            </span>
          </div>

          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <ShieldCheck size={24} weight="duotone" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">NexusWeb Backoffice</h1>
            <p className="text-xs text-zinc-400">
              Panel Administrativo Privado &bull; Calificación de Clientes
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="adminPin" className="block text-xs font-mono text-zinc-400 mb-1.5">
                Clave de Acceso de Administrador:
              </label>
              <div className="relative">
                <input
                  id="adminPin"
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-600 text-sm font-mono tracking-widest pl-10"
                />
                <Key size={16} className="absolute left-3.5 top-3 text-zinc-500" />
              </div>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center"
              >
                {authError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <Clock className="animate-spin" size={14} />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Acceder al Panel
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] text-zinc-500 font-mono">
                Clave por defecto: <code className="text-blue-400">nexus2026</code>
              </p>
            </div>
          </form>
        </motion.div>
      </main>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Action Toast Feedback */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs shadow-xl backdrop-blur-md"
          >
            <CheckCircle size={16} weight="fill" className="text-emerald-400" />
            <span>{actionFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Ver Sitio Web</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lightning size={16} weight="fill" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-2">
                NexusWeb Backoffice
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden md:inline-flex items-center gap-1 ${
                  stats?.engine === "firebase"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  <Database size={10} /> {stats?.engine === "firebase" ? "Firebase Firestore Cloud" : "SQLite Local"}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
            title="Descargar lista de prospectos en Excel / CSV"
          >
            <FileCsv size={16} className="text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-mono transition-colors"
          >
            <SignOut size={14} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Leads */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Total Prospectos</span>
              <EnvelopeSimple size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats?.totalContacts ?? contacts.length}
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {stats?.unreadContacts ?? 0} sin responder
            </div>
          </div>

          {/* Card 2: Hot Leads */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent space-y-1">
            <div className="flex items-center justify-between text-rose-400 text-xs font-mono font-medium">
              <span>🔥 Leads Calientes</span>
              <Fire size={18} weight="fill" className="text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {leadsCountByTier.hot}
            </div>
            <div className="text-[11px] text-rose-400/80 font-mono">
              Alta prioridad (&ge;70 pts)
            </div>
          </div>

          {/* Card 3: Warm Leads */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent space-y-1">
            <div className="flex items-center justify-between text-amber-400 text-xs font-mono font-medium">
              <span>⚡ Leads Templados</span>
              <Lightning size={18} weight="fill" className="text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {leadsCountByTier.warm}
            </div>
            <div className="text-[11px] text-amber-400/80 font-mono">
              En evaluación (40-69 pts)
            </div>
          </div>

          {/* Card 4: Total Estimates & Hours */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>Cotizaciones del Estudio</span>
              <ChartPie size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats?.totalEstimates ?? estimates.length}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              ~{stats?.totalEstimatedHours ?? 0}h ingeniería presupuestadas
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === "leads"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Fire size={15} />
              <span>Gestión de Prospectos ({contacts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("estimates")}
              className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === "estimates"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Database size={15} />
              <span>Cotizaciones del Cotizador ({estimates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("export")}
              className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === "export"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileCsv size={15} />
              <span>Exportar & Estadísticas</span>
            </button>
          </div>

          {activeTab === "leads" && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, email..."
                  className="w-full px-3 py-1.5 pl-8 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <MagnifyingGlass size={13} className="absolute left-2.5 top-2 text-zinc-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: LEADS CRM & QUALIFICATION */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 text-[11px] font-mono flex items-center gap-1">
                <Funnel size={12} /> Calificación:
              </span>
              {(["all", "hot", "warm", "cold"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setTierFilter(tier)}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                    tierFilter === tier
                      ? tier === "hot"
                        ? "bg-rose-500 text-white font-bold"
                        : tier === "warm"
                        ? "bg-amber-500 text-zinc-950 font-bold"
                        : tier === "cold"
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-zinc-200 text-zinc-900 font-bold"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {tier === "all"
                    ? "Todos los Niveles"
                    : tier === "hot"
                    ? "🔥 Calientes (≥70 pts)"
                    : tier === "warm"
                    ? "⚡ Templados (40-69 pts)"
                    : "❄️ Estándar (<40 pts)"}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-zinc-800 mx-1 hidden sm:block" />

              <span className="text-zinc-500 text-[11px] font-mono">Estado:</span>
              {(["all", "unread", "contacted", "qualified", "won", "archived"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                      statusFilter === st
                        ? "bg-zinc-200 text-zinc-900 font-bold"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {st === "all"
                      ? "Todos"
                      : st === "unread"
                      ? "Sin leer"
                      : st === "contacted"
                      ? "Contactado"
                      : st === "qualified"
                      ? "Calificado"
                      : st === "won"
                      ? "Ganado"
                      : "Archivado"}
                  </button>
                )
              )}
            </div>

            {/* Leads List */}
            {loadingData ? (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
                <Clock className="animate-spin" size={16} /> Cargando prospectos de la base de datos...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-16 text-center rounded-2xl border border-zinc-800/80 bg-zinc-900/30 text-zinc-500 space-y-2">
                <Sparkle size={32} className="mx-auto text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">No se encontraron prospectos</p>
                <p className="text-xs">
                  {searchQuery || statusFilter !== "all" || tierFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda o categoría."
                    : "Los nuevos formularios completados en la web aparecerán aquí automáticamente."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => {
                  let reasons: string[] = [];
                  try {
                    reasons = JSON.parse(contact.score_reasons_json || "[]");
                  } catch {}

                  const isHot = contact.score_tier === "hot" || contact.score >= 70;
                  const isWarm = contact.score_tier === "warm" || (contact.score >= 40 && contact.score < 70);

                  const cleanPhone = (contact.phone || "").replace(/[^\d+]/g, "");

                  return (
                    <motion.div
                      key={contact.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border transition-all ${
                        isHot
                          ? "border-rose-500/30 bg-zinc-900/80 shadow-lg shadow-rose-950/20"
                          : isWarm
                          ? "border-amber-500/30 bg-zinc-900/70"
                          : "border-zinc-800 bg-zinc-900/50"
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                        <div className="flex items-center gap-3">
                          {/* Score Pill Badge */}
                          <div
                            className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                              isHot
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                : isWarm
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {isHot ? (
                              <Fire size={14} weight="fill" className="text-rose-400" />
                            ) : isWarm ? (
                              <Lightning size={14} weight="fill" className="text-amber-400" />
                            ) : (
                              <Clock size={14} className="text-zinc-400" />
                            )}
                            <span>{contact.score} pts</span>
                            <span className="text-[10px] opacity-75">
                              {isHot ? "• ALTA PRIORIDAD" : isWarm ? "• MEDIA" : "• ESTÁNDAR"}
                            </span>
                          </div>

                          <div className="text-zinc-400 text-xs font-mono">
                            {new Date(contact.created_at).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-zinc-500 font-mono">Estado:</label>
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="unread">🔵 Sin leer</option>
                            <option value="contacted">🟡 Contactado</option>
                            <option value="qualified">🟣 Calificado</option>
                            <option value="won">🟢 Ganado / Contrato</option>
                            <option value="archived">⚪ Archivado</option>
                          </select>
                        </div>
                      </div>

                      {/* Lead Contact Info */}
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs text-zinc-500 font-mono">Cliente / Contacto:</div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            {contact.name}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-mono">Correo Electrónico:</div>
                          <div className="text-xs font-mono text-blue-400 truncate">
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:underline flex items-center gap-1"
                            >
                              <EnvelopeSimple size={14} />
                              {contact.email}
                            </a>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-mono">Teléfono / WhatsApp:</div>
                          <div className="text-xs font-mono text-zinc-300">
                            {contact.phone ? (
                              <span className="text-emerald-400 font-semibold">{contact.phone}</span>
                            ) : (
                              <span className="text-zinc-600">No especificado</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Automated Qualification Triggers List */}
                      {reasons.length > 0 && (
                        <div className="mt-3 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                            <Sparkle size={12} className="text-blue-400" /> Factores de Calificación Automática:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {reasons.map((reason, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono flex items-center gap-1"
                              >
                                <Check size={11} className="text-emerald-400" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 text-xs text-zinc-200 whitespace-pre-wrap font-sans max-h-56 overflow-y-auto leading-relaxed">
                        {contact.message}
                      </div>

                      {/* Internal Admin Notes */}
                      <div className="mt-3 pt-3 border-t border-zinc-800/60">
                        {editingNotesId === contact.id ? (
                          <div className="space-y-2">
                            <label className="text-[11px] font-mono text-zinc-400">
                              Nota Interna del Equipo:
                            </label>
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="Ej: Cliente habló por WhatsApp. Se acordó videollamada para el viernes 3 PM..."
                              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                              rows={2}
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingNotesId(null)}
                                className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200 font-mono cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveNote(contact.id)}
                                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium cursor-pointer"
                              >
                                Guardar Nota
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs">
                            <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-1.5 truncate">
                              <strong className="text-zinc-300">Nota Interna:</strong>
                              {contact.admin_notes ? (
                                <span className="text-zinc-200 truncate">{contact.admin_notes}</span>
                              ) : (
                                <span className="text-zinc-600 italic">Sin notas registradas</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNotesId(contact.id);
                                setNoteDraft(contact.admin_notes || "");
                              }}
                              className="text-[11px] text-blue-400 hover:text-blue-300 font-mono cursor-pointer"
                            >
                              {contact.admin_notes ? "Editar Nota" : "+ Añadir Nota"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions Footer */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/80">
                        <div className="flex items-center gap-2">
                          {cleanPhone ? (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
                                contact.name
                              )},%20te%20escribimos%20desde%20NexusWeb%20Technologies%20respecto%20a%20tu%20proyecto.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors"
                            >
                              <WhatsappLogo size={15} weight="fill" />
                              <span>Escribir por WhatsApp</span>
                            </a>
                          ) : null}

                          <a
                            href={`mailto:${contact.email}?subject=NexusWeb%20Technologies%20-%20Propuesta%20de%20Proyecto`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
                          >
                            <EnvelopeSimple size={15} />
                            <span>Enviar Email</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="cursor-pointer inline-flex items-center gap-1 text-zinc-500 hover:text-rose-400 text-xs font-mono p-1.5 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash size={15} />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ESTIMATES PERSISTED IN DATABASE */}
        {activeTab === "estimates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Especificaciones técnicas y arquitecturas generadas en el cotizador:</span>
              <span>{estimates.length} guardadas</span>
            </div>

            {estimates.length === 0 ? (
              <div className="p-16 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 text-zinc-500">
                <Database size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">No hay cotizaciones guardadas aún</p>
                <p className="text-xs">
                  Cuando los usuarios o administradores guarden propuestas en el cotizador, se registrarán aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estimates.map((est) => {
                  let modules: Record<string, unknown> = {};
                  let custom: Array<{ id: string; name: string; estimatedHours: number }> = [];
                  try {
                    modules = JSON.parse(est.modules_json || "{}");
                    custom = JSON.parse(est.custom_features_json || "[]");
                  } catch {}

                  const activeModuleKeys = Object.keys(modules).filter((k) => modules[k]);

                  return (
                    <div
                      key={est.id}
                      className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {est.project_type}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {new Date(est.created_at).toLocaleString("es-ES")}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
                        <div>
                          <strong className="text-white text-base">{est.total_hours}h</strong>{" "}
                          ingeniería
                        </div>
                        <div>&bull;</div>
                        <div>
                          ~<strong className="text-white text-base">{est.estimated_days}d</strong>{" "}
                          hábiles
                        </div>
                        {custom.length > 0 && (
                          <>
                            <div>&bull;</div>
                            <div className="text-emerald-400">+{custom.length} a medida</div>
                          </>
                        )}
                      </div>

                      {/* Modules tags */}
                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                        {activeModuleKeys.map((k) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                          >
                            ✓ {k}
                          </span>
                        ))}
                      </div>

                      {/* Custom Features list */}
                      {custom.length > 0 && (
                        <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                          <span className="text-emerald-400 font-semibold">Módulos Extra:</span>{" "}
                          {custom.map((c) => `${c.name} (+${c.estimatedHours}h)`).join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPORT & AGGREGATE METRICS */}
        {activeTab === "export" && (
          <div className="space-y-6">
            {/* Export Card */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileCsv size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Exportación de Datos para CRM & Excel</h3>
                  <p className="text-xs text-zinc-400">
                    Descarga todos los contactos, calificaciones automáticas y notas en formato CSV con soporte UTF-8 (BOM).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <FileCsv size={16} />
                  Descargar {contacts.length} Prospectos en CSV
                </button>
              </div>
            </div>

            {/* Cloud Storage Status Card */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <Database size={16} className="text-amber-400" />
                  <span>Motor de Base de Datos: {stats?.engine === "firebase" ? "Firebase Cloud Firestore" : "SQLite Local"}</span>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                  stats?.engine === "firebase"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                }`}>
                  {stats?.engine === "firebase" ? "Nube Activa (Persistente)" : "Modo Local (data/nexus.db)"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {stats?.engine === "firebase"
                  ? "Tus datos se sincronizan directamente con Firebase Cloud Firestore. Los clientes que envíen el formulario en Vercel aparecerán aquí de forma inmediata y permanente."
                  : "Actualmente estás usando el motor local SQLite. Para que los prospectos enviados en Vercel se guarden de forma permanente en la nube, solo agrega tus claves de Firebase en Vercel -> Settings -> Environment Variables."}
              </p>
            </div>

            {/* Demand Distribution breakdown */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <ChartPie size={16} className="text-blue-400" />
                Distribución de Demanda por Tipo de Solución
              </h3>

              {stats && Object.keys(stats.projectTypeBreakdown).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(stats.projectTypeBreakdown).map(([type, count]) => (
                    <div key={type} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{type}</div>
                      <div className="text-2xl font-bold text-white font-mono mt-1">{count}</div>
                      <div className="text-[10px] text-zinc-500">cotizaciones</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 font-mono">
                  Se generarán estadísticas conforme los clientes coticen en la plataforma.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
