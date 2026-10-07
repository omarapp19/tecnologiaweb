import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    const submission = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    // 1. Save locally to submissions.json (For local testing & backup)
    try {
      const submissionsPath = path.join(process.cwd(), "submissions.json");
      let submissions = [];
      if (fs.existsSync(submissionsPath)) {
        const fileContent = fs.readFileSync(submissionsPath, "utf-8");
        submissions = JSON.parse(fileContent);
      }
      submissions.push(submission);
      fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving submission locally:", err);
    }

    // 2. Email Configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_EMAIL || "omarapp1921@gmail.com";

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

    if (isSmtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort === "465", // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${name}" <${smtpUser}>`, // Send from SMTP user to prevent spoofing filters
        replyTo: email, // Reply-to the sender's email
        to: toEmail,
        subject: `Nuevo mensaje de contacto de ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Mensaje:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 10px; color: #888;">Enviado desde tu portafolio personal.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: "Mensaje enviado por correo y guardado localmente.",
      });
    }

    // If SMTP is not configured, we return success but flag that it was saved locally
    return NextResponse.json({
      success: true,
      savedLocally: true,
      message: "Mensaje guardado localmente (configura las variables SMTP en .env.local para recibir correos).",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el mensaje." },
      { status: 500 }
    );
  }
}
