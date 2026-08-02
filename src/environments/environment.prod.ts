/**
 * Environment de produção.
 * Em prod, a request vai direto para a API.
 * O servidor precisa ter CORS habilitado para o domínio do app.
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.frankfurter.app',
} as const;
