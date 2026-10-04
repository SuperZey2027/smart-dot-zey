"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  categoria: string | null;
};

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  // Revisa si el dueño tiene la sesión iniciada
const [haySesion, setHaySesion] = useState(false);
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => setHaySesion(!!data.session));
}, []);

  // Al abrir la página, trae los productos de la base de datos
  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .order("creado_en", { ascending: false })
      .then(({ data }) => {
        setProductos((data as Producto[]) ?? []);
        setCargando(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Barra superior sencilla con regreso al inicio */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-xl font-black uppercase tracking-tight text-slate-900">Smart Dot Zey</a>
         {/* Dueño con sesión: vuelve al panel. Cliente: vuelve al inicio de la página */}
         <a href="/" className="text-emerald-600">Ver página web</a>
<a href={haySesion ? "/admin" : "/"} className="text-sm font-bold text-emerald-600">
  {haySesion ? "← Volver al panel" : "← Volver al inicio"}
</a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-black uppercase text-slate-900">Catálogo</h1>

        {cargando && <p>Cargando productos...</p>}
        {!cargando && productos.length === 0 && <p className="text-slate-500">Pronto tendremos productos disponibles.</p>}

        {/* Cuadrícula: 2 columnas en celular, 3 en tablet, 4 en computadora */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* aspect-square + object-cover: todas las fotos quedan del mismo tamaño */}
              {p.imagen_url && (
                <img src={p.imagen_url} alt={p.nombre} className="aspect-square w-full object-cover" />
              )}
              <div className="space-y-2 p-4">
                {p.categoria && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{p.categoria}</span>
                )}
                <h2 className="font-black leading-tight text-slate-900">{p.nombre}</h2>
                <p className="text-xl font-black text-emerald-600">${Number(p.precio).toFixed(2)}</p>
                {/* Botón que abre WhatsApp con el nombre del producto ya escrito */}
                <a
                  href={`https://wa.me/593960524058?text=${encodeURIComponent(`Hola, quiero cotizar: ${p.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg bg-emerald-500 py-2 text-center text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-600"
                >
                  Cotizar
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}