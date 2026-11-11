"use client";

import { useState } from "react";
import {
  Lightning,
  EnvelopeSimple,
  GithubLogo,
  CheckCircle,
  Warning,
  CircleNotch,
  X,
} from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ASYNC STATE: Tracks ongoing asynchronous HTTP operations & feedback messages
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "error";
    message: string;
    statusCode?: number;
  } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Declarative Validation Engine
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

  // =========================================================================
  // ASYNCHRONOUS SUBMISSION PATTERN (Fetch API, Headers, JSON, response.ok, try/catch/finally)
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 1. Mostrar Spinner y limpiar notificaciones previas
    setIsSubmitting(true);
    setFeedback(null);

    // 2. Bloque try / catch / finally para comunicación asíncrona robusta
    try {
      // POST con Headers ('Content-Type': 'application/json') y Body serializado con JSON.stringify
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Validar response.ok (fetch NO lanza excepción automática ante errores 400, 404 ni 500)
      if (!response.ok) {
        let errorDetail = `Error HTTP ${response.status}: ${response.statusText || "Respuesta no exitosa"}`;
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.error) {
            errorDetail = errorJson.error;
          }
        } catch {
          // Si el servidor no devolvió JSON, mantenemos el statusText
        }
        throw new Error(errorDetail);
      }

      // Procesar respuesta JSON si la petición fue satisfactoria
      const result = await response.json();
      setFeedback({
        type: "ok",
        message:
          result.message ||
          (language === "es"
            ? "¡Tu mensaje ha sido enviado y registrado con éxito!"
            : "Your message has been successfully submitted and stored!"),
        statusCode: response.status,
      });

      // Limpiar formulario tras confirmación exitosa
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: unknown) {
      // Atrapar caídas de red físicas, DNS o excepciones lanzadas por status !response.ok
      const message =
        error instanceof Error
          ? error.message
          : language === "es"
          ? "Error de conexión con el servidor. Verifica tu acceso a internet."
          : "Network connection error with the server. Please check your connection.";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      // FINALLY: Se ejecuta SIEMPRE para ocultar el spinner y reactivar los controles
      setIsSubmitting(false);
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
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl relative shadow-lg">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {t.contact.nameLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">Regla: min 3 caracteres</span>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full py-2.5 px-1 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none ${
                    errors.name
                      ? "border-rose-500 focus:border-rose-500 bg-rose-500/[0.03]"
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
                  <label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {t.contact.emailLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">Regla: formato RFC 5322</span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full py-2.5 px-1 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none ${
                    errors.email
                      ? "border-rose-500 focus:border-rose-500 bg-rose-500/[0.03]"
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

              {/* Optional Phone / WhatsApp Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {language === "es" ? "Teléfono o WhatsApp" : "Phone or WhatsApp"} <span className="text-[10px] text-zinc-400 font-normal">({language === "es" ? "Opcional" : "Optional"})</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">Prioridad Rápida</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-1 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none border-zinc-300 dark:border-zinc-800 focus:border-blue-500 font-mono"
                  placeholder="+1 555 123 4567"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {t.contact.messageLabel[language]} <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">Regla: min 10 caracteres</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full py-2.5 px-1 bg-transparent border-b text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors focus:outline-none rounded-none resize-none ${
                    errors.message
                      ? "border-rose-500 focus:border-rose-500 bg-rose-500/[0.03]"
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

              {/* Asynchronous Feedback Alerts (Verde = Éxito / Rojo = Error HTTP/Red) */}
              {feedback && (
                <div
                  role="alert"
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs transition-all shadow-sm ${
                    feedback.type === "ok"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {feedback.type === "ok" ? (
                      <CheckCircle size={18} weight="fill" className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Warning size={18} weight="fill" className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <p className="font-semibold leading-snug">{feedback.message}</p>
                      {feedback.statusCode && (
                        <p className="text-[10px] font-mono opacity-80">
                          Código HTTP: {feedback.statusCode} OK &bull; Asincronía completada
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeedback(null)}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer"
                    title="Cerrar notificación"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Asynchronous Submit Action with Spinner */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tap-feedback inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={14} className="animate-spin" />
                      <span>{language === "es" ? "Enviando solicitud asíncrona..." : "Sending async request..."}</span>
                    </>
                  ) : (
                    <span>{t.contact.status.submit[language]}</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Studio Contact Info & Socials */}
          <div className="lg:col-span-5 glass-card p-8 rounded-2xl flex flex-col justify-between gap-10 shadow-lg">
            {/* Studio Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                <Lightning size={32} weight="fill" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-semibold">
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
                  <span className="block text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-medium">
                    {t.contact.email[language]}
                  </span>
                  <a
                    href="mailto:omarapp1921@gmail.com"
                    className="text-xs text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-mono font-medium"
                  >
                    contacto@nexusweb.dev
                  </a>
                </div>

                <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                  <span className="block text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-medium">
                    {t.contact.location[language]}
                  </span>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                    {t.contact.locationValue[language]}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Panel */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                {t.contact.socials[language]}
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/omarapp19/tecnologiaweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs"
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
