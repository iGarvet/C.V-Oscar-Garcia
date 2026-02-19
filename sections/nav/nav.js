/* ═══════════════════════════════════════════
   REGISTRO SCROLLTRIGGER
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   NAVEGACIÓN ACTIVA AL SCROLL
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navIcons = document.querySelectorAll('.nav-icon');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navIcons.forEach(icon => {
        icon.classList.toggle('active', icon.dataset.section === entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════
   SMOOTH SCROLL — NAV ICONS Y LINKS INTERNOS
═══════════════════════════════════════════ */
document.querySelectorAll('.nav-icon[href^="#"], a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const dest = document.querySelector(anchor.getAttribute('href'));
    if (dest) {
      e.preventDefault();
      dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════
   GSAP — FADE UP AL SCROLL (todas las secciones)
═══════════════════════════════════════════ */
gsap.utils.toArray('.fade-up').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.75,
      ease: 'power3.out',
      delay: (i % 4) * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});
