import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Obtener reseñas de un profesional
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const profesionalId = searchParams.get("profesional_id");

  if (!profesionalId) {
    return NextResponse.json(
      { error: "profesional_id requerido" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("resenas")
      .select("*")
      .eq("profesional_id", profesionalId)
      .eq("aprobada", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear nueva reseña (pendiente de aprobación)
export async function POST(request) {
  try {
    const body = await request.json();

    const { profesional_id, nombre_cliente, puntuacion, comentario } = body;

    // Validar campos requeridos
    if (!profesional_id || !nombre_cliente || !puntuacion) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar puntuación
    if (puntuacion < 1 || puntuacion > 5) {
      return NextResponse.json(
        { error: "La puntuación debe ser entre 1 y 5" },
        { status: 400 }
      );
    }

    // Insertar reseña (pendiente de aprobación)
    const { data, error } = await supabase
      .from("resenas")
      .insert([
        {
          profesional_id,
          nombre_cliente: nombre_cliente.trim(),
          puntuacion,
          comentario: comentario?.trim() || null,
          aprobada: false, // Pendiente de moderación
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al enviar reseña. Intentá de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}