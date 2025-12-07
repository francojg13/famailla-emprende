"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Estrellas } from "@/components/DirectorioCard";

const categoriasColores = {
  Salud: "bg-red-100 text-red-700",
  Construcción: "bg-orange-100 text-orange-700",
  Diseño: "bg-pink-100 text-pink-700",
  Hogar: "bg-green-100 text-green-700",
  Gastronomía: "bg-amber-100 text-amber-700",
  Belleza: "bg-purple-100 text-purple-700",
  Educación: "bg-blue-100 text-blue-700",
  Oficios: "bg-stone-200 text-stone-700",
  Legal: "bg-indigo-100 text-indigo-700",
  Otros: "bg-gray-100 text-gray-700",
};

export default function PerfilDirectorioPage() {
  const params = useParams();
  const [item, setItem] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormResena, setMostrarFormResena] = useState(false);
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [resenaEnviada, setResenaEnviada] = useState(false);
  const [formResena, setFormResena] = useState({
    nombre_cliente: "",
    puntuacion: 5,
    comentario: "",
  });

  useEffect(() => {
    cargarDatos();
  }, [params.slug]);

  const cargarDatos = async () => {
    try {
      const resItem = await fetch(`/api/directorio?slug=${params.slug}`);
      if (!resItem.ok) throw new Error("No encontrado");
      const dataItem = await resItem.json();
      setItem(dataItem);

      const resResenas = await fetch(`/api/resenas?profesional_id=${dataItem.id}`);
      if (resResenas.ok) {
        const dataResenas = await resResenas.json();
        setResenas(dataResenas);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResenaChange = (e) => {
    const { name, value } = e.target;
    setFormResena((prev) => ({
      ...prev,
      [name]: name === "puntuacion" ? parseInt(value) : value,
    }));
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    setEnviandoResena(true);

    try {
      const response = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formResena,
          profesional_id: item.id,
        }),
      });

      if (response.ok) {
        setResenaEnviada(true);
        setMostrarFormResena(false);
        setFormResena({ nombre_cliente: "", puntuacion: 5, comentario: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviandoResena(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!item?.whatsapp) return null;
    const tipoTexto = item.tipo === "negocio" ? "el negocio" : "tus servicios";
    const mensaje = encodeURIComponent(
      `Hola ${item.nombre}, te encontré en Famaillá Emprende y me gustaría consultar por ${tipoTexto}.`
    );
    return `https://wa.me/${item.whatsapp}?text=${mensaje}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">No encontrado</h1>
          <Link href="/directorio" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Volver al directorio
          </Link>
        </div>
      </main>
    );
  }

  const colorCategoria = categoriasColores[item.categoria] || categoriasColores.Otros;
  const esNegocio = item.tipo === "negocio";

  const iniciales = item.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white py-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/directorio" className="hover:text-white transition-colors">Directorio</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white truncate">{item.nombre}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Foto */}
            <div className="relative flex-shrink-0">
              {item.foto_url ? (
                <img
                  src={item.foto_url}
                  alt={item.nombre}
                  className={`w-32 h-32 object-cover shadow-xl border-4 border-white/20 ${
                    esNegocio ? "rounded-2xl" : "rounded-full"
                  }`}
                />
              ) : (
                <div
                  className={`w-32 h-32 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-white/20 ${
                    esNegocio ? "rounded-2xl" : "rounded-full"
                  }`}
                >
                  {esNegocio ? (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) : (
                    iniciales
                  )}
                </div>
              )}
              {item.verificado && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  esNegocio ? "bg-purple-400/30 text-white" : "bg-emerald-400/30 text-white"
                }`}>
                  {esNegocio ? "Negocio" : "Servicio"}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorCategoria}`}>
                  {item.categoria}
                </span>
                {item.verificado && (
                  <span className="text-xs font-medium text-indigo-200">✓ Verificado</span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-1">{item.nombre}</h1>
              <p className="text-indigo-200 text-lg mb-4">{item.profesion}</p>

              <div className="flex items-center gap-3">
                <Estrellas puntuacion={item.puntuacion_promedio || 0} size="large" />
                <span className="text-indigo-100">
                  {item.puntuacion_promedio > 0 ? (
                    <>
                      <span className="font-bold text-white">{item.puntuacion_promedio}</span>
                      {" · "}{item.total_resenas} {item.total_resenas === 1 ? "reseña" : "reseñas"}
                    </>
                  ) : (
                    "Sin reseñas aún"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTENIDO
          ============================================ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="md:col-span-2 space-y-8">
              {/* Descripción */}
              {item.descripcion && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">
                    {esNegocio ? "Sobre el negocio" : "Sobre mí"}
                  </h2>
                  <p className="text-stone-600 leading-relaxed">{item.descripcion}</p>
                </div>
              )}

              {/* Reseñas */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-stone-800">
                    Reseñas ({resenas.length})
                  </h2>
                  {!mostrarFormResena && !resenaEnviada && (
                    <button
                      onClick={() => setMostrarFormResena(true)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      + Escribir reseña
                    </button>
                  )}
                </div>

                {resenaEnviada && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm">
                    ¡Gracias por tu reseña! Será publicada después de ser revisada.
                  </div>
                )}

                {mostrarFormResena && (
                  <form onSubmit={enviarResena} className="mb-6 bg-stone-50 rounded-xl p-5">
                    <h3 className="font-medium text-stone-800 mb-4">Tu opinión</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Tu nombre *</label>
                        <input
                          type="text"
                          name="nombre_cliente"
                          value={formResena.nombre_cliente}
                          onChange={handleResenaChange}
                          required
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Puntuación *</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setFormResena((prev) => ({ ...prev, puntuacion: num }))}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`w-8 h-8 ${num <= formResena.puntuacion ? "text-amber-400" : "text-stone-200"} hover:text-amber-400 transition-colors`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Comentario</label>
                        <textarea
                          name="comentario"
                          value={formResena.comentario}
                          onChange={handleResenaChange}
                          rows={3}
                          placeholder="Contanos tu experiencia..."
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={enviandoResena}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-400 text-white font-medium px-5 py-2 rounded-lg transition-colors"
                        >
                          {enviandoResena ? "Enviando..." : "Enviar reseña"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormResena(false)}
                          className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium px-5 py-2 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {resenas.length > 0 ? (
                  <div className="space-y-4">
                    {resenas.map((resena) => (
                      <div key={resena.id} className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-stone-800">{resena.nombre_cliente}</span>
                          <Estrellas puntuacion={resena.puntuacion} />
                        </div>
                        {resena.comentario && (
                          <p className="text-stone-600 text-sm">{resena.comentario}</p>
                        )}
                        <p className="text-stone-400 text-xs mt-2">
                          {new Date(resena.created_at).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-center py-8">
                    Todavía no hay reseñas. ¡Sé el primero en opinar!
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24">
                <h3 className="font-semibold text-stone-800 mb-4">Contactar</h3>

                {item.whatsapp && (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar WhatsApp
                  </a>
                )}

                {item.email && (
                  <a
                    href={`mailto:${item.email}`}
                    className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 rounded-xl transition-colors mb-3"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar email
                  </a>
                )}

                {item.instagram && (
                  <a
                    href={`https://instagram.com/${item.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition-colors mb-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @{item.instagram.replace("@", "")}
                  </a>
                )}

                {item.sitio_web && (
                  <a
                    href={item.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Sitio web
                  </a>
                )}

                {/* Info adicional */}
                <div className="mt-6 pt-6 border-t border-stone-100 space-y-3">
                  {item.horarios && (
                    <div className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-stone-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-stone-600">{item.horarios}</span>
                    </div>
                  )}

                  {item.experiencia && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-stone-600">Experiencia: {item.experiencia}</span>
                    </div>
                  )}

                  {item.direccion && (
                    <div className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-stone-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-stone-600">{item.direccion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}