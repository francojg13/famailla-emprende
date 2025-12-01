"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminEmpleosPage() {
  const [empleos, setEmpleos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // todos, pendientes, activos
  const router = useRouter();

  useEffect(() => {
    cargarEmpleos();
  }, []);

  const cargarEmpleos = async () => {
    try {
      const response = await fetch("/api/admin/empleos");

      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await response.json();
      setEmpleos(data);
    } catch (error) {
      console.error("Error cargando empleos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (empleo) => {
    try {
      const response = await fetch("/api/admin/empleos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: empleo.id, activo: !empleo.activo }),
      });

      if (response.ok) {
        setEmpleos(
          empleos.map((e) =>
            e.id === empleo.id ? { ...e, activo: !e.activo } : e
          )
        );
      }
    } catch (error) {
      console.error("Error actualizando empleo:", error);
    }
  };

  const toggleDestacado = async (empleo) => {
    try {
      const response = await fetch("/api/admin/empleos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: empleo.id, destacado: !empleo.destacado }),
      });

      if (response.ok) {
        setEmpleos(
          empleos.map((e) =>
            e.id === empleo.id ? { ...e, destacado: !e.destacado } : e
          )
        );
      }
    } catch (error) {
      console.error("Error actualizando empleo:", error);
    }
  };

  const eliminarEmpleo = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este empleo?")) return;

    try {
      const response = await fetch(`/api/admin/empleos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEmpleos(empleos.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error eliminando empleo:", error);
    }
  };

  const empleosFiltrados = empleos.filter((e) => {
    if (filtro === "pendientes") return !e.activo;
    if (filtro === "activos") return e.activo;
    return true;
  });

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="font-bold text-stone-800 text-lg">Gestionar Empleos</h1>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtro === "todos"
                ? "bg-stone-800 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            Todos ({empleos.length})
          </button>
          <button
            onClick={() => setFiltro("pendientes")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtro === "pendientes"
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            Pendientes ({empleos.filter((e) => !e.activo).length})
          </button>
          <button
            onClick={() => setFiltro("activos")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtro === "activos"
                ? "bg-emerald-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            Activos ({empleos.filter((e) => e.activo).length})
          </button>
        </div>

        {/* Lista de empleos */}
        {empleosFiltrados.length > 0 ? (
          <div className="space-y-4">
            {empleosFiltrados.map((empleo) => (
              <div
                key={empleo.id}
                className={`bg-white rounded-xl border p-6 ${
                  empleo.activo ? "border-stone-200" : "border-amber-300 bg-amber-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Estado */}
                    <div className="flex items-center gap-2 mb-2">
                      {!empleo.activo && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Pendiente de revisión
                        </span>
                      )}
                      {empleo.activo && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Publicado
                        </span>
                      )}
                      {empleo.destacado && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                          ⭐ Destacado
                        </span>
                      )}
                      <span className="text-stone-400 text-xs">
                        {formatearFecha(empleo.created_at)}
                      </span>
                    </div>

                    {/* Título y empresa */}
                    <h3 className="font-semibold text-stone-800 text-lg">
                      {empleo.titulo}
                    </h3>
                    <p className="text-stone-600">{empleo.empresa}</p>
                    <p className="text-stone-400 text-sm">{empleo.ubicacion}</p>

                    {/* Descripción */}
                    {empleo.descripcion && (
                      <p className="text-stone-500 text-sm mt-2 line-clamp-2">
                        {empleo.descripcion}
                      </p>
                    )}

                    {/* WhatsApp */}
                    <p className="text-stone-400 text-sm mt-2">
                      📱 {empleo.whatsapp}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleActivo(empleo)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        empleo.activo
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {empleo.activo ? "Desactivar" : "Aprobar"}
                    </button>

                    <button
                      onClick={() => toggleDestacado(empleo)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        empleo.destacado
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {empleo.destacado ? "Quitar ⭐" : "Destacar ⭐"}
                    </button>

                    <button
                      onClick={() => eliminarEmpleo(empleo.id)}
                      className="px-4 py-2 rounded-lg font-medium text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-500">No hay empleos en esta categoría</p>
          </div>
        )}
      </main>
    </div>
  );
}