/* ============================================================
   PERSONAL WEBSITE — script.js
   What this file does:
     0. Cinematic intro — permanent landing page:
        - 16×9 photo grid generated and filled in JS
        - Signature draws itself left to right
        - Name zooms in, signature fades
        - Explore button appears — clicking it reveals the site
        - Cursor acts as flashlight over the photo grid
     1. Hero entrance animation (staggered fade-in)
     2. Scroll-reveal animation
     3. Basketball bucket list (drag to spin, click to open)
   ============================================================ */


/* ── 0. CINEMATIC INTRO ──────────────────────────────────────
   The intro is the permanent landing page.
   It stays visible until the user clicks Explore.

   Timeline (animation sequence):
     300ms  — signature starts drawing
     1700ms — signature fully drawn
     2100ms — name zooms in from scale(0.08)
     2900ms — signature fades out
     3500ms — Explore button appears, photo grid activates

   ✏️  TO ADD YOUR PHOTOS:
   Replace the strings in the PHOTOS array below with paths
   to your image files (e.g. 'assets/photos/photo1.jpg').
   They will tile across all 144 grid cells automatically.
   ──────────────────────────────────────────────────────────── */

// ✏️ Add your photo paths here — they tile across the 16×9 grid.
// Leave empty strings to use the warm placeholder background.
const PHOTOS = [
  '', // e.g. 'assets/photos/photo1.jpg'
  '',
  '',
  '',
  '',
  '',
];

// Grid dimensions: 16 columns × 9 rows = 144 cells
const GRID_COLS = 16;
const GRID_ROWS = 9;
const GRID_TOTAL = GRID_COLS * GRID_ROWS;

function initIntro() {
  const intro      = document.getElementById('intro');
  const sigWrap    = document.getElementById('introSigWrap');
  const sig        = document.getElementById('introSig');
  const name       = document.getElementById('introName');
  const exploreBtn = document.getElementById('introExplore');
  const photos     = document.getElementById('introPhotos');

  if (!intro) return;

  // ── Lock body scroll while intro is showing ─────────────────
  document.body.style.overflow = 'hidden';

  // ── Build the 16×9 photo grid ────────────────────────────────
  // Creates GRID_TOTAL cells and cycles through PHOTOS array.
  // If no real photos: alternates placeholder shades so the
  // grid is visible when the flashlight passes over it.
  buildPhotoGrid();

  function buildPhotoGrid() {
    if (!photos) return;

    const hasRealPhotos = PHOTOS.some(p => p.length > 0);

    for (let i = 0; i < GRID_TOTAL; i++) {
      const cell = document.createElement('div');
      cell.className = 'intro-photo';

      const src = PHOTOS[i % PHOTOS.length];

      if (hasRealPhotos && src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';                       // decorative
        img.loading = 'lazy';
        cell.appendChild(img);
      } else {
        // Warm placeholder — alternates two shades in a checkerboard
        const placeholder = document.createElement('div');
        const shade = (Math.floor(i / GRID_COLS) + (i % GRID_COLS)) % 2 === 0
          ? 'shade-a'
          : 'shade-b';
        placeholder.className = `intro-photo-placeholder ${shade}`;
        cell.appendChild(placeholder);
      }

      photos.appendChild(cell);
    }
  }

  // ── Reduced motion: skip animation, show button immediately ──
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    if (name) name.classList.add('name-show');
    if (exploreBtn) exploreBtn.classList.add('btn-show');
    activatePhotoReveal();
    bindExploreButton();
    return;
  }

  // ── Measure signature width for pen tip travel ───────────────
  function measureSig() {
    const w = sig ? sig.getBoundingClientRect().width : 0;
    if (sigWrap) sigWrap.style.setProperty('--sig-width', `${w}px`);
  }

  // ── Animation sequence ────────────────────────────────────────
  // Step 1: Signature draws
  setTimeout(() => {
    if (!sigWrap) return;
    measureSig();
    sigWrap.classList.add('sig-start');
    setTimeout(() => sigWrap.classList.add('sig-draw'), 40);
  }, 300);

  // Step 2: Name zooms in
  setTimeout(() => {
    if (name) name.classList.add('name-show');
  }, 2100);

  // Step 3: Signature fades out
  setTimeout(() => {
    if (sigWrap) sigWrap.classList.add('sig-fade');
  }, 2900);

  // Step 4: Explore button appears, photo flashlight activates
  setTimeout(() => {
    if (exploreBtn) exploreBtn.classList.add('btn-show');
    activatePhotoReveal();
    bindExploreButton();
  }, 3500);

  // ── Photo flashlight reveal ───────────────────────────────────
  // Moves the CSS radial-gradient mask so it follows the cursor,
  // revealing the photo grid only under a circle of light.
  function activatePhotoReveal() {
    if (!photos) return;

    let isOver = false;
    const REVEAL_RADIUS = '280px';

    function handleMove(clientX, clientY) {
      photos.style.setProperty('--mx', `${clientX}px`);
      photos.style.setProperty('--my', `${clientY}px`);

      if (!isOver) {
        isOver = true;
        // Smooth radius open
        requestAnimationFrame(() => {
          photos.style.setProperty('--radius', REVEAL_RADIUS);
        });
      }
    }

    function handleLeave() {
      isOver = false;
      photos.style.setProperty('--radius', '0px');
    }

    intro.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    intro.addEventListener('mouseleave', handleLeave);

    // Touch: single finger acts as the flashlight
    intro.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      handleMove(t.clientX, t.clientY);
    }, { passive: true });

    intro.addEventListener('touchend', handleLeave);
  }

  // ── Explore button: exit intro, reveal main site ─────────────
  function bindExploreButton() {
    if (!exploreBtn) return;

    exploreBtn.addEventListener('click', () => {
      intro.classList.add('intro-done');

      // Re-enable scroll
      document.body.style.overflow = '';

      // After the CSS fade finishes, remove the overlay from layout
      intro.addEventListener('transitionend', () => {
        intro.classList.add('intro-hidden');
      }, { once: true });

      // Fire the hero entrance animation
      initHero();
    });
  }
}


/* ── 1. HERO ENTRANCE ANIMATION ─────────────────────────────
   Each hero element fades in one after another.
   The delay is read from the element's data-delay attribute.  */

function initHero() {
  const animatedEls = document.querySelectorAll('[data-delay]');

  animatedEls.forEach(el => {
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

    el.classList.add('hero-animate');

    setTimeout(() => {
      el.classList.add('loaded');
    }, delay + 120);
  });
}


/* ── 2. SCROLL-REVEAL (IntersectionObserver) ─────────────────
   Elements with .reveal animate in when they enter viewport.  */

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ── 3. BASKETBALL BUCKET LIST ───────────────────────────────
   The bucket list is an interactive basketball.

   How it works:
   - Drag the ball left or right — the seam lines rotate, giving
     the impression of a spinning ball with momentum.
   - Four labels sit around the ball (top/right/bottom/left).
   - Clicking the ball (or a label) opens a content panel below
     showing the items for that quadrant.
   - An idle spin plays automatically on load.

   ✏️  TO UPDATE BUCKET LIST ITEMS: Edit the SECTORS object below.
   ──────────────────────────────────────────────────────────── */

// Bucket list data — four panels, one per quadrant of the ball.
// Edit the items arrays to add/change/remove your goals.
const SECTORS = {
  top: {
    label: 'Adventures',
    items: [
      'Live in a foreign city for a month',
      'Watch the sunrise from a mountain',
      'Take a solo trip with no itinerary',
    ],
  },
  right: {
    label: 'Create',
    items: [
      'Design a project I\'m genuinely proud of',
      'Build something that outlives the moment it was made',
      'Write something that makes a stranger feel understood',
    ],
  },
  bottom: {
    label: 'Connect',
    items: [
      '[ Add your goals here ]',
      '[ Add your goals here ]',
    ],
  },
  left: {
    label: 'Learn',
    items: [
      'Read 50 books in a year',
      'Learn to cook a dish from a completely new cuisine',
    ],
  },
};

function initBasketball() {
  const ball        = document.getElementById('basketball');
  const seamsGroup  = ball ? ball.querySelector('.ball-seams') : null;
  const panel       = document.getElementById('ballPanel');
  const panelTitle  = document.getElementById('ballPanelTitle');
  const panelList   = document.getElementById('ballPanelList');
  const closeBtn    = document.getElementById('ballPanelClose');
  const labels      = document.querySelectorAll('.ball-label');

  if (!ball || !seamsGroup) return;

  // ── Spin state ──────────────────────────────────────────────
  let isDragging   = false;
  let startX       = 0;
  let prevX        = 0;
  let rotation     = 0;      // current rotation in degrees
  let startRot     = 0;      // rotation at drag start
  let velocity     = 0;      // momentum after drag release
  let hasDragged   = false;  // true once drag threshold is exceeded
  let idleFrameId  = null;   // requestAnimationFrame ID for idle spin
  let momentumId   = null;   // requestAnimationFrame ID for momentum

  // How many degrees the seam group is rotated
  // (only the seams rotate — the gradient sphere stays still)
  function applySeamRotation(deg) {
    rotation = deg;
    seamsGroup.style.transform = `rotate(${deg}deg)`;
    seamsGroup.style.transformOrigin = '200px 200px'; // SVG centre
  }

  // ── Idle spin — slow automatic rotation on load ──────────────
  function idleSpin() {
    rotation += 0.12;
    applySeamRotation(rotation);
    idleFrameId = requestAnimationFrame(idleSpin);
  }

  // Start idle after a short delay so page has settled
  const idleStartTimer = setTimeout(idleSpin, 900);

  // Stop idle the moment the user interacts
  function stopIdle() {
    clearTimeout(idleStartTimer);
    cancelAnimationFrame(idleFrameId);
  }

  // ── Momentum after drag release ──────────────────────────────
  const FRICTION = 0.93;  // lower = stops faster, higher = keeps spinning longer

  function applyMomentum() {
    velocity *= FRICTION;
    applySeamRotation(rotation + velocity);
    if (Math.abs(velocity) > 0.05) {
      momentumId = requestAnimationFrame(applyMomentum);
    }
  }

  // ── Mouse drag ───────────────────────────────────────────────
  ball.addEventListener('mousedown', (e) => {
    stopIdle();
    cancelAnimationFrame(momentumId);
    isDragging = true;
    hasDragged = false;
    startX     = e.clientX;
    prevX      = e.clientX;
    startRot   = rotation;
    e.preventDefault(); // prevent text selection while dragging
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;
    velocity = (e.clientX - prevX) * 0.6;  // track per-frame velocity
    prevX    = e.clientX;
    applySeamRotation(startRot + dx * 0.55);
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    applyMomentum();
  });

  // ── Touch drag (mobile) ──────────────────────────────────────
  ball.addEventListener('touchstart', (e) => {
    stopIdle();
    cancelAnimationFrame(momentumId);
    isDragging = true;
    hasDragged = false;
    startX     = e.touches[0].clientX;
    prevX      = startX;
    startRot   = rotation;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;
    velocity = (e.touches[0].clientX - prevX) * 0.6;
    prevX    = e.touches[0].clientX;
    applySeamRotation(startRot + dx * 0.55);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    applyMomentum();
  });

  // ── Open a content panel ─────────────────────────────────────
  function openPanel(sectorKey) {
    const data = SECTORS[sectorKey];
    if (!data || !panel || !panelTitle || !panelList) return;

    // Highlight the matching label
    labels.forEach(l => l.classList.remove('active'));
    const matchingLabel = document.querySelector(`.ball-label[data-sector="${sectorKey}"]`);
    if (matchingLabel) matchingLabel.classList.add('active');

    // Fill in the panel content
    panelTitle.textContent = data.label;
    panelList.innerHTML = data.items
      .map(item => `<li>${item}</li>`)
      .join('');

    // Reveal the panel
    panel.classList.add('open');

    // Scroll panel into view smoothly
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Click on ball to open sector panel ───────────────────────
  // Use the click position relative to ball centre to determine
  // which quadrant (top / right / bottom / left) was clicked.
  ball.addEventListener('click', (e) => {
    if (hasDragged) return;  // was a drag, not a tap

    const rect  = ball.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    // atan2 returns degrees: 0° = right, 90° = down, ±180° = left, -90° = up

    let sector;
    if (angle > -45 && angle <= 45)          sector = 'right';
    else if (angle > 45  && angle <= 135)    sector = 'bottom';
    else if (angle > 135 || angle <= -135)   sector = 'left';
    else                                      sector = 'top';

    openPanel(sector);
  });

  // ── Click on a floating label to open its panel ──────────────
  labels.forEach(label => {
    label.addEventListener('click', () => {
      openPanel(label.getAttribute('data-sector'));
    });

    // Keyboard accessibility: Enter or Space opens the panel
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(label.getAttribute('data-sector'));
      }
    });
  });

  // ── Close the panel ───────────────────────────────────────────
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      labels.forEach(l => l.classList.remove('active'));
    });
  }
}


/* ── 4. INIT — run everything on DOMContentLoaded ────────────
   Note: initHero() is called by initIntro() once the overlay
   fades, so it is NOT called directly here.                  */
document.addEventListener('DOMContentLoaded', () => {
  initIntro();        // plays the cinematic intro, then calls initHero()
  initScrollReveal(); // safe to start observing right away
  initBasketball();   // basketball is below the fold, no conflict
});
