import { Pipe, PipeTransform } from '@angular/core';

/**
 * RateChangePipe — Formata a variação percentual de uma taxa.
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Por que um Pipe customizado?                               │
 * │                                                              │
 * │  Pipes são transformações PURAS aplicadas no template.       │
 * │  "Pura" = mesma entrada sempre produz mesma saída.           │
 * │                                                              │
 * │  Benefícios:                                                 │
 * │  1. Reutilizável: qualquer template pode usar `| rateChange` │
 * │  2. Testável: é apenas uma função, fácil de testar          │
 * │  3. Performance: pure:true → só recalcula quando input muda │
 * │  4. Legibilidade: template fica limpo e declarativo          │
 * │                                                              │
 * │  Uso no template:                                            │
 * │  {{ -1.23 | rateChange }}  → '-1.23%'                        │
 * │  {{ 2.45 | rateChange }}   → '+2.45%'                        │
 * │  {{ null | rateChange }}   → '—'                             │
 * └──────────────────────────────────────────────────────────────┘
 */
@Pipe({
  name: 'rateChange',
  standalone: true, // Standalone: importado diretamente no component, sem NgModule
  pure: true,       // Otimização: só recalcula quando o valor de entrada muda
})
export class RateChangePipe implements PipeTransform {
  /**
   * @param value - variação percentual (ex: 1.23, -0.45)
   * @param decimals - casas decimais (padrão: 2)
   */
  transform(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  }
}
