import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Verificar si está autenticado
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token;
}

// GET - Obtener todos los artículos
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("articulos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Crear artículo
export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Generar slug si no viene
    if (!body.slug && body.titulo) {
      body.slug = body.titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
        .replace(/\s+/g, "-") // Espacios a guiones
        .replace(/-+/g, "-") // Múltiples guiones a uno
        .trim();
    }

    const { data, error } = await supabase
      .from("articulos")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear artículo" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar artículo
export async function PATCH(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    // Actualizar fecha de modificación
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("articulos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar artículo
export async function DELETE(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("articulos")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar" },
      { status: 500 }
    );
  }
}