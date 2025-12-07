import Link from "next/link";

const categoriasColores = {
  Salud: "bg-red-100 text-red-700",
  Construcción: "bg-orange-100 text-orange-700",
  Diseño: "bg-pink-100 text-pink-700",
  Hogar: "bg-green-100 text-green-700",
  Gastronomía: "bg-amber-100 text-amber-700",
  Belleza: "bg-purple-100 text-purple-700",
  Educación: "bg-blue-100 text-blue-700",
  Oficios: "bg-stone-200 text-stone-700",
  Legal: "bg-indigo-100 text-indigo-700",
  Otros: "bg-gray-100 text-gray-700",
};

function Estrellas({ puntuacion, size = "small" }) {
  const estrellas = [];
  const puntuacionRedondeada = Math.round(puntuacion);
  const sizeClass = size === "small" ? "w-4 h-4" : "w-5 h-5";

  for (let i = 1; i <= 5; i++) {
    estrellas.push(
      <svg
        key={i}
        className={`${sizeClass} ${
          i <= puntuacionRedondeada ? "text-amber-400" : "text-stone-200"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }

  return <div className="flex items-center gap-0.5">{estrellas}</div>;
}

export default function DirectorioCard({ item }) {
  const colorCategoria = categoriasColores[item.categoria] || categoriasColores.Otros;
  const esNegocio = item.tipo === "negocio";

  // Iniciales para avatar por defecto
  const iniciales = item.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <Link href={`/directorio/${item.slug}`} className="block">
        {/* Header con foto */}
        <div className="p-6 pb-0">
          <div className="flex items-start gap-4">
            {/* Foto o avatar */}
            <div className="relative flex-shrink-0">
              {item.foto_url ? (
                <img
                  src={item.foto_url}
                  alt={item.nombre}
                  className={`w-20 h-20 object-cover shadow-md ${
                    esNegocio ? "rounded-xl" : "rounded-2xl"
                  }`}
                />
              ) : (
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${
                    esNegocio
                      ? "from-purple-500 to-indigo-500 rounded-xl"
                      : "from-emerald-500 to-teal-500 rounded-2xl"
                  } flex items-center justify-center text-white font-bold text-xl shadow-md`}
                >
                  {esNegocio ? (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) : (
                    iniciales
                  )}
                </div>
              )}
              
              {/* Badge verificado */}
              {item.verificado && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info principal */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                    esNegocio ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {esNegocio ? "Negocio" : "Servicio"}
                </span>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${colorCategoria}`}>
                  {item.categoria}
                </span>
              </div>

              {/* Nombre */}
              <h3 className="font-semibold text-stone-800 text-lg group-hover:text-indigo-700 transition-colors truncate">
                {item.nombre}
              </h3>

              {/* Profesión/Rubro */}
              <p className="text-indigo-600 font-medium text-sm truncate">
                {item.profesion}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 pt-4">
          {/* Descripción */}
          {item.descripcion && (
            <p className="text-stone-500 text-sm line-clamp-2 mb-4">
              {item.descripcion}
            </p>
          )}

          {/* Horarios (solo negocios) */}
          {esNegocio && item.horarios && (
            <p className="text-stone-400 text-xs mb-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.horarios}
            </p>
          )}

          {/* Puntuación y reseñas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Estrellas puntuacion={item.puntuacion_promedio || 0} />
              <span className="text-sm text-stone-500">
                {item.puntuacion_promedio > 0 ? (
                  <>
                    <span className="font-semibold text-stone-700">
                      {item.puntuacion_promedio}
                    </span>
                    {" · "}
                    {item.total_resenas} {item.total_resenas === 1 ? "reseña" : "reseñas"}
                  </>
                ) : (
                  <span className="text-stone-400">Sin reseñas</span>
                )}
              </span>
            </div>

            {/* Experiencia (solo servicios) */}
            {!esNegocio && item.experiencia && (
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                {item.experiencia}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <span className="flex items-center justify-center gap-2 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-700 text-sm font-semibold py-2.5 rounded-xl transition-colors">
            Ver perfil
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

export { Estrellas };