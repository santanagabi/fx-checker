import { CurrencyPair } from '../interfaces/currency.interface';

/**
 * Constantes globais da aplicação.
 *
 * Ficam em `shared/` pois são dados estáticos reutilizáveis
 * em qualquer parte da app — não são lógica de negócio.
 *
 * `as const` garante que os arrays são readonly e os valores são
 * literal types (ex: 'fxchecker_favorites' em vez de string).
 */

/** Chaves do LocalStorage — evita strings hardcoded espalhadas */
export const STORAGE_KEYS = {
  FAVORITES:       'fxchecker_favorites',
  CONVERSION_LOG:  'fxchecker_log',
} as const;

/** Pares populares exibidos no ticker de mercado ao vivo */
export const TICKER_PAIRS: CurrencyPair[] = [
  { from: 'EUR', to: 'USD' },
  { from: 'USD', to: 'BRL' },
  { from: 'EUR', to: 'BRL' },
  { from: 'GBP', to: 'USD' },
  { from: 'USD', to: 'JPY' },
  { from: 'USD', to: 'CAD' },
  { from: 'AUD', to: 'USD' },
  { from: 'USD', to: 'CHF' },
];

/** Moedas selecionadas por padrão na página de comparação */
export const DEFAULT_COMPARISON_TARGETS: string[] = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
];

/**
 * Intervalo de polling em ms.
 * A Frankfurter API atualiza 1x/dia (dados do BCE).
 * Polling a 60s demonstra o padrão interval() + switchMap
 * sem sobrecarregar a API.
 */
export const POLL_INTERVAL_MS = 60_000;

/** Máximo de entradas no log de conversões */
export const MAX_LOG_ENTRIES = 50;
