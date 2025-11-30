import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import Footer from "@/components/Footer";
import Link from "next/link";

// Función para obtener empleos desde Supabase
async function getEmpleos() {
  const { data, error } = await supabase
    .from("empleos")
    .select("*")
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar empleos:", error);
    return [];
  }

  return data;
}

export default async function EmpleosPage() {
  const empleos = await getEmpleos();

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ============================================
          HEADER DE LA PÁGINA
          ============================================ */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-16 relative overflow-hidden">
        {/* Formas decorativas */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-5 left-5 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Empleos</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ofertas laborales
          </h1>
          <p className="text-emerald-50 text-lg max-w-2xl">
            Encontrá tu próxima oportunidad en empresas y comercios de Famaillá.
            Postulate directamente por WhatsApp.
          </p>

          {/* Contador de empleos */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {empleos.length} {empleos.length === 1 ? "empleo disponible" : "empleos disponibles"}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          LISTADO DE EMPLEOS
          ============================================ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {empleos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empleos.map((empleo) => (
                <JobCard key={empleo.id} empleo={empleo} />
              ))}
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">
                No hay empleos publicados
              </h2>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                Por el momento no hay ofertas laborales disponibles. 
                Volvé pronto o publicá la primera oferta.
              </p>
              <Link
                href="/publicar"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publicar empleo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA PARA EMPRESAS
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
            ¿Tenés una vacante para cubrir?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publicá tus ofertas laborales
            <span className="text-emerald-400"> gratis</span>
          </h2>

          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Conectá con el talento local. Publicar es simple: completás un
            formulario y los candidatos te contactan directamente por WhatsApp.
          </p>

          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Publicar empleo
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </main>
  );
}