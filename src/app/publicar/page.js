"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function PublicarEmpleoPage() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "Tiempo completo",
    empresa: "",
    ubicacion: "",
    whatsapp: "",
  });

  const [estado, setEstado] = useState("idle"); // idle, loading, success, error
  const [mensaje, setMensaje] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Formatear número de WhatsApp (solo números, con código de país)
  const formatearWhatsApp = (numero) => {
    // Eliminar todo lo que no sea número
    let limpio = numero.replace(/\D/g, "");

    // Si empieza con 0, lo quitamos
    if (limpio.startsWith("0")) {
      limpio = limpio.slice(1);
    }

    // Si no tiene código de país, agregamos 549 (Argentina móvil)
    if (!limpio.startsWith("54")) {
      limpio = "549" + limpio;
    }

    return limpio;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("loading");
    setMensaje("");

    // Validaciones básicas
    if (!formData.titulo.trim()) {
      setEstado("error");
      setMensaje("El título del puesto es obligatorio");
      return;
    }

    if (!formData.empresa.trim()) {
      setEstado("error");
      setMensaje("El nombre de la empresa es obligatorio");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setEstado("error");
      setMensaje("El número de WhatsApp es obligatorio");
      return;
    }

    try {
      const response = await fetch("/api/empleos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          whatsapp: formatearWhatsApp(formData.whatsapp),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al publicar el empleo");
      }

      setEstado("success");
      setMensaje("¡Tu empleo fue enviado! Lo revisaremos y publicaremos pronto.");
      
      // Limpiar formulario
      setFormData({
        titulo: "",
        descripcion: "",
        tipo: "Tiempo completo",
        empresa: "",
        ubicacion: "",
        whatsapp: "",
      });
    } catch (error) {
      setEstado("error");
      setMensaje(error.message || "Ocurrió un error. Intentá de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-16 relative overflow-hidden">
        {/* Formas decorativas */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/empleos" className="hover:text-white transition-colors">
              Empleos
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Publicar</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Publicá tu empleo
          </h1>
          <p className="text-emerald-50 text-lg max-w-2xl">
            Completá el formulario y recibí postulantes directamente en tu WhatsApp.
            ¡Es gratis!
          </p>
        </div>
      </section>

      {/* ============================================
          FORMULARIO
          ============================================ */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* Mensaje de éxito */}
          {estado === "success" && (
            <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                ¡Empleo enviado!
              </h2>
              <p className="text-emerald-600 mb-4">
                {mensaje}
              </p>
              <Link
                href="/empleos"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver empleos publicados
              </Link>
            </div>
          )}

          {/* Formulario */}
          {estado !== "success" && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Datos del empleo
              </h2>

              {/* Mensaje de error */}
              {estado === "error" && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{mensaje}</p>
                </div>
              )}

              {/* Título del puesto */}
              <div className="mb-5">
                <label htmlFor="titulo" className="block text-sm font-semibold text-stone-700 mb-2">
                  Título del puesto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Vendedor/a para comercio"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              {/* Tipo de empleo */}
              <div className="mb-5">
                <label htmlFor="tipo" className="block text-sm font-semibold text-stone-700 mb-2">
                  Tipo de empleo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Temporal">Temporal</option>
                  <option value="Pasantía">Pasantía</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              {/* Descripción */}
              <div className="mb-5">
                <label htmlFor="descripcion" className="block text-sm font-semibold text-stone-700 mb-2">
                  Descripción del puesto
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describí las tareas, requisitos, horarios, beneficios..."
                  rows={4}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-400 resize-none"
                />
                <p className="mt-1 text-xs text-stone-400">
                  Opcional pero recomendado. Una buena descripción atrae mejores candidatos.
                </p>
              </div>

              <hr className="my-8 border-stone-200" />

              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Datos de tu empresa
              </h2>

              {/* Nombre de la empresa */}
              <div className="mb-5">
                <label htmlFor="empresa" className="block text-sm font-semibold text-stone-700 mb-2">
                  Nombre de la empresa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Ej: Almacén Don Pedro"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              {/* Ubicación */}
              <div className="mb-5">
                <label htmlFor="ubicacion" className="block text-sm font-semibold text-stone-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Centro, Famaillá"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-400"
                />
                <p className="mt-1 text-xs text-stone-400">
                  Barrio o zona de Famaillá donde está el trabajo.
                </p>
              </div>

              {/* WhatsApp */}
              <div className="mb-8">
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-stone-700 mb-2">
                  WhatsApp de contacto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="3863 123456"
                    className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-400"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  Los candidatos te contactarán por este número.
                </p>
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={estado === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-stone-400 disabled:to-stone-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 disabled:shadow-none transition-all duration-300"
              >
                {estado === "loading" ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar empleo para revisión
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>

              {/* Nota sobre moderación */}
              <p className="mt-4 text-center text-xs text-stone-400">
                Tu empleo será revisado antes de publicarse. 
                Esto suele demorar menos de 24 horas.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}