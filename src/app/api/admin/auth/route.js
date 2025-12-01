import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verificar contraseña
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Crear token simple (en producción usarías JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString("base64");

    // Guardar en cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout - eliminar cookie
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");

  return NextResponse.json({ success: true });
}