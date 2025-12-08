"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    empleosPendientes: 0,
    empleosActivos: 0,
    directorioPendientes: 0,
    directorioActivos: 0,
    eventosProximos: 0,
    eventosPendientes: 0,
    articulos: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      const [empleosRes, directorioRes, eventosRes, articulosRes] = await Promise.all([
        fetch("/api/admin/empleos"),
        fetch("/api/admin/directorio"),
        fetch("/api/admin/eventos"),
        fetch("/api/admin/articulos"),
      ]);

      if (empleosRes.status === 401) {
        router.push("/admin");
        return;
      }

      const empleos = await empleosRes.json();
      const directorio = directorioRes.ok ? await directorioRes.json() : [];
      const eventos = await eventosRes.json();
      const articulos = await articulosRes.json();

      const hoy = new Date().toISOString().split("T")[0];

      setStats({
        empleosPendientes: Array.isArray(empleos) ? empleos.filter((e) => !e.activo).length : 0,
        empleosActivos: Array.isArray(empleos) ? empleos.filter((e) => e.activo).length : 0,
        directorioPendientes: Array.isArray(directorio) ? directorio.filter((d) => !d.activo).length : 0,
        directorioActivos: Array.isArray(directorio) ? directorio.filter((d) => d.activo).length : 0,
        eventosPendientes: Array.isArray(eventos) ? eventos.filter((e) => !e.activo).length : 0,
        eventosProximos: Array.isArray(eventos) ? eventos.filter((e) => e.activo && e.fecha >= hoy).length : 0,
        articulos: Array.isArray(articulos) ? articulos.filter((a) => a.publicado).length : 0,
      });
    } catch (error) {
      console.error("Error cargando stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalPendientes = stats.empleosPendientes + stats.directorioPendientes + stats.eventosPendientes;

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
              F
            </div>
            <div>
              <h1 className="font-bold text-stone-800">Panel Admin</h1>
              <p className="text-xs text-stone-500">Famaillá Conecta</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-sm text-stone-500 hover:text-emerald-600 transition-colors"
            >
              Ver sitio →
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Dashboard</h2>
          {totalPendientes > 0 && (
            <span className="bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full">
              {totalPendientes} pendiente{totalPendientes !== 1 ? "s" : ""} de revisión
            </span>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {/* Empleos pendientes */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {stats.empleosPendientes > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  ¡Revisar!
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.empleosPendientes}</p>
            <p className="text-stone-500 text-xs">Empleos pendientes</p>
          </div>

          {/* Empleos activos */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.empleosActivos}</p>
            <p className="text-stone-500 text-xs">Empleos activos</p>
          </div>

          {/* Directorio pendientes */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {stats.directorioPendientes > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  ¡Revisar!
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.directorioPendientes}</p>
            <p className="text-stone-500 text-xs">Directorio pendiente</p>
          </div>

          {/* Directorio activos */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.directorioActivos}</p>
            <p className="text-stone-500 text-xs">En directorio</p>
          </div>

          {/* Eventos próximos */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {stats.eventosPendientes > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.eventosPendientes}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.eventosProximos}</p>
            <p className="text-stone-500 text-xs">Eventos próximos</p>
          </div>

          {/* Artículos */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-stone-800">{stats.articulos}</p>
            <p className="text-stone-500 text-xs">Artículos publicados</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Accesos rápidos</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gestionar Empleos */}
          <Link
            href="/admin/empleos"
            className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                Gestionar Empleos
              </p>
              <p className="text-sm text-stone-500 truncate">Moderar y administrar ofertas</p>
            </div>
            {stats.empleosPendientes > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                {stats.empleosPendientes}
              </span>
            )}
          </Link>

          {/* Gestionar Directorio */}
          <Link
            href="/admin/directorio"
            className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 group-hover:text-indigo-700 transition-colors">
                Gestionar Directorio
              </p>
              <p className="text-sm text-stone-500 truncate">Servicios y negocios</p>
            </div>
            {stats.directorioPendientes > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                {stats.directorioPendientes}
              </span>
            )}
          </Link>

          {/* Gestionar Eventos */}
          <Link
            href="/admin/eventos"
            className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 group-hover:text-blue-700 transition-colors">
                Gestionar Eventos
              </p>
              <p className="text-sm text-stone-500 truncate">Crear y editar eventos</p>
            </div>
            {stats.eventosPendientes > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                {stats.eventosPendientes}
              </span>
            )}
          </Link>

          {/* Gestionar Blog */}
          <Link
            href="/admin/articulos"
            className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 group-hover:text-purple-700 transition-colors">
                Gestionar Blog
              </p>
              <p className="text-sm text-stone-500 truncate">Escribir y editar artículos</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}