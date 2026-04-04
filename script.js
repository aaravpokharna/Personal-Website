/* ============================================================
   PERSONAL WEBSITE — script.js
   What this file does:
     1. Hero entrance animation (staggered fade-in on page load)
     2. Scroll-reveal animation (elements slide in as you scroll)
     3. Bucket list — SVG branch lines from root to each item
     4. Bucket list — click to toggle done/undone state
   ============================================================ */


/* ── 1. HERO ENTRANCE ANIMATION ─────────────────────────────
   On page load, each hero element fades in one after another.
   The delay is read from the element's data-delay attribute.  */

function initHero() {
  const animatedEls = document.querySelectorAll('[data-delay]');

  animatedEls.forEach(el => {
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

    // Start invisible (handled by CSS .hero-animate class)
    el.classList.add('hero-animate');

    // Trigger the entrance after the specified delay
    setTimeout(() => {
      el.classList.add('loaded');
    }, delay + 120); // +120ms base delay so nothing fires before paint
  });
}


/* ── 2. SCROLL-REVEAL (IntersectionObserver) ─────────────────
   Any element with class .reveal will animate in when it
   enters the viewport. The transition-delay is set via CSS
   custom property --delay on each element.                   */

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, stop observing — no need to re-animate
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'  // fire slightly before element hits bottom of screen
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ── 3. BUCKET LIST — SVG BRANCH LINES ──────────────────────
   Draws curved lines from the root node (#bucketRoot) to
   the centre of each bucket item card.

   How it works:
   - We measure the position of the root node and each item
   - We draw an SVG quadratic bezier curve between them
   - The line starts invisible (stroke-dashoffset trick) and
     animates into view when the section scrolls into view   */

function drawBucketLines() {
  const root    = document.getElementById('bucketRoot');
  const svg     = document.getElementById('bucketSvg');
  const wrapper = document.querySelector('.bucket-tree-wrapper');
  const items   = document.querySelectorAll('.bucket-item');

  if (!root || !svg || !wrapper || items.length === 0) return;

  // Clear any previously drawn lines (e.g. on window resize)
  svg.innerHTML = '';

  const wrapperRect = wrapper.getBoundingClientRect();
  const rootRect    = root.getBoundingClientRect();

  // Origin point: bottom-centre of the root node
  const originX = rootRect.left + rootRect.width  / 2 - wrapperRect.left;
  const originY = rootRect.top  + rootRect.height / 2 - wrapperRect.top;

  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();

    // Target point: top-centre of each bucket card
    const targetX = itemRect.left + itemRect.width  / 2 - wrapperRect.left;
    const targetY = itemRect.top  + 10               - wrapperRect.top;

    // Control point for the bezier curve — pulls the curve outward
    const midY = (originY + targetY) / 2;
    const d = `M ${originX} ${originY} Q ${targetX} ${midY}, ${targetX} ${targetY}`;

    // Approximate line length for the dash animation
    const dx = targetX - originX;
    const dy = targetY - originY;
    const lineLength = Math.sqrt(dx * dx + dy * dy) * 1.4; // *1.4 for curve

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'bucket-branch');
    path.style.setProperty('--line-length', lineLength);

    // Stagger the animation per line
    path.style.transitionDelay = `${index * 80}ms`;

    svg.appendChild(path);
  });
}

// Animate the lines in when the bucket section enters view
function initBucketLines() {
  drawBucketLines(); // draw positions

  const section = document.getElementById('bucket-list');
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so items have animated in first
          setTimeout(() => {
            document.querySelectorAll('.bucket-branch').forEach(line => {
              line.classList.add('drawn');
            });
          }, 400);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
}

// Redraw lines if the window is resized (positions will have changed)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawBucketLines();
    // Re-trigger drawn state for lines that were already visible
    document.querySelectorAll('.bucket-branch').forEach(line => {
      line.classList.add('drawn');
    });
  }, 200);
});


/* ── 4. BUCKET LIST — CLICK TO TOGGLE ───────────────────────
   Clicking any bucket item toggles it between
   done (struck through, filled circle) and undone.          */

function initBucketToggle() {
  const items = document.querySelectorAll('.bucket-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');
    });
  });
}


/* ── 5. INIT — run everything on page load ───────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initScrollReveal();

  // Bucket lines need a small delay so the layout is fully painted
  // before we measure element positions
  setTimeout(() => {
    initBucketLines();
    initBucketToggle();
  }, 100);
});
