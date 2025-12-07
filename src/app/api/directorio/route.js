import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET - Obtener por slug o todos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const tipo = searchParams.get("tipo"); // servicio, negocio, o null para todos

  try {
    if (slug) {
      // Obtener uno específico
      const { data, error } = await supabase
        .from("profesionales")
        .select("*")
        .eq("slug", slug)
        .eq("activo", true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "No encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Obtener todos (con filtro opcional por tipo)
      let query = supabase
        .from("profesionales")
        .select("*")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .order("puntuacion_promedio", { ascending: false });

      if (tipo) {
        query = query.eq("tipo", tipo);
      }

      const { data, error } = await query;

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

// POST - Registrar nuevo
export async function POST(request) {
  try {
    const body = await request.json();

    const { nombre, profesion, categoria, whatsapp, tipo } = body;

    if (!nombre || !profesion || !categoria || !whatsapp || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Generar slug único
    const slug = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      + "-" + Date.now().toString(36);

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