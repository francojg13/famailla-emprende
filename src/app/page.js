import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";

// Obtener empleos destacados
async function getEmpleosDestacados() {
  const { data, error } = await supabase
    .from("empleos")
    .select("id, titulo, empresa, ubicacion, tipo")
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
    .select("id, titulo, fecha, lugar, organizador")
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

// Obtener estadísticas
async function getStats() {
  const [empleosRes, eventosRes] = await Promise.all([
    supabase.from("empleos").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase.from("eventos").select("*", { count: "exact", head: true }).eq("activo", true),
  ]);

  return {
    empleos: empleosRes.count || 0,
    eventos: eventosRes.count || 0,
    emprendedores: 120,
  };
}

export default async function Home() {
  const [empleosDestacados, eventosProximos, stats] = await Promise.all([
    getEmpleosDestacados(),
    getEventosProximos(),
    getStats(),
  ]);

  const statsDisplay = [
    { numero: `${stats.empleos}+`, label: "Empleos publicados" },
    { numero: `${stats.emprendedores}+`, label: "Emprendedores conectados" },
    { numero: `${stats.eventos}`, label: "Eventos en agenda" },
  ];

  // Función para formatear fecha de eventos
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString("es-AR", { month: "short" });
    return { dia, mes: mes.charAt(0).toUpperCase() + mes.slice(1) };
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
              Plataforma local de empleo, eventos, emprendedores y profesionales
            </span>

            {/* Título principal */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Conectamos el talento
              <span className="block text-amber-300">con Famaillá</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl leading-relaxed">
              Encontrá oportunidades laborales, descubrí eventos y capacitaciones
              para hacer crecer tu emprendimiento en nuestra ciudad.
            </p>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/empleos"
                className="group inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Ver empleos disponibles
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <Link
                href="/eventos"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700/50 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-emerald-700/70 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Próximos eventos
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divisor */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
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
          <div className="grid grid-cols-3 gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">
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
          {/* Encabezado de sección */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                Oportunidades
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Empleos destacados
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Las últimas ofertas laborales de empresas y comercios de Famaillá
              </p>
            </div>
            <Link
              href="/empleos"
              className="group inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              Ver todos los empleos
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Grid de empleos */}
          {empleosDestacados.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {empleosDestacados.map((empleo) => (
                <article
                  key={empleo.id}
                  className="group bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Icono de empresa */}
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                    {empleo.empresa.charAt(0)}
                  </div>

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
                  <p className="text-stone-400 text-sm flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {empleo.ubicacion}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-2xl">
              <p className="text-stone-500">
                Próximamente publicaremos ofertas laborales
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          EVENTOS PRÓXIMOS
          ============================================ */}
      <section className="py-20 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
                Capacitate
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Próximos eventos
              </h2>
              <p className="text-stone-500 mt-2 max-w-lg">
                Talleres, cursos y eventos para emprendedores de nuestra ciudad
              </p>
            </div>
            <Link
              href="/eventos"
              className="group inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              Ver calendario completo
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Cards de eventos */}
          {eventosProximos.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {eventosProximos.map((evento) => {
                const { dia, mes } = formatearFecha(evento.fecha);
                return (
                  <article
                    key={evento.id}
                    className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-1 transition-all duration-300 flex gap-5"
                  >
                    {/* Fecha destacada */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold leading-none">{dia}</span>
                      <span className="text-xs uppercase tracking-wide opacity-90">
                        {mes}
                      </span>
                    </div>

                    {/* Info del evento */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                        {evento.titulo}
                      </h3>
                      <p className="text-stone-500 text-sm flex items-center gap-1 mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {evento.lugar}
                      </p>
                      <p className="text-stone-400 text-sm">
                        Organiza: {evento.organizador}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500">
                Próximamente publicaremos eventos y capacitaciones
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA SECTION - PARA EMPRESAS
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

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            ¿Tenés un negocio en Famaillá?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publicá tus ofertas laborales
            <span className="text-emerald-400"> gratis</span>
          </h2>

          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Conectá con el talento local. Publicar es simple: completás un
            formulario y los candidatos te contactan directamente por WhatsApp.
          </p>

          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Publicar empleo
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}