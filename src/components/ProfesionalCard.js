import Link from "next/link";

// Mapeo de categorías a colores
const categoriasColores = {
  Salud: "bg-red-100 text-red-700",
  Construcción: "bg-orange-100 text-orange-700",
  Diseño: "bg-pink-100 text-pink-700",
  Hogar: "bg-green-100 text-green-700",
  Gastronomía: "bg-amber-100 text-amber-700",
  Belleza: "bg-purple-100 text-purple-700",
  Educación: "bg-blue-100 text-blue-700",
  Oficios: "bg-stone-100 text-stone-700",
  Legal: "bg-indigo-100 text-indigo-700",
  Otros: "bg-gray-100 text-gray-700",
};

// Componente de estrellas
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

export default function ProfesionalCard({ profesional }) {
  const colorCategoria =
    categoriasColores[profesional.categoria] || categoriasColores.Otros;

  // Obtener iniciales para avatar por defecto
  const iniciales = profesional.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <Link href={`/profesionales/${profesional.slug}`} className="block">
        {/* Header con foto */}
        <div className="p-6 pb-0">
          <div className="flex items-start gap-4">
            {/* Foto o avatar */}
            <div className="relative flex-shrink-0">
              {profesional.foto_url ? (
                <img
                  src={profesional.foto_url}
                  alt={profesional.nombre}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {iniciales}
                </div>
              )}
              {/* Badge verificado */}
              {profesional.verificado && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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
              {/* Categoría */}
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${colorCategoria}`}
              >
                {profesional.categoria}
              </span>

              {/* Nombre */}
              <h3 className="font-semibold text-stone-800 text-lg group-hover:text-emerald-700 transition-colors truncate">
                {profesional.nombre}
              </h3>

              {/* Profesión */}
              <p className="text-emerald-600 font-medium text-sm truncate">
                {profesional.profesion}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 pt-4">
          {/* Descripción */}
          {profesional.descripcion && (
            <p className="text-stone-500 text-sm line-clamp-2 mb-4">
              {profesional.descripcion}
            </p>
          )}

          {/* Puntuación y reseñas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Estrellas puntuacion={profesional.puntuacion_promedio || 0} />
              <span className="text-sm text-stone-500">
                {profesional.puntuacion_promedio > 0 ? (
                  <>
                    <span className="font-semibold text-stone-700">
                      {profesional.puntuacion_promedio}
                    </span>
                    {" · "}
                    {profesional.total_resenas}{" "}
                    {profesional.total_resenas === 1 ? "reseña" : "reseñas"}
                  </>
                ) : (
                  <span className="text-stone-400">Sin reseñas aún</span>
                )}
              </span>
            </div>

            {/* Experiencia */}
            {profesional.experiencia && (
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                {profesional.experiencia}
              </span>
            )}
          </div>
        </div>

        {/* Footer con CTA */}
        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <span className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 text-sm font-semibold py-2.5 rounded-xl transition-colors">
              Ver perfil
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
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export { Estrellas };