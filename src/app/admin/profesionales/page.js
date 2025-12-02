"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminProfesionalesPage() {
  const [profesionales, setProfesionales] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profesionales"); // profesionales, resenas
  const [filtro, setFiltro] = useState("todos"); // todos, pendientes, activos
  const router = useRouter();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resProfesionales, resResenas] = await Promise.all([
        fetch("/api/admin/profesionales"),
        fetch("/api/admin/resenas"),
      ]);

      if (resProfesionales.status === 401) {
        router.push("/admin");
        return;
      }

      const dataProfesionales = await resProfesionales.json();
      const dataResenas = await resResenas.json();

      setProfesionales(dataProfesionales);
      setResenas(dataResenas);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Profesionales
  const toggleActivo = async (profesional) => {
    try {
      const response = await fetch("/api/admin/profesionales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profesional.id, activo: !profesional.activo }),
      });

      if (response.ok) {
        setProfesionales(
          profesionales.map((p) =>
            p.id === profesional.id ? { ...p, activo: !p.activo } : p
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleVerificado = async (profesional) => {
    try {
      const response = await fetch("/api/admin/profesionales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profesional.id, verificado: !profesional.verificado }),
      });

      if (response.ok) {
        setProfesionales(
          profesionales.map((p) =>
            p.id === profesional.id ? { ...p, verificado: !p.verificado } : p
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDestacado = async (profesional) => {
    try {
      const response = await fetch("/api/admin/profesionales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profesional.id, destacado: !profesional.destacado }),
      });

      if (response.ok) {
        setProfesionales(
          profesionales.map((p) =>
            p.id === profesional.id ? { ...p, destacado: !p.destacado } : p
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const eliminarProfesional = async (id) => {
    if (!confirm("¿Eliminar este profesional?")) return;

    try {
      const response = await fetch(`/api/admin/profesionales?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProfesionales(profesionales.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Reseñas
  const toggleAprobada = async (resena) => {
    try {
      const response = await fetch("/api/admin/resenas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resena.id, aprobada: !resena.aprobada }),
      });

      if (response.ok) {
        setResenas(
          resenas.map((r) =>
            r.id === resena.id ? { ...r, aprobada: !r.aprobada } : r
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const eliminarResena = async (id) => {
    if (!confirm("¿Eliminar esta reseña?")) return;

    try {
      const response = await fetch(`/api/admin/resenas?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResenas(resenas.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const profesionalesFiltrados = profesionales.filter((p) => {
    if (filtro === "pendientes") return !p.activo;
    if (filtro === "activos") return p.activo;
    return true;
  });

  const resenasPendientes = resenas.filter((r) => !r.aprobada);

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
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="font-bold text-stone-800 text-lg">Gestionar Profesionales</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("profesionales")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "profesionales"
                ? "bg-indigo-600 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            Profesionales ({profesionales.length})
          </button>
          <button
            onClick={() => setTab("resenas")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "resenas"
                ? "bg-indigo-600 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            Reseñas ({resenas.length})
            {resenasPendientes.length > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {resenasPendientes.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Profesionales */}
        {tab === "profesionales" && (
          <>
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
                Todos ({profesionales.length})
              </button>
              <button
                onClick={() => setFiltro("pendientes")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filtro === "pendientes"
                    ? "bg-amber-500 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                Pendientes ({profesionales.filter((p) => !p.activo).length})
              </button>
              <button
                onClick={() => setFiltro("activos")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filtro === "activos"
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                Activos ({profesionales.filter((p) => p.activo).length})
              </button>
            </div>

            {/* Lista */}
            {profesionalesFiltrados.length > 0 ? (
              <div className="space-y-4">
                {profesionalesFiltrados.map((profesional) => (
                  <div
                    key={profesional.id}
                    className={`bg-white rounded-xl border p-6 ${
                      profesional.activo ? "border-stone-200" : "border-amber-300 bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {!profesional.activo && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                              Pendiente
                            </span>
                          )}
                          {profesional.activo && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                              Activo
                            </span>
                          )}
                          {profesional.verificado && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                              ✓ Verificado
                            </span>
                          )}
                          {profesional.destacado && (
                            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                              ⭐ Destacado
                            </span>
                          )}
                          <span className="bg-stone-100 text-stone-600 text-xs font-semibold px-2 py-1 rounded-full">
                            {profesional.categoria}
                          </span>
                          <span className="text-stone-400 text-xs">
                            {formatearFecha(profesional.created_at)}
                          </span>
                        </div>

                        <h3 className="font-semibold text-stone-800 text-lg">
                          {profesional.nombre}
                        </h3>
                        <p className="text-indigo-600 font-medium">{profesional.profesion}</p>
                        {profesional.descripcion && (
                          <p className="text-stone-500 text-sm mt-2 line-clamp-2">
                            {profesional.descripcion}
                          </p>
                        )}
                        <p className="text-stone-400 text-sm mt-2">
                          📱 {profesional.whatsapp}
                          {profesional.email && ` · 📧 ${profesional.email}`}
                        </p>
                        <p className="text-stone-400 text-xs mt-1">
                          ⭐ {profesional.puntuacion_promedio || 0} ({profesional.total_resenas || 0} reseñas)
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleActivo(profesional)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            profesional.activo
                              ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              : "bg-emerald-500 text-white hover:bg-emerald-600"
                          }`}
                        >
                          {profesional.activo ? "Desactivar" : "Aprobar"}
                        </button>

                        <button
                          onClick={() => toggleVerificado(profesional)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            profesional.verificado
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {profesional.verificado ? "Quitar ✓" : "Verificar ✓"}
                        </button>

                        <button
                          onClick={() => toggleDestacado(profesional)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            profesional.destacado
                              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {profesional.destacado ? "Quitar ⭐" : "Destacar ⭐"}
                        </button>

                        <button
                          onClick={() => eliminarProfesional(profesional.id)}
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
                <p className="text-stone-500">No hay profesionales en esta categoría</p>
              </div>
            )}
          </>
        )}

        {/* Tab Reseñas */}
        {tab === "resenas" && (
          <>
            {resenas.length > 0 ? (
              <div className="space-y-4">
                {resenas.map((resena) => (
                  <div
                    key={resena.id}
                    className={`bg-white rounded-xl border p-6 ${
                      resena.aprobada ? "border-stone-200" : "border-amber-300 bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!resena.aprobada && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                              Pendiente
                            </span>
                          )}
                          {resena.aprobada && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                              Aprobada
                            </span>
                          )}
                          <span className="text-stone-400 text-xs">
                            {formatearFecha(resena.created_at)}
                          </span>
                        </div>

                        <p className="text-stone-600 mb-2">
                          <span className="font-semibold text-stone-800">{resena.nombre_cliente}</span>
                          {" → "}
                          <span className="text-indigo-600">{resena.profesionales?.nombre}</span>
                          <span className="text-stone-400 text-sm"> ({resena.profesionales?.profesion})</span>
                        </p>

                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <svg
                              key={num}
                              className={`w-5 h-5 ${num <= resena.puntuacion ? "text-amber-400" : "text-stone-200"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {resena.comentario && (
                          <p className="text-stone-500 text-sm">{resena.comentario}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAprobada(resena)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            resena.aprobada
                              ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              : "bg-emerald-500 text-white hover:bg-emerald-600"
                          }`}
                        >
                          {resena.aprobada ? "Desaprobar" : "Aprobar"}
                        </button>

                        <button
                          onClick={() => eliminarResena(resena.id)}
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
                <p className="text-stone-500">No hay reseñas</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}