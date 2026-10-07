"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  navbar: {
    inicio: { es: "Inicio", en: "Home" },
    servicios: { es: "Servicios", en: "Services" },
    proyectos: { es: "Proyectos", en: "Projects" },
    techStack: { es: "Tech Stack", en: "Tech Stack" },
    equipo: { es: "Equipo", en: "Team" },
    contacto: { es: "Contacto", en: "Contact" },
    contactanos: { es: "Contáctanos", en: "Contact Us" },
  },
  hero: {
    scroll: { es: "Desplazar para explorar", en: "Scroll to explore" },
    tagline: { es: "SOLUCIONES WEB", en: "DIGITAL STUDIO" },
    company: { es: "NEXUSWEB", en: "NEXUSWEB" },
    subtitle: {
      es: "Estudio de ingeniería de software, arquitectura cloud y diseño de experiencias web interactivas.",
      en: "Software engineering studio, cloud architecture, and interactive web experience design."
    }
  },
  services: {
    badge: { es: "NUESTRAS CAPACIDADES", en: "OUR CAPABILITIES" },
    title: { es: "Servicios & Soluciones", en: "Services & Solutions" },
    subtitle: {
      es: "Diseñamos e implementamos software moderno de principio a fin, combinando arquitectura de nube, interfaces interactivas y tecnologías emergentes.",
      en: "We design and deploy modern software from start to finish, combining cloud architecture, interactive interfaces, and emerging technologies."
    }
  },
  projects: {
    title: { es: "Proyectos & Casos de Estudio", en: "Projects & Case Studies" },
    subtitle: {
      es: "Una selección de plataformas web, herramientas y aplicaciones que demuestran arquitectura técnica y diseño de alto nivel.",
      en: "A curated selection of web platforms, tools, and applications demonstrating high-level technical architecture and design.",
    },
    categories: {
      website: { es: "SITIO WEB", en: "WEBSITE" },
      pwa: { es: "APLICACIÓN WEB / PWA", en: "WEB APP / PWA" },
      webapp: { es: "APLICACIÓN WEB", en: "WEB APP" },
      corporate: { es: "PLATAFORMA CORPORATIVA", en: "CORPORATE PLATFORM" },
      impact: { es: "PLATAFORMA DE IMPACTO SOCIAL", en: "SOCIAL IMPACT PLATFORM" },
      android: { es: "APP ANDROID", en: "ANDROID APP" },
    },
    visit: { es: "Visitar solución", en: "Visit solution" },
    prev: { es: "Proyecto anterior", en: "Previous project" },
    next: { es: "Siguiente proyecto", en: "Next project" },
  },
  techStack: {
    title: { es: "Stack Tecnológico del Estudio", en: "Studio Tech Stack" },
    subtitle: {
      es: "Tecnologías, frameworks e infraestructura que dominamos para construir soluciones empresariales estables y escalables.",
      en: "Technologies, frameworks, and infrastructure we master to build stable and scalable enterprise solutions.",
    },
    categories: {
      frontend: { es: "Desarrollo Frontend", en: "Frontend Development" },
      backend: { es: "Backend & Bases de Datos", en: "Backend & Databases" },
      infra: { es: "Infraestructura Cloud & CI/CD", en: "Cloud Infrastructure & CI/CD" },
      automation: { es: "Automatización & IA", en: "Automation & AI" },
    },
    levels: {
      solid: { es: "Sólido", en: "Solid" },
      advanced: { es: "Avanzado", en: "Advanced" },
    },
  },
  team: {
    badge: { es: "EQUIPO MULTIDISCIPLINARIO", en: "MULTIDISCIPLINARY TEAM" },
    title: { es: "Estructura del Equipo", en: "Team Structure" },
    subtitle: {
      es: "Áreas y especialidades del equipo que colaboran de manera integrada para garantizar calidad técnica, diseño y despliegue continuo.",
      en: "Team areas and specialties collaborating seamlessly to ensure technical excellence, design, and continuous delivery."
    }
  },
  contact: {
    title: { es: "Contacto Corporativo", en: "Corporate Contact" },
    subtitle: {
      es: "¿Tienes un proyecto o consulta? Escríbenos para conversar con el equipo técnico.",
      en: "Have a project or inquiry? Get in touch with our technical team.",
    },
    nameLabel: { es: "Nombre Completo o Empresa", en: "Full Name or Company" },
    namePlaceholder: { es: "Ej. Empresa / Contacto", en: "e.g., Company / Contact" },
    emailLabel: { es: "Correo Electrónico", en: "Email Address" },
    emailPlaceholder: { es: "Ej. contacto@empresa.com", en: "e.g., contact@company.com" },
    messageLabel: { es: "Detalles del Proyecto o Consulta", en: "Project Details or Inquiry" },
    messagePlaceholder: { es: "Cuéntanos sobre tus requerimientos...", en: "Tell us about your requirements..." },
    errors: {
      name: { es: "El nombre es obligatorio.", en: "Name is required." },
      emailReq: { es: "El correo electrónico es obligatorio.", en: "Email address is required." },
      emailVal: { es: "Ingresa una dirección de correo válida.", en: "Please enter a valid email address." },
      message: { es: "El mensaje no puede estar vacío.", en: "Message cannot be empty." },
    },
    status: {
      success: { es: "¡Mensaje recibido con éxito! Nuestro equipo responderá a la brevedad.", en: "Message received successfully! Our team will respond shortly." },
      error: { es: "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.", en: "An error occurred while sending the message. Please try again." },
      loading: { es: "Enviando...", en: "Sending..." },
      submit: { es: "Enviar Consulta", en: "Submit Inquiry" },
    },
    direct: { es: "Información de la Agencia", en: "Agency Information" },
    email: { es: "Correo Corporativo", en: "Corporate Email" },
    phone: { es: "Canal de Comunicación", en: "Communication Channel" },
    location: { es: "Ubicación", en: "Location" },
    locationValue: { es: "Maracaibo, Venezuela", en: "Maracaibo, Venezuela" },
    socials: { es: "Repositorio & Redes", en: "Repository & Networks" },
  },
  footer: {
    rights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
    credits: {
      es: "NexusWeb Technologies · Cátedra de Tecnología Web · Universidad",
      en: "NexusWeb Technologies · Web Technology Course · University",
    },
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("language") as Language;
      if (saved === "es" || saved === "en") {
        setLanguageState(saved);
      } else {
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === "es") {
          setLanguageState("es");
        }
      }
    } catch (e) {
      console.warn("Failed to access localStorage for language preference", e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("language", lang);
    } catch (e) {
      console.warn("Failed to save language preference to localStorage", e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
