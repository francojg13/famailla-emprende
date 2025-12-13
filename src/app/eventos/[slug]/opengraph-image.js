import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export const alt = "Evento en Famaillá Conecta";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Colores por categoría
const categoriasColores = {
  Taller: { bg: "#10b981", light: "#d1fae5" },
  Curso: { bg: "#3b82f6", light: "#dbeafe" },
  Charla: { bg: "#8b5cf6", light: "#ede9fe" },
  Feria: { bg: "#f59e0b", light: "#fef3c7" },
  Workshop: { bg: "#f43f5e", light: "#ffe4e6" },
  Networking: { bg: "#06b6d4", light: "#cffafe" },
  Capacitación: { bg: "#6366f1", light: "#e0e7ff" },
  Cultural: { bg: "#ec4899", light: "#fce7f3" },
  Deportivo: { bg: "#f97316", light: "#ffedd5" },
  Social: { bg: "#14b8a6", light: "#ccfbf1" },
};

export default async function Image({ params }) {
  const { slug } = await params;

  // Obtener evento
  const { data: evento } = await supabase
    .from("eventos")
    .select("titulo, categoria, fecha, lugar, precio, organizador")
    .eq("slug", slug)
    .single();

  if (!evento) {
    // Imagen por defecto si no existe
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1c1917",
            color: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          Evento no encontrado
        </div>
      ),
      { ...size }
    );
  }

  // Formatear fecha
  const fechaObj = new Date(evento.fecha + "T00:00:00");
  const fechaFormateada = fechaObj.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const colores = categoriasColores[evento.categoria] || { bg: "#f59e0b", light: "#fef3c7" };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
          position: "relative",
        }}
      >
        {/* Barra superior con color de categoría */}
        <div
          style={{
            height: "8px",
            width: "100%",
            backgroundColor: colores.bg,
          }}
        />

        {/* Contenido principal */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "50px 60px",
            gap: "40px",
          }}
        >
          {/* Columna izquierda - Fecha */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              backgroundColor: colores.bg,
              borderRadius: "24px",
              color: "white",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "72px", fontWeight: "bold", lineHeight: 1 }}>
              {fechaObj.getDate()}
            </span>
            <span style={{ fontSize: "28px", textTransform: "uppercase", opacity: 0.9 }}>
              {fechaObj.toLocaleDateString("es-AR", { month: "short" })}
            </span>
          </div>

          {/* Columna derecha - Info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {/* Badge categoría */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  backgroundColor: colores.light,
                  color: colores.bg,
                  padding: "8px 20px",
                  borderRadius: "50px",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {evento.categoria}
              </span>
              <span
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#059669",
                  padding: "8px 20px",
                  borderRadius: "50px",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {evento.precio ? `$${evento.precio.toLocaleString("es-AR")}` : "Gratuito"}
              </span>
            </div>

            {/* Título */}
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "bold",
                color: "#1c1917",
                lineHeight: 1.2,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {evento.titulo.length > 60 
                ? evento.titulo.substring(0, 60) + "..." 
                : evento.titulo}
            </h1>

            {/* Detalles */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>📅</span>
                <span style={{ fontSize: "28px", color: "#57534e", textTransform: "capitalize" }}>
                  {fechaFormateada}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>📍</span>
                <span style={{ fontSize: "28px", color: "#57534e" }}>
                  {evento.lugar}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>👤</span>
                <span style={{ fontSize: "28px", color: "#57534e" }}>
                  {evento.organizador}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 60px",
            backgroundColor: "#1c1917",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#10b981",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              F
            </div>
            <span style={{ fontSize: "32px", fontWeight: "bold" }}>
              Famaillá Conecta
            </span>
          </div>
          <span style={{ fontSize: "24px", color: "#a8a29e" }}>
            famaillaconecta.com/eventos
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}