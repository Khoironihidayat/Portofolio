// ===== CYBERPUNK DARK MODE TOGGLE =====
const cpThemeToggle = document.getElementById("cpThemeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme !== "light") {
  html.classList.add("dark");
}

function toggleTheme() {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

if (cpThemeToggle) {
  cpThemeToggle.addEventListener("click", toggleTheme);
}

// ===== CYBERPUNK NAVBAR SCROLL =====
const cpNavbar = document.getElementById("cpNavbar");

window.onscroll = function () {
  if (window.pageYOffset > 50) {
    cpNavbar.classList.add("scrolled");
  } else {
    cpNavbar.classList.remove("scrolled");
  }

  updateBottomNavActive();
  updateCpNavActive();
};

// ===== CYBERPUNK HAMBURGER =====
const cpHamburger = document.getElementById("cpHamburger");
const cpNav = document.getElementById("cpNav");

// Create mobile panel
const cpMobilePanel = document.createElement("div");
cpMobilePanel.className = "cp-mobile-panel";
cpMobilePanel.innerHTML = cpNav.innerHTML;
document.body.appendChild(cpMobilePanel);

const cpMobileOverlay = document.createElement("div");
cpMobileOverlay.className = "cp-mobile-overlay";
document.body.appendChild(cpMobileOverlay);

function toggleMobileNav() {
  cpHamburger.classList.toggle("active");
  cpMobilePanel.classList.toggle("open");
  cpMobileOverlay.classList.toggle("visible");
  document.body.style.overflow = cpMobilePanel.classList.contains("open") ? "hidden" : "";
}

cpHamburger.addEventListener("click", toggleMobileNav);
cpMobileOverlay.addEventListener("click", toggleMobileNav);

// Close mobile nav on link click
cpMobilePanel.querySelectorAll(".cp-nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    if (cpMobilePanel.classList.contains("open")) {
      toggleMobileNav();
    }
  });
});

// Also close desktop nav links smoothly
cpNav.querySelectorAll(".cp-nav-item").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== BOTTOM NAV ACTIVE STATE =====
function updateBottomNavActive() {
  const sections = document.querySelectorAll("section[id]");
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  bottomNavItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-section") === currentSection) {
      item.classList.add("active");
    }
  });
}

// ===== CYBERPUNK NAV ACTIVE LINK =====
function updateCpNavActive() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".cp-nav-item[data-section]");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active");
    }
  });

  // Sync mobile panel
  cpMobilePanel.querySelectorAll(".cp-nav-item").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active");
    }
  });
}

// ===== MAGNETIC HOVER EFFECT =====
function initMagneticHover() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const magneticElements = document.querySelectorAll(".cp-logo, .cp-theme-toggle, .cp-hamburger");

  magneticElements.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });

    el.addEventListener("mouseenter", () => {
      el.style.transition = "transform 0.1s ease";
    });
  });
}

// ===== SCROLL REVEAL ANIMATIONS (IntersectionObserver) =====
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".animate-on-scroll, .glow-divider").forEach(el => {
      el.classList.add("visible");
    });
    return;
  }

  // Scroll reveal for animate-on-scroll elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  });

  document.querySelectorAll(".animate-on-scroll").forEach(el => {
    revealObserver.observe(el);
  });

  // Glow divider expand animation
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        dividerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".glow-divider").forEach(el => {
    dividerObserver.observe(el);
  });

  // Parallax scroll effect
  const parallaxElements = document.querySelectorAll(".scroll-parallax");
  if (parallaxElements.length > 0) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const speed = parseFloat(el.dataset.parallaxSpeed) || 0.15;
            const yOffset = (scrollProgress - 0.5) * 100 * speed;
            el.style.transform = `translateY(${yOffset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// Run on load
window.addEventListener("load", () => {
  initScrollReveal();
  updateCpNavActive();
  initMagneticHover();
});

// Also run immediately for elements already in view
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(initScrollReveal, 100);
});

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const size = Math.random() * 3 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = Math.random() * 15 + 10 + "s";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.opacity = Math.random() * 0.3 + 0.1;

    const colors = ["#00f0ff", "#b400ff", "#ff00c8", "#00ff88"];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(particle);
  }
}

createParticles();

// ===== TECH ANIMATIONS =====
function createTechAnimations() {
  const layer = document.getElementById("techAnimLayer");
  if (!layer) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  layer.innerHTML = "";

  const isDark = html.classList.contains("dark");
  const codeSnippets = ["</>", "<html>", "{css}", "[]", "//js", "npm", "git", "<div>", "React", "TS", "api", "0x0F", "func", "async", "let", "=>{}"];

  // --- Geometric shapes (both modes) ---
  const shapeTypes = ["circle", "square", "triangle", "line", "dot"];
  for (let i = 0; i < 15; i++) {
    const shape = document.createElement("div");
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    shape.className = `tech-shape tech-shape--${type}`;

    const size = Math.random() * 20 + 8;
    shape.style.left = Math.random() * 100 + "%";
    shape.style.animationDuration = Math.random() * 20 + 15 + "s";
    shape.style.animationDelay = Math.random() * 15 + "s";

    if (type !== "triangle" && type !== "line") {
      shape.style.width = size + "px";
      shape.style.height = size + "px";
    } else if (type === "line") {
      shape.style.width = Math.random() * 60 + 30 + "px";
    }

    layer.appendChild(shape);
  }

  // --- Code snippets (both modes, different colors) ---
  for (let i = 0; i < 10; i++) {
    const code = document.createElement("div");
    code.className = "tech-shape tech-shape--code";
    code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    code.style.left = Math.random() * 100 + "%";
    code.style.animationDuration = Math.random() * 25 + 20 + "s";
    code.style.animationDelay = Math.random() * 15 + "s";
    layer.appendChild(code);
  }

  // --- Dark mode: binary rain + circuit elements ---
  if (isDark) {
    // Binary rain columns
    for (let i = 0; i < 8; i++) {
      const col = document.createElement("div");
      col.className = "tech-binary-col";
      let text = "";
      for (let j = 0; j < 40; j++) {
        text += Math.random() > 0.5 ? "1" : "0";
      }
      col.textContent = text;
      col.style.left = Math.random() * 100 + "%";
      col.style.fontSize = Math.random() * 4 + 9 + "px";
      col.style.animationDuration = Math.random() * 8 + 8 + "s";
      col.style.animationDelay = Math.random() * 10 + "s";
      col.style.color = Math.random() > 0.5 ? "#00f0ff" : "#b400ff";
      layer.appendChild(col);
    }

    // Circuit lines
    for (let i = 0; i < 6; i++) {
      const line = document.createElement("div");
      line.className = "tech-circuit-line";
      line.style.width = Math.random() * 150 + 50 + "px";
      line.style.top = Math.random() * 100 + "%";
      line.style.left = Math.random() * 100 + "%";
      line.style.animationDuration = Math.random() * 4 + 3 + "s";
      line.style.animationDelay = Math.random() * 5 + "s";
      line.style.transform = `rotate(${Math.random() * 180}deg)`;
      layer.appendChild(line);
    }

    // Circuit nodes
    for (let i = 0; i < 12; i++) {
      const node = document.createElement("div");
      node.className = "tech-circuit-node";
      node.style.left = Math.random() * 100 + "%";
      node.style.top = Math.random() * 100 + "%";
      node.style.animationDuration = Math.random() * 3 + 2 + "s";
      node.style.animationDelay = Math.random() * 4 + "s";
      node.style.background = Math.random() > 0.5 ? "#00f0ff" : "#b400ff";
      layer.appendChild(node);
    }

    // Hexagons
    for (let i = 0; i < 4; i++) {
      const hex = document.createElement("div");
      hex.className = "tech-hex";
      const hexSize = Math.random() * 30 + 20;
      hex.style.width = hexSize + "px";
      hex.style.height = hexSize + "px";
      hex.style.left = Math.random() * 100 + "%";
      hex.style.top = Math.random() * 100 + "%";
      hex.style.animationDuration = Math.random() * 6 + 8 + "s";
      hex.style.animationDelay = Math.random() * 5 + "s";
      hex.innerHTML = `<svg viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="1"><polygon points="25,2 47,14 47,36 25,48 3,36 3,14"/></svg>`;
      hex.style.color = Math.random() > 0.5 ? "#00f0ff" : "#b400ff";
      layer.appendChild(hex);
    }
  }
}

// Create on load
createTechAnimations();

// Recreate on theme change
const techObserver = new MutationObserver(() => {
  createTechAnimations();
});
techObserver.observe(html, { attributes: true, attributeFilter: ["class"] });

// ===== SMOOTH SCROLL FOR BOTTOM NAV =====
document.querySelectorAll('.bottom-nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== TYPING EFFECT FOR HERO =====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = "";
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ===== CONTACT FORM HANDLER =====
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = this.querySelector("button[type='submit']");
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>Mengirim...</span>';
    btn.disabled = true;

    try {
      const formData = new FormData(this);
      const response = await fetch("https://formspree.io/f/meeygqjo", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        btn.innerHTML = '<span>Terkirim!</span>';
        btn.classList.add("bg-neon-green");
        this.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove("bg-neon-green");
          btn.disabled = false;
        }, 2000);
      } else {
        throw new Error("Gagal mengirim");
      }
    } catch (error) {
      btn.innerHTML = '<span>Gagal! Coba lagi</span>';
      btn.classList.add("bg-red-500");
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove("bg-red-500");
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ===== ID CARD - PREMIUM INTERACTIVE =====
(function () {
  "use strict";

  // --- Element refs ---
  const wrapper = document.querySelector(".id-card-wrapper");
  const card3d = document.getElementById("idCard3D");
  const scene = document.getElementById("cardScene");
  const shine = document.getElementById("cardShine");
  const glow = document.getElementById("idCardGlow");
  const lanyard = document.getElementById("lanyard");
  const tapHint = document.getElementById("tapHint");
  const cardPhoto = document.getElementById("cardPhoto");
  const photo = cardPhoto ? cardPhoto.querySelector("img") : null;

  if (!card3d || !scene || !wrapper) return;

  // --- Check reduced motion ---
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- State ---
  let isFlipped = false;
  let isHovering = false;
  let isDragging = false;
  let isFloating = !prefersReducedMotion;

  // 3D rotation state
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  // Drag state
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragVelocityX = 0;
  let dragVelocityY = 0;
  let lastDragX = 0;
  let lastDragY = 0;
  let lastDragTime = 0;

  // Spring physics
  let springX = 0;
  let springY = 0;
  let springVX = 0;
  let springVY = 0;
  const springStiffness = 0.08;
  const springDamping = 0.85;

  // Parallax elements
  const parallaxElements = wrapper.querySelectorAll("[data-parallax]");

  // RAF
  let rafId = null;
  let isAnimating = false;

  // --- Detect isMobile ---
  function isMobile() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  // --- Start animation loop ---
  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    if (isAnimating && !isHovering && !isDragging && Math.abs(springX) < 0.01 && Math.abs(springY) < 0.01 && Math.abs(springVX) < 0.01 && Math.abs(springVY) < 0.01) {
      isAnimating = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      // Reset to neutral
      currentRotateX = 0;
      currentRotateY = 0;
      targetRotateX = 0;
      targetRotateY = 0;
      springX = 0;
      springY = 0;
      springVX = 0;
      springVY = 0;
      applyTransform();
    }
  }

  // --- Main animation loop ---
  function animate() {
    if (prefersReducedMotion) {
      stopAnimation();
      return;
    }

    const lerp = 0.1;

    // Smooth rotation lerp
    currentRotateX += (targetRotateX - currentRotateX) * lerp;
    currentRotateY += (targetRotateY - currentRotateY) * lerp;

    // Spring physics for drag release
    if (!isDragging) {
      const forceX = -springX * springStiffness;
      const forceY = -springY * springStiffness;
      springVX += forceX;
      springVY += forceY;
      springVX *= springDamping;
      springVY *= springDamping;
      springX += springVX;
      springY += springVY;
    }

    // Combine rotation and spring
    const finalRotateX = currentRotateX + springY * 0.3;
    const finalRotateY = currentRotateY + springX * 0.3;

    // Apply transform
    applyTransform(finalRotateX, finalRotateY);

    // Apply parallax to inner elements
    applyParallax(finalRotateX, finalRotateY);

    // Dynamic shadow
    applyDynamicShadow(finalRotateX, finalRotateY);

    // Lanyard deformation
    applyLanyardDeform(finalRotateX, finalRotateY);

    rafId = requestAnimationFrame(animate);
  }

  // --- Apply 3D transform ---
  function applyTransform(rx, ry) {
    rx = rx || currentRotateX;
    ry = ry || currentRotateY;
    const flipY = isFlipped ? 180 : 0;
    const dragScale = isDragging ? 1.02 : 1;
    const hoverScale = isHovering && !isDragging ? 1.015 : 1;
    const scale = dragScale * hoverScale;
    card3d.style.transform = `rotateX(${rx}deg) rotateY(${ry + flipY}deg) scale(${scale})`;
  }

  // --- Apply parallax to inner elements ---
  function applyParallax(rx, ry) {
    const tiltX = ry * 0.5;
    const tiltY = rx * 0.5;

    parallaxElements.forEach(el => {
      const depth = parseFloat(el.dataset.parallax) || 0.3;
      const moveX = tiltX * depth * 0.5;
      const moveY = -tiltY * depth * 0.5;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Photo parallax (extra layer)
    if (photo && !prefersReducedMotion) {
      const photoDepth = 0.6;
      const photoMoveX = tiltX * photoDepth * 0.3;
      const photoMoveY = -tiltY * photoDepth * 0.3;
      photo.style.transform = `translate(${photoMoveX}px, ${photoMoveY}px) scale(${isHovering ? 1.05 : 1})`;
    }

    // Deco parallax
    const decos = wrapper.querySelectorAll(".card-deco");
    decos.forEach((deco, i) => {
      const depth = 0.2 + i * 0.1;
      const moveX = tiltX * depth;
      const moveY = -tiltY * depth;
      const baseRotate = deco.classList.contains("card-deco-3") ? 45 : deco.classList.contains("card-deco-4") ? 30 : 0;
      deco.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${baseRotate + tiltX * 0.2}deg)`;
    });
  }

  // --- Dynamic shadow ---
  function applyDynamicShadow(rx, ry) {
    const shadowX = -ry * 1.2;
    const shadowY = rx * 0.8 + 15;
    const shadowBlur = 50 + Math.abs(ry) * 1.5;

    const isDark = document.documentElement.classList.contains("dark");

    const faces = card3d.querySelectorAll(".id-card-face");
    faces.forEach(face => {
      if (isDark) {
        face.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.5), 0 0 ${25 + Math.abs(ry) * 1.5}px rgba(0,240,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)`;
      } else {
        face.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`;
      }
    });
  }

  // --- Lanyard deformation ---
  function applyLanyardDeform(rx, ry) {
    if (!lanyard) return;
    const deformX = ry * 0.3;
    const deformY = Math.abs(rx) * 0.2;
    lanyard.style.transform = `translateX(calc(-50% + ${deformX}px)) translateY(${deformY}px)`;
  }

  // --- Mouse events ---
  scene.addEventListener("mouseenter", function () {
    if (isDragging) return;
    isHovering = true;
    wrapper.classList.remove("is-floating");
    if (tapHint) tapHint.style.opacity = "0";
    startAnimation();
  });

  scene.addEventListener("mousemove", function (e) {
    if (!isHovering || isDragging) return;
    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotateY = ((x - centerX) / centerX) * 18;
    targetRotateX = -((y - centerY) / centerY) * 14;

    // Shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    if (shine) {
      shine.style.setProperty("--shine-x", shineX + "%");
      shine.style.setProperty("--shine-y", shineY + "%");
    }
  });

  scene.addEventListener("mouseleave", function () {
    if (isDragging) return;
    isHovering = false;
    targetRotateX = 0;
    targetRotateY = 0;
    if (shine) {
      shine.style.setProperty("--shine-x", "50%");
      shine.style.setProperty("--shine-y", "50%");
    }
    if (tapHint) tapHint.style.opacity = "";
    // Re-enable floating after a delay
    setTimeout(() => {
      if (!isHovering && !isDragging && !prefersReducedMotion) {
        wrapper.classList.add("is-floating");
      }
    }, 1000);
  });

  // --- Click to flip ---
  let clickStartTime = 0;
  let clickStartPos = { x: 0, y: 0 };

  // --- Drag (mouse) ---
  scene.addEventListener("mousedown", function (e) {
    clickStartTime = Date.now();
    clickStartPos = { x: e.clientX, y: e.clientY };

    e.preventDefault();
    isDragging = true;
    wrapper.classList.add("is-dragging");
    wrapper.classList.remove("is-floating");
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    lastDragTime = Date.now();
    dragVelocityX = 0;
    dragVelocityY = 0;

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    startAnimation();
  });

  scene.addEventListener("mouseup", function (e) {
    if (isDragging) return;
    const elapsed = Date.now() - clickStartTime;
    const dist = Math.hypot(e.clientX - clickStartPos.x, e.clientY - clickStartPos.y);
    if (elapsed < 300 && dist < 10) {
      isFlipped = !isFlipped;
      applyTransform();
    }
  });

  function onDragMove(e) {
    if (!isDragging) return;

    const now = Date.now();
    const dt = now - lastDragTime;
    if (dt > 0) {
      dragVelocityX = (e.clientX - lastDragX) / dt * 16;
      dragVelocityY = (e.clientY - lastDragY) / dt * 16;
    }
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    lastDragTime = now;

    dragOffsetX = (e.clientX - dragStartX) * 0.5;
    dragOffsetY = (e.clientY - dragStartY) * 0.5;

    // Spring position
    springX = dragOffsetX;
    springY = dragOffsetY;

    // Rotation follows drag direction
    targetRotateY = dragOffsetX * 0.15;
    targetRotateX = -dragOffsetY * 0.1;
  }

  function onDragEnd(e) {
    // If barely moved, treat as click -> flip
    const elapsed = Date.now() - clickStartTime;
    const dist = Math.hypot((e ? e.clientX : 0) - clickStartPos.x, (e ? e.clientY : 0) - clickStartPos.y);
    if (elapsed < 300 && dist < 10) {
      isFlipped = !isFlipped;
    }

    isDragging = false;
    wrapper.classList.remove("is-dragging");

    // Apply momentum to spring
    springVX = dragVelocityX * 0.3;
    springVY = dragVelocityY * 0.3;

    // Reset targets
    targetRotateX = 0;
    targetRotateY = 0;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);

    // Re-enable floating after spring settles
    setTimeout(() => {
      if (!isHovering && !isDragging && !prefersReducedMotion) {
        wrapper.classList.add("is-floating");
      }
    }, 1500);
  }

  // --- Touch support ---
  let touchStartTime = 0;

  scene.addEventListener("touchstart", function (e) {
    touchStartTime = Date.now();
    isHovering = true;
    wrapper.classList.remove("is-floating");

    const touch = e.touches[0];
    const rect = scene.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotateY = ((x - centerX) / centerX) * 18;
    targetRotateX = -((y - centerY) / centerY) * 14;

    // Shine
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    if (shine) {
      shine.style.setProperty("--shine-x", shineX + "%");
      shine.style.setProperty("--shine-y", shineY + "%");
    }

    if (tapHint) tapHint.style.opacity = "0";
    startAnimation();

    // Start drag on touch
    isDragging = true;
    wrapper.classList.add("is-dragging");
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    lastDragX = touch.clientX;
    lastDragY = touch.clientY;
    lastDragTime = Date.now();
  }, { passive: true });

  scene.addEventListener("touchmove", function (e) {
    const touch = e.touches[0];
    const rect = scene.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotateY = ((x - centerX) / centerX) * 18;
    targetRotateX = -((y - centerY) / centerY) * 14;

    // Shine
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    if (shine) {
      shine.style.setProperty("--shine-x", shineX + "%");
      shine.style.setProperty("--shine-y", shineY + "%");
    }

    // Drag
    if (isDragging) {
      const now = Date.now();
      const dt = now - lastDragTime;
      if (dt > 0) {
        dragVelocityX = (touch.clientX - lastDragX) / dt * 16;
        dragVelocityY = (touch.clientY - lastDragY) / dt * 16;
      }
      lastDragX = touch.clientX;
      lastDragY = touch.clientY;
      lastDragTime = now;

      dragOffsetX = (touch.clientX - dragStartX) * 0.5;
      dragOffsetY = (touch.clientY - dragStartY) * 0.5;
      springX = dragOffsetX;
      springY = dragOffsetY;
      targetRotateY = dragOffsetX * 0.15;
      targetRotateX = -dragOffsetY * 0.1;
    }
  }, { passive: true });

  scene.addEventListener("touchend", function () {
    isHovering = false;
    targetRotateX = 0;
    targetRotateY = 0;

    // Detect tap for flip
    const elapsed = Date.now() - touchStartTime;
    if (elapsed < 250 && Math.abs(dragOffsetX) < 10 && Math.abs(dragOffsetY) < 10) {
      isFlipped = !isFlipped;
      applyTransform();
    }

    // Release drag
    if (isDragging) {
      isDragging = false;
      wrapper.classList.remove("is-dragging");
      springVX = dragVelocityX * 0.3;
      springVY = dragVelocityY * 0.3;
    }

    if (shine) {
      shine.style.setProperty("--shine-x", "50%");
      shine.style.setProperty("--shine-y", "50%");
    }
    if (tapHint) tapHint.style.opacity = "";

    setTimeout(() => {
      if (!isHovering && !isDragging && !prefersReducedMotion) {
        wrapper.classList.add("is-floating");
      }
    }, 1500);
  });

  // --- Keyboard support ---
  scene.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      isFlipped = !isFlipped;
      applyTransform();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      targetRotateY = -15;
      startAnimation();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      targetRotateY = 15;
      startAnimation();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      targetRotateX = 10;
      startAnimation();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      targetRotateX = -10;
      startAnimation();
    }
  });

  scene.addEventListener("blur", function () {
    targetRotateX = 0;
    targetRotateY = 0;
  });

  // --- Generate QR Code pattern ---
  function generateQRPattern(canvasId, size) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cellSize = size / 8;

    ctx.fillStyle = document.documentElement.classList.contains("dark") ? "#0c1018" : "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#00f0ff" : "#0a0a0f";

    // Generate a pseudo-QR pattern
    const pattern = [
      [1,1,1,1,1,1,1,0],
      [1,0,0,0,0,0,1,0],
      [1,0,1,1,1,0,1,0],
      [1,0,1,1,1,0,1,0],
      [1,0,1,1,1,0,1,0],
      [1,0,0,0,0,0,1,0],
      [1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,1],
    ];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (pattern[r][c]) {
          ctx.globalAlpha = 0.7 + Math.random() * 0.3;
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Initial QR generation
  generateQRPattern("qrCanvas", 64);
  generateQRPattern("qrCanvasBack", 56);

  // Re-generate QR on theme change
  const observer = new MutationObserver(() => {
    generateQRPattern("qrCanvas", 64);
    generateQRPattern("qrCanvasBack", 56);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // --- Init floating ---
  if (!prefersReducedMotion) {
    wrapper.classList.add("is-floating");
  }

  // Start animation loop
  startAnimation();

})();

// ===== MOUSE GLOW EFFECT =====
(function() {
  const mouseGlow = document.getElementById('mouseGlow');
  if (!mouseGlow) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  let isMoving = false;
  let moveTimeout;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMoving) {
      isMoving = true;
      mouseGlow.classList.add('active');
    }

    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function() {
      isMoving = false;
      mouseGlow.classList.remove('active');
    }, 1500);
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    mouseGlow.style.left = glowX + 'px';
    mouseGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  document.addEventListener('mouseleave', function() {
    mouseGlow.classList.remove('active');
  });

  document.addEventListener('mouseenter', function() {
    if (isMoving) mouseGlow.classList.add('active');
  });
})();

// ===== CUSTOM CURSOR + SPARKLE TRAIL =====
(function() {
  var core = document.getElementById('cursorCore');
  var ringEl = document.getElementById('cursorRingEl');
  if (!core || !ringEl) return;

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  document.documentElement.classList.add('hide-cursor');

  var mx = -200, my = -200;
  var sx = -200, sy = -200;
  var sparkleTimer = 0;
  var sparkleInterval = 3;

  var isDark = document.documentElement.classList.contains('dark');

  function rand(a, b) { return a + Math.random() * (b - a); }

  function spawnSparkle(x, y) {
    var p = document.createElement('div');
    var size = rand(8, 20);
    var angle = Math.random() * Math.PI * 2;
    var dist = rand(10, 30);
    var tx = Math.cos(angle) * dist;
    var ty = Math.sin(angle) * dist;
    var dur = rand(400, 800);
    var hue = isDark
      ? ['#00F5FF','#B400FF','#00FF88','#FF00C8','#FFFFFF'][Math.floor(Math.random()*5)]
      : ['#00838F','#6B21A8','#059669','#DB2777','#475569'][Math.floor(Math.random()*5)];

    p.style.cssText = 'position:fixed;left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;z-index:99998;pointer-events:none;transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:1;transition:none;';

    p.innerHTML = '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="'+hue+'"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z"/></svg>';

    document.body.appendChild(p);

    var start = performance.now();
    var rot = rand(-180, 180);

    function tick(now) {
      var t = (now - start) / dur;
      if (t >= 1) { p.remove(); return; }
      var ease = 1 - t;
      var cx = x + tx * t;
      var cy = y + ty * t + t * t * 40;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.opacity = ease;
      p.style.transform = 'translate(-50%,-50%) scale('+ease+') rotate('+(rot*t)+'deg)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var hoverTargets = 'a, button, [role="button"], input, textarea, select, .cp-nav-item, .bottom-nav-item, .portfolio-card, .btn-neon, .cp-theme-toggle, .cp-hamburger';

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    sparkleTimer++;
    if (sparkleTimer % sparkleInterval === 0) {
      spawnSparkle(mx, my);
    }
  });

  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverTargets)) {
      core.classList.add('hover');
      ringEl.classList.add('hover');
      sparkleInterval = 1;
    }
  });

  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverTargets)) {
      core.classList.remove('hover');
      ringEl.classList.remove('hover');
      sparkleInterval = 3;
    }
  });

  document.addEventListener('mousedown', function() {
    ringEl.classList.add('click');
    for (var i = 0; i < 8; i++) spawnSparkle(mx + rand(-8,8), my + rand(-8,8));
  });

  document.addEventListener('mouseup', function() {
    ringEl.classList.remove('click');
  });

  new MutationObserver(function() {
    isDark = document.documentElement.classList.contains('dark');
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  function animate() {
    core.style.left = mx + 'px';
    core.style.top = my + 'px';
    sx += (mx - sx) * 0.12;
    sy += (my - sy) * 0.12;
    ringEl.style.left = sx + 'px';
    ringEl.style.top = sy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();
