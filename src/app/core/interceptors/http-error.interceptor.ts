import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Error Interceptor — Middleware centralizado para erros HTTP.
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │  Por que um Interceptor?                                      │
 * │                                                                │
 * │  Sem interceptor: cada componente precisa tratar erros HTTP    │
 * │  individualmente → duplicação de código.                       │
 * │                                                                │
 * │  Com interceptor: todos os requests passam por aqui.          │
 * │  Tratamento de erro centralizado, logging, headers globais.    │
 * │                                                                │
 * │  Casos de uso comuns:                                          │
 * │  - Adicionar Authorization header (ex: Bearer token)          │
 * │  - Logging de requests                                         │
 * │  - Tratamento global de 401 (redirecionar para login)         │
 * │  - Retry automático em 503                                     │
 * └────────────────────────────────────────────────────────────────┘
 *
 * `HttpInterceptorFn` é a forma moderna (Angular 15+):
 * Uma função pura em vez de uma classe. Mais simples, mais testável,
 * funciona com standalone components sem NgModule.
 *
 * Registrada em app.config.ts via:
 * provideHttpClient(withInterceptors([httpErrorInterceptor]))
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'Ocorreu um erro inesperado.';

      if (!navigator.onLine || error.status === 0) {
        userMessage = 'Sem conexão com a internet. Verifique sua rede.';
      } else if (error.status === 404) {
        userMessage = `Recurso não encontrado: ${req.url}`;
      } else if (error.status === 429) {
        userMessage = 'Muitas requisições. Aguarde um momento.';
      } else if (error.status >= 500) {
        userMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (error.error?.message) {
        userMessage = error.error.message;
      }

      // Em produção: substituir por um serviço de logging (Sentry, etc.)
      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error);

      // throwError() propaga o erro como um Observable que falha.
      // O subscriber (ou catchError no componente) receberá este erro.
      return throwError(() => new Error(userMessage));
    })
  );
};
