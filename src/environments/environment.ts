/**
 * Environment de desenvolvimento.
 *
 * Por que usar environments?
 * ──────────────────────────
 * Permite ter configurações diferentes por ambiente (dev, prod, staging)
 * sem alterar o código. Em produção, o Angular CLI substitui este arquivo
 * por environment.prod.ts via `fileReplacements` no angular.json.
 *
 * Por que apiUrl='/api' em dev?
 * ──────────────────────────────
 * O Angular Dev Server (ng serve) tem um sistema de proxy configurado
 * em proxy.conf.json. Qualquer request para /api/* é redirecionada
 * para https://api.frankfurter.dev — evitando o erro de CORS.
 *
 * CORS ocorre porque o browser bloqueia requests de localhost:4200
 * para api.frankfurter.dev (origens diferentes). O proxy faz a request
 * de servidor para servidor (sem restrição de CORS).
 */
export const environment = {
  production: false,
  apiUrl: '/api',  // roteado pelo proxy → https://api.frankfurter.dev
} as const;
