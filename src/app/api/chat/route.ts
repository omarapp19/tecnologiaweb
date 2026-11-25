import { NextResponse } from "next/server";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_HISTORY = 10;
const MAX_CHARS = 500;

const SYSTEM_PROMPT = (lang: "es" | "en") => `
You are the virtual assistant of NexusWeb Technologies, a software studio offering web and PWA development, cloud architecture, UI/UX design and AI integrations (stack: Next.js, React, TypeScript, Three.js, cloud databases).
The website has an interactive project estimator (about 6 engineering hours per working day; it shows hours, timeline and budget range), projects, tech stack, team and contact sections.
Answer briefly (max 3 short sentences) and only about the studio, its services, pricing/timelines and how to contact it. Do not invent prices, clients or commitments: for exact quotes send the user to the estimator or the contact form.
If asked about unrelated topics, politely redirect. Reply in ${lang === "es" ? "Spanish" : "English"}.
`.trim();

interface ChatMsg {
  from: "bot" | "user";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chatbot no configurado." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const lang: "es" | "en" = body.lang === "en" ? "en" : "es";
    const history: ChatMsg[] = Array.isArray(body.messages) ? body.messages : [];

    const contents = history
      .filter((m) => (m?.from === "user" || m?.from === "bot") && typeof m.text === "string")
      .slice(-MAX_HISTORY)
      .map((m) => ({
        role: m.from === "user" ? "user" : "model",
        parts: [{ text: m.text.slice(0, MAX_CHARS) }],
      }));

    // Gemini requires the conversation to start with and end on a user turn.
    while (contents.length && contents[0].role !== "user") contents.shift();
    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return NextResponse.json({ error: "Mensaje inválido." }, { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT(lang) }] },
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text());
      return NextResponse.json({ error: "Error del servicio de IA." }, { status: 502 });
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json({ error: "Respuesta vacía." }, { status: 502 });
    }
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Error procesando el mensaje." }, { status: 500 });
  }
}
