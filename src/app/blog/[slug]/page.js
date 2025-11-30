import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// Obtener artículo por slug
async function getArticulo(slug) {
  const { data, error } = await supabase
    .from("articulos")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Obtener artículos relacionados (misma categoría)
async function getArticulosRelacionados(categoria, slugActual) {
  const { data, error } = await supabase
    .from("articulos")
    .select("id, titulo, slug, extracto, categoria, created_at")
    .eq("publicado", true)
    .eq("categoria", categoria)
    .neq("slug", slugActual)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    return [];
  }

  return data;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const articulo = await getArticulo(slug);

  if (!articulo) {
    return {
      title: "Artículo no encontrado | Famaillá Emprende",
    };
  }

  return {
    title: `${articulo.titulo} | Blog Famaillá Emprende`,
    description: articulo.meta_descripcion || articulo.extracto,
  };
}

// Mapeo de categorías a colores
const categoriasColores = {
  Emprendimiento: "bg-emerald-100 text-emerald-700",
  Marketing: "bg-blue-100 text-blue-700",
  Finanzas: "bg-amber-100 text-amber-700",
  Legal: "bg-purple-100 text-purple-700",
  Tecnología: "bg-cyan-100 text-cyan-700",
  General: "bg-stone-100 text-stone-700",
};

export default async function ArticuloPage({ params }) {
  const { slug } = await params;
  const articulo = await getArticulo(slug);

  if (!articulo) {
    notFound();
  }

  const articulosRelacionados = await getArticulosRelacionados(
    articulo.categoria,
    articulo.slug
  );

  // Formatear fecha
  const fecha = new Date(articulo.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const colorCategoria = categoriasColores[articulo.categoria] || categoriasColores.General;

  // Función para renderizar Markdown simple a HTML
  const renderizarContenido = (contenido) => {
    return contenido
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-stone-800 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-stone-800 mt-10 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-stone-800 mt-10 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-stone-800">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
      // Paragraphs (líneas que no son headers ni listas)
      .split('\n\n')
      .map(p => {
        if (p.startsWith('<h') || p.startsWith('<li')) return p;
        if (p.trim() === '') return '';
        return `<p class="text-stone-600 leading-relaxed mb-4">${p}</p>`;
      })
      .join('');
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER DEL ARTÍCULO
          ============================================ */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-stone-400 text-sm mb-8">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="hover:text-emerald-600 transition-colors">
              Blog
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-stone-600 truncate max-w-[200px]">{articulo.titulo}</span>
          </nav>

          {/* Categoría */}
          <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4 ${colorCategoria}`}>
            {articulo.categoria}
          </span>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6 leading-tight">
            {articulo.titulo}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-stone-500 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {articulo.autor}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {fecha}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          IMAGEN DESTACADA
          ============================================ */}
      {articulo.imagen_url && (
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="aspect-[2/1] rounded-2xl overflow-hidden -mt-4 mb-8 shadow-lg">
              <img
                src={articulo.imagen_url}
                alt={articulo.imagen_alt || articulo.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          CONTENIDO DEL ARTÍCULO
          ============================================ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <article className="bg-white rounded-2xl border border-stone-200 p-8 md:p-12 shadow-sm">
            {/* Extracto destacado */}
            {articulo.extracto && (
              <p className="text-xl text-stone-600 leading-relaxed mb-8 pb-8 border-b border-stone-100 font-medium">
                {articulo.extracto}
              </p>
            )}

            {/* Contenido */}
            <div
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: renderizarContenido(articulo.contenido) }}
            />
          </article>

          {/* Compartir */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al blog
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-400">Compartir:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(articulo.titulo + ' - Famaillá Emprende')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ARTÍCULOS RELACIONADOS
          ============================================ */}
      {articulosRelacionados.length > 0 && (
        <section className="py-12 bg-white border-t border-stone-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-8">
              Artículos relacionados
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {articulosRelacionados.map((art) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="group block bg-stone-50 rounded-xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${categoriasColores[art.categoria] || categoriasColores.General}`}>
                    {art.categoria}
                  </span>
                  <h3 className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {art.titulo}
                  </h3>
                  {art.extracto && (
                    <p className="text-stone-500 text-sm mt-2 line-clamp-2">
                      {art.extracto}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}