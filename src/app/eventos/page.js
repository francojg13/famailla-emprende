import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Función para obtener eventos desde Supabase
async function getEventos() {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("activo", true)
    .gte("fecha", hoy)
    .order("destacado", { ascending: false })
    .order("fecha", { ascending: true });

  if (error) {
    console.error("Error al cargar eventos:", error);
    return [];
  }

  return data;
}

// Función para obtener eventos pasados
async function getEventosPasados() {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("activo", true)
    .lt("fecha", hoy)
    .order("fecha", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error al cargar eventos pasados:", error);
    return [];
  }

  return data;
}

export default async function EventosPage() {
  const [eventos, eventosPasados] = await Promise.all([
    getEventos(),
    getEventosPasados(),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER DE LA PÁGINA
          ============================================ */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-400 to-orange-400 text-white py-16 relative overflow-hidden">
        {/* Formas decorativas */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-amber-100 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Eventos</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eventos y capacitaciones
          </h1>
          <p className="text-amber-50 text-lg max-w-2xl">
            Talleres, cursos, ferias y charlas para emprendedores de Famaillá.
            ¡Capacitate y hacé crecer tu negocio!
          </p>

          {/* Contador de eventos */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">
              {eventos.length} {eventos.length === 1 ? "evento próximo" : "eventos próximos"}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          PRÓXIMOS EVENTOS
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {eventos.length > 0 ? (
            <>
              {/* Encabezado */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-800">Próximos eventos</h2>
                <p className="text-stone-500 mt-1">No te pierdas ninguna oportunidad de aprender</p>
              </div>

              {/* Grid de eventos */}
              <div className="grid md:grid-cols-2 gap-6">
                {eventos.map((evento) => (
                  <EventCard key={evento.id} evento={evento} />
                ))}
              </div>
            </>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                No hay eventos programados
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                Por el momento no hay eventos próximos. 
                ¡Volvé pronto para ver las novedades!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
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
          EVENTOS PASADOS (si hay)
          ============================================ */}
      {eventosPasados.length > 0 && (
        <section className="py-12 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            {/* Encabezado */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-800">Eventos anteriores</h2>
              <p className="text-stone-500 mt-1">Lo que te perdiste (¡no dejes que pase de nuevo!)</p>
            </div>

            {/* Grid de eventos pasados */}
            <div className="grid md:grid-cols-3 gap-6 opacity-75">
              {eventosPasados.map((evento) => (
                <article
                  key={evento.id}
                  className="bg-stone-50 rounded-xl p-5 border border-stone-100"
                >
                  <span className="inline-block text-xs font-medium text-stone-500 bg-stone-200 px-2 py-1 rounded-full mb-3">
                    {evento.categoria}
                  </span>
                  <h3 className="font-semibold text-stone-700 mb-2 line-clamp-2">
                    {evento.titulo}
                  </h3>
                  <p className="text-stone-400 text-sm">
                    {new Date(evento.fecha + "T00:00:00").toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          CTA PARA ORGANIZADORES
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
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            ¿Organizás cursos o eventos?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publicá tu evento en nuestra agenda
          </h2>

          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Llegá a más emprendedores de Famaillá. Publicar es gratuito para
            instituciones, cámaras y organizaciones sin fines de lucro.
          </p>

          <a
            href="https://wa.me/5493863000000?text=Hola,%20quiero%20publicar%20un%20evento%20en%20Famaillá%20Emprende"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contactanos por WhatsApp
          </a>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}