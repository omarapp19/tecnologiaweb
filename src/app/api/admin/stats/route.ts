import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getAdminStats } from "@/lib/db";

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error retrieving admin stats:", error);
    return NextResponse.json({ error: "Error al cargar estadísticas." }, { status: 500 });
  }
}
