# CLAUDE.md — AI Coding Rules for This Project

This file tells Claude how to think, write, and behave when working on this codebase.
Read this before touching any file.

---

## Project Identity

- **What this is:** A personal website for Aarav — a student, designer, and writer.
- **Stack:** Vanilla HTML, CSS, JavaScript. No frameworks. No build step.
- **Philosophy:** Deliberate simplicity. Every line of code should have a reason to exist.

---

## Core Coding Rules

### 1. Write for a human who is new to code
- Add comments that explain *why*, not just *what*
- Use clear, descriptive variable and class names — no cryptic abbreviations
- Keep functions small and single-purpose
- If something is confusing, simplify it rather than adding a comment

### 2. Don't add what wasn't asked for
- No extra features, no speculative abstractions
- No error handling for cases that can't happen
- No helper functions for one-time operations
- No backwards-compatibility hacks
- When in doubt: do less, not more

### 3. CSS conventions
- All design values live in `:root` as CSS custom properties — never hardcode colours, font sizes, or spacing
- Use `clamp()` for responsive sizing — avoid breakpoint-heavy media queries
- Class names follow BEM-lite: `block`, `block-element`, `block--modifier`
- Animations use `transition` and `@keyframes` only — no JS animation libraries
- Always include a `prefers-reduced-motion` fallback for animations

### 4. JavaScript conventions
- Vanilla JS only — no jQuery, no lodash
- Use `const` by default, `let` when reassignment is needed, never `var`
- Use `addEventListener` — never inline `onclick` attributes in HTML
- Use `IntersectionObserver` for scroll effects — never listen to `scroll` events directly
- Clean up event listeners when elements are removed from the DOM
- No `console.log` left in committed code

### 5. HTML conventions
- Semantic elements first: `<section>`, `<nav>`, `<article>`, `<main>`, `<footer>`
- Every image needs an `alt` attribute
- Every interactive element must be keyboard-accessible
- Use `data-*` attributes for JS hooks, not `id` or class names shared with CSS

### 6. Performance
- No blocking `<script>` tags in `<head>` — scripts go at end of `<body>` or use `defer`
- Fonts loaded via `<link rel="preconnect">` before the font URL
- Images should have `width` and `height` attributes to prevent layout shift
- SVG assets inlined when small, external file when reused

### 7. Accessibility (a11y)
- Colour contrast must meet WCAG AA minimum (4.5:1 for text)
- Focus states must be visible — never `outline: none` without a replacement
- Decorative SVGs get `aria-hidden="true"`
- Interactive elements that aren't `<button>` or `<a>` need `role` and `tabindex`

### 8. Git hygiene
- Run the pre-commit checklist (see `.claude/agents/pre-commit-agent.md`) before every commit
- Commit messages: imperative tense, present tense — "Add hero animation" not "Added"
- One logical change per commit — don't bundle unrelated edits
- Never commit `.DS_Store`, `node_modules`, or `.env` files

---

## What Claude Should Never Do

- Never generate or guess URLs
- Never add emojis unless explicitly asked
- Never create new files when editing an existing one would work
- Never leave `TODO` comments — either implement it or document it in `FUTURE_IDEAS.md`
- Never run `git push` without explicit user confirmation
- Never install packages without checking with the user first

---

## File Map

| File | Purpose |
|------|---------|
| `index.html` | All page sections — single scrollable page |
| `style.css` | All styles. Design tokens at top in `:root` |
| `script.js` | Scroll animations, bucket list interactivity |
| `FUTURE_IDEAS.md` | Backlog of design/feature ideas |
| `CLAUDE.md` | This file — AI behaviour rules |
| `.claude/agents/style-agent.md` | Style review agent |
| `.claude/agents/pre-commit-agent.md` | Pre-commit checklist agent |
| `.eslintrc.json` | ESLint rules for JS quality |
| `package.json` | npm scripts for linting and checks |
