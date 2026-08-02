import { defineConfig } from 'vite';

/**
 * Configuração do Vite para o Angular Dev Server.
 *
 * Por que isso é necessário?
 * ─────────────────────────────────────────────────────────────────────────
 * O Angular 19 usa o Vite como bundler/dev-server internamente.
 * O arquivo `proxy.conf.json` é o formato legado (Webpack).
 * O Vite usa sua própria sintaxe para proxy.
 *
 * Como funciona o proxy?
 * ─────────────────────────────────────────────────────────────────────────
 * Sem proxy:
 *   Browser → GET https://api.frankfurter.app/currencies
 *   Browser recebe CORS error (origens diferentes)
 *
 * Com proxy:
 *   Browser → GET http://localhost:4200/api/currencies
 *   Dev Server → GET https://api.frankfurter.app/currencies  (sem CORS!)
 *   Dev Server → responde para o Browser
 *
 * Por que o proxy não tem CORS?
 *   CORS é uma política do BROWSER, não do servidor.
 *   Servidor → servidor (Node.js do Vite → API) não tem essa restrição.
 *
 * Em produção:
 *   Use environment.prod.ts com a URL direta, ou configure um
 *   reverse proxy (nginx, Cloudflare Workers, etc.) no servidor.
 */
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.frankfurter.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
