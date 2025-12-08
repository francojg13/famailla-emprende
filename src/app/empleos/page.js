import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Categorías disponibles
const categorias = [
  "Ventas y Atención",
  "Gastronomía",
  "Administración",
  "Producción y Oficios",
  "Servicios",
  "Profesionales",
  "Salud",
  "Educación",
  "Otro",
];

const tiposEmpleo = [
  "Tiempo completo",
  "Part-time",
  "Temporal",
  "Pasantía",
  "Freelance",
];

// Obtener empleos
async function getEmpleos(categoria = null, tipo = null, busqueda = null) {
  let query = supabase
    .from("empleos")
    .select("*")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar empleos:", error);
    return [];
  }

  // Filtrar por búsqueda en cliente (Supabase free no tiene full-text search)
  if (busqueda && data) {
    const busquedaLower = busqueda.toLowerCase();
    return data.filter(
      (empleo) =>
        empleo.titulo.toLowerCase().includes(busquedaLower) ||
        empleo.empresa.toLowerCase().includes(busquedaLower) ||
        (empleo.descripcion && empleo.descripcion.toLowerCase().includes(busquedaLower))
    );
  }

  return data;
}

// Obtener conteos
async function getConteos() {
  const { data, error } = await supabase
    .from("empleos")
    .select("categoria, tipo")
    .eq("activo", true);

  if (error) return { categorias: {}, tipos: {}, total: 0 };

  const categoriaConteo = {};
  const tipoConteo = {};

  data.forEach((e) => {
    if (e.categoria) {
      categoriaConteo[e.categoria] = (categoriaConteo[e.categoria] || 0) + 1;
    }
    if (e.tipo) {
      tipoConteo[e.tipo] = (tipoConteo[e.tipo] || 0) + 1;
    }
  });

  return {
    categorias: categoriaConteo,
    tipos: tipoConteo,
    total: data.length,
  };
}

export default async function EmpleosPage({ searchParams }) {
  const params = await searchParams;
  const categoriaFiltro = params?.categoria || null;
  const tipoFiltro = params?.tipo || null;
  const busqueda = params?.q || null;

  const [empleos, conteos] = await Promise.all([
    getEmpleos(categoriaFiltro, tipoFiltro, busqueda),
    getConteos(),
  ]);

  // Construir URL con filtros
  const buildUrl = (newParams) => {
    const url = new URLSearchParams();
    
    const categoria = newParams.categoria !== undefined ? newParams.categoria : categoriaFiltro;
    const tipo = newParams.tipo !== undefined ? newParams.tipo : tipoFiltro;
    const q = newParams.q !== undefined ? newParams.q : busqueda;

    if (categoria) url.set("categoria", categoria);
    if (tipo) url.set("tipo", tipo);
    if (q) url.set("q", q);

    const queryString = url.toString();
    return queryString ? `/empleos?${queryString}` : "/empleos";
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Empleos</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Empleos en Famaillá
          </h1>
          <p className="text-emerald-50 text-lg max-w-2xl mb-8">
            Encontrá oportunidades laborales en tu ciudad. Postulate directamente por WhatsApp.
          </p>

          {/* Barra de búsqueda */}
          <form action="/empleos" method="GET" className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={busqueda || ""}
                placeholder="Buscar por puesto, empresa..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Mantener filtros existentes */}
              {categoriaFiltro && (
                <input type="hidden" name="categoria" value={categoriaFiltro} />
              )}
              {tipoFiltro && (
                <input type="hidden" name="tipo" value={tipoFiltro} />
              )}
            </div>
          </form>

          {/* Contador */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">
              {conteos.total} {conteos.total === 1 ? "empleo disponible" : "empleos disponibles"}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FILTROS
          ============================================ */}
      <section className="py-6 bg-white border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filtro por categoría */}
          <div className="mb-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-stone-500 flex-shrink-0 font-medium">
                Categoría:
              </span>
              <Link
                href={buildUrl({ categoria: null })}
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  !categoriaFiltro
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Todas ({conteos.total})
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
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat} ({count})
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Filtro por tipo de empleo */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-stone-500 flex-shrink-0 font-medium">
              Tipo:
            </span>
            <Link
              href={buildUrl({ tipo: null })}
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                !tipoFiltro
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos
            </Link>
            {tiposEmpleo.map((tipo) => {
              const count = conteos.tipos[tipo] || 0;
              if (count === 0) return null;

              return (
                <Link
                  key={tipo}
                  href={buildUrl({ tipo: tipo })}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    tipoFiltro === tipo
                      ? "bg-teal-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {tipo} ({count})
                </Link>
              );
            })}
          </div>

          {/* Filtros activos */}
          {(categoriaFiltro || tipoFiltro || busqueda) && (
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
              {categoriaFiltro && (
                <Link
                  href={buildUrl({ categoria: null })}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-emerald-200 transition-colors"
                >
                  {categoriaFiltro}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              {tipoFiltro && (
                <Link
                  href={buildUrl({ tipo: null })}
                  className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-teal-200 transition-colors"
                >
                  {tipoFiltro}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              <Link
                href="/empleos"
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
          LISTADO DE EMPLEOS
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {empleos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empleos.map((empleo) => (
                <JobCard key={empleo.id} empleo={empleo} />
              ))}
            </div>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                No se encontraron empleos
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                {busqueda
                  ? `No hay resultados para "${busqueda}". Probá con otros términos.`
                  : "No hay empleos con los filtros seleccionados. Probá con otros filtros."}
              </p>
              <Link
                href="/empleos"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver todos los empleos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA
          ============================================ */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5L25 18l-5 2.5z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            ¿Estás buscando personal?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publicá tu empleo gratis
          </h2>

          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            Recibí postulantes directamente en tu WhatsApp. Sin intermediarios,
            sin comisiones.
          </p>

          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Publicar empleo gratis
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}