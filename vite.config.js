import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite's React plugin injects an inline <script> preamble in dev mode to
// power Fast Refresh. That trips the strict `script-src 'self'` CSP meta
// tag in index.html, which is written for the production build (no dev
// tooling, no inline scripts). Rather than weakening the shipped CSP, we
// only relax script-src for the dev server's served HTML.
function devOnlyRelaxedCsp() {
  return {
    name: 'dev-only-relaxed-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace("script-src 'self';", "script-src 'self' 'unsafe-inline';")
    },
  }
}

export default defineConfig({
  plugins: [react(), devOnlyRelaxedCsp()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['dist/**', 'src/main.jsx', 'src/test/**'],
    },
  },
})
