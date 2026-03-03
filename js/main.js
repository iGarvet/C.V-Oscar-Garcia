/* ─────────────── UTILS ─────────────── */
const $ = (id) => document.getElementById(id);
const isMobile = () => window.innerWidth <= 920;

/* ─────────────── PAQUETES SERVICIOS (cotización WhatsApp) ─────────────── */
const PACKETES = {
  basico: {
    nombre: "Paquete Básico",
    precio: "Desde $6,000 – $8,000 MXN",
    tiempo: "7-14 días",
    resumen:
      "Landing 1-3 secciones, responsive, animaciones básicas, formulario + WhatsApp, 1 ronda de revisiones.",
  },
  estandar: {
    nombre: "Paquete Estándar",
    precio: "Desde $12,000 – $18,000 MXN",
    tiempo: "3-5 semanas",
    resumen:
      "Sitio multi-sección, animaciones GSAP + ScrollTrigger, WhatsApp/Calendly, SEO básico, diseño pixel-perfect, 2 rondas de revisiones.",
  },
  premium: {
    nombre: "Paquete Premium",
    precio: "Desde $32,000 – $45,000 MXN en adelante",
    tiempo: "5-10 semanas o más",
    resumen:
      "Landing de alto impacto o sitio con funcionalidades extras, animaciones complejas, optimización LCP/CLS, integraciones (pagos, APIs, CRM), mantenimiento 1 mes, revisiones ilimitadas.",
  },
};
let paqueteSeleccionado = null;

function seleccionarPaqueteYCotizar(key) {
  paqueteSeleccionado = PACKETES[key] || null;
  switchPanel("contact");
  if (typeof updateResumenPaquete === "function") updateResumenPaquete();
}

function updateResumenPaquete() {
  const el = $("resumenPaquete");
  if (!el) return;
  if (paqueteSeleccionado) {
    el.innerHTML =
      `<p class="card-title" style="margin-bottom:8px;"><i class="fa-solid fa-box-open"></i> Cotización: ${paqueteSeleccionado.nombre}</p>` +
      `<p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${paqueteSeleccionado.precio} · ${paqueteSeleccionado.tiempo}</p>` +
      `<p style="font-size:0.72rem;color:var(--text-secondary);line-height:1.5;">${paqueteSeleccionado.resumen}</p>` +
      `<button type="button" class="resumen-paquete-clear" onclick="limpiarPaqueteSeleccionado()" aria-label="Quitar paquete">Quitar paquete</button>`;
    el.style.display = "block";
  } else {
    el.innerHTML = "";
    el.style.display = "none";
  }
}

function limpiarPaqueteSeleccionado() {
  const contactEl = $("contact");
  const serviciosEl = $("servicios");
  if (!contactEl || !serviciosEl) {
    paqueteSeleccionado = null;
    updateResumenPaquete();
    switchPanel("servicios");
    return;
  }
  gsap.to(contactEl, {
    y: -120,
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
    onComplete() {
      paqueteSeleccionado = null;
      updateResumenPaquete();
      contactEl.classList.remove("active");
      gsap.set(contactEl, { clearProps: "all" });
      window.scrollTo(0, 0);

      navPills.forEach((n) => n.classList.remove("active"));
      document
        .querySelector('[data-panel="servicios"]')
        .classList.add("active");
      current = "servicios";

      const headers = serviciosEl.querySelectorAll(HEADER_SEL);
      const cards = serviciosEl.querySelectorAll(".glass-card, .project-card");
      gsap.set(headers, { opacity: 0, y: 18 });
      gsap.set(cards, { opacity: 0, y: 14 });
      serviciosEl.classList.add("active");
      gsap.set(serviciosEl, { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        onComplete() {
          if (typeof animateSkills === "function" && current === "skills")
            animateSkills();
        },
      });
      if (headers.length) {
        tl.to(headers, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        });
      }
      if (cards.length) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.08,
            ease: "power2.out",
          },
          headers.length ? "-=0.15" : 0,
        );
      }
    },
  });
}

/* ─────────────── FOOTER AÑO ─────────────── */
$("sbFooter").textContent =
  `© ${new Date().getFullYear()} Oscar Garcia Acevedo`;

/* ─────────────── TEMA ─────────────── */
const html = document.documentElement;
const themeBtn = $("themeToggle");
const applyTheme = (t) => {
  html.dataset.theme = t;
  themeBtn.innerHTML =
    t === "dark"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  localStorage.setItem("theme", t);
};
applyTheme(localStorage.getItem("theme") || "dark");
themeBtn.addEventListener("click", () =>
  applyTheme(html.dataset.theme === "dark" ? "light" : "dark"),
);

/* ─────────────── CURSOR GLOW ─────────────── */
const glow = $("cursorGlow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* ─────────────── CAPSULE OVERSCROLL STRETCH (solo móvil) ─────────────── */
function initCapsuleOverscroll() {
  if (!isMobile()) return;
  const capsule = $("capsule");
  if (!capsule) return;
  const docEl = document.documentElement;
  const MAX_STRETCH_PX = 60;
  const DAMPING = 0.35;
  const OVERSTRETCH_FACTOR = 0.12;
  const MAX_TOTAL_STRETCH_PX = 92;
  const MAX_DEFORM = 0.08;
  const DEFORM_SENSITIVITY = 0.004;
  let touchY0 = 0;

  function atTop() {
    return window.scrollY <= 0;
  }
  function atBottom() {
    return window.scrollY + window.innerHeight >= docEl.scrollHeight - 1;
  }
  function canScroll() {
    return docEl.scrollHeight > window.innerHeight;
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1 || !canScroll()) return;
      touchY0 = e.touches[0].clientY;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length !== 1 || !canScroll()) return;
      const clientY = e.touches[0].clientY;
      const delta = clientY - touchY0;
      if (atTop() && delta > 0) {
        const damped = delta * DAMPING;
        const excess = Math.max(0, damped - MAX_STRETCH_PX);
        const y = Math.min(
          damped <= MAX_STRETCH_PX
            ? damped
            : MAX_STRETCH_PX + excess * OVERSTRETCH_FACTOR,
          MAX_TOTAL_STRETCH_PX,
        );
        const deform = Math.min(excess * DEFORM_SENSITIVITY, MAX_DEFORM);
        gsap.set(capsule, {
          y,
          scaleY: 1 + deform,
          transformOrigin: "50% 0%",
        });
        e.preventDefault();
      } else if (atBottom() && delta < 0) {
        const damped = -delta * DAMPING;
        const excess = Math.max(0, damped - MAX_STRETCH_PX);
        const yRaw =
          damped <= MAX_STRETCH_PX
            ? damped
            : MAX_STRETCH_PX + excess * OVERSTRETCH_FACTOR;
        const y = -Math.min(yRaw, MAX_TOTAL_STRETCH_PX);
        const deform = Math.min(excess * DEFORM_SENSITIVITY, MAX_DEFORM);
        gsap.set(capsule, {
          y,
          scaleY: 1 + deform,
          transformOrigin: "50% 100%",
        });
        e.preventDefault();
      }
    },
    { passive: false },
  );

  document.addEventListener(
    "touchend",
    () => {
      gsap.to(capsule, {
        y: 0,
        scaleY: 1,
        duration: 0.4,
        ease: "back.out",
        onComplete: () => gsap.set(capsule, { clearProps: "transformOrigin" }),
      });
    },
    { passive: true },
  );
}
initCapsuleOverscroll();

/* ─────────────── TYPING EFFECT ─────────────── */
const words = [
  "premium.",
  "modernas.",
  "impactantes.",
  "rápidas.",
  "perfectas.",
];
const typingEl = $("typingTarget");
let wIdx = 0,
  cIdx = 0,
  deleting = false;

function type() {
  const w = words[wIdx];
  if (!deleting) {
    typingEl.textContent = w.slice(0, ++cIdx);
    if (cIdx === w.length) {
      deleting = true;
      setTimeout(type, 1900);
      return;
    }
  } else {
    typingEl.textContent = w.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
    }
  }
  setTimeout(type, deleting ? 55 : 88);
}
function startTyping() {
  setTimeout(type, 400);
}

/* ─────────────── SKILLS PROGRESS BARS ─────────────── */
let skillsDone = false;
function animateSkills() {
  if (skillsDone) return;
  skillsDone = true;
  document.querySelectorAll("#skills .skill-item").forEach((el, i) => {
    setTimeout(() => {
      el.querySelector(".skill-bar-fill").style.width = el.dataset.skill + "%";
    }, i * 85);
  });
}

/* ─────────────── PANEL SWITCHING ─────────────── */
const panels = document.querySelectorAll(".panel");
const navPills = document.querySelectorAll(".nav-pill");
let current = "home";
let sidebarVisibleMobile = true;

const HEADER_SEL = [
  ":scope > .sec-tag",
  ":scope > .home-greeting",
  ":scope > .sec-title",
  ":scope > .home-title",
  ":scope > .sec-sub",
  ":scope > .home-para",
  ":scope > .home-cta",
  ":scope > .home-stats",
].join(", ");

function switchPanel(id) {
  if (id === current) return;

  if (isMobile()) {
    const sidebar = $("sidebar");
    const outEl = $(current);
    const inEl = $(id);

    // Home → cualquier panel (primera salida): sidebar desaparece hacia arriba (clip-path), luego colapso y mostrar panel
    if (current === "home") {
      navPills.forEach((n) => n.classList.remove("active"));
      document.querySelector(`[data-panel="${id}"]`).classList.add("active");
      current = id;

      gsap.set(sidebar, { clipPath: "inset(0 0 0 0)" });
      gsap.to(sidebar, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power2.in",
        onComplete() {
          sidebar.classList.add("sidebar--hidden-mobile");
          sidebar.setAttribute("aria-hidden", "true");
          if (sidebar.inert !== undefined) sidebar.inert = true;
          gsap.set(sidebar, { clearProps: "clipPath" });

          outEl.classList.remove("active");
          gsap.set(outEl, { clearProps: "all" });
          window.scrollTo({ top: 0 });

          // Estado inicial del panel ANTES de mostrarlo para que la transición se vea
          gsap.set(inEl, { opacity: 0, y: 18 });
          const headers = inEl.querySelectorAll(HEADER_SEL);
          const cards = inEl.querySelectorAll(".glass-card, .project-card");
          if (headers.length) gsap.set(headers, { opacity: 0, y: 16 });
          if (cards.length) gsap.set(cards, { opacity: 0, y: 12 });

          sidebarVisibleMobile = false;
          inEl.classList.add("active");

          requestAnimationFrame(() => {
            const tl = gsap.timeline({
              onComplete() {
                if (id === "skills") animateSkills();
                if (
                  id === "contact" &&
                  typeof updateResumenPaquete === "function"
                )
                  updateResumenPaquete();
              },
            });
            tl.to(inEl, {
              opacity: 1,
              y: 0,
              duration: 0.32,
              ease: "power3.out",
            });
            if (headers.length) {
              tl.to(
                headers,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.38,
                  stagger: 0.08,
                  ease: "power3.out",
                },
                "-=0.2",
              );
            }
            if (cards.length) {
              tl.to(
                cards,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.32,
                  stagger: 0.07,
                  ease: "power2.out",
                },
                "-=0.15",
              );
            }
          });
        },
      });
      return;
    }

    // Cualquier panel → Home: quitar colapso del sidebar y animar entrada (sidebar + home)
    if (id === "home") {
      navPills.forEach((n) => n.classList.remove("active"));
      document.querySelector(`[data-panel="${id}"]`).classList.add("active");
      current = id;

      outEl.classList.remove("active");
      gsap.set(outEl, { clearProps: "all" });
      window.scrollTo({ top: 0 });

      gsap.set("#sidebar > *", { opacity: 0, y: 16 });
      gsap.set("#home > *", { opacity: 0, y: 16 });

      sidebar.classList.remove("sidebar--hidden-mobile");
      sidebar.removeAttribute("aria-hidden");
      if (sidebar.inert !== undefined) sidebar.inert = false;
      inEl.classList.add("active");

      const tl = gsap.timeline({
        onComplete() {
          sidebarVisibleMobile = true;
        },
      });
      tl.to("#sidebar > *", {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: "power3.out",
      });
      tl.to(
        "#home > *",
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.09, ease: "power3.out" },
        "-=0.25",
      );
      return;
    }

    // Resto: Sobre mí ↔ Habilidades/Portafolio/Contacto — animación normal (sidebar ya oculto)
    navPills.forEach((n) => n.classList.remove("active"));
    document.querySelector(`[data-panel="${id}"]`).classList.add("active");
    current = id;

    outEl.classList.remove("active");
    gsap.set(outEl, { clearProps: "all" });
    window.scrollTo({ top: 0 });

    inEl.classList.add("active");
    gsap.set(inEl, { opacity: 0, y: 18 });

    const headers = inEl.querySelectorAll(HEADER_SEL);
    const cards = inEl.querySelectorAll(".glass-card, .project-card");

    const tl = gsap.timeline({
      onComplete() {
        if (id === "skills") animateSkills();
        if (id === "contact" && typeof updateResumenPaquete === "function")
          updateResumenPaquete();
      },
    });

    tl.to(inEl, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out" });

    if (headers.length) {
      gsap.set(headers, { opacity: 0, y: 16 });
      tl.to(
        headers,
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.08, ease: "power3.out" },
        "-=0.2",
      );
    }

    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 12 });
      tl.to(
        cards,
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.07, ease: "power2.out" },
        "-=0.15",
      );
    }

    return;
  }

  const outEl = $(current);
  const inEl = $(id);

  gsap.to(outEl, {
    opacity: 0,
    y: -18,
    scale: 0.97,
    duration: 0.28,
    ease: "power2.in",
    onComplete() {
      outEl.classList.remove("active");
      gsap.set(outEl, { clearProps: "all" });

      const headers = inEl.querySelectorAll(HEADER_SEL);
      const cards = inEl.querySelectorAll(".glass-card, .project-card");

      gsap.set(headers, { opacity: 0, y: 18 });
      gsap.set(cards, { opacity: 0, y: 14 });

      inEl.classList.add("active");
      gsap.set(inEl, { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        onComplete() {
          if (id === "skills") animateSkills();
          if (id === "contact" && typeof updateResumenPaquete === "function")
            updateResumenPaquete();
        },
      });

      if (headers.length) {
        tl.to(headers, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      if (cards.length) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.08,
            ease: "power2.out",
          },
          headers.length ? "-=0.15" : 0,
        );
      }
    },
  });

  navPills.forEach((n) => n.classList.remove("active"));
  document.querySelector(`[data-panel="${id}"]`).classList.add("active");
  current = id;

  if (id === "contact" && typeof updateResumenPaquete === "function")
    updateResumenPaquete();
}

navPills.forEach((pill) => {
  pill.addEventListener("click", () => switchPanel(pill.dataset.panel));
  pill.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") switchPanel(pill.dataset.panel);
  });
});

/* ─────────────── WHATSAPP FORM ─────────────── */
function enviarWhatsApp() {
  const campos = ["inputNombre", "inputEmail", "inputAsunto", "inputMensaje"];

  const nombre = $("inputNombre").value.trim();
  const email = $("inputEmail").value.trim();
  const asunto = $("inputAsunto").value.trim();
  const mensaje = $("inputMensaje").value.trim();

  const invalidos = campos.filter((id) => !$(id).value.trim());

  if (invalidos.length > 0) {
    invalidos.forEach((id) => {
      const el = $(id);

      el.style.transition = "border-color 0.3s ease, box-shadow 0.3s ease";
      el.style.borderColor = "#ef5350";
      el.style.boxShadow = "0 0 0 3px rgba(239,83,80,0.18)";

      gsap.fromTo(
        el,
        { x: -6 },
        {
          x: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
          clearProps: "x",
        },
      );

      setTimeout(() => {
        el.style.borderColor = "";
        el.style.boxShadow = "";
        setTimeout(() => {
          el.style.transition = "";
        }, 350);
      }, 2500);
    });
    return;
  }

  let waMsg = `¡Hola Oscar! \n\nMe contacto desde tu portafolio:\n\n`;
  if (paqueteSeleccionado) {
    waMsg += `*Paquete de interés:* ${paqueteSeleccionado.nombre}\n`;
    waMsg += `*Precio:* ${paqueteSeleccionado.precio}\n`;
    waMsg += `*Tiempo:* ${paqueteSeleccionado.tiempo}\n`;
    waMsg += `*Resumen:* ${paqueteSeleccionado.resumen}\n\n`;
  }
  waMsg += ` *Nombre:* ${nombre}\n`;
  if (email) waMsg += ` *Email:* ${email}\n`;
  if (asunto) waMsg += ` *Asunto:* ${asunto}\n`;
  waMsg += `\n *Mensaje:*\n${mensaje}`;

  const encoded = encodeURIComponent(waMsg);
  const waURL = `https://wa.me/522228791843?text=${encoded}`;
  window.open(waURL, "_blank", "noopener,noreferrer");
  paqueteSeleccionado = null;
  if (typeof updateResumenPaquete === "function") updateResumenPaquete();
}

/* ─────────────── GSAP ENTRADA ─────────────── */
(function initGSAP() {
  if (isMobile()) {
    gsap.set("#capsule", { opacity: 0, y: 28 });
    gsap.set("#sidebar > *", { opacity: 0, y: 16 });
    gsap.set("#home > *", { opacity: 0, y: 16 });

    function runMobileAnim() {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: startTyping,
      });
      tl.to("#capsule", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power4.out",
      });
      tl.to(
        "#sidebar > *",
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 },
        "-=0.35",
      );
      tl.to(
        "#home > *",
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
        "-=0.25",
      );
    }

    if (document.readyState === "complete") runMobileAnim();
    else window.addEventListener("load", runMobileAnim);
    return;
  }

  gsap.set("#capsule", { opacity: 0, scale: 0.93, y: 30 });
  gsap.set("#sidebar > *", { opacity: 0, x: -16 });
  gsap.set("#home > *", { opacity: 0, y: 22 });

  function runInitAnim() {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: startTyping,
    });
    tl.to("#capsule", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      ease: "power4.out",
    });
    tl.to(
      "#sidebar > *",
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 },
      "-=0.45",
    );
    tl.to(
      "#home > *",
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.14 },
      "-=0.35",
    );
  }

  if (document.readyState === "complete") {
    runInitAnim();
  } else {
    window.addEventListener("load", runInitAnim);
  }
})();
