/**
 * Interface do log de conversões.
 *
 * Nota: timestamp é string (ISO 8601) em vez de Date para que
 * JSON.stringify/parse funcione corretamente no LocalStorage.
 * Ao exibir, convertemos para Date com `new Date(entry.timestamp)`.
 */
export interface ConversionLog {
  id: string;        // UUID gerado com crypto.randomUUID()
  amount: number;    // valor original (ex: 100)
  from: string;      // moeda de origem (ex: 'USD')
  to: string;        // moeda de destino (ex: 'BRL')
  rate: number;      // taxa usada (ex: 4.97)
  result: number;    // valor convertido (ex: 497)
  timestamp: string; // ISO string (ex: '2024-01-15T10:30:00.000Z')
}
