/* ═══════════════════════════════════════════
   TOGGLE TEMA (dark / light)
═══════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function toggleTheme() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}
