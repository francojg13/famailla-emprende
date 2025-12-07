import { supabase } from "@/lib/supabase";
import DirectorioCard from "@/components/DirectorioCard";
import Footer from "@/components/Footer";
import Link from "next/link";

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

async function getDirectorio(tipo = null, categoria = null) {
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
    console.error("Error:", error);
    return [];
  }

  return data;
}

async function getConteos() {
  const { data, error } = await supabase
    .from("profesionales")
    .select("tipo, categoria")
    .eq("activo", true);

  if (error) return { servicios: 0, negocios: 0, categorias: {} };

  const servicios = data.filter((d) => d.tipo === "servicio").length;
  const negocios = data.filter((d) => d.tipo === "negocio").length;

  const categoriaConteo = {};
  data.forEach((d) => {
    categoriaConteo[d.categoria] = (categoriaConteo[d.categoria] || 0) + 1;
  });

  return { servicios, negocios, categorias: categoriaConteo };
}

export default async function DirectorioPage({ searchParams }) {
  const params = await searchParams;
  const tipoFiltro = params?.tipo || null;
  const categoriaFiltro = params?.categoria || null;

  const [items, conteos] = await Promise.all([
    getDirectorio(tipoFiltro, categoriaFiltro),
    getConteos(),
  ]);

  const total = conteos.servicios + conteos.negocios;

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
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Directorio</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Directorio de Famaillá
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Encontrá profesionales, servicios y negocios de confianza en tu ciudad.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">
              {total} registrados
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          TABS Y FILTROS
          ============================================ */}
      <section className="py-6 bg-white border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Tabs principales */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/directorio"
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                !tipoFiltro
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos ({total})
            </Link>
            <Link
              href="/directorio?tipo=servicio"
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 ${
                tipoFiltro === "servicio"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Servicios ({conteos.servicios})
            </Link>
            <Link
              href="/directorio?tipo=negocio"
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 ${
                tipoFiltro === "negocio"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Negocios ({conteos.negocios})
            </Link>
          </div>

          {/* Filtro por categorías */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-stone-500 flex-shrink-0">Categoría:</span>
            {categorias.map((cat) => {
              const count = conteos.categorias[cat] || 0;
              if (count === 0) return null;

              const href = tipoFiltro
                ? `/directorio?tipo=${tipoFiltro}&categoria=${encodeURIComponent(cat)}`
                : `/directorio?categoria=${encodeURIComponent(cat)}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    categoriaFiltro === cat
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat} ({count})
                </Link>
              );
            })}
            {categoriaFiltro && (
              <Link
                href={tipoFiltro ? `/directorio?tipo=${tipoFiltro}` : "/directorio"}
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex-shrink-0"
              >
                ✕ Limpiar filtro
              </Link>
            )}
          </div>
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
              <p className="text-stone-500 mb-6">
                Probá con otros filtros o volvé pronto.
              </p>
              <Link
                href="/directorio"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
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
            ¿Ofrecés un servicio o tenés un negocio?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Registrate gratis y conseguí más clientes
          </h2>

          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Unite al directorio de Famaillá. Es gratis y te ayuda a que más gente de la ciudad te encuentre.
          </p>

          <Link
            href="/directorio/registrarse"
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Registrarme gratis
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}