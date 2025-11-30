import { supabase } from "@/lib/supabase";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Obtener artículos publicados
async function getArticulos() {
  const { data, error } = await supabase
    .from("articulos")
    .select("id, titulo, slug, extracto, categoria, autor, created_at, imagen_url, imagen_alt, destacado")
    .eq("publicado", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar artículos:", error);
    return [];
  }

  return data;
}

// Obtener categorías únicas
async function getCategorias() {
  const { data, error } = await supabase
    .from("articulos")
    .select("categoria")
    .eq("publicado", true);

  if (error) {
    console.error("Error al cargar categorías:", error);
    return [];
  }

  // Obtener categorías únicas
  const categoriasUnicas = [...new Set(data.map((a) => a.categoria))];
  return categoriasUnicas;
}

export default async function BlogPage() {
  const [articulos, categorias] = await Promise.all([
    getArticulos(),
    getCategorias(),
  ]);

  // Separar destacado del resto
  const articuloDestacado = articulos.find((a) => a.destacado);
  const otrosArticulos = articulos.filter((a) => !a.destacado);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER
          ============================================ */}
      <section className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-800 text-white py-16 relative overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Formas decorativas */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-stone-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Blog</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog para emprendedores
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Artículos, guías y consejos para hacer crecer tu negocio en Famaillá. Agregando cada semana nuevo contenido.
          </p>

          {/* Contador de artículos */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className="text-sm font-medium">
              {articulos.length} {articulos.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          FILTROS POR CATEGORÍA
          ============================================ */}
      {categorias.length > 1 && (
        <section className="py-6 bg-white border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-sm text-stone-500 flex-shrink-0">Categorías:</span>
              <div className="flex gap-2">
                {categorias.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block px-4 py-1.5 bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 text-sm font-medium rounded-full cursor-pointer transition-colors flex-shrink-0"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          ARTÍCULOS
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {articulos.length > 0 ? (
            <div className="space-y-12">
              {/* Artículo destacado */}
              {articuloDestacado && (
                <div className="mb-8">
                  <ArticleCard articulo={articuloDestacado} destacado={true} />
                </div>
              )}

              {/* Grid de artículos */}
              {otrosArticulos.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otrosArticulos.map((articulo) => (
                    <ArticleCard key={articulo.id} articulo={articulo} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                Próximamente
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                Estamos preparando contenido útil para emprendedores.
                ¡Volvé pronto!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA NEWSLETTER (Opcional para futuro)
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
            Articulos y novedades
          </span>
          <h2 className="text-3xl font-bold mb-4">
            ¿Querés recibir más contenido?
          </h2>
          <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
            Seguinos en redes sociales para estar al día con nuevos artículos,
            eventos y oportunidades para emprendedores.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
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