"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const categorias = [
  "Salud",
  "Construcción",
  "Diseño",
  "Hogar",
  "Gastronomía",
  "Belleza",
  "Educación",
  "Oficios",
  "Legal",
  "Otros",
];

export default function RegistrarseProfesionalPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    profesion: "",
    categoria: "",
    descripcion: "",
    experiencia: "",
    whatsapp: "",
    email: "",
    instagram: "",
    direccion: "",
  });

  const [estado, setEstado] = useState("idle"); // idle, loading, success, error
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Formatear número de WhatsApp
  const formatearWhatsApp = (numero) => {
    let limpio = numero.replace(/\D/g, "");
    if (limpio.startsWith("0")) {
      limpio = limpio.slice(1);
    }
    if (!limpio.startsWith("54")) {
      limpio = "549" + limpio;
    }
    return limpio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("loading");
    setMensaje("");

    // Validaciones
    if (!formData.nombre.trim()) {
      setEstado("error");
      setMensaje("El nombre es obligatorio");
      return;
    }

    if (!formData.profesion.trim()) {
      setEstado("error");
      setMensaje("La profesión es obligatoria");
      return;
    }

    if (!formData.categoria) {
      setEstado("error");
      setMensaje("Seleccioná una categoría");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setEstado("error");
      setMensaje("El WhatsApp es obligatorio");
      return;
    }

    try {
      const response = await fetch("/api/profesionales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          whatsapp: formatearWhatsApp(formData.whatsapp),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      setEstado("success");
      setMensaje("¡Registro enviado! Revisaremos tu perfil y lo publicaremos pronto.");

      // Limpiar formulario
      setFormData({
        nombre: "",
        profesion: "",
        categoria: "",
        descripcion: "",
        experiencia: "",
        whatsapp: "",
        email: "",
        instagram: "",
        direccion: "",
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
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/profesionales" className="hover:text-white transition-colors">
              Profesionales
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Registrarse</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Registrate como profesional
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Completá el formulario para aparecer en nuestro directorio.
            Es gratis y te ayuda a conseguir más clientes en Famaillá.
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
                ¡Registro enviado!
              </h2>
              <p className="text-emerald-600 mb-4">{mensaje}</p>
              <Link
                href="/profesionales"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver profesionales
              </Link>
            </div>
          )}

          {/* Formulario */}
          {estado !== "success" && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Tus datos
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

              {/* Nombre */}
              <div className="mb-5">
                <label htmlFor="nombre" className="block text-sm font-semibold text-stone-700 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: María García"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Profesión */}
              <div className="mb-5">
                <label htmlFor="profesion" className="block text-sm font-semibold text-stone-700 mb-2">
                  Profesión / Servicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="profesion"
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  placeholder="Ej: Psicóloga, Electricista, Repostera"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Categoría */}
              <div className="mb-5">
                <label htmlFor="categoria" className="block text-sm font-semibold text-stone-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                  required
                >
                  <option value="">Seleccioná una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="mb-5">
                <label htmlFor="descripcion" className="block text-sm font-semibold text-stone-700 mb-2">
                  Descripción de tus servicios
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Contá qué servicios ofrecés, tu experiencia, horarios de atención..."
                  rows={4}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Experiencia */}
              <div className="mb-5">
                <label htmlFor="experiencia" className="block text-sm font-semibold text-stone-700 mb-2">
                  Años de experiencia
                </label>
                <input
                  type="text"
                  id="experiencia"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  placeholder="Ej: 5 años, Más de 10 años"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <hr className="my-8 border-stone-200" />

              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Contacto
              </h2>

              {/* WhatsApp */}
              <div className="mb-5">
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-stone-700 mb-2">
                  WhatsApp <span className="text-red-500">*</span>
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
                    className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  Los clientes te contactarán por este número
                </p>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Instagram */}
              <div className="mb-5">
                <label htmlFor="instagram" className="block text-sm font-semibold text-stone-700 mb-2">
                  Instagram (opcional)
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@tu_usuario"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Dirección */}
              <div className="mb-8">
                <label htmlFor="direccion" className="block text-sm font-semibold text-stone-700 mb-2">
                  Zona de trabajo (opcional)
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Centro de Famaillá, Atiendo a domicilio"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={estado === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-stone-400 disabled:to-stone-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
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
                    Enviar registro
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-stone-400">
                Tu perfil será revisado antes de publicarse.
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