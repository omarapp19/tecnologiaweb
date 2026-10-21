import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveContact, getContacts, deleteContact } from "@/lib/db";
import { evaluateLead } from "@/lib/leadScorer";

export async function GET() {
  try {
    const contacts = getContacts(50);
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error retrieving contacts from database:", error);
    return NextResponse.json(
      { error: "Error al recuperar los mensajes de la base de datos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message, phone } = await request.json();

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // 1. Run Automated Lead Scoring Algorithm
    const leadScore = evaluateLead({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      phone: phone ? String(phone).trim() : undefined,
    });

    // 2. Save directly into SQLite Database with qualification metrics
    let savedRecord = null;
    try {
      savedRecord = saveContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        phone: leadScore.detectedPhone || (phone ? String(phone).trim() : ""),
        score: leadScore.score,
        score_tier: leadScore.scoreTier,
        score_reasons_json: JSON.stringify(leadScore.reasons),
      });
    } catch (dbError) {
      console.error("Database save error:", dbError);
    }

    // 3. Email Configuration (Optional SMTP notification with priority indicator)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_EMAIL || "omarapp1921@gmail.com";

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const tierBadge =
          leadScore.scoreTier === "hot"
            ? "🔥 LEAD CALIENTE (ALTA PRIORIDAD)"
            : leadScore.scoreTier === "warm"
            ? "⚡ LEAD TEMPLADO"
            : "❄️ LEAD ESTÁNDAR";

        const mailOptions = {
          from: `"${name}" <${smtpUser}>`,
          replyTo: email,
          to: toEmail,
          subject: `[${tierBadge} - ${leadScore.score} pts] Nuevo contacto de ${name}`,
          text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${leadScore.detectedPhone || "No especificado"}\nCalificación: ${leadScore.score} pts (${leadScore.scoreTier.toUpperCase()})\nMensaje:\n${message}\n\nFactores de Calificación:\n${leadScore.reasons.join("\n")}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #18181b; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="color: #09090b; margin: 0; font-size: 18px;">Nuevo Contacto Recibido</h2>
                <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${
                  leadScore.scoreTier === "hot"
                    ? "#fee2e2; color: #b91c1c;"
                    : leadScore.scoreTier === "warm"
                    ? "#fef3c7; color: #b45309;"
                    : "#f1f5f9; color: #475569;"
                }">
                  ${tierBadge} (${leadScore.score}/100)
                </span>
              </div>
              <p style="margin: 6px 0;"><strong>Nombre:</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              ${leadScore.detectedPhone ? `<p style="margin: 6px 0;"><strong>Teléfono / WhatsApp:</strong> ${leadScore.detectedPhone}</p>` : ""}
              
              <div style="margin-top: 16px; margin-bottom: 16px; background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; border-radius: 6px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 13px; color: #334155;">Mensaje del Cliente:</p>
                <div style="white-space: pre-wrap; font-size: 13px; color: #0f172a; line-height: 1.5;">${message}</div>
              </div>

              <div style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-size: 12px; margin-top: 16px;">
                <strong style="color: #27272a;">Factores de Calificación Automática:</strong>
                <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #52525b;">
                  ${leadScore.reasons.map((r) => `<li>${r}</li>`).join("")}
                </ul>
              </div>

              <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0 12px 0;" />
              <p style="font-size: 11px; color: #a1a1aa; margin: 0; text-align: center;">
                Almacenado de forma segura en NexusWeb Database &bull; Panel Admin: <a href="https://nexusweb.dev/admin" style="color: #2563eb;">/admin</a>
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("Error sending notification email:", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      savedInDb: !!savedRecord,
      record: savedRecord,
      leadScore,
      message: savedRecord
        ? "Mensaje guardado y calificado exitosamente en la base de datos."
        : "Mensaje procesado.",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el mensaje." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID para eliminar el registro." },
        { status: 400 }
      );
    }

    const deleted = deleteContact(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting contact record:", error);
    return NextResponse.json(
      { error: "Error al eliminar el registro de la base de datos." },
      { status: 500 }
    );
  }
}
