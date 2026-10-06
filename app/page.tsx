"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const [tiempo, setTiempo] = useState({ d: 0, h: 0, m: 0, s: 0 });

useEffect(() => {
  const fin = new Date("2026-10-31T23:59:59").getTime();
  const tick = () => {
    const diff = Math.max(fin - Date.now(), 0);
    setTiempo({
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    });
  };
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
// Marcas que aparecen en la cinta
const marcas = ["Deye", "Huawei", "Victron Energy", "Longi", "Trina Solar", "JinkoSolar", "Soluna"];
const categorias = ["Energía solar", "Iluminación", "Seguridad", "Domótica", "Material eléctrico"];
// Control del video: arranca sin sonido (los navegadores solo dejan reproducir solo si está silenciado)
const videoRef = useRef<HTMLVideoElement>(null);
const [silenciado, setSilenciado] = useState(true);
const alternarSonido = () => {
  if (videoRef.current) {
    videoRef.current.muted = !videoRef.current.muted;
    setSilenciado(videoRef.current.muted);
  }
};
  return (
    <main className="min-h-screen text-slate-800 font-sans antialiased">
      {/* Fondo único de toda la página */}
<div
  className="fixed inset-0 -z-10 bg-cover bg-center"
  style={{ backgroundImage: "url('/domotica-1.jpeg')" }}
></div>
<div className="fixed inset-0 -z-10 bg-black/10"></div>
      

      {/* 2. NAVBAR PRINCIPAL */}
      <header translate="no" className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3 md:py-4">

    {/* Logo corporativo */}
    <div className="flex items-center gap-2">
      <img src="/logosmart.jpeg" alt="Smart Dot Zey" className="h-10 w-10 rounded-full object-cover" />
      <span className="text-base md:text-xl font-black tracking-tight text-slate-900 uppercase whitespace-nowrap">Smart Dot Zey</span>
    </div>

    {/* Menú para computadora: solo se ve en pantallas grandes */}
    <nav className="hidden md:flex items-center gap-15 text-sm font-bold text-slate-600">
      <a href="#" className="text-emerald-600">Inicio</a>

      <div className="relative">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="hover:text-slate-900 cursor-pointer"
        >
          Categorías ▾
        </button>
        {menuAbierto && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)}></div>
            <div className="absolute left-0 top-full pt-2 z-50">
              <div className="w-52 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                <a
                  href="/catalogo"
                  onClick={() => setMenuAbierto(false)}
                  className="block px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-emerald-600"
                >
                  Todos los productos
                </a>
                {categorias.map((c) => (
                  <a
                    key={c}
                    href={`/catalogo?categoria=${encodeURIComponent(c)}`}
                    onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-emerald-600"
                  >
                    {c}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <a href="#" className="hover:text-slate-900">servicios</a>
    </nav>

    {/* Derecha: Iniciar sesión y botón de las 3 rayitas (solo celular) */}
    <div className="flex items-center gap-3 text-slate-700">
      <button className="hover:text-slate-900 text-lg">
        👤<span className="hidden sm:inline"> Iniciar Secion</span>
      </button>
      <button
        onClick={() => setMenuMovil(!menuMovil)}
        aria-label="Abrir menú"
        className="md:hidden p-2"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-slate-800" fill="none" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  {/* Menú desplegable del celular */}
  {menuMovil && (
    <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600">
      <a href="#" onClick={() => setMenuMovil(false)} className="block py-2 text-emerald-600">Inicio</a>

      <p className="pt-3 pb-1 text-xs font-black uppercase tracking-widest text-slate-400">Categorías</p>
      <a href="/catalogo" onClick={() => setMenuMovil(false)} className="block py-2 pl-3">Todos los productos</a>
      {categorias.map((c) => (
        <a
          key={c}
          href={`/catalogo?categoria=${encodeURIComponent(c)}`}
          onClick={() => setMenuMovil(false)}
          className="block py-2 pl-3"
        >
          {c}
        </a>
      ))}

      <a href="#" onClick={() => setMenuMovil(false)} className="block py-2 pt-3">servicios</a>
    </div>
  )}
</header>
            {/* ================= PARTE 2: HERO BANNER (EL PODER DEL SOL) ================= */}
      <section className="relative h-[450px] md:h-[500px] text-white flex items-start pt-6 md:pt-8">
        {/* Capa oscura translúcida sobre el fondo */}
<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent z-10"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 w-full z-20 space-y-4 text-left">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Energía ☀️ Seguridad 📹 Domótica 🏠 Nacional 🇪🇨 Cotiza al privado 📩 
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
            El poder <br />
            <span className="text-emerald-500">del sol</span>
          </h1>
          <p className="text-sm md:text-base font-medium max-w-xl text-slate-200 leading-relaxed">
           
           Una opción que ofrece la mejor Relación, Calidad y Precio, para Distribuidores y Clientes

          
          </p>
          <div className="pt-2">
            <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all rounded shadow-md active:scale-95">
              Compra Ahora
            </button>
          </div>
        </div>
      </section>
      
           {/* ================= PARTE 3: VENTAJAS ================= */}
      <section className="bg-black/10 py-8 px-6">
        <div className="mx-auto max-w-7xl">
          
          {/* Beneficio 1: Envío */}
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl shadow-sm bg-slate-50/50 max-w-sm mx-auto">
            <div className="text-3xl text-emerald-600 bg-white p-3 rounded-full shadow-sm">🚚</div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Envío 100% Gratis</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">En todas las órdenes superiores a $100</p>
            </div>
          </div>

          {/* Beneficio 2: Calidad Materiales */}
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl shadow-sm bg-slate-50/50 max-w-sm mx-auto mt-4 md:mt-0">
            <div className="text-3xl text-emerald-600 bg-white p-3 rounded-full shadow-sm">💵</div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Calidad Garantizada</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Materiales eléctricos de alta durabilidad</p>
            </div>
          </div>

          {/* Beneficio 3: Soporte e Instalación */}
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl shadow-sm bg-slate-50/50 max-w-sm mx-auto mt-4 md:mt-0">
            <div className="text-3xl text-emerald-600 bg-white p-3 rounded-full shadow-sm">⚡</div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Soporte Técnico 24/7</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Instaladores profesionales siempre listos</p>
            </div>
          </div>

        </div>
      </section>
           {/* ================= PARTE 4: OFERTAS ANIMADAS ================= */}
<section className="bg-black/10 py-12 px-6">
  <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">

    {/* Tarjeta 1: 10% OFF con fondo en movimiento y brillo */}
    <div className="oferta-animada relative overflow-hidden text-white p-8 rounded-2xl text-center shadow-lg space-y-6">
      <div className="brillo"></div>
      <div className="relative space-y-2">
        <span className="inline-block animate-pulse text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-widest">
          🔥 Oferta Especial
        </span>
        <h3 className="flotar text-6xl font-black tracking-tight leading-none uppercase">10% OFF</h3>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">En pedidos mayores a $300</p>
      </div>
      <button className="relative bg-white text-emerald-700 hover:bg-slate-100 font-black text-xs uppercase tracking-widest px-6 py-3 rounded shadow-sm w-full transition-all active:scale-95">
        Comprar Ahora
      </button>
    </div>

    {/* Tarjeta 2: cuenta regresiva real */}
    <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm space-y-6">
      <p className="text-xs font-black uppercase tracking-widest text-red-500 animate-pulse">⏰ La oferta termina en</p>
      <div className="flex justify-center gap-2">
        {[
          { v: tiempo.d, l: "Días" },
          { v: tiempo.h, l: "Horas" },
          { v: tiempo.m, l: "Min" },
          { v: tiempo.s, l: "Seg" },
        ].map((b) => (
          <div key={b.l} className="bg-slate-900 text-white font-black px-3 py-2 rounded-lg text-xl shadow-md flex flex-col items-center min-w-[58px]">
            {String(b.v).padStart(2, "0")}
            <span className="text-[9px] text-emerald-400 font-bold uppercase">{b.l}</span>
          </div>
        ))}
      </div>
      <div>
        <h3 className="flotar text-4xl font-black tracking-tight text-emerald-600 uppercase leading-none">HASTA 40% OFF</h3>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">En accesorios e iluminación</p>
      </div>
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded shadow-sm w-full transition-all active:scale-95">
        Ver Accesorios
      </button>
    </div>

  </div>
</section>

{/* ================= MARCAS QUE TRABAJAMOS ================= */}
<section className="bg-white py-10 overflow-hidden">
  <p className="text-center text-xs font-black uppercase tracking-widest text-slate-500 mb-6">
    Trabajamos con las mejores marcas
  </p>
  <div className="cinta">
    {[...marcas, ...marcas].map((marca, i) => (
      <span
        key={i}
        className="mx-10 whitespace-nowrap text-2xl md:text-3xl font-black uppercase tracking-wide text-slate-400 hover:text-emerald-600 transition-colors"
      >
        {marca}
      </span>
    ))}
  </div>
</section>

{/* ================= VIDEO + COMENTARIO DEL CLIENTE ================= */}
<section className="bg-emerald-600 py-12 px-6">
  <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 items-center">

    {/* Marco del video: redondeado, con borde claro */}
    <div className="relative mx-auto w-full max-w-xs aspect-[9/16] overflow-hidden rounded-3xl border-4 border-emerald-300 shadow-xl">
      <video
  ref={videoRef}
  src="/video-1.mp4"
  autoPlay
  muted
  loop
  playsInline
  onClick={alternarSonido}
  className="h-full w-full cursor-pointer object-cover"
/>

     

      
    </div>

    
    {/* Mensaje de la empresa a la derecha del video */}
<div className="text-white space-y-6">
  <p className="text-2xl md:text-3xl font-black leading-snug">
    “En Smart Dot Zey no solo instalamos paneles: garantizamos tu inversión con herraje de aluminio anodizado y la correcta puesta a tierra.”
  </p>
  <p className="text-lg font-bold text-emerald-100">
    Calidad y seguridad garantizada.
  </p>
  <div className="flex items-center gap-4">
    <img src="/logosmart.jpeg" alt="Smart Dot Zey" className="h-14 w-14 rounded-full object-cover" />
    <div>
      <p className="font-black">Smart Dot Zey</p>
      <p className="text-sm text-emerald-100">Energía solar, seguridad y domótica</p>
    </div>
  </div>
</div>

  </div>
</section>

{/* ================= PARTE 5: BOTÓN FLOTANTE DE WHATSAPP ================= */}
{/* "fixed" lo deja fijo en la pantalla aunque se baje la página */}
{/* "bottom-6 right-6" lo ubica abajo a la derecha */}
{/* "z-50" hace que quede por encima de todo lo demás */}
<a
  href={`https://wa.me/960524058?text=${encodeURIComponent("Hola, quiero información sobre un producto")}`}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Escríbenos por WhatsApp"
  className="fixed bottom-6 right-6 z-50"
>
  {/* Este círculo se agranda y desaparece en bucle, da el efecto de "llamar la atención" */}
  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 animate-ping"></span>

  {/* Este es el botón verde de verdad, con el ícono de WhatsApp dibujado en SVG */}
  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg hover:bg-emerald-600 transition-all active:scale-95">
    <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9C13.5 28.3 14.7 28.6 16 28.6c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.3c-1.2 0-2.3-.3-3.3-.9l-.5-.3-4.6 1.1 1.2-4.5-.3-.5C7.7 18.3 7.3 16.7 7.3 15 7.3 10.2 11.2 6.3 16 6.3s8.7 3.9 8.7 8.7-3.9 10.3-8.7 10.3zm4.8-6.5c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6l.4-.4c.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.500 1.100 2.700c.1.2 1.800 2.800 4.400 3.900 1.600.7 2.200.7 3 .6.5-.1 1.600-.7 1.800-1.300.2-.6.2-1.100.2-1.300-.1-.1-.3-.2-.6-.3z" />
    </svg>
  </span>
</a>

{/* ================= PARTE 6: PIE DE PÁGINA CON REDES SOCIALES ================= */}
{/* Fondo oscuro para que se distinga del resto de la página */}
<footer className="bg-slate-900 text-slate-300 py-10 px-6">
  <div className="mx-auto max-w-7xl flex flex-col items-center gap-6 text-center">

    {/* Nombre de la empresa, igual que en el menú de arriba */}
    <div className="flex items-center gap-2">
      <img src="/logosmart.jpeg" alt="Smart Dot Zey" className="h-10 w-10 rounded-full object-cover" />
      <span className="text-lg font-black uppercase tracking-tight text-white">Smart Dot Zey</span>
    </div>

    {/* Frase corta para explicar a qué se dedica la empresa */}
    <p className="text-xs max-w-md text-slate-400">
      Energía solar, iluminación, seguridad y domótica en Ecuador.
    </p>

    {/* Botones de redes sociales: cada uno abre su enlace en una pestaña nueva */}
    {/* Botones de redes sociales con sus logos oficiales dibujados en SVG */}
<div className="flex flex-wrap justify-center gap-3">

  {/* INSTAGRAM: cuadro con degradado de colores y el ícono de cámara en blanco */}
  <a
    href="https://www.instagram.com/smartdotzey"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 pl-2 pr-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-95"
  >
    <svg viewBox="0 0 24 24" className="h-7 w-7">
      <defs>
        {/* Degradado amarillo-rojo-morado que usa Instagram */}
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="30%" stopColor="#FA7E1E" />
          <stop offset="55%" stopColor="#D62976" />
          <stop offset="80%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igGrad)" />
      <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="16.4" cy="7.6" r="1" fill="white" />
    </svg>
    Instagram
  </a>

  {/* TIKTOK: la nota musical del logo, con su sombra celeste y roja característica */}
  <a
    href="https://www.tiktok.com/@smartdotzey"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 pl-2 pr-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-95"
  >
    <svg viewBox="0 0 24 24" className="h-7 w-7 rounded-md bg-black p-1">
      {/* Capa celeste, corrida un poquito a la izquierda */}
      <path transform="translate(-0.6 -0.6)" fill="#25F4EE" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      {/* Capa roja, corrida un poquito a la derecha */}
      <path transform="translate(0.6 0.6)" fill="#FE2C55" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      {/* Capa blanca encima, en el centro */}
      <path fill="white" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
    TikTok
  </a>

  {/* FACEBOOK: círculo azul con la "f" (cambia el enlace por la página real del cliente) */}
  <a
    href="https://www.facebook.com/share/1C2tBgZDpk/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 pl-2 pr-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-95"
  >
    <svg viewBox="0 0 24 24" className="h-7 w-7">
      <path fill="#1877F2" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
    Facebook
  </a>

</div>

    {/* Línea final con los derechos de la empresa */}
    <p className="text-[11px] text-slate-500 border-t border-slate-800 pt-4 w-full">
      © 2026 Smart Dot Zey. Todos los derechos reservados.
    </p>
    {/* Número visible: al tocarlo en el celular abre WhatsApp con el mensaje ya escrito */}
<a
  href={`https://wa.me/960524058?text=${encodeURIComponent("Hola, quiero información sobre un producto")}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-lg font-black tracking-wider text-emerald-400 hover:text-emerald-300 transition-all"
>
  📞 0960524058
</a>
  </div>
</footer>
    </main>
  
  );
}
