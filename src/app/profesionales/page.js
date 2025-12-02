import { supabase } from "@/lib/supabase";
import ProfesionalCard from "@/components/ProfesionalCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Categorías disponibles
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

// Obtener profesionales
async function getProfesionales(categoria = null) {
  let query = supabase
    .from("profesionales")
    .select("*")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("puntuacion_promedio", { ascending: false })
    .order("created_at", { ascending: false });

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar profesionales:", error);
    return [];
  }

  return data;
}

// Obtener conteo por categoría
async function getConteoPorCategoria() {
  const { data, error } = await supabase
    .from("profesionales")
    .select("categoria")
    .eq("activo", true);

  if (error) return {};

  const conteo = {};
  data.forEach((p) => {
    conteo[p.categoria] = (conteo[p.categoria] || 0) + 1;
  });

  return conteo;
}

export default async function ProfesionalesPage({ searchParams }) {
  const params = await searchParams;
  const categoriaFiltro = params?.categoria || null;
  
  const [profesionales, conteoCategorias] = await Promise.all([
    getProfesionales(categoriaFiltro),
    getConteoPorCategoria(),
  ]);

  const totalProfesionales = Object.values(conteoCategorias).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white py-16 relative overflow-hidden">
        {/* Formas decorativas */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-white">Profesionales</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Profesionales de Famaillá
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Encontrá profesionales y servicios de confianza en tu ciudad.
            Todos verificados y con reseñas de clientes reales.
          </p>

          {/* Contador */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {totalProfesionales}{" "}
              {totalProfesionales === 1 ? "profesional" : "profesionales"}{" "}
              disponibles
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FILTROS POR CATEGORÍA
          ============================================ */}
      <section className="py-6 bg-white border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-stone-500 flex-shrink-0">
              Filtrar:
            </span>

            {/* Botón Todos */}
            <Link
              href="/profesionales"
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                !categoriaFiltro
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos ({totalProfesionales})
            </Link>

            {/* Botones de categoría */}
            {categorias.map((cat) => {
              const count = conteoCategorias[cat] || 0;
              if (count === 0) return null;

              return (
                <Link
                  key={cat}
                  href={`/profesionales?categoria=${encodeURIComponent(cat)}`}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    categoriaFiltro === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat} ({count})
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          LISTADO DE PROFESIONALES
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {profesionales.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profesionales.map((profesional) => (
                <ProfesionalCard
                  key={profesional.id}
                  profesional={profesional}
                />
              ))}
            </div>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                {categoriaFiltro
                  ? `No hay profesionales en ${categoriaFiltro}`
                  : "No hay profesionales registrados"}
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                {categoriaFiltro
                  ? "Probá con otra categoría o volvé pronto."
                  : "¡Sé el primero en registrarte!"}
              </p>
              {categoriaFiltro && (
                <Link
                  href="/profesionales"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Ver todos los profesionales
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA PARA PROFESIONALES
          ============================================ */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Patrón decorativo */}
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
            ¿Sos profesional o freelancer?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Registrate y conseguí más clientes
          </h2>

          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Unite al directorio de profesionales de Famaillá. Es gratis y te
            ayuda a que más gente de la ciudad te encuentre.
          </p>

          <Link
            href="/profesionales/registrarse"
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Registrarme gratis
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