// ESLint flat config (ESLint v9+)
// Enforces clean, consistent JavaScript for a vanilla HTML/CSS/JS project.

export default [
  {
    // Only lint our one JS file (expand this if you add more)
    files: ['script.js'],

    languageOptions: {
      ecmaVersion: 2022,        // allow modern JS syntax
      sourceType: 'script',     // vanilla JS loaded via <script> tag (not ES modules)
      globals: {
        window:    'readonly',
        document:  'readonly',
        console:   'readonly',
        setTimeout:'readonly',
        clearTimeout: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },

    rules: {
      // ── Errors — these will block a commit ──────────────────
      'no-unused-vars':     ['error', { args: 'none' }],  // no dead variables
      'no-undef':           'error',                       // catch typos in variable names
      'no-console':         'error',                       // no console.log in production
      'no-var':             'error',                       // const/let only
      'eqeqeq':             ['error', 'always'],           // use === not ==
      'no-duplicate-case':  'error',                       // catch switch bugs
      'no-unreachable':     'error',                       // catch dead code after return

      // ── Warnings — worth fixing but won't block ─────────────
      'prefer-const':       'warn',                        // use const when not reassigned
      'no-lonely-if':       'warn',                        // else { if } → else if
      'no-useless-return':  'warn',                        // pointless return statements

      // ── Style — keep code readable ──────────────────────────
      'semi':               ['error', 'always'],           // always end statements with ;
      'quotes':             ['error', 'single', { avoidEscape: true }],
      'indent':             ['error', 2],                  // 2-space indentation
      'no-trailing-spaces': 'error',
      'eol-last':           ['error', 'always'],           // newline at end of file
    },
  },
];
