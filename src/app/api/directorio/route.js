import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Función para generar slug
function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET: Obtener items del directorio
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const tipo = searchParams.get("tipo");
    const categoria = searchParams.get("categoria");

    // Si viene un slug, buscar uno específico
    if (slug) {
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
    }

    // Sino, listar todos con filtros opcionales
    let query = supabase
      .from("profesionales")
      .select("*")
      .eq("activo", true)
      .order("destacado", { ascending: false })
      .order("puntuacion_promedio", { ascending: false })
      .order("created_at", { ascending: false });

    if (tipo) {
      query = query.eq("tipo", tipo);
    }

    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET /api/directorio:", error);
    return NextResponse.json(
      { error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}

// POST: Registrar nuevo en el directorio
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      tipo,
      categoria,
      profesion,
      nombre,
      descripcion,
      experiencia,
      horarios,
      sitio_web,
      whatsapp,
      email,
      instagram,
      direccion,
      foto_url,
    } = body;

    // Validaciones
    if (!tipo || !["servicio", "negocio"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo inválido" },
        { status: 400 }
      );
    }

    if (!categoria) {
      return NextResponse.json(
        { error: "La categoría es obligatoria" },
        { status: 400 }
      );
    }

    if (!profesion) {
      return NextResponse.json(
        { error: "La profesión/rubro es obligatoria" },
        { status: 400 }
      );
    }

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (!whatsapp) {
      return NextResponse.json(
        { error: "El WhatsApp es obligatorio" },
        { status: 400 }
      );
    }

    // Generar slug único
    let slug = generarSlug(nombre);
    
    // Verificar si el slug ya existe
    const { data: existente } = await supabase
      .from("profesionales")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existente) {
      slug = `${slug}-${Date.now()}`;
    }

    // Insertar en la base de datos
    const { data, error } = await supabase
      .from("profesionales")
      .insert([
        {
          tipo,
          categoria,
          profesion,
          nombre,
          slug,
          descripcion: descripcion || null,
          experiencia: tipo === "servicio" ? experiencia : null,
          horarios: tipo === "negocio" ? horarios : null,
          sitio_web: tipo === "negocio" ? sitio_web : null,
          whatsapp,
          email: email || null,
          instagram: instagram || null,
          direccion: direccion || null,
          foto_url: foto_url || null,
          activo: false, // Requiere aprobación
          destacado: false,
          verificado: false,
          puntuacion_promedio: 0,
          total_resenas: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/directorio:", error);
    return NextResponse.json(
      { error: "Error al registrar" },
      { status: 500 }
    );
  }
}