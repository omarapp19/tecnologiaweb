"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Lightning, EnvelopeSimple, Phone, MapPin, GithubLogo } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = t.contact.errors.name[language];
    }
    if (!formData.email.trim()) {
      newErrors.email = t.contact.errors.emailReq[language];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.errors.emailVal[language];
    }
    if (!formData.message.trim()) {
      newErrors.message = t.contact.errors.message[language];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="relative py-28 px-6 bg-transparent border-t border-zinc-900/50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
            <EnvelopeSimple size={14} weight="fill" />
            <span>{language === "es" ? "CANALES DE ATENCIÓN" : "COMMUNICATION CHANNELS"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100">
            {t.contact.title[language]}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            {t.contact.subtitle[language]}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium text-zinc-400">
                  {t.contact.nameLabel[language]}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-100 placeholder-zinc-700 transition-colors focus:outline-none rounded-none ${
                    errors.name
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.namePlaceholder[language]}
                />
                {errors.name && (
                  <span id="name-error" className="text-xs text-rose-500 mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-400">
                  {t.contact.emailLabel[language]}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-100 placeholder-zinc-700 transition-colors focus:outline-none rounded-none ${
                    errors.email
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.emailPlaceholder[language]}
                />
                {errors.email && (
                  <span id="email-error" className="text-xs text-rose-500 mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-medium text-zinc-400">
                  {t.contact.messageLabel[language]}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full py-2 bg-transparent border-b text-sm text-zinc-100 placeholder-zinc-700 transition-colors focus:outline-none rounded-none resize-none ${
                    errors.message
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-zinc-800 focus:border-blue-500"
                  }`}
                  placeholder={t.contact.messagePlaceholder[language]}
                />
                {errors.message && (
                  <span id="message-error" className="text-xs text-rose-500 mt-1">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Success & Error Messages */}
              {status === "success" && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 rounded-md">
                  <span>{t.contact.status.success[language]}</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 text-xs text-rose-400 rounded-md">
                  <span>{t.contact.status.error[language]}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="tap-feedback w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-zinc-950 bg-blue-500 hover:bg-blue-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === "loading" ? t.contact.status.loading[language] : t.contact.status.submit[language]}
              </button>
            </form>
          </div>

          {/* Right Side: Studio Contact Info & Socials */}
          <div className="lg:col-span-5 glass-card p-8 rounded-2xl flex flex-col justify-between gap-10">
            {/* Studio Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-900/80">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl shrink-0">
                <Lightning size={32} weight="fill" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{language === "es" ? "Recepción de Proyectos Activa" : "Accepting Projects"}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
                  NexusWeb Technologies
                </h3>
                <p className="text-xs text-zinc-400 font-normal">
                  {language === "es"
                    ? "Estudio de Desarrollo Web & Soluciones Digitales"
                    : "Web Development & Digital Solutions Studio"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {t.contact.direct[language]}
              </h3>

              <div className="grid grid-cols-1 gap-5 pt-2">
                <div className="border-l border-zinc-800 pl-4 py-1">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{t.contact.email[language]}</span>
                  <a
                    href="mailto:omarapp1921@gmail.com"
                    className="text-xs text-zinc-300 hover:text-blue-400 transition-colors font-mono"
                  >
                    contacto@nexusweb.dev
                  </a>
                </div>

                <div className="border-l border-zinc-800 pl-4 py-1">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{t.contact.location[language]}</span>
                  <p className="text-xs text-zinc-300">{t.contact.locationValue[language]}</p>
                </div>
              </div>
            </div>

            {/* Social Panel */}
            <div className="space-y-4 pt-4 border-t border-zinc-900/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {t.contact.socials[language]}
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/omarapp19/tecnologiaweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
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
