/**
 * Contratos de moeda.
 *
 * Por que interfaces TypeScript?
 * ────────────────────────────────
 * Interfaces definem a "forma" dos dados. Elas existem APENAS em tempo
 * de compilação — não geram código JavaScript. São o contrato entre
 * diferentes partes da aplicação, garantindo tipagem forte.
 *
 * Se a API mudar e retornar um campo diferente, o TypeScript avisará
 * imediatamente em vez de um bug silencioso em produção.
 */

/** Representa uma moeda com código ISO 4217 e nome completo */
export interface Currency {
  code: string; // ex: 'USD', 'BRL', 'EUR'
  name: string; // ex: 'US Dollar', 'Brazilian Real'
}

/** Par de moedas: origem → destino */
export interface CurrencyPair {
  from: string; // código da moeda de origem
  to: string;   // código da moeda de destino
}
