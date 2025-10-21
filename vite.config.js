import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages when building in CI
  // GitHub Actions exposes GITHUB_REPOSITORY as "owner/repo"
  base: process.env.VITE_BASE || (process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/'),
})
