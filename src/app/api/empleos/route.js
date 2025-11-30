import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Log para debug
    console.log("=== DATOS RECIBIDOS ===");
    console.log(body);

    // Validar campos requeridos
    const { titulo, empresa, whatsapp } = body;

    if (!titulo || !titulo.trim()) {
      return NextResponse.json(
        { error: "El título del puesto es obligatorio" },
        { status: 400 }
      );
    }

    if (!empresa || !empresa.trim()) {
      return NextResponse.json(
        { error: "El nombre de la empresa es obligatorio" },
        { status: 400 }
      );
    }

    if (!whatsapp || !whatsapp.trim()) {
      return NextResponse.json(
        { error: "El número de WhatsApp es obligatorio" },
        { status: 400 }
      );
    }

    // Validar que el WhatsApp tenga al menos 10 dígitos
    const whatsappLimpio = whatsapp.replace(/\D/g, "");
    if (whatsappLimpio.length < 10) {
      return NextResponse.json(
        { error: "El número de WhatsApp no es válido" },
        { status: 400 }
      );
    }

    // Crear el mensaje predeterminado para WhatsApp
    const mensajeWhatsapp = `Hola, me interesa la oferta de "${titulo.trim()}" publicada en Famaillá Emprende.`;

    // Datos a insertar
    const datosInsertar = {
      titulo: titulo.trim(),
      descripcion: body.descripcion?.trim() || null,
      tipo: body.tipo || "Tiempo completo",
      empresa: empresa.trim(),
      ubicacion: body.ubicacion?.trim() || "Famaillá",
      whatsapp: whatsappLimpio,
      mensaje_whatsapp: mensajeWhatsapp,
      activo: false,
      destacado: false,
    };

    console.log("=== DATOS A INSERTAR ===");
    console.log(datosInsertar);

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("empleos")
      .insert([datosInsertar])
      .select()
      .single();

    // Log del error si existe
    if (error) {
      console.log("=== ERROR DE SUPABASE ===");
      console.log("Código:", error.code);
      console.log("Mensaje:", error.message);
      console.log("Detalles:", error.details);
      console.log("Hint:", error.hint);
      console.log("Error completo:", JSON.stringify(error, null, 2));
      
      return NextResponse.json(
        { error: "Error al guardar el empleo. Intentá de nuevo.", detalles: error.message },
        { status: 500 }
      );
    }

    console.log("=== ÉXITO ===");
    console.log(data);

    return NextResponse.json(
      {
        success: true,
        message: "Empleo enviado para revisión",
        empleo: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("=== ERROR GENERAL ===");
    console.log(error);
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}