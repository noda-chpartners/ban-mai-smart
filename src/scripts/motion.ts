import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis: Lenis | null = null;

function initLenis() {
  if (reduced) return;

  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    wheelMultiplier: 0.95,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    return;
  }

  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      event.preventDefault();
      closeMenu();
      scrollToHash(hash);
    });
  });
}

function setMenuOpen(open: boolean) {
  const header = document.querySelector<HTMLElement>(".site-header");
  const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  const nav = document.querySelector<HTMLElement>("#site-nav");
  if (!header || !toggle) return;

  header.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  nav?.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-locked", open);

  if (open) {
    lenis?.stop();
  } else {
    lenis?.start();
  }
}

function closeMenu() {
  setMenuOpen(false);
}

function initMenu() {
  const header = document.querySelector<HTMLElement>(".site-header");
  const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  if (!header || !toggle) return;

  const nav = document.querySelector<HTMLElement>("#site-nav");
  nav?.setAttribute("aria-hidden", "true");

  toggle.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

function initHeader() {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initIntro() {
  const intro = document.querySelector<HTMLElement>(".intro");
  const line = document.querySelector<HTMLElement>(".intro-line");
  const name = document.querySelector<HTMLElement>(".intro-name");
  if (!intro || reduced) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.fromTo(name, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
    .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "-=0.25")
    .to(intro, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.2 });
}

function initHero() {
  if (reduced) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.85 });
  tl.from(".hero-kicker", { y: 24, opacity: 0, duration: 0.8 })
    .from(".hero-title .word", { yPercent: 110, duration: 1.05, stagger: 0.08 }, "-=0.45")
    .from(".hero-lead, .hero-sub, .hero-cta, .hero-meta", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.55");

  const visual = document.querySelector<HTMLElement>(".hero-visual img");
  if (visual) {
    gsap.fromTo(
      visual,
      { scale: 1.12 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }
}

function initReveals() {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(":scope > *");
    gsap.from(items, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 84%",
      },
    });
  });
}

function initParallax() {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;

    const target = el.querySelector<HTMLElement>("img") ?? el;

    gsap.fromTo(
      target,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: parent,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

function initLine() {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>("[data-grow-line]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "power2.out",
        duration: 1.1,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      },
    );
  });
}

initLenis();
initIntro();
initHeader();
initMenu();
initAnchors();
initHero();
initReveals();
initParallax();
initLine();
