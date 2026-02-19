/* ═══════════════════════════════════════════
   CURSOR GLOW (solo desktop / pointer fine)
═══════════════════════════════════════════ */
const cursorGlow = document.getElementById("cursorGlow");
if (window.matchMedia("(pointer:fine)").matches && cursorGlow) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });
}

/* ═══════════════════════════════════════════
   TYPING EFFECT — Home title
═══════════════════════════════════════════ */
const words = ["premium.", "fluidas.", "funcionales.", "perfectas."];
let wi = 0,
  ci = 0,
  deleting = false;
const typingTarget = document.getElementById("typingTarget");

function typeLoop() {
  const word = words[wi];
  if (!deleting) {
    typingTarget.textContent = word.substring(0, ci + 1);
    ci++;
    if (ci === word.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
  } else {
    typingTarget.textContent = word.substring(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}

setTimeout(typeLoop, 1500);

/* ═══════════════════════════════════════════
   SCROLL INDICATOR → ocultar al bajar
═══════════════════════════════════════════ */
const scrollInd = document.querySelector(".scroll-indicator");
if (scrollInd) {
  window.addEventListener(
    "scroll",
    () => {
      scrollInd.style.opacity = window.scrollY > 80 ? "0" : "0.5";
    },
    { passive: true },
  );
}

/* ═══════════════════════════════════════════
   GSAP HOME — entrada inicial
═══════════════════════════════════════════ */
const homeEls = document.querySelectorAll("#home .fade-up");
gsap.set(homeEls, { opacity: 0, y: 40 });
gsap.to(homeEls, {
  opacity: 1,
  y: 0,
  duration: 0.7,
  stagger: 0.12,
  ease: "power3.out",
  delay: 0.3,
});
