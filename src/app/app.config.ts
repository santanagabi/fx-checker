import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

/**
 * appConfig — Configuração central da aplicação (substitui AppModule).
 *
 * Com Standalone Components, não usamos NgModule.
 * Toda a configuração fica aqui:
 *
 * provideZoneChangeDetection: otimiza detecção de mudanças com coalescing
 *   (agrupa múltiplos eventos em um único ciclo de detecção)
 *
 * provideRouter(routes): registra as rotas com lazy loading
 *   withComponentInputBinding: permite passar route params como @Input()
 *
 * provideHttpClient: habilita injeção de HttpClient em toda a app
 *   withInterceptors: registra interceptors funcionais (functional interceptors)
 *   O httpErrorInterceptor trata todos os erros HTTP centralmente
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([httpErrorInterceptor])
    ),
  ],
};
