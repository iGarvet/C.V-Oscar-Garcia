/* ─────────────── UTILS ─────────────── */
const $ = id => document.getElementById(id);
const isMobile = () => window.innerWidth <= 920;

/* ─────────────── FOOTER AÑO ─────────────── */
$('sbFooter').textContent = `© ${new Date().getFullYear()} Oscar Garcia Acevedo`;

/* ─────────────── TEMA ─────────────── */
const html     = document.documentElement;
const themeBtn = $('themeToggle');
const applyTheme = t => {
  html.dataset.theme = t;
  themeBtn.innerHTML = t === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  localStorage.setItem('theme', t);
};
applyTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () =>
  applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark')
);

/* ─────────────── CURSOR GLOW ─────────────── */
const glow = $('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ─────────────── TYPING EFFECT ─────────────── */
const words    = ['premium.', 'modernas.', 'impactantes.', 'rápidas.', 'perfectas.'];
const typingEl = $('typingTarget');
let wIdx = 0, cIdx = 0, deleting = false;

function type() {
  const w = words[wIdx];
  if (!deleting) {
    typingEl.textContent = w.slice(0, ++cIdx);
    if (cIdx === w.length) { deleting = true; setTimeout(type, 1900); return; }
  } else {
    typingEl.textContent = w.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
  }
  setTimeout(type, deleting ? 55 : 88);
}
setTimeout(type, 1400);

/* ─────────────── SKILLS PROGRESS BARS ─────────────── */
let skillsDone = false;
function animateSkills() {
  if (skillsDone) return;
  skillsDone = true;
  document.querySelectorAll('#skills .skill-item').forEach((el, i) => {
    setTimeout(() => {
      el.querySelector('.skill-bar-fill').style.width = el.dataset.skill + '%';
    }, i * 85);
  });
}

/* ─────────────── PANEL SWITCHING ─────────────── */
const panels   = document.querySelectorAll('.panel');
const navPills = document.querySelectorAll('.nav-pill');
let current    = 'home';

const HEADER_SEL = [
  ':scope > .sec-tag',
  ':scope > .home-greeting',
  ':scope > .sec-title',
  ':scope > .home-title',
  ':scope > .sec-sub',
  ':scope > .home-para',
  ':scope > .home-cta',
  ':scope > .home-stats'
].join(', ');

function switchPanel(id) {
  if (id === current) return;

  if (isMobile()) {
    const outEl = $(current);
    const inEl  = $(id);

    navPills.forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-panel="${id}"]`).classList.add('active');
    current = id;

    // Ocultar panel saliente INMEDIATAMENTE para que no ocupe espacio en el flujo
    outEl.classList.remove('active');
    gsap.set(outEl, { clearProps: 'all' });

    // Scroll instantáneo al tope antes de mostrar el nuevo panel
    window.scrollTo({ top: 0 });

    // Mostrar panel entrante PRIMERO, luego set GSAP (el set requiere display:block)
    inEl.classList.add('active');
    gsap.set(inEl, { opacity: 0, y: 18 });

    const headers = inEl.querySelectorAll(HEADER_SEL);
    const cards   = inEl.querySelectorAll('.glass-card, .project-card');

    const tl = gsap.timeline({
      onComplete() { if (id === 'skills') animateSkills(); }
    });

    tl.to(inEl, { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' });

    if (headers.length) {
      gsap.set(headers, { opacity: 0, y: 16 });
      tl.to(headers, { opacity: 1, y: 0, duration: 0.38, stagger: 0.08, ease: 'power3.out' }, '-=0.2');
    }

    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 12 });
      tl.to(cards, { opacity: 1, y: 0, duration: 0.32, stagger: 0.07, ease: 'power2.out' }, '-=0.15');
    }

    return;
  }

  const outEl = $(current);
  const inEl  = $(id);

  gsap.to(outEl, {
    opacity: 0, y: -18, scale: 0.97,
    duration: 0.28, ease: 'power2.in',
    onComplete() {
      outEl.classList.remove('active');
      gsap.set(outEl, { clearProps: 'all' });

      const headers = inEl.querySelectorAll(HEADER_SEL);
      const cards   = inEl.querySelectorAll('.glass-card, .project-card');

      gsap.set(headers, { opacity: 0, y: 18 });
      gsap.set(cards,   { opacity: 0, y: 14 });

      inEl.classList.add('active');
      gsap.set(inEl, { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        onComplete() { if (id === 'skills') animateSkills(); }
      });

      if (headers.length) {
        tl.to(headers, {
          opacity: 1, y: 0,
          duration: 0.4, stagger: 0.08, ease: 'power3.out'
        });
      }

      if (cards.length) {
        tl.to(cards, {
          opacity: 1, y: 0,
          duration: 0.36, stagger: 0.08, ease: 'power2.out'
        }, headers.length ? '-=0.15' : 0);
      }
    }
  });

  navPills.forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-panel="${id}"]`).classList.add('active');
  current = id;
}

navPills.forEach(pill => {
  pill.addEventListener('click',   () => switchPanel(pill.dataset.panel));
  pill.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') switchPanel(pill.dataset.panel); });
});

/* ─────────────── WHATSAPP FORM ─────────────── */
function enviarWhatsApp() {
  const campos = ['inputNombre', 'inputEmail', 'inputAsunto', 'inputMensaje'];

  const nombre  = $('inputNombre').value.trim();
  const email   = $('inputEmail').value.trim();
  const asunto  = $('inputAsunto').value.trim();
  const mensaje = $('inputMensaje').value.trim();

  const invalidos = campos.filter(id => !$(id).value.trim());

  if (invalidos.length > 0) {
    invalidos.forEach(id => {
      const el = $(id);

      el.style.transition  = 'border-color 0.3s ease, box-shadow 0.3s ease';
      el.style.borderColor = '#ef5350';
      el.style.boxShadow   = '0 0 0 3px rgba(239,83,80,0.18)';

      gsap.fromTo(el,
        { x: -6 },
        {
          x: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
          clearProps: 'x'
        }
      );

      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
        setTimeout(() => { el.style.transition = ''; }, 350);
      }, 2500);
    });
    return;
  }

  let waMsg = `¡Hola Oscar! 👋\n\nMe contacto desde tu portafolio:\n\n`;
  waMsg += `👤 *Nombre:* ${nombre}\n`;
  if (email)  waMsg += `📧 *Email:* ${email}\n`;
  if (asunto) waMsg += `📌 *Asunto:* ${asunto}\n`;
  waMsg += `\n💬 *Mensaje:*\n${mensaje}`;

  const encoded = encodeURIComponent(waMsg);
  const waURL = `https://wa.me/52222879843?text=${encoded}`;
  window.open(waURL, '_blank', 'noopener,noreferrer');
}

/* ─────────────── GSAP ENTRADA ─────────────── */
(function initGSAP() {
  if (isMobile()) {
    gsap.set('#capsule',     { opacity: 0, y: 28 });
    gsap.set('#sidebar > *', { opacity: 0, y: 16 });
    gsap.set('#home > *',    { opacity: 0, y: 16 });

    function runMobileAnim() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('#capsule',     { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' });
      tl.to('#sidebar > *', { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, '-=0.35');
      tl.to('#home > *',    { opacity: 1, y: 0, duration: 0.45, stagger: 0.09 }, '-=0.25');
    }

    if (document.readyState === 'complete') runMobileAnim();
    else window.addEventListener('load', runMobileAnim);
    return;
  }

  gsap.set('#capsule',     { opacity: 0, scale: 0.93, y: 30 });
  gsap.set('#sidebar > *', { opacity: 0, x: -16 });
  gsap.set('#home > *',    { opacity: 0, y: 22 });

  function runInitAnim() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#capsule',     { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power4.out' });
    tl.to('#sidebar > *', { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 }, '-=0.45');
    tl.to('#home > *',    { opacity: 1, y: 0, duration: 0.5, stagger: 0.10 }, '-=0.35');
  }

  if (document.readyState === 'complete') {
    runInitAnim();
  } else {
    window.addEventListener('load', runInitAnim);
  }
})();
