/* ═══════════════════════════════════════════
   SIDEBAR MOBILE
═══════════════════════════════════════════ */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('mobileMenuBtn');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  menuBtn.classList.add('open');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  menuBtn.classList.remove('open');
}

function toggleSidebar() {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
}

sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) closeSidebar();
  });
});

/* ═══════════════════════════════════════════
   GSAP SIDEBAR — ENTRADA INICIAL
═══════════════════════════════════════════ */
gsap.fromTo('.sidebar',
  { x: -30, opacity: 0 },
  { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
);
