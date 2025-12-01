import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Verificar si está autenticado
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token;
}

// GET - Obtener todos los eventos
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Crear evento
export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("eventos")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear evento" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar evento
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
      .from("eventos")
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

// DELETE - Eliminar evento
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
      .from("eventos")
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