import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export const alt = "Empleo en Famaillá Conecta";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Colores por modalidad
const modalidadColores = {
  Presencial: { bg: "#10b981", light: "#d1fae5" },
  Remoto: { bg: "#8b5cf6", light: "#ede9fe" },
  Híbrido: { bg: "#3b82f6", light: "#dbeafe" },
};

export default async function Image({ params }) {
  const { slug } = await params;

  // Obtener empleo
  const { data: empleo } = await supabase
    .from("empleos")
    .select("titulo, empresa, ubicacion, modalidad, tipo, salario_min, salario_max, logo_url")
    .eq("slug", slug)
    .single();

  if (!empleo) {
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
          Empleo no encontrado
        </div>
      ),
      { ...size }
    );
  }

  const colores = modalidadColores[empleo.modalidad] || { bg: "#10b981", light: "#d1fae5" };

  // Formatear salario
  const formatearSalario = () => {
    if (!empleo.salario_min && !empleo.salario_max) return null;
    if (empleo.salario_min && empleo.salario_max) {
      return `$${empleo.salario_min.toLocaleString("es-AR")} - $${empleo.salario_max.toLocaleString("es-AR")}`;
    }
    if (empleo.salario_min) return `Desde $${empleo.salario_min.toLocaleString("es-AR")}`;
    return `Hasta $${empleo.salario_max.toLocaleString("es-AR")}`;
  };

  const salario = formatearSalario();

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
        {/* Barra superior verde */}
        <div
          style={{
            height: "8px",
            width: "100%",
            backgroundColor: "#10b981",
          }}
        />

        {/* Badge "Empleo" */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            backgroundColor: "#10b981",
            color: "white",
            padding: "12px 24px",
            borderRadius: "50px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          💼 EMPLEO
        </div>

        {/* Contenido principal */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "60px",
            gap: "40px",
          }}
        >
          {/* Logo empresa */}
          <div
            style={{
              width: "160px",
              height: "160px",
              backgroundColor: empleo.logo_url ? "transparent" : "#e7e5e4",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: "2px solid #e7e5e4",
            }}
          >
            {empleo.logo_url ? (
              <img
                src={empleo.logo_url}
                width="160"
                height="160"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "64px", color: "#a8a29e" }}>🏢</span>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {/* Empresa */}
            <span style={{ fontSize: "28px", color: "#10b981", fontWeight: "600" }}>
              {empleo.empresa}
            </span>

            {/* Título */}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: "#1c1917",
                lineHeight: 1.1,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {empleo.titulo.length > 50 
                ? empleo.titulo.substring(0, 50) + "..." 
                : empleo.titulo}
            </h1>

            {/* Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "8px",
                flexWrap: "wrap",
              }}
            >
              {empleo.modalidad && (
                <span
                  style={{
                    backgroundColor: colores.light,
                    color: colores.bg,
                    padding: "8px 20px",
                    borderRadius: "50px",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {empleo.modalidad}
                </span>
              )}
              {empleo.tipo && (
                <span
                  style={{
                    backgroundColor: "#e7e5e4",
                    color: "#57534e",
                    padding: "8px 20px",
                    borderRadius: "50px",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {empleo.tipo}
                </span>
              )}
            </div>

            {/* Detalles */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {empleo.ubicacion && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "26px" }}>📍</span>
                  <span style={{ fontSize: "26px", color: "#57534e" }}>
                    {empleo.ubicacion}
                  </span>
                </div>
              )}
              {salario && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "26px" }}>💰</span>
                  <span style={{ fontSize: "26px", color: "#57534e" }}>
                    {salario}
                  </span>
                </div>
              )}
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
            famaillaconecta.com/empleos
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}