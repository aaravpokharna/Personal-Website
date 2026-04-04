# Future Ideas — Aarav's Personal Website

A living document of concepts to build toward. These are bigger, more ambitious ideas to layer in once the foundation is solid.

---

## 1. Cinematic Intro Experience

**The vision:**
A full-screen animated entrance sequence that plays when someone first visits the site.

**Sequence breakdown:**
1. White screen — complete silence, nothing there
2. A handwritten signature (`Aarav`) draws itself in — like ink on paper, animated stroke by stroke
3. The name `AARAV` zooms into view from the background — large, bold, cinematic
4. The signature fades away, leaving just the clean display name on white
5. The name settles — the page feels still, like a held breath

**The hover reveal:**
- When the cursor moves across the white screen, it acts like a flashlight
- Wherever the cursor goes, photographs from your life appear — fading in, soft, personal
- Move the cursor away and the photos fade back to white
- The effect is like memories surfacing and retreating — intimate and poetic

**Technical notes to explore:**
- SVG `stroke-dashoffset` animation for the signature draw
- CSS `scale` + `opacity` keyframes for the name zoom
- Mouse position tracked via `mousemove` event listener
- Radial gradient mask centred on cursor to reveal images underneath
- Images positioned absolutely behind the name layer
- `pointer-events: none` on the image layer so cursor tracking stays smooth

---

*More ideas to be added here as they come.*
