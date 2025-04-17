import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

function getBaseUrl() {
  // Try to get URL from package.json homepage
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
    if (pkg.homepage) {
      // Ensure homepage ends with a trailing slash
      return pkg.homepage.endsWith('/') ? pkg.homepage : `${pkg.homepage}/`
    }
  } catch (error) {
    console.warn('Could not read package.json homepage:', error.message)
    return '/'
  }
}

export default defineConfig({
  server: {
    open: process.env.NODE_ENV === 'development' ? 'index.html' : false,
  },
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: { '/src': path.resolve(process.cwd(), 'src') },
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/%__BASE_URL__%/g, getBaseUrl())
      },
    },
  ],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
