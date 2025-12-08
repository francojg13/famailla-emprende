"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDirectorioPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // todos, pendientes, activos, servicios, negocios
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const response = await fetch("/api/admin/directorio");

      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando directorio:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarRegistro = async (id, datos) => {
    try {
      const response = await fetch("/api/admin/directorio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...datos }),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      await cargarRegistros();
    } catch (error) {
      console.error("Error actualizando registro:", error);
      alert("Error al actualizar el registro");
    }
  };

  const eliminarRegistro = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/directorio?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      await cargarRegistros();
    } catch (error) {
      console.error("Error eliminando registro:", error);
      alert("Error al eliminar el registro");
    }
  };

  // Filtrar registros
  const registrosFiltrados = registros.filter((r) => {
    // Filtro por estado/tipo
    if (filtro === "pendientes" && r.activo) return false;
    if (filtro === "activos" && !r.activo) return false;
    if (filtro === "servicios" && r.tipo !== "servicio") return false;
    if (filtro === "negocios" && r.tipo !== "negocio") return false;

    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      return (
        r.nombre?.toLowerCase().includes(busquedaLower) ||
        r.profesion?.toLowerCase().includes(busquedaLower) ||
        r.telefono?.includes(busqueda) ||
        r.email?.toLowerCase().includes(busquedaLower)
      );
    }

    return true;
  });

  const conteos = {
    todos: registros.length,
    pendientes: registros.filter((r) => !r.activo).length,
    activos: registros.filter((r) => r.activo).length,
    servicios: registros.filter((r) => r.tipo === "servicio").length,
    negocios: registros.filter((r) => r.tipo === "negocio").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold hover:shadow-lg transition-shadow"
            >
              F
            </Link>
            <div>
              <h1 className="font-bold text-stone-800">Gestionar Directorio</h1>
              <p className="text-xs text-stone-500">Famaillá Conecta</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-stone-500 hover:text-emerald-600 transition-colors"
            >
              ← Volver al dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Barra de herramientas */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, profesión, teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "todos", label: "Todos", color: "stone" },
                { key: "pendientes", label: "Pendientes", color: "amber" },
                { key: "activos", label: "Activos", color: "emerald" },
                { key: "servicios", label: "Servicios", color: "teal" },
                { key: "negocios", label: "Negocios", color: "purple" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filtro === f.key
                      ? f.color === "stone"
                        ? "bg-stone-800 text-white"
                        : f.color === "amber"
                          ? "bg-amber-500 text-white"
                          : f.color === "emerald"
                            ? "bg-emerald-500 text-white"
                            : f.color === "teal"
                              ? "bg-teal-500 text-white"
                              : "bg-purple-500 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {f.label} ({conteos[f.key]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de registros */}
        {registrosFiltrados.length > 0 ? (
          <div className="space-y-4">
            {registrosFiltrados.map((registro) => (
              <div
                key={registro.id}
                className={`bg-white rounded-2xl border p-6 transition-all ${
                  registro.activo
                    ? "border-stone-200"
                    : "border-amber-300 bg-amber-50/50"
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Foto */}
                  <div className="flex-shrink-0">
                    {registro.foto_url ? (
                      <img
                        src={registro.foto_url}
                        alt={registro.nombre}
                        className={`w-20 h-20 object-cover ${
                          registro.tipo === "negocio" ? "rounded-xl" : "rounded-full"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 flex items-center justify-center text-white font-bold text-2xl ${
                          registro.tipo === "negocio"
                            ? "rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500"
                            : "rounded-full bg-gradient-to-br from-emerald-500 to-teal-500"
                        }`}
                      >
                        {registro.tipo === "negocio" ? (
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        ) : (
                          registro.nombre?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-stone-800">
                            {registro.nombre}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              registro.tipo === "negocio"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-teal-100 text-teal-700"
                            }`}
                          >
                            {registro.tipo === "negocio" ? "Negocio" : "Servicio"}
                          </span>
                          {registro.verificado && (
                            <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Verificado
                            </span>
                          )}
                          {registro.destacado && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              ⭐ Destacado
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600">{registro.profesion}</p>
                        {registro.categoria && (
                          <p className="text-stone-400 text-sm">{registro.categoria}</p>
                        )}
                      </div>

                      {/* Estado */}
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          registro.activo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {registro.activo ? "Activo" : "Pendiente"}
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
                      {registro.telefono && (
                        <div className="flex items-center gap-2 text-stone-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {registro.telefono}
                        </div>
                      )}
                      {registro.email && (
                        <div className="flex items-center gap-2 text-stone-500 truncate">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{registro.email}</span>
                        </div>
                      )}
                      {registro.direccion && (
                        <div className="flex items-center gap-2 text-stone-500 truncate">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="truncate">{registro.direccion}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-stone-400 text-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(registro.created_at).toLocaleDateString("es-AR")}
                      </div>
                    </div>

                    {/* Descripción */}
                    {registro.descripcion && (
                      <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                        {registro.descripcion}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2">
                      {!registro.activo ? (
                        <button
                          onClick={() => actualizarRegistro(registro.id, { activo: true })}
                          className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Aprobar
                        </button>
                      ) : (
                        <button
                          onClick={() => actualizarRegistro(registro.id, { activo: false })}
                          className="inline-flex items-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Desactivar
                        </button>
                      )}

                      <button
                        onClick={() =>
                          actualizarRegistro(registro.id, { verificado: !registro.verificado })
                        }
                        className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                          registro.verificado
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {registro.verificado ? "Quitar verificado" : "Verificar"}
                      </button>

                      <button
                        onClick={() =>
                          actualizarRegistro(registro.id, { destacado: !registro.destacado })
                        }
                        className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                          registro.destacado
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        ⭐ {registro.destacado ? "Quitar destacado" : "Destacar"}
                      </button>

                      <a
                        href={`/directorio/${registro.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver perfil
                      </a>

                      <button
                        onClick={() => eliminarRegistro(registro.id, registro.nombre)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-2">
              No hay registros
            </h3>
            <p className="text-stone-500">
              {busqueda
                ? `No se encontraron resultados para "${busqueda}"`
                : filtro === "pendientes"
                  ? "No hay registros pendientes de aprobación"
                  : "Aún no hay registros en el directorio"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}