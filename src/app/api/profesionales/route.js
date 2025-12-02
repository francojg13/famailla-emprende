import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Obtener profesional por slug o todos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      // Obtener profesional específico
      const { data, error } = await supabase
        .from("profesionales")
        .select("*")
        .eq("slug", slug)
        .eq("activo", true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Profesional no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Obtener todos los profesionales activos
      const { data, error } = await supabase
        .from("profesionales")
        .select("*")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .order("puntuacion_promedio", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}

// POST - Registrar nuevo profesional (pendiente de moderación)
export async function POST(request) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    const { nombre, profesion, categoria, whatsapp } = body;

    if (!nombre || !profesion || !categoria || !whatsapp) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Generar slug
    const slug = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      + "-" + Date.now().toString(36);

    // Insertar profesional (inactivo hasta moderación)
    const { data, error } = await supabase
      .from("profesionales")
      .insert([
        {
          ...body,
          slug,
          activo: false,
          destacado: false,
          verificado: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al registrar. Intentá de nuevo." },
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