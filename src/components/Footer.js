import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-stone-900 text-stone-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo */}
          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              Famaillá Emprende
            </h3>
            <p className="text-sm">
              Conectando talento y oportunidades en nuestra ciudad
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-6 text-sm">
            <Link
              href="/empleos"
              className="hover:text-emerald-400 transition-colors"
            >
              Empleos
            </Link>
            <Link
              href="/eventos"
              className="hover:text-emerald-400 transition-colors"
            >
              Eventos
            </Link>
             <Link
              href="/directorio"
              className="hover:text-emerald-400 transition-colors"
            >
              Directorio
            </Link>
            <Link
              href="/blog"
              className="hover:text-emerald-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className="hover:text-emerald-400 transition-colors"
            >
              Contacto
            </Link>
          </nav>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Famaillá Emprende. Hecho con 💚 en
            Tucumán.
          </p>
        </div>
      </div>
    </footer>
  );
}