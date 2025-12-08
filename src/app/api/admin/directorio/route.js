import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Verificar autenticación
async function verificarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token?.value
}

// GET: Obtener todos los registros del directorio (activos e inactivos)
export async function GET() {
  try {
    const autenticado = await verificarAuth();
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profesionales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET /api/admin/directorio:", error);
    return NextResponse.json(
      { error: "Error al obtener directorio" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar registro del directorio
export async function PUT(request) {
  try {
    const autenticado = await verificarAuth();
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...datos } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profesionales")
      .update(datos)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en PUT /api/admin/directorio:", error);
    return NextResponse.json(
      { error: "Error al actualizar registro" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar registro del directorio
export async function DELETE(request) {
  try {
    const autenticado = await verificarAuth();
    if (!autenticado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profesionales")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/admin/directorio:", error);
    return NextResponse.json(
      { error: "Error al eliminar registro" },
      { status: 500 }
    );
  }
}