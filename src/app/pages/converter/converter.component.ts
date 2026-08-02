import { Component, OnInit, inject, signal } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, startWith, debounceTime, distinctUntilChanged, filter, tap, switchMap, catchError, finalize, map, shareReplay } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { FavoritesService } from '../../services/favorites.service';
import { ConversionLogService } from '../../services/conversion-log.service';
import { Currency, CurrencyPair } from '../../interfaces/currency.interface';
import { ConversionResult } from '../../interfaces/exchange-rate.interface';
import { CurrencyPickerComponent } from '../../components/currency-picker/currency-picker.component';
import { SwapButtonComponent } from '../../components/swap-button/swap-button.component';

/**
 * ConverterComponent — Página principal do conversor.
 *
 * Conceitos demonstrados:
 * ─────────────────────────────────────────────────────────────────────────
 * ✓ Reactive Forms (FormBuilder, FormGroup, Validators)
 * ✓ Observables + async pipe (currencies$, result$)
 * ✓ Signals (loading, error) — estado local síncrono
 * ✓ debounceTime — aguarda silêncio antes de chamar a API
 * ✓ distinctUntilChanged — evita chamadas duplicadas
 * ✓ switchMap — cancela a requisição anterior (sem race condition)
 * ✓ catchError — trata erros sem quebrar o stream
 * ✓ finalize — executa após sucesso OU erro (reset de loading)
 * ✓ shareReplay(1) — cache: múltiplos subscribers, uma só requisição
 * ✓ @Input/@Output via CurrencyPickerComponent e SwapButtonComponent
 * ✓ Interação com FavoritesService e ConversionLogService (Signals)
 */
@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    NgIf, NgFor, AsyncPipe, DecimalPipe,
    ReactiveFormsModule,
    CurrencyPickerComponent,
    SwapButtonComponent,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly exchangeService = inject(ExchangeRateService);

  // readonly: o template pode ler mas não modificar diretamente
  readonly favoritesService = inject(FavoritesService); // exposto para o template
  private readonly logService = inject(ConversionLogService);

  // ─── Reactive Form ─────────────────────────────────────────────────────────
  /**
   * Por que Reactive Forms?
   * ────────────────────────
   * 1. Definido no TypeScript (testável)
   * 2. Acesso direto a valueChanges (Observable)
   * 3. Validação explícita e type-safe
   * 4. Melhor controle sobre o estado do form
   */
  readonly form = this.fb.group({
    amount: [100, [Validators.required, Validators.min(0.01)]],
    from:   ['USD', Validators.required],
    to:     ['BRL', Validators.required],
  });

  // ─── Signals: estado síncrono local ────────────────────────────────────────
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);
  readonly saved   = signal(false); // feedback visual ao salvar

  // ─── Observables: dados assíncronos ────────────────────────────────────────
  currencies$!: Observable<Currency[]>;
  result$!: Observable<ConversionResult | null>;

  ngOnInit(): void {
    /**
     * currencies$ — Busca as moedas uma única vez.
     * shareReplay(1): o 2º subscriber (picker de destino) recebe o cache
     * sem fazer uma nova requisição HTTP.
     */
    this.currencies$ = this.exchangeService.getCurrencies().pipe(
      map(record =>
        Object.entries(record)
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.code.localeCompare(b.code))
      ),
      shareReplay(1),
    );

    /**
     * result$ — Pipeline de conversão reativa.
     *
     * Diagrama do fluxo:
     * form.valueChanges
     *   → startWith (emite o valor inicial → 1ª conversão automática)
     *   → debounceTime(600ms) (aguarda parar de digitar)
     *   → distinctUntilChanged (não repete se igual)
     *   → filter (só se o form for válido)
     *   → tap (ativa loading — efeito colateral sem alterar o stream)
     *   → switchMap (cancela a request anterior → NOVA request HTTP)
     *       → map (transforma a resposta em ConversionResult)
     *       → catchError (trata erro sem quebrar o stream)
     *       → finalize (desativa loading após sucesso OU erro)
     */
    this.result$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      debounceTime(600),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      filter(() => this.form.valid),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap(values =>
        this.exchangeService.getLatestRate(values.from!, values.to!).pipe(
          map(response => ({
            amount: values.amount!,
            from:   values.from!,
            to:     values.to!,
            rate:   response.rates[values.to!],
            result: values.amount! * response.rates[values.to!],
            date:   response.date,
          }) as ConversionResult),
          catchError(err => {
            this.error.set(err.message ?? 'Falha ao buscar taxa de câmbio.');
            return of(null); // stream não quebra — emite null e continua
          }),
          finalize(() => this.loading.set(false)),
        )
      ),
    );
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  swapCurrencies(): void {
    const { from, to } = this.form.value;
    this.form.patchValue({ from: to ?? 'USD', to: from ?? 'BRL' });
  }

  onFromChange(code: string): void { this.form.patchValue({ from: code }); }
  onToChange(code: string): void   { this.form.patchValue({ to: code }); }

  saveConversion(result: ConversionResult): void {
    this.logService.add({
      amount: result.amount,
      from:   result.from,
      to:     result.to,
      rate:   result.rate,
      result: result.result,
    });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  toggleFavorite(): void {
    const { from, to } = this.form.value;
    if (from && to) this.favoritesService.toggle({ from, to });
  }

  isFavorite(): boolean {
    const { from, to } = this.form.value;
    return from && to ? this.favoritesService.isFavorite({ from, to }) : false;
  }

  loadFavorite(pair: CurrencyPair): void {
    this.form.patchValue({ from: pair.from, to: pair.to });
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
