/* ============================================================
   CIRCULARSOFT · EventFlow Sostenible
   scripts.js — Interactividad y animaciones
   EcoCode Studio · Economía Circular 7R
   ============================================================ */

'use strict';

/* ── Utilidad: ejecutar cuando el DOM esté listo ─────────────── */
document.addEventListener('DOMContentLoaded', () => {

  iniciarBarraProgreso();
  iniciarMenuMovil();
  iniciarNavegacionActiva();
  iniciarTogglesSecciones7R();
  iniciarScrollSuave();
  iniciarAnimacionesEntrada();
  iniciarParticulasHero();
  iniciarNavSolida();

});

/* ── Barra de Progreso de Lectura ───────────────────────────── */
function iniciarBarraProgreso() {
  const barra = document.getElementById('barra-progreso');
  if (!barra) return;

  function actualizarBarra() {
    const scrollTop    = window.scrollY;
    const alturaTotal  = document.documentElement.scrollHeight - window.innerHeight;
    const progreso     = alturaTotal > 0 ? (scrollTop / alturaTotal) * 100 : 0;
    barra.style.width  = progreso + '%';
    barra.setAttribute('aria-valuenow', Math.round(progreso));
  }

  window.addEventListener('scroll', actualizarBarra, { passive: true });
}

/* ── Menú Móvil (Hamburger) ─────────────────────────────────── */
function iniciarMenuMovil() {
  const btnMenu   = document.getElementById('btn-menu');
  const navEnlaces = document.getElementById('nav-enlaces');
  if (!btnMenu || !navEnlaces) return;

  // Abrir / cerrar menú
  btnMenu.addEventListener('click', () => {
    const abierto = navEnlaces.classList.toggle('abierto');
    btnMenu.classList.toggle('activo', abierto);
    btnMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  // Cerrar al hacer clic en un enlace
  navEnlaces.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      navEnlaces.classList.remove('abierto');
      btnMenu.classList.remove('activo');
      btnMenu.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav-principal')) {
      navEnlaces.classList.remove('abierto');
      btnMenu.classList.remove('activo');
      btnMenu.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Navegación Activa (resaltar sección actual) ────────────── */
function iniciarNavegacionActiva() {
  const secciones  = document.querySelectorAll('section[id]');
  const enlaces    = document.querySelectorAll('.nav-enlaces a');
  if (!secciones.length || !enlaces.length) return;

  // Construir mapa de id → enlace
  const mapaEnlaces = {};
  enlaces.forEach(a => {
    const id = a.getAttribute('href')?.replace('#', '');
    if (id) mapaEnlaces[id] = a;
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        // Quitar activo de todos
        Object.values(mapaEnlaces).forEach(a => a.removeAttribute('aria-current'));
        // Activar el actual
        const enlaceActivo = mapaEnlaces[entrada.target.id];
        if (enlaceActivo) enlaceActivo.setAttribute('aria-current', 'page');
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  secciones.forEach(s => observador.observe(s));
}

/* ── Toggles de las 7R (acordeón) ──────────────────────────── */
function iniciarTogglesSecciones7R() {
  const botones = document.querySelectorAll('.r-toggle');
  if (!botones.length) return;

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
      const idDetalle   = boton.getAttribute('aria-controls');
      const detalle     = document.getElementById(idDetalle);
      if (!detalle) return;

      if (estaAbierto) {
        // Cerrar
        boton.setAttribute('aria-expanded', 'false');
        detalle.setAttribute('hidden', '');
      } else {
        // Abrir
        boton.setAttribute('aria-expanded', 'true');
        detalle.removeAttribute('hidden');
        // Animar barras de métricas al abrir
        setTimeout(() => animarBarras(detalle), 50);
        // Hacer scroll suave a la tarjeta
        boton.closest('.r-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Soporte teclado: Enter y Espacio
    boton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        boton.click();
      }
    });
  });
}

/* ── Animar barras de métricas ──────────────────────────────── */
function animarBarras(contenedor) {
  const barras = contenedor.querySelectorAll('.barra-fill');
  barras.forEach(barra => {
    const pct = barra.style.getPropertyValue('--pct') || '0%';
    barra.style.setProperty('--pct', '0%');
    // Forzar repaint antes de animar
    barra.getBoundingClientRect();
    requestAnimationFrame(() => {
      barra.style.setProperty('--pct', pct);
    });
  });
}

/* ── Scroll Suave para enlaces internos ─────────────────────── */
function iniciarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      const id     = enlace.getAttribute('href')?.replace('#', '');
      const destino = id ? document.getElementById(id) : null;
      if (!destino) return;

      e.preventDefault();
      const navAltura = document.getElementById('nav-principal')?.offsetHeight || 64;

      window.scrollTo({
        top: destino.offsetTop - navAltura,
        behavior: 'smooth'
      });

      // Poner foco en el destino para accesibilidad
      destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
    });
  });
}

/* ── Animaciones de entrada al hacer scroll ─────────────────── */
function iniciarAnimacionesEntrada() {
  // Marcar elementos para revelar
  const selectores = [
    '.tarjeta',
    '.stat-card',
    '.obj-card',
    '.modulo-item',
    '.impacto-row',
    '.r-card',
    '.canvas-celda',
    '.concl-item',
    '.arq-capa',
    '.sistema-intro',
    '.impacto-intro',
    '.reflexion-box',
    '.idea-clave'
  ];

  selectores.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('revelar');
    });
  });

  // Observer para revelar al entrar en viewport
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target); // Solo una vez
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.revelar').forEach(el => observador.observe(el));
}

/* ── Partículas decorativas en el Hero ─────────────────────── */
function iniciarParticulasHero() {
  const contenedor = document.getElementById('particulas');
  if (!contenedor) return;

  // Reducir si el usuario prefiere menos movimiento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const NUM_PARTICULAS = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < NUM_PARTICULAS; i++) {
    const p = document.createElement('div');
    p.className = 'particula';

    // Propiedades aleatorias via CSS custom properties
    const x        = Math.random() * 100;
    const y        = Math.random() * 100;
    const tamaño   = Math.random() * 3 + 1;
    const duracion = Math.random() * 6 + 4;
    const retraso  = Math.random() * 5;
    const opacidad = Math.random() * 0.4 + 0.1;

    p.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${tamaño}px;
      height: ${tamaño}px;
      background: rgba(46,204,87,${opacidad});
      border-radius: 50%;
      animation: flotarParticula ${duracion}s ease-in-out ${retraso}s infinite alternate;
      pointer-events: none;
    `;

    contenedor.appendChild(p);
  }

  // Inyectar keyframes si no existen
  if (!document.getElementById('kf-particulas')) {
    const style = document.createElement('style');
    style.id = 'kf-particulas';
    style.textContent = `
      @keyframes flotarParticula {
        0%   { transform: translateY(0px) scale(1); opacity: 0.3; }
        100% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── Barra de navegación se vuelve sólida al hacer scroll ───── */
function iniciarNavSolida() {
  const nav = document.getElementById('nav-principal');
  if (!nav) return;

  function verificarScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('nav-solido');
    } else {
      nav.classList.remove('nav-solido');
    }
  }

  window.addEventListener('scroll', verificarScroll, { passive: true });
  verificarScroll(); // Verificar al cargar
}

/* ── Abrir/Cerrar todas las R con atajos de teclado ────────── */
document.addEventListener('keydown', (e) => {
  // Alt + A → Abrir todas las R
  if (e.altKey && e.key === 'a') {
    document.querySelectorAll('.r-toggle').forEach(btn => {
      btn.setAttribute('aria-expanded', 'true');
      const idDetalle = btn.getAttribute('aria-controls');
      document.getElementById(idDetalle)?.removeAttribute('hidden');
    });
  }

  // Alt + Z → Cerrar todas las R
  if (e.altKey && e.key === 'z') {
    document.querySelectorAll('.r-toggle').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const idDetalle = btn.getAttribute('aria-controls');
      document.getElementById(idDetalle)?.setAttribute('hidden', '');
    });
  }

  // Escape → Cerrar menú móvil
  if (e.key === 'Escape') {
    const navEnlaces = document.getElementById('nav-enlaces');
    const btnMenu    = document.getElementById('btn-menu');
    if (navEnlaces?.classList.contains('abierto')) {
      navEnlaces.classList.remove('abierto');
      btnMenu?.classList.remove('activo');
      btnMenu?.setAttribute('aria-expanded', 'false');
    }
  }
});

/* ── Service Worker para funcionamiento offline básico ──────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registro del Service Worker (archivo sw.js opcional)
    // navigator.serviceWorker.register('/sw.js').catch(() => {});
    // Para esta demo, el contenido es estático así que funciona sin SW
    console.info('[EventFlow] PWA lista. Funcionamiento offline activo (archivos cacheados por el navegador).');
  });
}

/* ── Registro de métricas de rendimiento (Web Vitals básico) ── */
if ('PerformanceObserver' in window) {
  try {
    const obs = new PerformanceObserver((lista) => {
      lista.getEntries().forEach(entrada => {
        if (entrada.entryType === 'largest-contentful-paint') {
          console.info(`[EventFlow] LCP: ${Math.round(entrada.startTime)}ms`);
        }
      });
    });
    obs.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (_) {
    // El navegador no soporta el observer, no es crítico
  }
}