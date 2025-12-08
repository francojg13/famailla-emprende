import { supabase } from "@/lib/supabase";
import DirectorioCard from "@/components/DirectorioCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Categorías para servicios
const categoriasServicios = [
  "Salud",
  "Construcción",
  "Hogar",
  "Diseño y Tecnología",
  "Educación",
  "Legal y Contable",
  "Belleza",
  "Transporte",
  "Oficios",
  "Otro",
];

// Categorías para negocios
const categoriasNegocios = [
  "Gastronomía",
  "Comercio",
  "Salud y Belleza",
  "Servicios",
  "Tecnología",
  "Hogar",
  "Entretenimiento",
  "Otro",
];

// Obtener items del directorio
async function getDirectorio(tipo = null, categoria = null, busqueda = null) {
  let query = supabase
    .from("profesionales")
    .select("*")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("puntuacion_promedio", { ascending: false })
    .order("created_at", { ascending: false });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar directorio:", error);
    return [];
  }

  // Filtrar por búsqueda en cliente
  if (busqueda && data) {
    const busquedaLower = busqueda.toLowerCase();
    return data.filter(
      (item) =>
        item.nombre.toLowerCase().includes(busquedaLower) ||
        item.profesion.toLowerCase().includes(busquedaLower) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(busquedaLower))
    );
  }

  return data;
}

// Obtener conteos
async function getConteos() {
  const { data, error } = await supabase
    .from("profesionales")
    .select("tipo, categoria")
    .eq("activo", true);

  if (error) return { servicios: 0, negocios: 0, categorias: {}, total: 0 };

  let servicios = 0;
  let negocios = 0;
  const categoriaConteo = {};

  data.forEach((item) => {
    if (item.tipo === "servicio") servicios++;
    if (item.tipo === "negocio") negocios++;
    if (item.categoria) {
      categoriaConteo[item.categoria] = (categoriaConteo[item.categoria] || 0) + 1;
    }
  });

  return {
    servicios,
    negocios,
    categorias: categoriaConteo,
    total: data.length,
  };
}

export default async function DirectorioPage({ searchParams }) {
  const params = await searchParams;
  const tipoFiltro = params?.tipo || null;
  const categoriaFiltro = params?.categoria || null;
  const busqueda = params?.q || null;

  const [items, conteos] = await Promise.all([
    getDirectorio(tipoFiltro, categoriaFiltro, busqueda),
    getConteos(),
  ]);

  // Determinar qué categorías mostrar según el tipo
  const categoriasActuales = tipoFiltro === "servicio"
    ? categoriasServicios
    : tipoFiltro === "negocio"
      ? categoriasNegocios
      : [...new Set([...categoriasServicios, ...categoriasNegocios])];

  // Construir URL con filtros
  const buildUrl = (newParams) => {
    const url = new URLSearchParams();

    const tipo = newParams.tipo !== undefined ? newParams.tipo : tipoFiltro;
    const categoria = newParams.categoria !== undefined ? newParams.categoria : categoriaFiltro;
    const q = newParams.q !== undefined ? newParams.q : busqueda;

    // Si cambia el tipo, limpiar categoría
    if (newParams.tipo !== undefined && newParams.tipo !== tipoFiltro) {
      if (tipo) url.set("tipo", tipo);
      if (q) url.set("q", q);
      return `/directorio?${url.toString()}`;
    }

    if (tipo) url.set("tipo", tipo);
    if (categoria) url.set("categoria", categoria);
    if (q) url.set("q", q);

    const queryString = url.toString();
    return queryString ? `/directorio?${queryString}` : "/directorio";
  };

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
            <span className="text-white">Directorio</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Directorio de Famaillá
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mb-8">
            Encontrá profesionales, servicios y negocios de tu ciudad. Contactalos directamente.
          </p>

          {/* Barra de búsqueda */}
          <form action="/directorio" method="GET" className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={busqueda || ""}
                placeholder="Buscar por nombre, profesión, negocio..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {tipoFiltro && <input type="hidden" name="tipo" value={tipoFiltro} />}
              {categoriaFiltro && <input type="hidden" name="categoria" value={categoriaFiltro} />}
            </div>
          </form>

          {/* Contador */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">
              {conteos.total} {conteos.total === 1 ? "registro" : "registros"} en el directorio
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FILTROS
          ============================================ */}
      <section className="py-6 bg-white border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filtro por tipo (tabs principales) */}
          <div className="mb-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-stone-500 flex-shrink-0 font-medium">Tipo:</span>
              <Link
                href={buildUrl({ tipo: null, categoria: null })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  !tipoFiltro
                    ? "bg-indigo-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Todos ({conteos.total})
              </Link>
              <Link
                href={buildUrl({ tipo: "servicio", categoria: null })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  tipoFiltro === "servicio"
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Servicios ({conteos.servicios})
              </Link>
              <Link
                href={buildUrl({ tipo: "negocio", categoria: null })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  tipoFiltro === "negocio"
                    ? "bg-purple-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Negocios ({conteos.negocios})
              </Link>
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-stone-500 flex-shrink-0 font-medium">Categoría:</span>
            <Link
              href={buildUrl({ categoria: null })}
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                !categoriaFiltro
                  ? "bg-purple-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todas
            </Link>
            {categoriasActuales.map((cat) => {
              const count = conteos.categorias[cat] || 0;
              if (count === 0) return null;

              return (
                <Link
                  key={cat}
                  href={buildUrl({ categoria: cat })}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    categoriaFiltro === cat
                      ? "bg-purple-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat} ({count})
                </Link>
              );
            })}
          </div>

          {/* Filtros activos */}
          {(tipoFiltro || categoriaFiltro || busqueda) && (
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
              {tipoFiltro && (
                <Link
                  href={buildUrl({ tipo: null, categoria: null })}
                  className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                    tipoFiltro === "servicio"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {tipoFiltro === "servicio" ? "Servicios" : "Negocios"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              {categoriaFiltro && (
                <Link
                  href={buildUrl({ categoria: null })}
                  className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  {categoriaFiltro}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              <Link
                href="/directorio"
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
          LISTADO
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {items.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <DirectorioCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                No se encontraron resultados
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                {busqueda
                  ? `No hay resultados para "${busqueda}". Probá con otros términos.`
                  : "No hay registros con los filtros seleccionados."}
              </p>
              <Link
                href="/directorio"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver todo el directorio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA
          ============================================ */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
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
            ¿Sos profesional o tenés un negocio?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sumá tu servicio al directorio
          </h2>

          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Dá a conocer lo que hacés a toda la comunidad de Famaillá. Es gratis y te contactan directamente.
          </p>

          <Link
            href="/directorio/registrarse"
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrarme gratis
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}