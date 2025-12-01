"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "Taller",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    lugar: "",
    direccion: "",
    organizador: "",
    whatsapp: "",
    precio: "",
    activo: true,
    destacado: false,
  });
  const router = useRouter();

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await fetch("/api/admin/eventos");

      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetFormulario = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      categoria: "Taller",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      lugar: "",
      direccion: "",
      organizador: "",
      whatsapp: "",
      precio: "",
      activo: true,
      destacado: false,
    });
    setEventoEditando(null);
    setMostrarFormulario(false);
  };

  const editarEvento = (evento) => {
    setFormData({
      titulo: evento.titulo || "",
      descripcion: evento.descripcion || "",
      categoria: evento.categoria || "Taller",
      fecha: evento.fecha || "",
      hora_inicio: evento.hora_inicio || "",
      hora_fin: evento.hora_fin || "",
      lugar: evento.lugar || "",
      direccion: evento.direccion || "",
      organizador: evento.organizador || "",
      whatsapp: evento.whatsapp || "",
      precio: evento.precio || "",
      activo: evento.activo,
      destacado: evento.destacado,
    });
    setEventoEditando(evento);
    setMostrarFormulario(true);
  };

  const guardarEvento = async (e) => {
    e.preventDefault();

    const datosEvento = {
      ...formData,
      precio: formData.precio ? parseFloat(formData.precio) : null,
      hora_inicio: formData.hora_inicio || null,
      hora_fin: formData.hora_fin || null,
    };

    try {
      const url = "/api/admin/eventos";
      const method = eventoEditando ? "PATCH" : "POST";
      const body = eventoEditando
        ? { id: eventoEditando.id, ...datosEvento }
        : datosEvento;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        cargarEventos();
        resetFormulario();
      }
    } catch (error) {
      console.error("Error guardando evento:", error);
    }
  };

  const eliminarEvento = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;

    try {
      const response = await fetch(`/api/admin/eventos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEventos(eventos.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
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
            <h1 className="font-bold text-stone-800 text-lg">Gestionar Eventos</h1>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo evento
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              {eventoEditando ? "Editar evento" : "Nuevo evento"}
            </h2>

            <form onSubmit={guardarEvento} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Taller">Taller</option>
                    <option value="Curso">Curso</option>
                    <option value="Charla">Charla</option>
                    <option value="Feria">Feria</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Hora inicio
                    </label>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={formData.hora_inicio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      name="hora_fin"
                      value={formData.hora_fin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Lugar *
                  </label>
                  <input
                    type="text"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Organizador *
                  </label>
                  <input
                    type="text"
                    name="organizador"
                    value={formData.organizador}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="5493863123456"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Precio (vacío = gratuito)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-stone-700">Activo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-stone-700">Destacado</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  {eventoEditando ? "Guardar cambios" : "Crear evento"}
                </button>
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de eventos */}
        {eventos.length > 0 ? (
          <div className="space-y-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-xl border border-stone-200 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {evento.categoria}
                      </span>
                      {!evento.activo && (
                        <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2 py-1 rounded-full">
                          Inactivo
                        </span>
                      )}
                      {evento.destacado && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-stone-800 text-lg">
                      {evento.titulo}
                    </h3>
                    <p className="text-stone-600">
                      📅 {formatearFecha(evento.fecha)}
                      {evento.hora_inicio && ` - ${evento.hora_inicio}`}
                    </p>
                    <p className="text-stone-500 text-sm">
                      📍 {evento.lugar} | 🏢 {evento.organizador}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editarEvento(evento)}
                      className="px-4 py-2 rounded-lg font-medium text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarEvento(evento.id)}
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
            <p className="text-stone-500">No hay eventos creados</p>
          </div>
        )}
      </main>
    </div>
  );
}