"use client";

import { useState, useRef } from "react";

export default function FotoUploader({ onUpload, fotoActual, tipo = "perfil" }) {
  const [preview, setPreview] = useState(fotoActual || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validar tipo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Formato no válido. Usá JPG, PNG, WEBP o GIF.");
      return;
    }

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen es muy grande. Máximo 2MB.");
      return;
    }

    // Mostrar preview local mientras sube
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Subir a Supabase
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir");
      }

      // Notificar al padre con la URL
      onUpload(data.url);
    } catch (err) {
      setError(err.message || "Error al subir la imagen");
      setPreview(fotoActual || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview o placeholder */}
      <div className="flex items-center gap-4">
        <div
          className={`relative flex-shrink-0 ${
            tipo === "perfil" ? "w-24 h-24 rounded-2xl" : "w-32 h-20 rounded-xl"
          } bg-stone-100 border-2 border-dashed border-stone-300 overflow-hidden flex items-center justify-center`}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <svg
              className="w-8 h-8 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {tipo === "perfil" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              )}
            </svg>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <label
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors ${
                uploading
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {uploading ? "Subiendo..." : preview ? "Cambiar" : "Subir foto"}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Quitar
              </button>
            )}
          </div>

          <p className="text-xs text-stone-400 mt-2">
            JPG, PNG, WEBP o GIF. Máximo 2MB.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}