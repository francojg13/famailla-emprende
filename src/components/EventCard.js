// Mapeo de categorías a colores
const categoriasColores = {
  Taller: "bg-emerald-100 text-emerald-700",
  Curso: "bg-blue-100 text-blue-700",
  Charla: "bg-purple-100 text-purple-700",
  Feria: "bg-amber-100 text-amber-700",
  Workshop: "bg-rose-100 text-rose-700",
  Networking: "bg-cyan-100 text-cyan-700",
};

// Mapeo de categorías a colores del badge de fecha
const categoriasFecha = {
  Taller: "from-emerald-400 to-emerald-500",
  Curso: "from-blue-400 to-blue-500",
  Charla: "from-purple-400 to-purple-500",
  Feria: "from-amber-400 to-orange-400",
  Workshop: "from-rose-400 to-rose-500",
  Networking: "from-cyan-400 to-cyan-500",
};

export default function EventCard({ evento }) {
  // Formatear fecha
  const fechaObj = new Date(evento.fecha + "T00:00:00");
  const dia = fechaObj.getDate();
  const mes = fechaObj.toLocaleDateString("es-AR", { month: "short" }).toUpperCase();

  // Formatear hora
  const formatearHora = (hora) => {
    if (!hora) return null;
    return hora.slice(0, 5) + "hs";
  };

  // Construir link de contacto
  const getLinkContacto = () => {
    if (evento.link_inscripcion) {
      return evento.link_inscripcion;
    }
    if (evento.whatsapp) {
      const mensaje = encodeURIComponent(
        `Hola, quiero inscribirme en "${evento.titulo}" publicado en Famaillá Emprende.`
      );
      return `https://wa.me/${evento.whatsapp}?text=${mensaje}`;
    }
    if (evento.email) {
      return `mailto:${evento.email}?subject=Inscripción: ${evento.titulo}`;
    }
    return null;
  };

  const linkContacto = getLinkContacto();
  const colorCategoria = categoriasColores[evento.categoria] || "bg-stone-100 text-stone-700";
  const colorFecha = categoriasFecha[evento.categoria] || "from-stone-400 to-stone-500";

  // Verificar si el evento ya pasó
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const yaPaso = fechaObj < hoy;

  return (
    <article
      className={`group bg-white rounded-2xl border border-stone-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
        yaPaso ? "opacity-60" : ""
      }`}
    >
      {/* Contenido principal */}
      <div className="p-6 flex gap-5">
        {/* Fecha destacada */}
        <div
          className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${colorFecha} rounded-xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          <span className="text-2xl font-bold leading-none">{dia}</span>
          <span className="text-xs uppercase tracking-wide opacity-90">{mes}</span>
        </div>

        {/* Info del evento */}
        <div className="flex-1 min-w-0">
          {/* Categoría + Precio */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colorCategoria}`}>
              {evento.categoria}
            </span>
            {evento.precio ? (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                ${evento.precio.toLocaleString("es-AR")}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Gratuito
              </span>
            )}
            {yaPaso && (
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                Finalizado
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {evento.titulo}
          </h3>

          {/* Hora */}
          {evento.hora_inicio && (
            <p className="text-stone-500 text-sm flex items-center gap-1.5 mb-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatearHora(evento.hora_inicio)}
              {evento.hora_fin && ` - ${formatearHora(evento.hora_fin)}`}
            </p>
          )}

          {/* Lugar */}
          <p className="text-stone-500 text-sm flex items-center gap-1.5 mb-1">
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
            <span className="truncate">{evento.lugar}</span>
          </p>

          {/* Organizador */}
          <p className="text-stone-400 text-sm">
            Organiza: {evento.organizador}
          </p>
        </div>
      </div>

      {/* Descripción + Botón */}
      <div className="px-6 pb-6">
        {evento.descripcion && (
          <p className="text-stone-500 text-sm mb-4 line-clamp-2">
            {evento.descripcion}
          </p>
        )}

        {/* Botón de inscripción */}
        {linkContacto && !yaPaso && (
          <a
            href={linkContacto}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            {evento.whatsapp ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Inscribirme por WhatsApp
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Inscribirme
              </>
            )}
          </a>
        )}
      </div>
    </article>
  );
}