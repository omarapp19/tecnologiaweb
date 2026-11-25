"use client";

import { useState, useRef, useEffect } from "react";
import { ChatCircleDots, X, PaperPlaneRight } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

type Lang = "es" | "en";
interface Msg {
  from: "bot" | "user";
  text: string;
  section?: { id: string; label: string };
}
interface Rule {
  keys: string[];
  es: string;
  en: string;
  section?: { id: string; es: string; en: string };
}

const RULES: Rule[] = [
  {
    keys: ["precio", "costo", "cuanto", "cuánto", "presupuesto", "cotiz", "price", "cost", "budget", "quote", "estimate"],
    es: "Puedes calcular horas, plazo e inversión estimada con nuestro cotizador interactivo. Además, una regresión lineal con proyectos guardados predice el plazo.",
    en: "You can compute hours, timeline and budget with our interactive estimator. A linear regression over saved projects also predicts the timeline.",
    section: { id: "cotizador", es: "Ir al cotizador", en: "Go to estimator" },
  },
  {
    keys: ["servicio", "ofrec", "hacen", "service", "offer", "do you do"],
    es: "Ofrecemos desarrollo web y PWA, arquitectura cloud, diseño UI/UX e integraciones de IA.",
    en: "We offer web and PWA development, cloud architecture, UI/UX design and AI integrations.",
    section: { id: "servicios", es: "Ver servicios", en: "See services" },
  },
  {
    keys: ["proyecto", "portafolio", "trabajos", "project", "portfolio", "work"],
    es: "Aquí puedes ver una selección de nuestros trabajos.",
    en: "Here is a selection of our work.",
    section: { id: "proyectos", es: "Ver proyectos", en: "See projects" },
  },
  {
    keys: ["tecnolog", "stack", "next", "react", "tech"],
    es: "Trabajamos con Next.js, React, TypeScript, Three.js y bases de datos en la nube.",
    en: "We work with Next.js, React, TypeScript, Three.js and cloud databases.",
    section: { id: "tech-stack", es: "Ver tecnologías", en: "See tech stack" },
  },
  {
    keys: ["equipo", "quienes", "quiénes", "team", "who"],
    es: "Somos un equipo multidisciplinario de desarrollo, diseño e infraestructura.",
    en: "We are a multidisciplinary team of development, design and infrastructure.",
    section: { id: "equipo", es: "Conocer al equipo", en: "Meet the team" },
  },
  {
    keys: ["contact", "correo", "email", "hablar", "reunión", "reunion", "llamada", "talk", "call", "meeting"],
    es: "Escríbenos con el formulario y te responderemos pronto.",
    en: "Send us a message with the form and we will reply soon.",
    section: { id: "contacto", es: "Ir al contacto", en: "Go to contact" },
  },
  {
    keys: ["plazo", "tiempo", "cuando", "cuándo", "días", "dias", "timeline", "how long", "days"],
    es: "El plazo depende del alcance: aproximadamente 6 horas de ingeniería por día hábil. El cotizador te da el estimado exacto.",
    en: "The timeline depends on scope: roughly 6 engineering hours per working day. The estimator gives the exact figure.",
    section: { id: "cotizador", es: "Ir al cotizador", en: "Go to estimator" },
  },
  {
    keys: ["hola", "buenas", "hello", "hi", "hey"],
    es: "¡Hola! ¿En qué puedo ayudarte? Pregúntame por servicios, precios, plazos o proyectos.",
    en: "Hi! How can I help? Ask me about services, pricing, timelines or projects.",
  },
];

const FALLBACK = {
  es: "No estoy seguro de eso. Prueba preguntando por servicios, precios, plazos, tecnologías o contacto.",
  en: "I'm not sure about that. Try asking about services, pricing, timelines, tech or contact.",
};

function reply(input: string, lang: Lang): Msg {
  const q = input.toLowerCase();
  const rule = RULES.find((r) => r.keys.some((k) => q.includes(k)));
  if (!rule) return { from: "bot", text: FALLBACK[lang] };
  return {
    from: "bot",
    text: rule[lang],
    section: rule.section && { id: rule.section.id, label: rule.section[lang] },
  };
}

export default function Chatbot() {
  const { language } = useLanguage();
  const lang: Lang = language === "en" ? "en" : "es";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const greeting: Msg = {
    from: "bot",
    text:
      lang === "es"
        ? "¡Hola! Soy el asistente de NexusWeb. Pregúntame por servicios, precios o plazos."
        : "Hi! I'm the NexusWeb assistant. Ask me about services, pricing or timelines.",
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { from: "user", text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: next.map(({ from, text }) => ({ from, text })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // Keep section shortcut from the keyword rules when one matches
      const hint = reply(text, lang);
      setMessages([...next, { from: "bot", text: json.reply, section: hint.section }]);
    } catch (err) {
      console.warn("Gemini unavailable, using local rules", err);
      setMessages([...next, reply(text, lang)]);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const all = [greeting, ...messages];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {open && (
        <div
          role="dialog"
          aria-label="Chatbot"
          className="mb-3 w-[min(22rem,calc(100vw-2.5rem))] h-96 flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <span className="text-sm font-semibold">NexusWeb Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {all.map((m, i) => (
              <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl ${
                    m.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.section && (
                    <button
                      onClick={() => goTo(m.section!.id)}
                      className="mt-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 underline cursor-pointer"
                    >
                      {m.section.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-xs font-mono animate-pulse">
                  {lang === "es" ? "Escribiendo…" : "Typing…"}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 p-2 border-t border-zinc-200 dark:border-zinc-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "es" ? "Escribe tu pregunta…" : "Type your question…"}
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              aria-label="Send"
              className="px-3 rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-500"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </form>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Open chat"}
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors"
        >
          <ChatCircleDots size={24} weight="fill" />
        </button>
      </div>
    </div>
  );
}
