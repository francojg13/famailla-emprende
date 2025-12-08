import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Función para generar slug
function generarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET: Obtener eventos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Si viene un slug, buscar uno específico
    if (slug) {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("slug", slug)
        .eq("activo", true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Evento no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    }

    // Sino, listar todos los activos
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .eq("activo", true)
      .order("fecha", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET /api/eventos:", error);
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo evento
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      titulo,
      descripcion,
      categoria,
      fecha,
      hora_inicio,
      hora_fin,
      lugar,
      direccion,
      organizador,
      whatsapp,
      email,
      link_inscripcion,
      cupo_maximo,
      precio,
      imagen_url,
    } = body;

    // Validaciones
    if (!titulo || !titulo.trim()) {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 }
      );
    }

    if (!categoria) {
      return NextResponse.json(
        { error: "La categoría es obligatoria" },
        { status: 400 }
      );
    }

    if (!fecha) {
      return NextResponse.json(
        { error: "La fecha es obligatoria" },
        { status: 400 }
      );
    }

    if (!lugar || !lugar.trim()) {
      return NextResponse.json(
        { error: "El lugar es obligatorio" },
        { status: 400 }
      );
    }

    if (!organizador || !organizador.trim()) {
      return NextResponse.json(
        { error: "El organizador es obligatorio" },
        { status: 400 }
      );
    }

    if (!whatsapp && !email) {
      return NextResponse.json(
        { error: "Ingresá al menos un medio de contacto" },
        { status: 400 }
      );
    }

    // Generar slug único
    let slug = generarSlug(titulo);

    // Verificar si el slug ya existe
    const { data: existente } = await supabase
      .from("eventos")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existente) {
      slug = `${slug}-${Date.now()}`;
    }

    // Insertar en la base de datos
    const { data, error } = await supabase
      .from("eventos")
      .insert([
        {
          titulo,
          slug,
          descripcion: descripcion || null,
          categoria,
          fecha,
          hora_inicio: hora_inicio || null,
          hora_fin: hora_fin || null,
          lugar,
          direccion: direccion || null,
          organizador,
          whatsapp: whatsapp || null,
          email: email || null,
          link_inscripcion: link_inscripcion || null,
          cupo_maximo: cupo_maximo || null,
          cupo_actual: 0,
          precio: precio || null,
          imagen_url: imagen_url || null,
          activo: false, // Requiere aprobación
          destacado: false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/eventos:", error);
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );
  }
}