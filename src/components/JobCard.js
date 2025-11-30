import Link from "next/link";

export default function JobCard({ empleo }) {
  // Construir el link de WhatsApp
  const mensajeEncoded = encodeURIComponent(
    empleo.mensaje_whatsapp || 
    `Hola, me interesa la oferta de "${empleo.titulo}" publicada en Famaillá Emprende.`
  );
  const whatsappLink = `https://wa.me/${empleo.whatsapp}?text=${mensajeEncoded}`;

  // Formatear la fecha
  const fechaPublicacion = new Date(empleo.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <article className="group bg-white rounded-2xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Header: Avatar + Badge */}
      <div className="flex items-start justify-between mb-4">
        {/* Avatar de empresa */}
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-200/50 group-hover:scale-110 transition-transform">
          {empleo.empresa.charAt(0).toUpperCase()}
        </div>

        {/* Badge destacado */}
        {empleo.destacado && (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Destacado
          </span>
        )}
      </div>

      {/* Tipo de empleo */}
      <span className="inline-block w-fit bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
        {empleo.tipo}
      </span>

      {/* Título */}
      <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors">
        {empleo.titulo}
      </h3>

      {/* Empresa */}
      <p className="text-stone-600 text-sm mb-1 font-medium">
        {empleo.empresa}
      </p>

      {/* Ubicación */}
      <p className="text-stone-400 text-sm flex items-center gap-1 mb-4">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {empleo.ubicacion}
      </p>

      {/* Descripción (si existe) */}
      {empleo.descripcion && (
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
          {empleo.descripcion}
        </p>
      )}

      {/* Footer: Fecha + Botón */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
        <span className="text-stone-400 text-xs">
          Publicado {fechaPublicacion}
        </span>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Postularme
        </a>
      </div>
    </article>
  );
}