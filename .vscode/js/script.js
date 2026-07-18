// ===== DARK MODE TOGGLE =====
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Check saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  html.classList.add("dark");
}

themeToggle.addEventListener("click", function () {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== NAVBAR FIXED =====
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;

  if (window.pageYOffset > fixedNav) {
    header.classList.add("navbar-fixed");
  } else {
    header.classList.remove("navbar-fixed");
  }

  // Bottom nav active state on scroll
  updateBottomNavActive();

  // Scroll animations
  animateOnScroll();
};

// ===== HAMBURGER =====
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// Close menu when clicking a link
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function () {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
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

// ===== SCROLL ANIMATIONS =====
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight - 80) {
      el.classList.add("visible");
    }
  });
}

// Run on load
window.addEventListener("load", animateOnScroll);

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
