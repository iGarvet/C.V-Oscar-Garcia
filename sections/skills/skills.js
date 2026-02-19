/* ═══════════════════════════════════════════
   PROGRESS BARS — animar al scroll
═══════════════════════════════════════════ */
document.querySelectorAll('.skill-item[data-skill]').forEach(item => {
  const fill = item.querySelector('.skill-bar-fill');
  const pct  = item.getAttribute('data-skill');

  ScrollTrigger.create({
    trigger: item,
    start: 'top 85%',
    onEnter: () => {
      fill.style.width = pct + '%';
    }
  });
});
