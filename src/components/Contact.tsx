"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightning,
  EnvelopeSimple,
  GithubLogo,
  CheckCircle,
  Warning,
  FloppyDisk,
  Trash,
  CaretDown,
  CaretUp,
  Clock
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface SavedInquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // 1. JSON & LOCALSTORAGE: Saved Inquiries List
  const [savedInquiries, setSavedInquiries] = useState<SavedInquiry[]>([]);
  const [showInquiriesDrawer, setShowInquiriesDrawer] = useState<boolean>(false);

  // Load from localStorage on mount using JSON.parse()
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexus_saved_inquiries");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedInquiries(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved inquiries from localStorage", e);
    }
  }, []);

  // 2. DECLARATIVE VALIDATION ENGINE (rules & messages)
  const validationRules = {
    name: { required: true, minLength: 3 },
    email: { required: true, email: true },
    message: { required: true, minLength: 10 },
  };

  const validationMessages = {
    name: {
      required: language === "es" ? "El nombre es obligatorio." : "Name is required.",
      minLength: language === "es" ? "El nombre debe tener al menos 3 caracteres." : "Name must have at least 3 characters.",
    },
    email: {
      required: language === "es" ? "El correo electrónico es obligatorio." : "Email address is required.",
      email: language === "es" ? "Ingresa una dirección de correo válida." : "Please enter a valid email address.",
    },
    message: {
      required: language === "es" ? "El mensaje no puede estar vacío." : "Message cannot be empty.",
      minLength: language === "es" ? "El mensaje debe contener al menos 10 caracteres." : "Message must be at least 10 characters.",
    },
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate Name
    const nameVal = formData.name.trim();
    if (validationRules.name.required && !nameVal) {
      newErrors.name = validationMessages.name.required;
    } else if (validationRules.name.minLength && nameVal.length < validationRules.name.minLength) {
      newErrors.name = validationMessages.name.minLength;
    }

    // Validate Email
    const emailVal = formData.email.trim();
    if (validationRules.email.required && !emailVal) {
      newErrors.email = validationMessages.email.required;
    } else if (validationRules.email.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = validationMessages.email.email;
    }

    // Validate Message
    const messageVal = formData.message.trim();
    if (validationRules.message.required && !messageVal) {
      newErrors.message = validationMessages.message.required;
    } else if (validationRules.message.minLength && messageVal.length < validationRules.message.minLength) {
      newErrors.message = validationMessages.message.minLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 3. FORM SUBMISSION INTERCEPT (e.preventDefault() + JSON.stringify() + localStorage + remote API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🛑 Intercepts form submission and halts default flow

    if (!validateForm()) {
      return; // Halts flow if rules fail
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");

        // Save structured inquiry object to localStorage with JSON.stringify()
        const newInquiry: SavedInquiry = {
          id: `inq-${Date.now()}`,
          timestamp: new Date().toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        };

        const updatedInquiries = [newInquiry, ...savedInquiries];
        setSavedInquiries(updatedInquiries);
        try {
          localStorage.setItem("nexus_saved_inquiries", JSON.stringify(updatedInquiries));
        } catch (storageErr) {
          console.warn("Could not write to localStorage", storageErr);
        }

        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // 4. DOM MANIPULATION: Remove saved inquiry node and update storage (.remove())
  const handleRemoveInquiry = (id: string) => {
    const updated = savedInquiries.filter((inq) => inq.id !== id);
    setSavedInquiries(updated);
    try {
      localStorage.setItem("nexus_saved_inquiries", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not update localStorage", e);
    }
  };

  return (
    <section id="contacto" className="relative py-28 px-6 bg-transparent border-t border-zinc-200 dark:border-zinc-900/50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono mb-4 font-semibold">
            <EnvelopeSimple size={14} weight="fill" />
            <span>{language === "es" ? "CANALES DE ATENCIÓN & CONTACTO" : "COMMUNICATION CHANNELS"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.contact.title[language]}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            {t.contact.subtitle[language]}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Contact Form with Declarative Validation */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl relative">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="name" className="text-xs font-medium text-zinc-700 dark:text-zinc-400">
                    {t.contact.nameLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">Regla: min 3 caracteres</span>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none ${
                    errors.name
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/[0.02]"
                      : "border-zinc-300 dark:border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.namePlaceholder[language]}
                />
                {errors.name && (
                  <span id="name-error" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-mono">
                    <Warning size={13} weight="fill" />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="text-xs font-medium text-zinc-700 dark:text-zinc-400">
                    {t.contact.emailLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">Regla: formato RFC 5322</span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none ${
                    errors.email
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/[0.02]"
                      : "border-zinc-300 dark:border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.emailPlaceholder[language]}
                />
                {errors.email && (
                  <span id="email-error" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-mono">
                    <Warning size={13} weight="fill" />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="text-xs font-medium text-zinc-700 dark:text-zinc-400">
                    {t.contact.messageLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">Regla: min 10 caracteres</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none resize-none ${
                    errors.message
                      ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/[0.02]"
                      : "border-zinc-300 dark:border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.messagePlaceholder[language]}
                />
                {errors.message && (
                  <span id="message-error" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-mono">
                    <Warning size={13} weight="fill" />
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Success & Error Messages */}
              {status === "success" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 rounded-md flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" />
                  <span className="font-medium">{t.contact.status.success[language]}</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 rounded-md flex items-center gap-2">
                  <Warning size={16} weight="fill" />
                  <span className="font-medium">{t.contact.status.error[language]}</span>
                </div>
              )}

              {/* Submit button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="tap-feedback inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  {status === "loading" ? t.contact.status.loading[language] : t.contact.status.submit[language]}
                </button>

                {savedInquiries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowInquiriesDrawer(!showInquiriesDrawer)}
                    className="cursor-pointer text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FloppyDisk size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Consultas guardadas ({savedInquiries.length})</span>
                    {showInquiriesDrawer ? <CaretUp size={12} /> : <CaretDown size={12} />}
                  </button>
                )}
              </div>
            </form>

            {/* Saved Inquiries Accordion Drawer (.slideDown()) */}
            <AnimatePresence>
              {showInquiriesDrawer && savedInquiries.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-900/80 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-600 dark:text-zinc-400 font-semibold uppercase text-[11px] flex items-center gap-1.5">
                      <Clock size={13} className="text-blue-600 dark:text-blue-400" />
                      Historial Local (localStorage)
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {savedInquiries.length} registro(s)
                    </span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {savedInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-sans space-y-1.5 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-200">{inq.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-500">{inq.timestamp}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveInquiry(inq.id)}
                              title="Eliminar registro (.remove())"
                              className="cursor-pointer text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors p-1"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-[11px]">{inq.message}</p>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block font-medium">{inq.email}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Studio Contact Info & Socials */}
          <div className="lg:col-span-5 glass-card p-8 rounded-2xl flex flex-col justify-between gap-10">
            {/* Studio Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-900/80">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl shrink-0">
                <Lightning size={32} weight="fill" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{language === "es" ? "Recepción de Proyectos Activa" : "Accepting Projects"}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  NexusWeb Technologies
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                  {language === "es"
                    ? "Estudio de Desarrollo Web & Soluciones Digitales"
                    : "Web Development & Digital Solutions Studio"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                {t.contact.direct[language]}
              </h3>

              <div className="grid grid-cols-1 gap-5 pt-2">
                <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{t.contact.email[language]}</span>
                  <a
                    href="mailto:omarapp1921@gmail.com"
                    className="text-xs text-zinc-800 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-mono"
                  >
                    contacto@nexusweb.dev
                  </a>
                </div>

                <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{t.contact.location[language]}</span>
                  <p className="text-xs text-zinc-800 dark:text-zinc-300">{t.contact.locationValue[language]}</p>
                </div>
              </div>
            </div>

            {/* Social Panel */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-900/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                {t.contact.socials[language]}
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/omarapp19/tecnologiaweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <GithubLogo size={14} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
