import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminAuth, generateAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function GET() {
  const isAuth = await verifyAdminAuth();
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "Ingresa la clave de acceso." }, { status: 400 });
    }

    const token = generateAdminSessionToken(pin);
    if (!token) {
      return NextResponse.json(
        { error: "Clave de administrador incorrecta." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Acceso concedido." });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Error en la autenticación." }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Sesión cerrada." });
}
