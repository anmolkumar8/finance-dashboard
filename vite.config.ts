import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

/**
 * Fixes React Router refresh on paths like /transactions (dev + vite preview).
 * Without this, the server looks for a real file and returns 404.
 */
function spaFallback(): Plugin {
  const shouldRewrite = (url: string, isPreview: boolean) => {
    if (url === '/' || url === '/index.html') return false
    if (url.startsWith('/@') || url.startsWith('/node_modules') || url.startsWith('/src/')) {
      return false
    }
    // Static assets from build
    if (isPreview && url.startsWith('/assets/')) return false
    // Any path that looks like a file
    if (/\.[a-zA-Z0-9]{1,8}$/.test(url)) return false
    return true
  }

  const middleware =
    (isPreview: boolean) =>
    (
      req: { url?: string; method?: string; headers: { accept?: string } },
      _res: unknown,
      next: () => void,
    ) => {
      const accept = req.headers.accept ?? ''
      if (req.method !== 'GET' || !accept.includes('text/html')) {
        next()
        return
      }
      const path = req.url?.split('?')[0]?.split('#')[0] ?? ''
      if (!shouldRewrite(path, isPreview)) {
        next()
        return
      }
      req.url = '/index.html'
      next()
    }

  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use(middleware(false))
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(true))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
})
