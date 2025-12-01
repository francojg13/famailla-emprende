"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminArticulosPage() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [articuloEditando, setArticuloEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    extracto: "",
    contenido: "",
    categoria: "General",
    autor: "Famaillá Emprende",
    imagen_url: "",
    publicado: false,
    destacado: false,
  });
  const router = useRouter();

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const response = await fetch("/api/admin/articulos");

      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await response.json();
      setArticulos(data);
    } catch (error) {
      console.error("Error cargando artículos:", error);
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

  const generarSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTituloChange = (e) => {
    const titulo = e.target.value;
    setFormData((prev) => ({
      ...prev,
      titulo,
      slug: articuloEditando ? prev.slug : generarSlug(titulo),
    }));
  };

  const resetFormulario = () => {
    setFormData({
      titulo: "",
      slug: "",
      extracto: "",
      contenido: "",
      categoria: "General",
      autor: "Famaillá Emprende",
      imagen_url: "",
      publicado: false,
      destacado: false,
    });
    setArticuloEditando(null);
    setMostrarFormulario(false);
  };

  const editarArticulo = (articulo) => {
    setFormData({
      titulo: articulo.titulo || "",
      slug: articulo.slug || "",
      extracto: articulo.extracto || "",
      contenido: articulo.contenido || "",
      categoria: articulo.categoria || "General",
      autor: articulo.autor || "Famaillá Emprende",
      imagen_url: articulo.imagen_url || "",
      publicado: articulo.publicado,
      destacado: articulo.destacado,
    });
    setArticuloEditando(articulo);
    setMostrarFormulario(true);
  };

  const guardarArticulo = async (e) => {
    e.preventDefault();

    try {
      const url = "/api/admin/articulos";
      const method = articuloEditando ? "PATCH" : "POST";
      const body = articuloEditando
        ? { id: articuloEditando.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        cargarArticulos();
        resetFormulario();
      }
    } catch (error) {
      console.error("Error guardando artículo:", error);
    }
  };

  const togglePublicado = async (articulo) => {
    try {
      const response = await fetch("/api/admin/articulos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articulo.id, publicado: !articulo.publicado }),
      });

      if (response.ok) {
        setArticulos(
          articulos.map((a) =>
            a.id === articulo.id ? { ...a, publicado: !a.publicado } : a
          )
        );
      }
    } catch (error) {
      console.error("Error actualizando artículo:", error);
    }
  };

  const eliminarArticulo = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

    try {
      const response = await fetch(`/api/admin/articulos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticulos(articulos.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Error eliminando artículo:", error);
    }
  };

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
            <h1 className="font-bold text-stone-800 text-lg">Gestionar Blog</h1>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo artículo
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              {articuloEditando ? "Editar artículo" : "Nuevo artículo"}
            </h2>

            <form onSubmit={guardarArticulo} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleTituloChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
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
                    <option value="General">General</option>
                    <option value="Emprendimiento">Emprendimiento</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Legal">Legal</option>
                    <option value="Tecnología">Tecnología</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    name="autor"
                    value={formData.autor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Extracto (resumen corto)
                </label>
                <textarea
                  name="extracto"
                  value={formData.extracto}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Breve descripción del artículo..."
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Contenido * (soporta Markdown)
                </label>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                  rows={12}
                  placeholder="## Título de sección&#10;&#10;Texto del artículo...&#10;&#10;- Lista item 1&#10;- Lista item 2"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="text-xs text-stone-400 mt-1">
                  Usá ## para títulos, **texto** para negrita, - para listas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  URL de imagen destacada
                </label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="publicado"
                    checked={formData.publicado}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-stone-700">Publicado</span>
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
                  {articuloEditando ? "Guardar cambios" : "Crear artículo"}
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

        {/* Lista de artículos */}
        {articulos.length > 0 ? (
          <div className="space-y-4">
            {articulos.map((articulo) => (
              <div
                key={articulo.id}
                className="bg-white rounded-xl border border-stone-200 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {articulo.categoria}
                      </span>
                      {articulo.publicado ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Publicado
                        </span>
                      ) : (
                        <span className="bg-stone-100 text-stone-500 text-xs font-semibold px-2 py-1 rounded-full">
                          Borrador
                        </span>
                      )}
                      {articulo.destacado && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                          ⭐ Destacado
                        </span>
                      )}
                      <span className="text-stone-400 text-xs">
                        {formatearFecha(articulo.created_at)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-stone-800 text-lg">
                      {articulo.titulo}
                    </h3>
                    {articulo.extracto && (
                      <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                        {articulo.extracto}
                      </p>
                    )}
                    <p className="text-stone-400 text-xs mt-2">
                      /{articulo.slug}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublicado(articulo)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        articulo.publicado
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {articulo.publicado ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      onClick={() => editarArticulo(articulo)}
                      className="px-4 py-2 rounded-lg font-medium text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarArticulo(articulo.id)}
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
            <p className="text-stone-500">No hay artículos creados</p>
          </div>
        )}
      </main>
    </div>
  );
}