import { CurrencyPair } from './currency.interface';

/**
 * Interfaces de taxa de câmbio — contratos para os dados da Frankfurter API.
 *
 * Exemplo de resposta de /latest?from=USD&to=BRL:
 * { "amount": 1, "base": "USD", "date": "2024-01-15", "rates": { "BRL": 4.97 } }
 */

/** Resposta da Frankfurter API para taxas atuais */
export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>; // { "BRL": 4.97, "EUR": 0.92 }
}

/**
 * Resposta da Frankfurter API para histórico.
 * Endpoint: GET /2024-01-01..?from=USD&to=BRL
 *
 * Exemplo:
 * { "rates": { "2024-01-01": { "BRL": 4.85 }, "2024-01-02": { "BRL": 4.87 } } }
 */
export interface HistoricalRateResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>; // { "2024-01-01": { "BRL": 4.85 } }
}

/** Resultado processado de uma conversão (usado nos componentes) */
export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  rate: number;
  result: number;
  date: string;
}

/** Item do ticker de mercado ao vivo */
export interface TickerItem {
  pair: CurrencyPair;
  rate: number;
  change24h: number | null; // variação percentual nas últimas 24h
  loading: boolean;
  error: boolean;
}

/** Resultado da comparação de múltiplas moedas */
export interface ComparisonResult {
  currency: string;
  rate: number;
  result: number;
}
