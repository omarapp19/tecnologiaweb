import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getFilteredContacts, updateContactStatus, updateContactNotes, deleteContact } from "@/lib/db";

export async function GET(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const tier = searchParams.get("tier") || "all";
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const contacts = await getFilteredContacts({ status, tier, query, limit });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error retrieving admin contacts:", error);
    return NextResponse.json({ error: "Error al cargar contactos." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de contacto requerido." }, { status: 400 });
    }

    if (status !== undefined) {
      await updateContactStatus(id, status, notes);
    } else if (notes !== undefined) {
      await updateContactNotes(id, notes);
    }

    return NextResponse.json({ success: true, message: "Contacto actualizado exitosamente." });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Error al actualizar contacto." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de contacto requerido." }, { status: 400 });
    }

    const deleted = await deleteContact(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Error al eliminar contacto." }, { status: 500 });
  }
}
