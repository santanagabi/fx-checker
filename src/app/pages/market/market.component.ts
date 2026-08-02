import {
  Component, OnInit, OnDestroy, inject, signal, computed,
} from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import {
  Observable, Subject, interval, forkJoin, of,
  startWith, switchMap, tap, catchError, takeUntil, map,
} from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { FavoritesService } from '../../services/favorites.service';
import { CurrencyPair } from '../../interfaces/currency.interface';
import { TickerItem } from '../../interfaces/exchange-rate.interface';
import { ChartRange, CHART_RANGE_OPTIONS } from '../../models/chart-range.model';
import { TICKER_PAIRS, POLL_INTERVAL_MS } from '../../shared/constants';
import { RateChartComponent } from '../../components/rate-chart/rate-chart.component';

/**
 * MarketComponent — Mercado ao Vivo.
 *
 * Conceitos demonstrados:
 * ─────────────────────────────────────────────────────────────────────────
 * ✓ interval() + switchMap → polling a cada 60s (cancela o anterior)
 * ✓ forkJoin → N requisições em paralelo, emite quando TODAS completam
 * ✓ Signals → estado reativo local (tickerItems, activePair, activeRange)
 * ✓ computed() → derive estado de Signals (activeTickerItem)
 * ✓ @Input() via RateChartComponent — par e range passados para o gráfico
 * ✓ ngOnDestroy + takeUntil → prevenção de memory leak
 *
 * Por que forkJoin aqui?
 * ─────────────────────
 * TICKER_PAIRS tem 8 pares. Precisamos da taxa de cada um.
 * forkJoin([obs1, obs2, ... obs8]):
 * - Dispara todas as 8 requisições EM PARALELO
 * - Aguarda todas completarem
 * - Emite um array com os 8 resultados
 *
 * Sequencial (ruim): 8 × 300ms ≈ 2.4s de espera
 * Paralelo (bom):    max(300ms) ≈ 300ms no total
 */
@Component({
  selector: 'app-market',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, RateChartComponent],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss',
})
export class MarketComponent implements OnInit, OnDestroy {
  private readonly exchangeService = inject(ExchangeRateService);
  readonly favoritesService = inject(FavoritesService);
  private readonly destroy$ = new Subject<void>();

  // ─── Signals ───────────────────────────────────────────────────────────────
  readonly tickerItems    = signal<TickerItem[]>([]);
  readonly tickerLoading  = signal(true);
  readonly tickerError    = signal<string | null>(null);
  readonly activePair     = signal<CurrencyPair>(TICKER_PAIRS[0]);
  readonly activeRange    = signal<ChartRange>('1M');

  /**
   * computed() — valor derivado de outros Signals.
   * Recalcula automaticamente quando tickerItems ou activePair mudam.
   */
  readonly activeTickerItem = computed(() =>
    this.tickerItems().find(
      i => i.pair.from === this.activePair().from && i.pair.to === this.activePair().to
    )
  );

  readonly chartRanges = CHART_RANGE_OPTIONS;

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startPolling(): void {
    /**
     * Padrão de polling com RxJS:
     * ─────────────────────────────
     * interval(60_000) emite 0, 1, 2, 3... a cada 60 segundos.
     * startWith(0) faz o stream começar IMEDIATAMENTE.
     *
     * switchMap: cada emissão do interval cancela a requisição forkJoin
     * anterior e inicia uma nova. Se a requisição demorar > 60s, o
     * switchMap a cancela e começa a próxima — sem acúmulo de requests.
     *
     * takeUntil(destroy$): cancela o interval e todas as requisições
     * quando o componente é destruído (ngOnDestroy). Sem isso: memory leak!
     */
    interval(POLL_INTERVAL_MS).pipe(
      startWith(0),
      tap(() => this.tickerLoading.set(true)),
      switchMap(() =>
        forkJoin(
          TICKER_PAIRS.map(pair =>
            this.exchangeService.getLatestRate(pair.from, pair.to).pipe(
              map(r => ({
                pair,
                rate: r.rates[pair.to],
                // Frankfurter não fornece variação de 24h diretamente.
                // Em produção, faria-se uma 2ª chamada ao histórico de ontem.
                change24h: null,
                loading: false,
                error: false,
              }) as TickerItem),
              catchError(() => of({
                pair, rate: 0, change24h: null, loading: false, error: true,
              } as TickerItem))
            )
          )
        )
      ),
      takeUntil(this.destroy$),
    ).subscribe({
      next: items => {
        this.tickerItems.set(items);
        this.tickerLoading.set(false);
      },
      error: err => {
        this.tickerError.set(err.message);
        this.tickerLoading.set(false);
      },
    });
  }

  selectPair(pair: CurrencyPair): void   { this.activePair.set(pair); }
  selectRange(range: ChartRange): void   { this.activeRange.set(range); }
  toggleFavorite(pair: CurrencyPair): void { this.favoritesService.toggle(pair); }

  isActivePair(pair: CurrencyPair): boolean {
    const active = this.activePair();
    return pair.from === active.from && pair.to === active.to;
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
