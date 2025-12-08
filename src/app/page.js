import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";

// ============================================
// FUNCIONES DE DATOS
// ============================================

// Obtener empleos destacados
async function getEmpleosDestacados() {
  const { data, error } = await supabase
    .from("empleos")
    .select("id, titulo, empresa, ubicacion, tipo, logo_url")
    .eq("activo", true)
    .eq("destacado", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error al cargar empleos:", error);
    return [];
  }

  return data;
}

// Obtener próximos eventos
async function getEventosProximos() {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("eventos")
    .select("id, titulo, fecha, lugar, organizador, slug")
    .eq("activo", true)
    .gte("fecha", hoy)
    .order("fecha", { ascending: true })
    .limit(2);

  if (error) {
    console.error("Error al cargar eventos:", error);
    return [];
  }

  return data;
}

// Obtener directorio destacado (verificados o destacados)
async function getDirectorioDestacado() {
  const { data, error } = await supabase
    .from("profesionales")
    .select("id, nombre, profesion, tipo, categoria, foto_url, slug, verificado, puntuacion_promedio")
    .eq("activo", true)
    .or("destacado.eq.true,verificado.eq.true")
    .order("verificado", { ascending: false })
    .order("puntuacion_promedio", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error al cargar directorio:", error);
    return [];
  }

  return data;
}

// Obtener artículos recientes del blog
async function getArticulosRecientes() {
  const { data, error } = await supabase
    .from("articulos")
    .select("id, titulo, slug, extracto, imagen_url, created_at, categoria")
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error al cargar artículos:", error);
    return [];
  }

  return data;
}

// Obtener estadísticas reales
async function getStats() {
  const [empleosRes, eventosRes, directorioRes, articulosRes] = await Promise.all([
    supabase.from("empleos").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase.from("eventos").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase.from("profesionales").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase.from("articulos").select("*", { count: "exact", head: true }).eq("publicado", true),
  ]);

  return {
    empleos: empleosRes.count || 0,
    eventos: eventosRes.count || 0,
    directorio: directorioRes.count || 0,
    articulos: articulosRes.count || 0,
  };
}

// ============================================
// COMPONENTE BANNER PUBLICITARIO
// ============================================
function BannerPublicitario({ ubicacion }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="bg-gradient-to-r from-stone-100 to-stone-200 border-2 border-dashed border-stone-300 rounded-2xl p-4 flex items-center justify-center min-h-[90px]">
        <div className="text-center">
          <p className="text-stone-400 text-sm font-medium">
            📢 Espacio publicitario disponible
          </p>
          <p className="text-stone-400 text-xs">
            728 x 90 px • {ubicacion}
          </p>
          <Link 
            href="/contacto" 
            className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold mt-1 inline-block"
          >
            Contactanos para anunciar →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================
export default async function Home() {
  const [empleosDestacados, eventosProximos, directorioDestacado, articulosRecientes, stats] = await Promise.all([
    getEmpleosDestacados(),
    getEventosProximos(),
    getDirectorioDestacado(),
    getArticulosRecientes(),
    getStats(),
  ]);

  const statsDisplay = [
    { numero: `+${stats.empleos}`, label: "Empleos activos", color: "text-emerald-600" },
    { numero: `+${stats.directorio}`, label: "En el directorio", color: "text-indigo-600" },
    { numero: `${stats.eventos}`, label: "Eventos próximos", color: "text-amber-600" },
    { numero: `${stats.articulos}`, label: "Artículos del blog", color: "text-rose-600" },
  ];

  // Función para formatear fecha de eventos
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString("es-AR", { month: "short" });
    return { dia, mes: mes.charAt(0).toUpperCase() + mes.slice(1) };
  };

  // Función para formatear fecha de artículos
  const formatearFechaArticulo = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-AR", { 
      day: "numeric", 
      month: "short",
      year: "numeric"
    });
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Formas decorativas */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              La plataforma de Famaillá
            </span>

            {/* Título principal */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Empleos, servicios y
              <span className="block text-amber-300">negocios locales</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl leading-relaxed">
              Encontrá trabajo, descubrí profesionales y negocios de confianza, 
              y mantenete al día con los eventos de nuestra ciudad.
            </p>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/empleos"
                className="group inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Ver empleos
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/directorio"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700/50 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-emerald-700/70 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Explorar directorio
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divisor */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#fafaf9"
            />
          </svg>
        </div>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <p className={`text-3xl md:text-4xl font-bold ${stat.color} mb-1`}>
                  {stat.numero}
                </p>
                <p className="text-stone-500 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          EMPLEOS DESTACADOS
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                Oportunidades laborales
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Empleos destacados
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Las últimas ofertas de empresas y comercios de Famaillá
              </p>
            </div>
            <Link
              href="/empleos"
              className="group inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Ver todos los empleos
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de empleos */}
          {empleosDestacados.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {empleosDestacados.map((empleo) => (
                <Link key={empleo.id} href="/empleos">
                  <article className="group bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 h-full">
                    {/* Logo o inicial */}
                    {empleo.logo_url ? (
                      <img
                        src={empleo.logo_url}
                        alt={empleo.empresa}
                        className="w-14 h-14 rounded-xl object-cover shadow-md mb-4 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
                        {empleo.empresa.charAt(0)}
                      </div>
                    )}

                    {/* Badge de tipo */}
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                      {empleo.tipo}
                    </span>

                    {/* Título */}
                    <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors">
                      {empleo.titulo}
                    </h3>

                    {/* Empresa */}
                    <p className="text-stone-600 text-sm mb-1">{empleo.empresa}</p>

                    {/* Ubicación */}
                    {empleo.ubicacion && (
                      <p className="text-stone-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {empleo.ubicacion}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-2xl">
              <p className="text-stone-500">Próximamente publicaremos ofertas laborales</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          BANNER PUBLICITARIO 1
          ============================================ */}
      <section className="py-6 bg-white">
        <BannerPublicitario ubicacion="Sección superior" />
      </section>

      {/* ============================================
          DIRECTORIO DESTACADO
          ============================================ */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Profesionales y negocios
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Directorio destacado
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Servicios verificados y emprendimientos de confianza de nuestra ciudad
              </p>
            </div>
            <Link
              href="/directorio"
              className="group inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Ver directorio completo
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid del directorio */}
          {directorioDestacado.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {directorioDestacado.map((item) => {
                const esNegocio = item.tipo === "negocio";
                const iniciales = item.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <Link key={item.id} href={`/directorio/${item.slug}`}>
                    <article className="group bg-white rounded-2xl p-6 border border-stone-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 h-full text-center">
                      {/* Foto o avatar */}
                      <div className="flex justify-center mb-4">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nombre}
                            className={`w-20 h-20 object-cover shadow-md group-hover:scale-105 transition-transform ${
                              esNegocio ? "rounded-xl" : "rounded-full"
                            }`}
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${
                              esNegocio
                                ? "rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500"
                                : "rounded-full bg-gradient-to-br from-emerald-500 to-teal-500"
                            }`}
                          >
                            {esNegocio ? (
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            ) : (
                              <span className="text-white font-bold text-xl">{iniciales}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          esNegocio ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {esNegocio ? "Negocio" : "Servicio"}
                        </span>
                        {item.verificado && (
                          <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Verificado
                          </span>
                        )}
                      </div>

                      {/* Nombre */}
                      <h3 className="text-lg font-semibold text-stone-800 mb-1 group-hover:text-indigo-700 transition-colors">
                        {item.nombre}
                      </h3>

                      {/* Profesión */}
                      <p className="text-stone-500 text-sm">
                        {item.profesion}
                      </p>

                      {/* Puntuación */}
                      {item.puntuacion_promedio > 0 && (
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-stone-600 font-medium">{item.puntuacion_promedio}</span>
                        </div>
                      )}
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
              <p className="text-stone-500 mb-4">Sé el primero en registrarte en nuestro directorio</p>
              <Link
                href="/directorio/registrarse"
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Registrarme gratis →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          EVENTOS PRÓXIMOS
          ============================================ */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                Agenda local
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Próximos eventos
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Talleres, cursos y eventos para la comunidad de Famaillá
              </p>
            </div>
            <Link
              href="/eventos"
              className="group inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              Ver calendario completo
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Cards de eventos */}
          {eventosProximos.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {eventosProximos.map((evento) => {
                const { dia, mes } = formatearFecha(evento.fecha);
                return (
                  <Link key={evento.id} href={`/eventos/${evento.slug}`}>
                    <article className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-1 transition-all duration-300 flex gap-5">
                      {/* Fecha destacada */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform">
                        <span className="text-xl font-bold leading-none">{dia}</span>
                        <span className="text-xs uppercase tracking-wide opacity-90">{mes}</span>
                      </div>

                      {/* Info del evento */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                          {evento.titulo}
                        </h3>
                        <p className="text-stone-500 text-sm flex items-center gap-1 mb-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {evento.lugar}
                        </p>
                        <p className="text-stone-400 text-sm">
                          Organiza: {evento.organizador}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500">Próximamente publicaremos eventos y capacitaciones</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          BANNER PUBLICITARIO 2
          ============================================ */}
      <section className="py-6 bg-stone-50">
        <BannerPublicitario ubicacion="Sección intermedia" />
      </section>

      {/* ============================================
          BLOG RECIENTE
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
                Noticias y consejos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Últimos artículos
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Información útil para emprendedores y la comunidad
              </p>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors"
            >
              Ver todos los artículos
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Grid de artículos */}
          {articulosRecientes.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {articulosRecientes.map((articulo) => (
                <Link key={articulo.id} href={`/blog/${articulo.slug}`}>
                  <article className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Imagen */}
                    {articulo.imagen_url ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={articulo.imagen_url}
                          alt={articulo.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Categoría y fecha */}
                      <div className="flex items-center gap-2 mb-3">
                        {articulo.categoria && (
                          <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {articulo.categoria}
                          </span>
                        )}
                        <span className="text-stone-400 text-xs">
                          {formatearFechaArticulo(articulo.created_at)}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-rose-700 transition-colors line-clamp-2">
                        {articulo.titulo}
                      </h3>

                      {/* Extracto */}
                      {articulo.extracto && (
                        <p className="text-stone-500 text-sm line-clamp-2 flex-1">
                          {articulo.extracto}
                        </p>
                      )}

                      {/* Leer más */}
                      <div className="mt-4 pt-4 border-t border-stone-100">
                        <span className="inline-flex items-center gap-1 text-rose-600 text-sm font-medium group-hover:gap-2 transition-all">
                          Leer artículo
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-2xl">
              <p className="text-stone-500">Próximamente publicaremos artículos y noticias</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA SECTION - MÚLTIPLE
          ============================================ */}
      <section className="py-20 bg-stone-800 text-white relative overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5L25 18l-5 2.5z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              ¿Querés ser parte?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unite a la comunidad de Famaillá
            </h2>
            <p className="text-stone-300 text-lg max-w-2xl mx-auto">
              Publicar es gratis y simple. Conectá con tu comunidad local.
            </p>
          </div>

          {/* Grid de CTAs */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* CTA Empleos */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Publicá un empleo</h3>
              <p className="text-stone-400 text-sm mb-4">
                Recibí postulantes directo en tu WhatsApp
              </p>
              <Link
                href="/publicar"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Publicar gratis
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>

            {/* CTA Directorio */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sumá tu servicio</h3>
              <p className="text-stone-400 text-sm mb-4">
                Dá a conocer tu profesión o negocio
              </p>
              <Link
                href="/directorio/registrarse"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Registrarme
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>

            {/* CTA Eventos */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Publicá un evento</h3>
              <p className="text-stone-400 text-sm mb-4">
                Compartí talleres, cursos o encuentros
              </p>
              <Link
                href="/eventos/publicar"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Crear evento
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}