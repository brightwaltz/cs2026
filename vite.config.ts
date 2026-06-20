import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' makes all asset URLs relative, so the built site works on
// GitHub Pages project sites (https://<user>.github.io/<repo>/) without
// needing to know the repository name at build time.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
