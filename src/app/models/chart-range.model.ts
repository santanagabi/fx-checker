/**
 * Model de range do gráfico.
 *
 * Por que um "model" e não uma "interface"?
 * ─────────────────────────────────────────
 * Models contêm tipos, enums e constantes — valores de runtime.
 * Interfaces são apenas contratos de tipo (desaparecem em runtime).
 * CHART_RANGE_OPTIONS é um dado real que existe em runtime, por isso
 * fica no model, não na interface.
 */

/** Union type com os rangos disponíveis */
export type ChartRange = '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

/** Opção de rango com metadados para o componente de seleção */
export interface ChartRangeOption {
  label: string;     // Exibido no botão: '7D', '1M', etc.
  value: ChartRange; // Valor interno
  days: number;      // Quantos dias buscar no histórico
}

/** Constante com todas as opções disponíveis */
export const CHART_RANGE_OPTIONS: ChartRangeOption[] = [
  { label: '7D',  value: '1W', days: 7    },
  { label: '1M',  value: '1M', days: 30   },
  { label: '3M',  value: '3M', days: 90   },
  { label: '6M',  value: '6M', days: 180  },
  { label: '1A',  value: '1Y', days: 365  },
  { label: '5A',  value: '5Y', days: 1825 },
] as const;
