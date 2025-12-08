import Link from "next/link";

// Colores por categoría
const categoriasColores = {
  // Servicios
  "Salud": "bg-red-100 text-red-700",
  "Construcción": "bg-orange-100 text-orange-700",
  "Hogar": "bg-green-100 text-green-700",
  "Diseño y Tecnología": "bg-pink-100 text-pink-700",
  "Educación": "bg-blue-100 text-blue-700",
  "Legal y Contable": "bg-indigo-100 text-indigo-700",
  "Belleza": "bg-purple-100 text-purple-700",
  "Transporte": "bg-cyan-100 text-cyan-700",
  "Oficios": "bg-stone-200 text-stone-700",
  // Negocios
  "Gastronomía": "bg-amber-100 text-amber-700",
  "Comercio": "bg-teal-100 text-teal-700",
  "Salud y Belleza": "bg-rose-100 text-rose-700",
  "Servicios": "bg-lime-100 text-lime-700",
  "Tecnología": "bg-violet-100 text-violet-700",
  "Entretenimiento": "bg-fuchsia-100 text-fuchsia-700",
  "Otro": "bg-gray-100 text-gray-700",
};

// Componente de estrellas
export function Estrellas({ puntuacion, size = "small" }) {
  const sizeClasses = size === "large" ? "w-5 h-5" : "w-4 h-4";
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses} ${
            star <= puntuacion ? "text-amber-400" : "text-stone-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function DirectorioCard({ item }) {
  const esNegocio = item.tipo === "negocio";
  const colorCategoria = categoriasColores[item.categoria] || categoriasColores["Otro"];

  // Iniciales para avatar
  const iniciales = item.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/directorio/${item.slug}`}>
      <article className="group bg-white rounded-2xl p-6 border border-stone-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Header: Foto + Badges */}
        <div className="flex items-start justify-between mb-4">
          {/* Foto o Avatar */}
          {item.foto_url ? (
            <img
              src={item.foto_url}
              alt={item.nombre}
              className={`w-16 h-16 object-cover shadow-md group-hover:scale-105 transition-transform ${
                esNegocio ? "rounded-xl" : "rounded-full"
              }`}
            />
          ) : (
            <div
              className={`w-16 h-16 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${
                esNegocio
                  ? "rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500"
                  : "rounded-full bg-gradient-to-br from-emerald-500 to-teal-500"
              }`}
            >
              {esNegocio ? (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ) : (
                <span className="text-white font-bold text-lg">{iniciales}</span>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-col items-end gap-1">
            {item.verificado && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verificado
              </span>
            )}
            {item.destacado && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Destacado
              </span>
            )}
          </div>
        </div>

        {/* Badges: Tipo + Categoría */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            esNegocio ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {esNegocio ? "Negocio" : "Servicio"}
          </span>
          {item.categoria && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorCategoria}`}>
              {item.categoria}
            </span>
          )}
        </div>

        {/* Nombre y profesión */}
        <h3 className="text-lg font-semibold text-stone-800 mb-1 group-hover:text-indigo-700 transition-colors">
          {item.nombre}
        </h3>
        <p className="text-stone-500 text-sm mb-3">
          {item.profesion}
        </p>

        {/* Puntuación */}
        {item.puntuacion_promedio > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Estrellas puntuacion={item.puntuacion_promedio} />
            <span className="text-sm text-stone-500">
              ({item.total_resenas})
            </span>
          </div>
        )}

        {/* Info adicional */}
        <div className="mt-auto pt-3 border-t border-stone-100 space-y-1">
          {item.horarios && esNegocio && (
            <p className="text-stone-400 text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.horarios}
            </p>
          )}
          {item.experiencia && !esNegocio && (
            <p className="text-stone-400 text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {item.experiencia} de experiencia
            </p>
          )}
          {item.direccion && (
            <p className="text-stone-400 text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.direccion}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}