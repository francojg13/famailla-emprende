"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FotoUploader from "@/components/FotoUploader";

// ============================================
// LISTAS PREDEFINIDAS
// ============================================

// Categorías y profesiones para SERVICIOS
const categoriasProfesiones = {
  "Salud": [
    "Médico/a",
    "Psicólogo/a",
    "Odontólogo/a",
    "Kinesiólogo/a",
    "Nutricionista",
    "Enfermero/a",
    "Veterinario/a",
    "Fonoaudiólogo/a",
    "Podólogo/a",
  ],
  "Construcción": [
    "Albañil",
    "Electricista",
    "Plomero/a",
    "Gasista",
    "Pintor/a",
    "Herrero/a",
    "Techista",
    "Durlock/Yesero",
    "Vidriero/a",
    "Ceramista",
  ],
  "Hogar": [
    "Limpieza",
    "Niñera",
    "Cuidador/a de adultos",
    "Jardinero/a",
    "Fumigador/a",
    "Técnico en electrodomésticos",
    "Cerrajero/a",
  ],
  "Diseño y Tecnología": [
    "Diseñador/a Gráfico",
    "Fotógrafo/a",
    "Desarrollador Web",
    "Community Manager",
    "Editor de Video",
    "Diseñador/a de Interiores",
  ],
  "Educación": [
    "Profesor/a particular",
    "Maestro/a",
    "Instructor/a de manejo",
    "Profesor/a de música",
    "Profesor/a de idiomas",
  ],
  "Legal y Contable": [
    "Abogado/a",
    "Contador/a",
    "Gestor/a",
    "Escribano/a",
    "Despachante de aduanas",
  ],
  "Belleza": [
    "Peluquero/a",
    "Manicura",
    "Maquillador/a",
    "Masajista",
    "Cosmetólogo/a",
    "Barbero",
  ],
  "Transporte": [
    "Flete",
    "Remis",
    "Delivery",
    "Traslados médicos",
  ],
  "Oficios": [
    "Mecánico/a",
    "Tapicero/a",
    "Modista/Sastre",
    "Relojero/a",
    "Zapatero/a",
    "Carpintero/a",
    "Soldador/a",
  ],
  "Otro": [],
};

// Categorías y rubros para NEGOCIOS
const categoriasRubros = {
  "Gastronomía": [
    "Panadería",
    "Rotisería",
    "Restaurante",
    "Pizzería",
    "Heladería",
    "Repostería/Tortas",
    "Comidas caseras",
    "Food truck",
    "Catering",
  ],
  "Comercio": [
    "Kiosco",
    "Almacén",
    "Ferretería",
    "Bazar",
    "Librería",
    "Tienda de ropa",
    "Zapatería",
    "Juguetería",
    "Cotillón",
  ],
  "Salud y Belleza": [
    "Farmacia",
    "Peluquería",
    "Barbería",
    "Spa",
    "Óptica",
    "Ortopedia",
  ],
  "Servicios": [
    "Lavadero de autos",
    "Lavandería",
    "Imprenta",
    "Cerrajería",
    "Taller mecánico",
    "Gomería",
  ],
  "Tecnología": [
    "Reparación de celulares",
    "Reparación de PC",
    "Venta de accesorios",
    "Cibercafé",
  ],
  "Hogar": [
    "Mueblería",
    "Colchonería",
    "Artículos de limpieza",
    "Vivero",
    "Corralón",
  ],
  "Entretenimiento": [
    "Salón de fiestas",
    "Alquiler de inflables",
    "DJ/Sonido",
    "Fotografía de eventos",
  ],
  "Otro": [],
};

export default function RegistrarseDirectorioPage() {
  const [formData, setFormData] = useState({
    tipo: "",
    categoria: "",
    profesion: "",
    profesionPersonalizada: "",
    nombre: "",
    descripcion: "",
    experiencia: "",
    horarios: "",
    sitio_web: "",
    whatsapp: "",
    email: "",
    instagram: "",
    direccion: "",
    foto_url: "",
  });

  const [estado, setEstado] = useState("idle");
  const [mensaje, setMensaje] = useState("");

  // Obtener lista según tipo seleccionado
  const categoriasDisponibles = formData.tipo === "servicio" 
    ? Object.keys(categoriasProfesiones) 
    : formData.tipo === "negocio" 
      ? Object.keys(categoriasRubros) 
      : [];

  const profesionesDisponibles = formData.tipo === "servicio"
    ? categoriasProfesiones[formData.categoria] || []
    : formData.tipo === "negocio"
      ? categoriasRubros[formData.categoria] || []
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia el tipo, resetear categoría y profesión
    if (name === "tipo") {
      setFormData((prev) => ({
        ...prev,
        tipo: value,
        categoria: "",
        profesion: "",
        profesionPersonalizada: "",
      }));
    }
    // Si cambia la categoría, resetear profesión
    else if (name === "categoria") {
      setFormData((prev) => ({
        ...prev,
        categoria: value,
        profesion: "",
        profesionPersonalizada: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFotoUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      foto_url: url,
    }));
  };

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
    if (!formData.tipo) {
      setEstado("error");
      setMensaje("Seleccioná un tipo (Servicio o Negocio)");
      return;
    }

    if (!formData.categoria) {
      setEstado("error");
      setMensaje("Seleccioná una categoría");
      return;
    }

    // Determinar la profesión final
    const profesionFinal = formData.profesion === "Otro (especificar)"
      ? formData.profesionPersonalizada
      : formData.profesion;

    if (!profesionFinal.trim()) {
      setEstado("error");
      setMensaje(formData.tipo === "servicio" 
        ? "Seleccioná o escribí tu profesión" 
        : "Seleccioná o escribí el rubro de tu negocio");
      return;
    }

    if (!formData.nombre.trim()) {
      setEstado("error");
      setMensaje(formData.tipo === "servicio" 
        ? "Tu nombre es obligatorio" 
        : "El nombre del negocio es obligatorio");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setEstado("error");
      setMensaje("El número de WhatsApp es obligatorio");
      return;
    }

    try {
      const response = await fetch("/api/directorio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: formData.tipo,
          categoria: formData.categoria,
          profesion: profesionFinal,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          experiencia: formData.tipo === "servicio" ? formData.experiencia : null,
          horarios: formData.tipo === "negocio" ? formData.horarios : null,
          sitio_web: formData.tipo === "negocio" ? formData.sitio_web : null,
          whatsapp: formatearWhatsApp(formData.whatsapp),
          email: formData.email,
          instagram: formData.instagram,
          direccion: formData.direccion,
          foto_url: formData.foto_url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      setEstado("success");
      setMensaje("¡Tu registro fue enviado! Lo revisaremos y publicaremos pronto.");

      setFormData({
        tipo: "",
        categoria: "",
        profesion: "",
        profesionPersonalizada: "",
        nombre: "",
        descripcion: "",
        experiencia: "",
        horarios: "",
        sitio_web: "",
        whatsapp: "",
        email: "",
        instagram: "",
        direccion: "",
        foto_url: "",
      });
    } catch (error) {
      setEstado("error");
      setMensaje(error.message || "Ocurrió un error. Intentá de nuevo.");
    }
  };

  const esServicio = formData.tipo === "servicio";
  const esNegocio = formData.tipo === "negocio";

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/directorio" className="hover:text-white transition-colors">Directorio</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Registrarse</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Registrate en el Directorio
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Dá a conocer tu servicio profesional o negocio a toda la comunidad de Famaillá. ¡Es gratis!
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
                href="/directorio"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver el directorio
              </Link>
            </div>
          )}

          {/* Formulario */}
          {estado !== "success" && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
              
              {/* ============================================
                  TIPO DE REGISTRO
                  ============================================ */}
              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                ¿Qué querés registrar?
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

              {/* Selector de tipo */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: "tipo", value: "servicio" } })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    esServicio
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    esServicio ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-500"
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold mb-1 ${esServicio ? "text-emerald-700" : "text-stone-800"}`}>
                    Servicio Profesional
                  </h3>
                  <p className="text-sm text-stone-500">
                    Electricista, psicólogo, fotógrafo, etc.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: "tipo", value: "negocio" } })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    esNegocio
                      ? "border-purple-500 bg-purple-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    esNegocio ? "bg-purple-500 text-white" : "bg-stone-100 text-stone-500"
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold mb-1 ${esNegocio ? "text-purple-700" : "text-stone-800"}`}>
                    Negocio / Emprendimiento
                  </h3>
                  <p className="text-sm text-stone-500">
                    Panadería, kiosco, taller, etc.
                  </p>
                </button>
              </div>

              {/* ============================================
                  CATEGORÍA Y PROFESIÓN/RUBRO
                  ============================================ */}
              {formData.tipo && (
                <>
                  <hr className="my-8 border-stone-200" />

                  <h2 className="text-2xl font-bold text-stone-800 mb-6">
                    {esServicio ? "Tu profesión" : "Datos del negocio"}
                  </h2>

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
                      {categoriasDisponibles.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Profesión / Rubro */}
                  {formData.categoria && (
                    <div className="mb-5">
                      <label htmlFor="profesion" className="block text-sm font-semibold text-stone-700 mb-2">
                        {esServicio ? "Profesión / Servicio" : "Rubro / Tipo de negocio"} <span className="text-red-500">*</span>
                      </label>
                      {profesionesDisponibles.length > 0 ? (
                        <select
                          id="profesion"
                          name="profesion"
                          value={formData.profesion}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                          required
                        >
                          <option value="">Seleccioná una opción</option>
                          {profesionesDisponibles.map((prof) => (
                            <option key={prof} value={prof}>{prof}</option>
                          ))}
                          <option value="Otro (especificar)">Otro (especificar)</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          id="profesion"
                          name="profesionPersonalizada"
                          value={formData.profesionPersonalizada}
                          onChange={handleChange}
                          placeholder={esServicio ? "Ej: Instructor de yoga" : "Ej: Tienda de mascotas"}
                          className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                          required
                        />
                      )}
                    </div>
                  )}

                  {/* Campo personalizado si eligió "Otro" */}
                  {formData.profesion === "Otro (especificar)" && (
                    <div className="mb-5">
                      <label htmlFor="profesionPersonalizada" className="block text-sm font-semibold text-stone-700 mb-2">
                        Especificá {esServicio ? "tu profesión" : "el rubro"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="profesionPersonalizada"
                        name="profesionPersonalizada"
                        value={formData.profesionPersonalizada}
                        onChange={handleChange}
                        placeholder={esServicio ? "Ej: Instructor de yoga" : "Ej: Tienda de mascotas"}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* ============================================
                  DATOS PERSONALES / DEL NEGOCIO
                  ============================================ */}
              {formData.categoria && (
                <>
                  <hr className="my-8 border-stone-200" />

                  <h2 className="text-2xl font-bold text-stone-800 mb-6">
                    {esServicio ? "Tus datos" : "Información del negocio"}
                  </h2>

                  {/* Foto / Logo */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      {esServicio ? "Tu foto (opcional)" : "Logo del negocio (opcional)"}
                    </label>
                    <FotoUploader
                      onUpload={handleFotoUpload}
                      fotoActual={formData.foto_url}
                      tipo={esServicio ? "perfil" : "logo"}
                    />
                    <p className="mt-2 text-xs text-stone-400">
                      {esServicio 
                        ? "Una foto profesional genera más confianza." 
                        : "El logo ayuda a que te reconozcan."}
                    </p>
                  </div>

                  {/* Nombre */}
                  <div className="mb-5">
                    <label htmlFor="nombre" className="block text-sm font-semibold text-stone-700 mb-2">
                      {esServicio ? "Tu nombre completo" : "Nombre del negocio"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder={esServicio ? "Ej: Juan Pérez" : "Ej: Panadería Don José"}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div className="mb-5">
                    <label htmlFor="descripcion" className="block text-sm font-semibold text-stone-700 mb-2">
                      {esServicio ? "Descripción de tus servicios" : "Descripción del negocio"}
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder={esServicio 
                        ? "Contá qué servicios ofrecés, tu experiencia, especialidades..." 
                        : "Describí tu negocio, qué productos o servicios ofrecés..."}
                      rows={4}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400 resize-none"
                    />
                  </div>

                  {/* Campo específico: Experiencia (servicio) o Horarios (negocio) */}
                  {esServicio && (
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
                        placeholder="Ej: 5 años"
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                      />
                    </div>
                  )}

                  {esNegocio && (
                    <>
                      <div className="mb-5">
                        <label htmlFor="horarios" className="block text-sm font-semibold text-stone-700 mb-2">
                          Horarios de atención
                        </label>
                        <input
                          type="text"
                          id="horarios"
                          name="horarios"
                          value={formData.horarios}
                          onChange={handleChange}
                          placeholder="Ej: Lunes a Viernes 8:00 a 20:00"
                          className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                        />
                      </div>

                      <div className="mb-5">
                        <label htmlFor="sitio_web" className="block text-sm font-semibold text-stone-700 mb-2">
                          Sitio web o link
                        </label>
                        <input
                          type="url"
                          id="sitio_web"
                          name="sitio_web"
                          value={formData.sitio_web}
                          onChange={handleChange}
                          placeholder="Ej: https://www.minegocio.com"
                          className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                        />
                      </div>
                    </>
                  )}

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
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="mb-5">
                    <label htmlFor="instagram" className="block text-sm font-semibold text-stone-700 mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-stone-400">@</span>
                      </div>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="tu_usuario"
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="mb-8">
                    <label htmlFor="direccion" className="block text-sm font-semibold text-stone-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Ej: Av. San Martín 123, Famaillá"
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Botón submit */}
                  <button
                    type="submit"
                    disabled={estado === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-stone-400 disabled:to-stone-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 disabled:shadow-none transition-all duration-300"
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
                    Tu registro será revisado antes de publicarse.
                    Esto suele demorar menos de 24 horas.
                  </p>
                </>
              )}
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}