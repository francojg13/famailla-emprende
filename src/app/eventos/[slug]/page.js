import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

// Mapeo de categorías a colores
const categoriasColores = {
  Taller: "bg-emerald-100 text-emerald-700",
  Curso: "bg-blue-100 text-blue-700",
  Charla: "bg-purple-100 text-purple-700",
  Feria: "bg-amber-100 text-amber-700",
  Workshop: "bg-rose-100 text-rose-700",
  Networking: "bg-cyan-100 text-cyan-700",
  Capacitación: "bg-indigo-100 text-indigo-700",
  Cultural: "bg-pink-100 text-pink-700",
  Deportivo: "bg-orange-100 text-orange-700",
  Social: "bg-teal-100 text-teal-700",
};

const categoriasGradiente = {
  Taller: "from-emerald-500 to-teal-500",
  Curso: "from-blue-500 to-indigo-500",
  Charla: "from-purple-500 to-pink-500",
  Feria: "from-amber-500 to-orange-500",
  Workshop: "from-rose-500 to-pink-500",
  Networking: "from-cyan-500 to-blue-500",
  Capacitación: "from-indigo-500 to-purple-500",
  Cultural: "from-pink-500 to-rose-500",
  Deportivo: "from-orange-500 to-red-500",
  Social: "from-teal-500 to-emerald-500",
};

// Obtener evento por slug
async function getEvento(slug) {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Obtener eventos relacionados
async function getEventosRelacionados(categoriaActual, idActual) {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("eventos")
    .select("id, titulo, slug, fecha, categoria, lugar")
    .eq("activo", true)
    .eq("categoria", categoriaActual)
    .neq("id", idActual)
    .gte("fecha", hoy)
    .order("fecha", { ascending: true })
    .limit(3);

  if (error) return [];
  return data;
}

// Generar metadata dinámica
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento) {
    return { title: "Evento no encontrado" };
  }

  return {
    title: `${evento.titulo} | Famaillá Conecta`,
    description: evento.descripcion || `${evento.categoria} organizado por ${evento.organizador}`,
  };
}

export default async function EventoDetallePage({ params }) {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento) {
    notFound();
  }

  const eventosRelacionados = await getEventosRelacionados(evento.categoria, evento.id);

  // Formatear fecha
  const fechaObj = new Date(evento.fecha + "T00:00:00");
  const fechaFormateada = fechaObj.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dia = fechaObj.getDate();
  const mes = fechaObj.toLocaleDateString("es-AR", { month: "short" }).toUpperCase();

  // Formatear hora
  const formatearHora = (hora) => {
    if (!hora) return null;
    return hora.slice(0, 5) + " hs";
  };

  // Verificar si el evento ya pasó
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const yaPaso = fechaObj < hoy;

  // Construir links de contacto
  const getLinkWhatsApp = () => {
    if (!evento.whatsapp) return null;
    const mensaje = encodeURIComponent(
      `Hola, quiero más información sobre "${evento.titulo}" publicado en Famaillá Conecta.`
    );
    return `https://wa.me/${evento.whatsapp}?text=${mensaje}`;
  };

  const colorCategoria = categoriasColores[evento.categoria] || "bg-stone-100 text-stone-700";
  const gradienteCategoria = categoriasGradiente[evento.categoria] || "from-amber-500 to-orange-500";

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER CON IMAGEN
          ============================================ */}
      <section className={`relative bg-gradient-to-br ${gradienteCategoria} text-white py-20 overflow-hidden`}>
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/eventos" className="hover:text-white transition-colors">
              Eventos
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white truncate max-w-[200px]">{evento.titulo}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Fecha destacada */}
            <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl">
              <span className="text-4xl font-bold text-stone-800 leading-none">{dia}</span>
              <span className="text-sm font-semibold text-stone-500 uppercase">{mes}</span>
            </div>

            {/* Info principal */}
            <div className="flex-1">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${colorCategoria}`}>
                  {evento.categoria}
                </span>
                {evento.precio ? (
                  <span className="text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    ${evento.precio.toLocaleString("es-AR")}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Gratuito
                  </span>
                )}
                {yaPaso && (
                  <span className="text-sm font-semibold text-white bg-red-500/80 px-3 py-1 rounded-full">
                    Evento finalizado
                  </span>
                )}
                {evento.destacado && !yaPaso && (
                  <span className="text-sm font-semibold text-amber-900 bg-amber-300 px-3 py-1 rounded-full">
                    ⭐ Destacado
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {evento.titulo}
              </h1>

              {/* Organizador */}
              <p className="text-white/80 text-lg">
                Organiza: <span className="font-semibold text-white">{evento.organizador}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTENIDO PRINCIPAL
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Imagen del evento */}
              {evento.imagen_url && (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={evento.imagen_url}
                    alt={evento.titulo}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Descripción */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-stone-800 mb-4">
                  Sobre este evento
                </h2>
                {evento.descripcion ? (
                  <div className="prose prose-stone max-w-none">
                    <p className="text-stone-600 whitespace-pre-line leading-relaxed">
                      {evento.descripcion}
                    </p>
                  </div>
                ) : (
                  <p className="text-stone-500 italic">
                    No hay descripción disponible para este evento.
                  </p>
                )}
              </div>

              {/* Cupos */}
              {evento.cupo_maximo && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-stone-800 mb-4">
                    Disponibilidad
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(((evento.cupo_actual || 0) / evento.cupo_maximo) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-stone-600">
                      {evento.cupo_actual || 0} / {evento.cupo_maximo} inscriptos
                    </div>
                  </div>
                  {evento.cupo_actual >= evento.cupo_maximo && (
                    <p className="mt-3 text-amber-600 font-medium">
                      ⚠️ Cupos agotados
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Card de detalles */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-stone-800 mb-4">
                  Detalles del evento
                </h3>

                <div className="space-y-4">
                  {/* Fecha */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Fecha</p>
                      <p className="font-semibold text-stone-800 capitalize">{fechaFormateada}</p>
                    </div>
                  </div>

                  {/* Hora */}
                  {evento.hora_inicio && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Horario</p>
                        <p className="font-semibold text-stone-800">
                          {formatearHora(evento.hora_inicio)}
                          {evento.hora_fin && ` - ${formatearHora(evento.hora_fin)}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lugar */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Lugar</p>
                      <p className="font-semibold text-stone-800">{evento.lugar}</p>
                      {evento.direccion && (
                        <p className="text-sm text-stone-500">{evento.direccion}</p>
                      )}
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Precio</p>
                      <p className="font-semibold text-stone-800">
                        {evento.precio ? `$${evento.precio.toLocaleString("es-AR")}` : "Gratuito"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                {!yaPaso && (
                  <div className="mt-6 space-y-3">
                    {evento.link_inscripcion && (
                      <a
                        href={evento.link_inscripcion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-200/50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Inscribirme
                      </a>
                    )}

                    {evento.whatsapp && (
                      <a
                        href={getLinkWhatsApp()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all ${
                          evento.link_inscripcion
                            ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/50"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {evento.link_inscripcion ? "Consultar por WhatsApp" : "Inscribirme por WhatsApp"}
                      </a>
                    )}

                    {evento.email && (
                      <a
                        href={`mailto:${evento.email}?subject=Consulta: ${evento.titulo}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-700 hover:bg-stone-200 font-semibold px-6 py-3 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Enviar email
                      </a>
                    )}
                  </div>
                )}

                {yaPaso && (
                  <div className="mt-6 bg-stone-100 rounded-xl p-4 text-center">
                    <p className="text-stone-600 font-medium">
                      Este evento ya finalizó
                    </p>
                    <Link
                      href="/eventos"
                      className="inline-flex items-center gap-1 text-emerald-600 font-semibold mt-2 hover:text-emerald-700 transition-colors"
                    >
                      Ver próximos eventos
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Compartir */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="text-lg font-bold text-stone-800 mb-4">
                  Compartir evento
                </h3>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Mirá este evento: ${evento.titulo} - https://famaillaconecta.com/eventos/${evento.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://famaillaconecta.com/eventos/${evento.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          EVENTOS RELACIONADOS
          ============================================ */}
      {eventosRelacionados.length > 0 && (
        <section className="py-12 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Otros eventos de {evento.categoria}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {eventosRelacionados.map((relacionado) => {
                const fechaRel = new Date(relacionado.fecha + "T00:00:00");
                const diaRel = fechaRel.getDate();
                const mesRel = fechaRel.toLocaleDateString("es-AR", { month: "short" }).toUpperCase();

                return (
                  <Link
                    key={relacionado.id}
                    href={`/eventos/${relacionado.slug}`}
                    className="group bg-stone-50 rounded-xl p-5 border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="text-lg font-bold leading-none">{diaRel}</span>
                        <span className="text-xs uppercase">{mesRel}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {relacionado.titulo}
                        </h3>
                        <p className="text-stone-500 text-sm mt-1 truncate">
                          {relacionado.lugar}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                Ver todos los eventos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}