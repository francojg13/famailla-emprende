"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* ============================================
              LOGO
              ============================================ */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Icono/Símbolo */}
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200/50 group-hover:shadow-lg group-hover:shadow-emerald-200/70 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            {/* Texto del logo */}
            <span className="text-xl font-bold text-stone-800 tracking-tight">
              Famaillá
              <span className="text-emerald-600">Emprende</span>
            </span>
          </Link>

          {/* ============================================
              ENLACES DEL MENÚ (Escritorio)
              ============================================ */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="relative px-4 py-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors group"
            >
              Inicio
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-6 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/empleos"
              className="relative px-4 py-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors group"
            >
              Empleos
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-6 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/eventos"
              className="relative px-4 py-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors group"
            >
              Eventos
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-6 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/blog"
              className="relative px-4 py-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors group"
            >
              Blog
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-6 transition-all duration-300 rounded-full" />
            </Link>
          </div>

          {/* ============================================
              BOTÓN CTA (Escritorio)
              ============================================ */}
          <div className="hidden md:block">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
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
              Publicar Gratis
            </Link>
          </div>

          {/* ============================================
              BOTÓN HAMBURGUESA (Móvil)
              ============================================ */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 text-stone-600 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            {menuAbierto ? (
              // Icono X (cerrar)
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icono hamburguesa
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* ============================================
            MENÚ MÓVIL DESPLEGABLE
            ============================================ */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuAbierto ? "max-h-80 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-stone-100">
            <Link
              href="/"
              onClick={() => setMenuAbierto(false)}
              className="px-4 py-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/empleos"
              onClick={() => setMenuAbierto(false)}
              className="px-4 py-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors"
            >
              Empleos
            </Link>
            <Link
              href="/eventos"
              onClick={() => setMenuAbierto(false)}
              className="px-4 py-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors"
            >
              Eventos
            </Link>
            <Link
              href="/blog"
              onClick={() => setMenuAbierto(false)}
              className="px-4 py-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors"
            >
              Blog
            </Link>

            {/* CTA en móvil */}
            <Link
              href="/publicar"
              onClick={() => setMenuAbierto(false)}
              className="mx-4 mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md"
            >
              <svg
                className="w-4 h-4"
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
              Publicar Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}