import Link from "next/link";

// Mapeo de categorías a colores
const categoriasColores = {
  Emprendimiento: "bg-emerald-100 text-emerald-700",
  Marketing: "bg-blue-100 text-blue-700",
  Finanzas: "bg-amber-100 text-amber-700",
  Legal: "bg-purple-100 text-purple-700",
  Tecnología: "bg-cyan-100 text-cyan-700",
  General: "bg-stone-100 text-stone-700",
};

export default function ArticleCard({ articulo, destacado = false }) {
  // Formatear fecha
  const fecha = new Date(articulo.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const colorCategoria = categoriasColores[articulo.categoria] || categoriasColores.General;

  // Card destacada (más grande)
  if (destacado) {
    return (
      <article className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <Link href={`/blog/${articulo.slug}`} className="block">
          {/* Imagen destacada */}
          <div className="aspect-[2/1] bg-gradient-to-br from-emerald-500 to-teal-500 relative overflow-hidden">
            {articulo.imagen_url ? (
              <img
                src={articulo.imagen_url}
                alt={articulo.imagen_alt || articulo.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white/30"
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
            )}
            {/* Badge destacado */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Destacado
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {/* Categoría + Fecha */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorCategoria}`}>
                {articulo.categoria}
              </span>
              <span className="text-stone-400 text-sm">{fecha}</span>
            </div>

            {/* Título */}
            <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {articulo.titulo}
            </h2>

            {/* Extracto */}
            {articulo.extracto && (
              <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                {articulo.extracto}
              </p>
            )}

            {/* Leer más */}
            <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
              Leer artículo
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>
      </article>
    );
  }

  // Card normal
  return (
    <article className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <Link href={`/blog/${articulo.slug}`} className="block">
        {/* Imagen */}
        <div className="aspect-[16/9] bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
          {articulo.imagen_url ? (
            <img
              src={articulo.imagen_url}
              alt={articulo.imagen_alt || articulo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <svg
                className="w-12 h-12 text-emerald-300"
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
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Categoría + Fecha */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorCategoria}`}>
              {articulo.categoria}
            </span>
            <span className="text-stone-400 text-xs">{fecha}</span>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {articulo.titulo}
          </h3>

          {/* Extracto */}
          {articulo.extracto && (
            <p className="text-stone-500 text-sm line-clamp-2">
              {articulo.extracto}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}