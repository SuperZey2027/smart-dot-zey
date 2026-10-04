"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Forma de un producto, igual que las columnas de la tabla "productos"
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  categoria: string | null;
};

// Categorías disponibles (puedes agregar o quitar nombres)
const CATEGORIAS = ["Energía solar", "Iluminación", "Seguridad", "Domótica", "Material eléctrico"];

// Reduce la foto a máximo 800 px de ancho y la comprime, para que no llene el almacén
async function reducirImagen(archivo: File, anchoMax = 800): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, anchoMax / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolver, rechazar) =>
    canvas.toBlob(
      (b) => (b ? resolver(b) : rechazar(new Error("No se pudo reducir la imagen"))),
      "image/jpeg",
      0.8
    )
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  // Datos del inicio de sesión
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // Datos del formulario de producto
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0); // sirve para vaciar el selector de foto
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Si tiene un producto, el formulario está en modo "editar"; si es null, está en modo "nuevo"
  const [editando, setEditando] = useState<Producto | null>(null);

  const [productos, setProductos] = useState<Producto[]>([]);

  // Al abrir la página: revisa si ya hay sesión iniciada y escucha cambios
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargando(false);
    });
    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSession(nuevaSesion);
    });
    return () => escucha.subscription.unsubscribe();
  }, []);

  // Trae los productos de la base de datos
  async function cargarProductos() {
    const { data } = await supabase
      .from("productos")
      .select("*")
      .order("creado_en", { ascending: false });
    setProductos((data as Producto[]) ?? []);
  }

  // Cuando hay sesión, carga la lista
  useEffect(() => {
    if (session) cargarProductos();
  }, [session]);

  async function iniciarSesion(e: React.SyntheticEvent) {
    e.preventDefault();
    setErrorLogin("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorLogin("Correo o contraseña incorrectos");
  }

  // Vacía el formulario y vuelve al modo "nuevo producto"
  function limpiarFormulario() {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setCategoria("");
    setArchivo(null);
    setInputKey((k) => k + 1);
  }

  // Carga los datos de un producto en el formulario para modificarlo
  function iniciarEdicion(p: Producto) {
    setEditando(p);
    setNombre(p.nombre);
    setPrecio(String(p.precio));
    setCategoria(p.categoria ?? "");
    setArchivo(null);
    setInputKey((k) => k + 1);
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicion() {
    limpiarFormulario();
    setMensaje("");
  }

  // Sirve tanto para crear un producto nuevo como para guardar los cambios de uno existente
  async function guardarProducto(e: React.SyntheticEvent) {
    e.preventDefault();
    setMensaje("");
    const eraEdicion = !!editando;

    // Al crear, la foto es obligatoria; al editar, es opcional (si no eliges una, se queda la actual)
    if (!nombre.trim() || !precio || (!eraEdicion && !archivo)) {
      setMensaje(eraEdicion ? "Escribe el nombre y el precio." : "Escribe el nombre, el precio y elige una foto.");
      return;
    }

    setGuardando(true);
    try {
      let imagenUrl = editando?.imagen_url ?? null;
      let fotoAnterior: string | null = null;

      // Si eligió una foto nueva: se reduce, se sube y se anota la anterior para borrarla después
      if (archivo) {
        const foto = await reducirImagen(archivo);
        const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error: errorSubida } = await supabase.storage
          .from("productos")
          .upload(nombreArchivo, foto, { contentType: "image/jpeg" });
        if (errorSubida) throw errorSubida;

        const { data: url } = supabase.storage.from("productos").getPublicUrl(nombreArchivo);
        fotoAnterior = editando?.imagen_url ?? null;
        imagenUrl = url.publicUrl;
      }

      const datos = {
        nombre: nombre.trim(),
        precio: Number(precio),
        categoria: categoria.trim() || null,
        imagen_url: imagenUrl,
      };

      if (editando) {
        const { error } = await supabase.from("productos").update(datos).eq("id", editando.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("productos").insert(datos);
        if (error) throw error;
      }

      // Si se cambió la foto, borra la anterior del almacén para no acumular archivos
      if (fotoAnterior) {
        const nombreAnterior = fotoAnterior.split("/").pop();
        if (nombreAnterior) await supabase.storage.from("productos").remove([nombreAnterior]);
      }

      limpiarFormulario();
      setMensaje(eraEdicion ? "✅ Cambios guardados" : "✅ Producto guardado");
      cargarProductos();
    } catch {
      setMensaje("❌ No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarProducto(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    // Borra la foto del almacén (el nombre es lo último de la dirección) y luego el producto
    if (p.imagen_url) {
      const nombreArchivo = p.imagen_url.split("/").pop();
      if (nombreArchivo) await supabase.storage.from("productos").remove([nombreArchivo]);
    }
    await supabase.from("productos").delete().eq("id", p.id);
    if (editando?.id === p.id) cancelarEdicion();
    cargarProductos();
  }

  if (cargando) return <main className="p-10 text-center text-slate-900">Cargando...</main>;

  // ---------- PANTALLA DE INICIO DE SESIÓN ----------
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-6 text-slate-900">
        <form onSubmit={iniciarSesion} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-xl font-black uppercase text-slate-900">Panel de productos</h1>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {errorLogin && <p className="text-sm text-red-600">{errorLogin}</p>}
          <button className="w-full rounded-lg bg-emerald-500 py-2 font-black uppercase text-white hover:bg-emerald-600">
            Entrar
          </button>
        </form>
      </main>
    );
  }

  // ---------- PANEL PARA SUBIR, EDITAR Y ELIMINAR PRODUCTOS ----------
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase text-slate-900">Panel de productos</h1>
          <div className="flex gap-4 text-sm font-bold">
            <a href="/" className="text-emerald-600">Ver página web</a>
            <a href="/catalogo" target="_blank" rel="noopener noreferrer" className="text-emerald-600">Ver catálogo</a>
            <button onClick={() => supabase.auth.signOut()} className="text-slate-500">Cerrar sesión</button>
          </div>
        </div>

        {/* Formulario: sirve para crear un producto nuevo o para editar uno existente */}
        <form onSubmit={guardarProducto} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-black uppercase text-slate-700">
            {editando ? `Editando: ${editando.nombre}` : "Nuevo producto"}
          </h2>

          <input
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Precio (ej. 25.50)"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Categoría</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              {/* Si el producto tiene una categoría antigua que no está en la lista, también se muestra */}
              {categoria && !CATEGORIAS.includes(categoria) && (
                <option value={categoria}>{categoria}</option>
              )}
            </select>
          </div>

          {/* Al editar, muestra la foto actual */}
          {editando?.imagen_url && (
            <div className="flex items-center gap-3">
              <img src={editando.imagen_url} alt="Foto actual" className="h-16 w-16 rounded-lg object-cover" />
              <p className="text-sm text-slate-500">Foto actual. Si no eliges otra, se queda esta.</p>
            </div>
          )}

          <input
            key={inputKey}
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />

          {mensaje && <p className="text-sm font-bold">{mensaje}</p>}

          <div className="flex gap-3">
            <button
              disabled={guardando}
              className="rounded-lg bg-emerald-500 px-6 py-2 font-black uppercase text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Guardar producto"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="rounded-lg border border-slate-300 px-6 py-2 font-bold text-slate-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de productos ya subidos, con botones para editar y eliminar */}
        <div className="space-y-3">
          {productos.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm">
              {p.imagen_url && (
                <img src={p.imagen_url} alt={p.nombre} className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-black text-slate-900">{p.nombre}</p>
                <p className="text-sm text-slate-500">
                  ${Number(p.precio).toFixed(2)} {p.categoria ? `• ${p.categoria}` : ""}
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => iniciarEdicion(p)} className="text-sm font-bold text-emerald-600">
                  Editar
                </button>
                <button onClick={() => eliminarProducto(p)} className="text-sm font-bold text-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {productos.length === 0 && <p className="text-center text-slate-500">Aún no hay productos.</p>}
        </div>
      </div>
    </main>
  );
}