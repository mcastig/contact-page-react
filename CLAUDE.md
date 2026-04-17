# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server with HMR
npm run build          # Type-check then build for production (tsc -b && vite build)
npm run lint           # Run ESLint
npm run preview        # Preview production build locally
npm test               # Run unit tests (single pass, vitest run)
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests and generate coverage report
```

## Architecture

This is a React 19 + TypeScript + Vite single-page app. The entry point is `src/main.tsx`, which mounts `src/App.tsx` into `#root`.

**Styling approach:** Plain CSS with CSS custom properties (variables). Global tokens and layout live in `src/index.css`; component-specific styles use CSS Modules (`.module.css` files co-located with each component). Dark mode is handled via `@media (prefers-color-scheme: dark)` overriding the `:root` variables — no CSS-in-JS or utility framework.

**SVG icons:** Loaded via `<use href="/icons.svg#icon-name">` referencing a sprite at `public/icons.svg`, not imported as React components.

**Assets:** Images/SVGs under `src/assets/` are imported directly into TSX files (Vite handles the URL transformation). Assets in `public/` are served as static files.

**TypeScript config:** Split across `tsconfig.json` (references), `tsconfig.app.json` (src files), and `tsconfig.node.json` (Vite config). ESLint uses `typescript-eslint` with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.

## Testing

Tests use **Vitest** with **React Testing Library** and **jsdom**. Configuration lives in `vite.config.ts` under the `test` key. The setup file is `src/test/setup.ts` (imports `@testing-library/jest-dom`).

Test files are co-located with their source files (`*.test.tsx`). Coverage is collected by V8 and output to `coverage/` (HTML + LCOV).

Current coverage: **100%** statements, branches, functions, and lines across all source files.
