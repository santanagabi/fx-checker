import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, map, shareReplay } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { Currency } from '../../interfaces/currency.interface';
import { ComparisonResult } from '../../interfaces/exchange-rate.interface';
import { CurrencyPickerComponent } from '../../components/currency-picker/currency-picker.component';
import { DEFAULT_COMPARISON_TARGETS } from '../../shared/constants';

/**
 * ComparisonComponent — Comparação de moedas em paralelo.
 *
 * Conceitos demonstrados:
 * ─────────────────────────────────────────────────────────────────────────
 * ✓ getComparisonRates() → 1 requisição com múltiplos targets (otimizado)
 * ✓ subscribe() com { next, error } — quando precisamos de efeito colateral
 * ✓ finalize() → reset de loading independente de sucesso/erro
 * ✓ Signals para gerenciar estado da comparação (results, selectedTargets)
 * ✓ computed() → maxResult derivado de results (para as barras visuais)
 * ✓ CurrencyPickerComponent via @Input/@Output
 *
 * Por que subscribe() aqui em vez de async pipe?
 * ──────────────────────────────────────────────────
 * O compare() é chamado por um botão — é um efeito imperativo.
 * Precisamos AGIR com o resultado (atualizar o Signal results()).
 * O async pipe serve para exibir dados no template automaticamente.
 * subscribe() serve quando precisamos fazer algo com o valor no .ts.
 */
@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [
    NgIf, NgFor, AsyncPipe, DecimalPipe,
    ReactiveFormsModule,
    CurrencyPickerComponent,
  ],
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.scss',
})
export class ComparisonComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly exchangeService = inject(ExchangeRateService);

  readonly form = this.fb.group({
    amount: [100, [Validators.required, Validators.min(0.01)]],
    base:   ['USD', Validators.required],
  });

  // ─── Signals ───────────────────────────────────────────────────────────────
  readonly loading          = signal(false);
  readonly error            = signal<string | null>(null);
  readonly results          = signal<ComparisonResult[]>([]);
  readonly selectedTargets  = signal<string[]>([...DEFAULT_COMPARISON_TARGETS]);

  /** computed(): derivado de results — recalcula quando results muda */
  readonly maxResult = computed(() => {
    const r = this.results();
    return r.length > 0 ? Math.max(...r.map(x => x.result)) : 1;
  });

  // ─── Observables ───────────────────────────────────────────────────────────
  currencies$!: Observable<Currency[]>;

  ngOnInit(): void {
    this.currencies$ = this.exchangeService.getCurrencies().pipe(
      map(record =>
        Object.entries(record)
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.code.localeCompare(b.code))
      ),
      shareReplay(1),
    );
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  onBaseChange(code: string): void {
    this.form.patchValue({ base: code });
    this.results.set([]); // limpa resultados ao trocar a base
  }

  toggleTarget(code: string): void {
    const current = this.selectedTargets();
    if (current.includes(code)) {
      if (current.length > 1) {
        this.selectedTargets.update(t => t.filter(c => c !== code));
      }
    } else {
      this.selectedTargets.update(t => [...t, code]);
    }
  }

  isSelected(code: string): boolean {
    return this.selectedTargets().includes(code);
  }

  compare(): void {
    const { amount, base } = this.form.value;
    if (!base || !amount || !this.form.valid) return;

    const targets = this.selectedTargets().filter(t => t !== base);
    if (targets.length === 0) return;

    this.loading.set(true);
    this.error.set(null);
    this.results.set([]);

    /**
     * Uma requisição retorna taxas para TODOS os targets de uma vez:
     * GET /latest?from=USD&to=BRL,EUR,GBP,JPY,CAD,AUD,CHF
     *
     * Isso é mais eficiente que N chamadas individuais com forkJoin.
     * forkJoin seria ideal se cada target precisasse de um endpoint diferente.
     */
    this.exchangeService.getComparisonRates(base, targets).pipe(
      map(response =>
        Object.entries(response.rates)
          .map(([currency, rate]) => ({
            currency,
            rate,
            result: amount * rate,
          } as ComparisonResult))
          .sort((a, b) => b.result - a.result) // maior resultado primeiro
      ),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next:  results => this.results.set(results),
      error: err => this.error.set(err.message ?? 'Falha na comparação.'),
    });
  }

  /** Calcula a largura proporcional da barra de comparação */
  barPercent(result: number): number {
    return (result / this.maxResult()) * 100;
  }

  getFlag(code: string): string {
    const s: Record<string, string> = { EUR: '🇪🇺', XAU: '🥇', XAG: '🥈' };
    if (s[code]) return s[code];
    try {
      return [...code.substring(0, 2).toUpperCase()]
        .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');
    } catch { return '🌐'; }
  }
}
