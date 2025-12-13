import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export const alt = "Perfil en Famaillá Conecta";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;

  // Obtener profesional/negocio
  const { data: perfil } = await supabase
    .from("profesionales")
    .select("nombre, profesion, categoria, tipo, descripcion, foto_url, verificado, direccion")
    .eq("slug", slug)
    .single();

  if (!perfil) {
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
          Perfil no encontrado
        </div>
      ),
      { ...size }
    );
  }

  const esNegocio = perfil.tipo === "negocio";
  const colorPrincipal = esNegocio ? "#8b5cf6" : "#10b981";
  const colorClaro = esNegocio ? "#ede9fe" : "#d1fae5";

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
        {/* Barra superior */}
        <div
          style={{
            height: "8px",
            width: "100%",
            backgroundColor: colorPrincipal,
          }}
        />

        {/* Badge tipo */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            backgroundColor: colorPrincipal,
            color: "white",
            padding: "12px 24px",
            borderRadius: "50px",
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {esNegocio ? "🏪 NEGOCIO" : "👤 SERVICIO"}
        </div>

        {/* Contenido principal */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "60px",
            gap: "50px",
            alignItems: "center",
          }}
        >
          {/* Foto / Logo */}
          <div
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: perfil.foto_url ? "transparent" : colorClaro,
              borderRadius: esNegocio ? "24px" : "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: `4px solid ${colorPrincipal}`,
            }}
          >
            {perfil.foto_url ? (
              <img
                src={perfil.foto_url}
                width="200"
                height="200"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "80px" }}>
                {esNegocio ? "🏪" : "👤"}
              </span>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Nombre + Verificado */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "#1c1917",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {perfil.nombre.length > 30 
                  ? perfil.nombre.substring(0, 30) + "..." 
                  : perfil.nombre}
              </h1>
              {perfil.verificado && (
                <div
                  style={{
                    backgroundColor: "#3b82f6",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontSize: "24px" }}>✓</span>
                </div>
              )}
            </div>

            {/* Profesión */}
            <span style={{ fontSize: "36px", color: colorPrincipal, fontWeight: "600" }}>
              {perfil.profesion}
            </span>

            {/* Categoría */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  backgroundColor: colorClaro,
                  color: colorPrincipal,
                  padding: "10px 24px",
                  borderRadius: "50px",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {perfil.categoria}
              </span>
            </div>

            {/* Descripción corta */}
            {perfil.descripcion && (
              <p
                style={{
                  fontSize: "24px",
                  color: "#78716c",
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: "700px",
                }}
              >
                {perfil.descripcion.length > 100
                  ? perfil.descripcion.substring(0, 100) + "..."
                  : perfil.descripcion}
              </p>
            )}

            {/* Ubicación */}
            {perfil.direccion && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                <span style={{ fontSize: "26px" }}>📍</span>
                <span style={{ fontSize: "26px", color: "#57534e" }}>
                  {perfil.direccion}
                </span>
              </div>
            )}
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
            famaillaconecta.com/directorio
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}