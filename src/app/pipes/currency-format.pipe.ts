import { Pipe, PipeTransform } from '@angular/core';

/**
 * CurrencyFormatPipe — Formata um valor numérico como moeda local.
 *
 * Usa a API nativa `Intl.NumberFormat` — sem dependência externa.
 * Retorna a formatação correta de acordo com o locale:
 * - pt-BR: R$ 4.970,00
 * - en-US: $4,970.00
 * - ja-JP: ¥4,970
 *
 * Por que não usar o `CurrencyPipe` do Angular?
 * ─────────────────────────────────────────────
 * O pipe nativo do Angular é ótimo, mas exige registrar o locale
 * corretamente. Este pipe usa `Intl` do browser diretamente,
 * funcionando com qualquer locale sem configuração adicional.
 *
 * Uso no template:
 * {{ 4970 | currencyFormat:'BRL' }}        → 'R$ 4.970,00'
 * {{ 0.9152 | currencyFormat:'EUR':'en-US' }} → '€0.92'
 */
@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencyCode = 'USD',
    locale = 'pt-BR'
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value);
    } catch {
      // Fallback se o código de moeda não for reconhecido pelo Intl
      return value.toFixed(4);
    }
  }
}
