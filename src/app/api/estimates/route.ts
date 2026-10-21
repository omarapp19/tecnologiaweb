import { NextResponse } from "next/server";
import { saveEstimate, getEstimates, getLatestEstimate, deleteEstimate } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latestOnly = searchParams.get("latest") === "true";

    if (latestOnly) {
      const latest = getLatestEstimate();
      return NextResponse.json({ success: true, data: latest });
    }

    const estimates = getEstimates(20);
    return NextResponse.json({ success: true, data: estimates });
  } catch (error) {
    console.error("Error retrieving estimates:", error);
    return NextResponse.json(
      { error: "Error al recuperar las estimaciones de la base de datos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      project_type,
      total_hours,
      estimated_days,
      modules,
      custom_features,
      raw_specification,
    } = body;

    if (!project_type || typeof total_hours !== "number" || typeof estimated_days !== "number") {
      return NextResponse.json(
        { error: "Datos de estimación incompletos o inválidos." },
        { status: 400 }
      );
    }

    const record = saveEstimate({
      project_type,
      total_hours,
      estimated_days,
      modules: modules || {},
      custom_features: custom_features || [],
      raw_specification,
    });

    return NextResponse.json({
      success: true,
      message: "Estimación guardada exitosamente en la base de datos.",
      record,
    });
  } catch (error) {
    console.error("Error saving estimate:", error);
    return NextResponse.json(
      { error: "Error al guardar la estimación en la base de datos." },
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
        { error: "Se requiere el ID para eliminar la estimación." },
        { status: 400 }
      );
    }

    const deleted = deleteEstimate(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting estimate:", error);
    return NextResponse.json(
      { error: "Error al eliminar la estimación de la base de datos." },
      { status: 500 }
    );
  }
}
