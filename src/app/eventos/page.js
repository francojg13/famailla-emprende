import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Categorías de eventos
const categorias = [
  "Capacitación",
  "Taller",
  "Curso",
  "Feria",
  "Cultural",
  "Deportivo",
  "Social",
  "Networking",
  "Charla",
  "Otro",
];

// Obtener eventos con filtros
async function getEventos(estado = "proximos", categoria = null, busqueda = null) {
  const hoy = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("eventos")
    .select("*")
    .eq("activo", true);

  // Filtrar por estado
  if (estado === "proximos") {
    query = query.gte("fecha", hoy).order("fecha", { ascending: true });
  } else if (estado === "pasados") {
    query = query.lt("fecha", hoy).order("fecha", { ascending: false });
  } else {
    // Todos: primero próximos, luego pasados
    query = query.order("fecha", { ascending: false });
  }

  // Filtrar por categoría
  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  // Ordenar destacados primero (solo para próximos)
  if (estado === "proximos") {
    query = query.order("destacado", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar eventos:", error);
    return [];
  }

  // Filtrar por búsqueda en cliente
  if (busqueda && data) {
    const busquedaLower = busqueda.toLowerCase();
    return data.filter(
      (evento) =>
        evento.titulo.toLowerCase().includes(busquedaLower) ||
        (evento.lugar && evento.lugar.toLowerCase().includes(busquedaLower)) ||
        (evento.organizador && evento.organizador.toLowerCase().includes(busquedaLower)) ||
        (evento.descripcion && evento.descripcion.toLowerCase().includes(busquedaLower))
    );
  }

  return data;
}

// Obtener conteos
async function getConteos() {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("eventos")
    .select("fecha, categoria")
    .eq("activo", true);

  if (error) return { proximos: 0, pasados: 0, categorias: {}, total: 0 };

  let proximos = 0;
  let pasados = 0;
  const categoriaConteo = {};

  data.forEach((evento) => {
    if (evento.fecha >= hoy) {
      proximos++;
    } else {
      pasados++;
    }
    if (evento.categoria) {
      categoriaConteo[evento.categoria] = (categoriaConteo[evento.categoria] || 0) + 1;
    }
  });

  return {
    proximos,
    pasados,
    categorias: categoriaConteo,
    total: data.length,
  };
}

export default async function EventosPage({ searchParams }) {
  const params = await searchParams;
  const estadoFiltro = params?.estado || "proximos";
  const categoriaFiltro = params?.categoria || null;
  const busqueda = params?.q || null;

  const [eventos, conteos] = await Promise.all([
    getEventos(estadoFiltro, categoriaFiltro, busqueda),
    getConteos(),
  ]);

  const hoy = new Date().toISOString().split("T")[0];

  // Construir URL con filtros
  const buildUrl = (newParams) => {
    const url = new URLSearchParams();

    const estado = newParams.estado !== undefined ? newParams.estado : estadoFiltro;
    const categoria = newParams.categoria !== undefined ? newParams.categoria : categoriaFiltro;
    const q = newParams.q !== undefined ? newParams.q : busqueda;

    if (estado && estado !== "proximos") url.set("estado", estado);
    if (categoria) url.set("categoria", categoria);
    if (q) url.set("q", q);

    const queryString = url.toString();
    return queryString ? `/eventos?${queryString}` : "/eventos";
  };

  // Formatear fecha para eventos pasados en grid
  const formatearFechaPasado = (fechaStr) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-400 to-orange-400 text-white py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-amber-100 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Eventos</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eventos y capacitaciones
          </h1>
          <p className="text-amber-50 text-lg max-w-2xl mb-8">
            Talleres, cursos, ferias y charlas para emprendedores de Famaillá.
            ¡Capacitate y hacé crecer tu negocio!
          </p>

          {/* Barra de búsqueda */}
          <form action="/eventos" method="GET" className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={busqueda || ""}
                placeholder="Buscar por título, lugar, organizador..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-amber-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Mantener filtros existentes */}
              {estadoFiltro !== "proximos" && (
                <input type="hidden" name="estado" value={estadoFiltro} />
              )}
              {categoriaFiltro && (
                <input type="hidden" name="categoria" value={categoriaFiltro} />
              )}
            </div>
          </form>

          {/* Contador */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">
              {conteos.proximos} {conteos.proximos === 1 ? "evento próximo" : "eventos próximos"}
              {conteos.pasados > 0 && ` · ${conteos.pasados} pasados`}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FILTROS
          ============================================ */}
      <section className="py-6 bg-white border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filtro por estado */}
          <div className="mb-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-stone-500 flex-shrink-0 font-medium">
                Mostrar:
              </span>
              <Link
                href={buildUrl({ estado: "proximos", categoria: categoriaFiltro })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  estadoFiltro === "proximos"
                    ? "bg-amber-500 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Próximos ({conteos.proximos})
              </Link>
              <Link
                href={buildUrl({ estado: "pasados", categoria: categoriaFiltro })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  estadoFiltro === "pasados"
                    ? "bg-stone-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pasados ({conteos.pasados})
              </Link>
              <Link
                href={buildUrl({ estado: "todos", categoria: categoriaFiltro })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  estadoFiltro === "todos"
                    ? "bg-orange-500 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Todos ({conteos.total})
              </Link>
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-stone-500 flex-shrink-0 font-medium">
              Categoría:
            </span>
            <Link
              href={buildUrl({ categoria: null })}
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                !categoriaFiltro
                  ? "bg-orange-500 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todas
            </Link>
            {categorias.map((cat) => {
              const count = conteos.categorias[cat] || 0;
              if (count === 0) return null;

              return (
                <Link
                  key={cat}
                  href={buildUrl({ categoria: cat })}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    categoriaFiltro === cat
                      ? "bg-orange-500 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat} ({count})
                </Link>
              );
            })}
          </div>

          {/* Filtros activos */}
          {(categoriaFiltro || busqueda || estadoFiltro !== "proximos") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-stone-500">Filtros activos:</span>
              {busqueda && (
                <Link
                  href={buildUrl({ q: null })}
                  className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
                >
                  "{busqueda}"
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              {estadoFiltro !== "proximos" && (
                <Link
                  href={buildUrl({ estado: "proximos" })}
                  className="inline-flex items-center gap-1 bg-stone-200 text-stone-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-stone-300 transition-colors"
                >
                  {estadoFiltro === "pasados" ? "Pasados" : "Todos"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              {categoriaFiltro && (
                <Link
                  href={buildUrl({ categoria: null })}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
                >
                  {categoriaFiltro}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              <Link
                href="/eventos"
                className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
              >
                Limpiar todo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          LISTADO DE EVENTOS
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {eventos.length > 0 ? (
            <>
              {/* Título dinámico */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-800">
                  {estadoFiltro === "proximos" && "Próximos eventos"}
                  {estadoFiltro === "pasados" && "Eventos pasados"}
                  {estadoFiltro === "todos" && "Todos los eventos"}
                  {categoriaFiltro && ` de ${categoriaFiltro}`}
                </h2>
                <p className="text-stone-500 mt-1">
                  {eventos.length} {eventos.length === 1 ? "evento encontrado" : "eventos encontrados"}
                </p>
              </div>

              {/* Grid de eventos */}
              {estadoFiltro === "pasados" ? (
                // Vista compacta para pasados
                <div className="grid md:grid-cols-3 gap-6">
                  {eventos.map((evento) => (
                    <Link key={evento.id} href={`/eventos/${evento.slug}`}>
                      <article className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all opacity-80 hover:opacity-100">
                        <div className="flex items-center gap-2 mb-3">
                          {evento.categoria && (
                            <span className="inline-block text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                              {evento.categoria}
                            </span>
                          )}
                          <span className="text-xs text-stone-400">
                            {formatearFechaPasado(evento.fecha)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2">
                          {evento.titulo}
                        </h3>
                        {evento.lugar && (
                          <p className="text-stone-400 text-sm mt-2 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {evento.lugar}
                          </p>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                // Vista normal para próximos y todos
                <div className="grid md:grid-cols-2 gap-6">
                  {eventos.map((evento) => {
                    const esPasado = evento.fecha < hoy;
                    return (
                      <div key={evento.id} className={esPasado ? "opacity-60" : ""}>
                        <EventCard evento={evento} />
                        {esPasado && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                              Evento finalizado
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                No se encontraron eventos
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                {busqueda
                  ? `No hay resultados para "${busqueda}". Probá con otros términos.`
                  : estadoFiltro === "pasados"
                    ? "No hay eventos pasados registrados."
                    : "No hay eventos con los filtros seleccionados."}
              </p>
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver todos los eventos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA PARA ORGANIZADORES
          ============================================ */}
      <section className="py-20 bg-stone-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5L25 18l-5 2.5z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            ¿Organizás cursos o eventos?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publicá tu evento en nuestra agenda
          </h2>

          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Llegá a más emprendedores de Famaillá. Publicar es gratuito para
            instituciones, cámaras y organizaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eventos/publicar"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Publicar evento
            </Link>
            <a
              href="https://wa.me/5493863000000?text=Hola,%20quiero%20publicar%20un%20evento%20en%20Famaillá%20Emprende"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}