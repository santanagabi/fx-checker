import { Routes } from '@angular/router';

/**
 * Rotas da aplicação com Lazy Loading.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  Por que Lazy Loading?                                             │
 * │                                                                     │
 * │  loadComponent() carrega o componente SOMENTE quando a rota é     │
 * │  acessada — não no bundle inicial.                                  │
 * │                                                                     │
 * │  Sem lazy loading: main.js contém código de TODAS as páginas.     │
 * │  Com lazy loading: main.js é menor. Cada página é um chunk         │
 * │  separado (ex: converter-HASH.js), baixado sob demanda.            │
 * │                                                                     │
 * │  Como verificar no browser:                                         │
 * │  DevTools → Network → ao navegar, observe novos .js sendo carregados│
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * `title`: define o <title> da página automaticamente (Angular Router)
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'converter',
    pathMatch: 'full',
  },
  {
    path: 'converter',
    loadComponent: () =>
      import('./pages/converter/converter.component').then(m => m.ConverterComponent),
    title: 'Conversor — FX Checker',
  },
  {
    path: 'market',
    loadComponent: () =>
      import('./pages/market/market.component').then(m => m.MarketComponent),
    title: 'Mercado ao Vivo — FX Checker',
  },
  {
    path: 'comparison',
    loadComponent: () =>
      import('./pages/comparison/comparison.component').then(m => m.ComparisonComponent),
    title: 'Comparação — FX Checker',
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.component').then(m => m.HistoryComponent),
    title: 'Histórico — FX Checker',
  },
  {
    path: '**',
    redirectTo: 'converter',
  },
];
