export interface LeadScoreResult {
  score: number;
  scoreTier: "hot" | "warm" | "cold";
  reasons: string[];
  estimatedValue?: {
    currency: string;
    min: number;
    max: number;
  };
  detectedPhone?: string;
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "yahoo.es",
  "outlook.com",
  "outlook.es",
  "icloud.com",
  "live.com",
  "proton.me",
  "protonmail.com",
  "mail.ru",
  "yandex.com",
  "aol.com",
  "zoho.com",
  "gmx.com",
]);

/**
 * Evaluates a lead based on:
 * 1. Email authenticity and corporate domain
 * 2. Presence of interactive quote specification
 * 3. Scope / estimated hours
 * 4. High-value capability triggers (AI, Payments, DevOps)
 * 5. Intent and urgency keywords
 * 6. Message depth & phone availability
 */
export function evaluateLead(data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}): LeadScoreResult {
  let score = 10; // Base score
  const reasons: string[] = [];

  const email = (data.email || "").trim().toLowerCase();
  const message = (data.message || "").trim();
  const lowerMessage = message.toLowerCase();

  // 1. Corporate Email Domain (+15 pts)
  const emailDomain = email.split("@")[1];
  if (emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain)) {
    score += 15;
    reasons.push(`Dominio corporativo (@${emailDomain}) [+15 pts]`);
  } else if (emailDomain) {
    reasons.push(`Correo de proveedor personal (@${emailDomain})`);
  }

  // 2. Check for Phone Number (+10 pts)
  let phone = data.phone;
  if (!phone) {
    // Regex for phone detection in message
    const phoneMatch = message.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
    if (phoneMatch && phoneMatch[0].length >= 8) {
      phone = phoneMatch[0];
      score += 10;
      reasons.push(`Número telefónico/WhatsApp detectado (${phone}) [+10 pts]`);
    }
  } else {
    score += 10;
    reasons.push(`Teléfono de contacto proporcionado [+10 pts]`);
  }

  // 3. Technical Quote Specification Attached (+20 to +35 pts)
  const hasSpec =
    message.includes("ESPECIFICACIÓN DE PROYECTO") ||
    message.includes("NEXUSWEB TECHNOLOGIES") ||
    message.includes("Horas de Ingeniería:") ||
    message.includes("Inversión Estimada:");

  let parsedHours = 0;
  let parsedMinBudget = 0;
  let parsedMaxBudget = 0;
  let parsedCurrency = "USD";

  if (hasSpec) {
    reasons.push(`Especificación técnica del cotizador adjunta [+20 pts]`);
    score += 20;

    // Parse estimated hours
    const hoursMatch = message.match(/(\d+)\s*horas estimadas/i);
    if (hoursMatch) {
      parsedHours = parseInt(hoursMatch[1], 10);
      if (parsedHours >= 80) {
        score += 20;
        reasons.push(`Proyecto enterprise de alto alcance (${parsedHours}h) [+20 pts]`);
      } else if (parsedHours >= 45) {
        score += 10;
        reasons.push(`Proyecto de alcance medio (${parsedHours}h) [+10 pts]`);
      }
    }

    // Parse investment range
    const budgetMatch = message.match(/Inversión Estimada:\s*([$€])([\d,.]+)\s*-\s*([$€])([\d,.]+)\s*(USD|EUR)?/i);
    if (budgetMatch) {
      parsedCurrency = budgetMatch[5] || (budgetMatch[1] === "€" ? "EUR" : "USD");
      parsedMinBudget = parseInt(budgetMatch[2].replace(/[.,]/g, ""), 10);
      parsedMaxBudget = parseInt(budgetMatch[4].replace(/[.,]/g, ""), 10);

      if (parsedMinBudget >= 3000) {
        score += 15;
        reasons.push(`Presupuesto superior a ${parsedCurrency === "USD" ? "$" : "€"}3,000 [+15 pts]`);
      }
    }
  }

  // 4. High-Value Capabilities (+10 to +15 pts each)
  const mentionsAI =
    lowerMessage.includes("ia") ||
    lowerMessage.includes("llm") ||
    lowerMessage.includes("inteligencia artificial") ||
    lowerMessage.includes("openai") ||
    lowerMessage.includes("chatbot");
  if (mentionsAI) {
    score += 15;
    reasons.push(`Requerimiento de Inteligencia Artificial / LLMs [+15 pts]`);
  }

  const mentionsPayments =
    lowerMessage.includes("pasarela de pagos") ||
    lowerMessage.includes("stripe") ||
    lowerMessage.includes("paypal") ||
    lowerMessage.includes("checkout") ||
    lowerMessage.includes("e-commerce") ||
    lowerMessage.includes("tienda online") ||
    lowerMessage.includes("suscripciones");
  if (mentionsPayments) {
    score += 12;
    reasons.push(`Módulo financiero / Pasarela de Pagos [+12 pts]`);
  }

  const mentionsCloudDevOps =
    lowerMessage.includes("ci/cd") ||
    lowerMessage.includes("cloud") ||
    lowerMessage.includes("aws") ||
    lowerMessage.includes("cloudflare") ||
    lowerMessage.includes("docker") ||
    lowerMessage.includes("microservicios");
  if (mentionsCloudDevOps) {
    score += 10;
    reasons.push(`Infraestructura Cloud / DevOps [+10 pts]`);
  }

  // 5. Commercial Urgency & Ready-to-Hire (+15 pts)
  const urgencyKeywords = [
    "urgente",
    "inmediato",
    "este mes",
    "esta semana",
    "contratar",
    "empezar ya",
    "iniciar",
    "reunión",
    "llamada",
    "presupuesto aprobado",
    "cotización formal",
    "asap",
  ];
  const hasUrgency = urgencyKeywords.some((kw) => lowerMessage.includes(kw));
  if (hasUrgency) {
    score += 15;
    reasons.push(`Intención comercial alta / Decisión inmediata [+15 pts]`);
  }

  // 6. Project Architecture Scope
  const scopeKeywords = [
    "saas",
    "dashboard",
    "plataforma",
    "sistema",
    "app móvil",
    "pwa",
    "aplicación",
    "startup",
    "empresa",
  ];
  const matchedScope = scopeKeywords.filter((kw) => lowerMessage.includes(kw));
  if (matchedScope.length > 0) {
    score += 8;
    reasons.push(`Alcance de software empresarial (${matchedScope.slice(0, 3).join(", ")}) [+8 pts]`);
  }

  // 7. Message Depth
  if (message.length > 300) {
    score += 10;
    reasons.push(`Descripción detallada de requerimientos (${message.length} caracteres) [+10 pts]`);
  } else if (message.length > 120) {
    score += 5;
    reasons.push(`Requerimientos claros (+120 caracteres) [+5 pts]`);
  }

  // Normalize score between 0 and 100
  score = Math.min(100, Math.max(10, score));

  // Determine Tier
  let scoreTier: "hot" | "warm" | "cold" = "cold";
  if (score >= 70) {
    scoreTier = "hot";
  } else if (score >= 40) {
    scoreTier = "warm";
  } else {
    scoreTier = "cold";
  }

  return {
    score,
    scoreTier,
    reasons,
    estimatedValue:
      parsedMinBudget > 0
        ? {
            currency: parsedCurrency,
            min: parsedMinBudget,
            max: parsedMaxBudget,
          }
        : undefined,
    detectedPhone: phone,
  };
}
