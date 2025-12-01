import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Verificar si está autenticado
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token;
}

// GET - Obtener todos los empleos (incluyendo inactivos)
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("empleos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH - Actualizar empleo (activar/desactivar, destacar, etc.)
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

    const { data, error } = await supabase
      .from("empleos")
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

// DELETE - Eliminar empleo
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
      .from("empleos")
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