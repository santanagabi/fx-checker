import {
  Component, Input, ViewChild, ElementRef,
  OnChanges, AfterViewInit, OnDestroy, SimpleChanges, inject,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Subject, EMPTY, startWith, switchMap, tap, takeUntil, catchError } from 'rxjs';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ChartRange, CHART_RANGE_OPTIONS } from '../../models/chart-range.model';
import { HistoricalRateResponse } from '../../interfaces/exchange-rate.interface';

// Registra todos os tipos de gráfico, escalas e plugins do Chart.js
Chart.register(...registerables);

/**
 * RateChartComponent — Gráfico de histórico de taxas usando Chart.js.
 *
 * Conceitos demonstrados:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  ViewChild: acessa o elemento <canvas> no DOM após a view existir   │
 * │  ngAfterViewInit: único lugar seguro para acessar ViewChild         │
 * │  ngOnChanges: reage a mudanças em @Input() ao longo do tempo        │
 * │  switchMap: cancela a requisição anterior ao trocar range/par       │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Por que switchMap aqui?
 * ───────────────────────
 * O usuário pode trocar o range (1M → 6M) antes da resposta chegar.
 * switchMap cancela a request anterior e começa uma nova.
 * Sem ele: race condition — a resposta de 1M poderia chegar depois de 6M.
 */
@Component({
  selector: 'app-rate-chart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './rate-chart.component.html',
  styleUrl: './rate-chart.component.scss',
})
export class RateChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() from = 'EUR';
  @Input() to = 'USD';
  @Input() range: ChartRange = '1M';

  /**
   * ViewChild: referência ao <canvas #chartCanvas> no template.
   * O ! (non-null assertion) diz ao TypeScript que este campo
   * estará definido quando for usado (em ngAfterViewInit).
   */
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly exchangeService = inject(ExchangeRateService);
  private chart: Chart | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();

  loading = false;
  error: string | null = null;

  /**
   * ngAfterViewInit — Ciclo de vida: view inicializada.
   * ─────────────────────────────────────────────────────
   * Chamado UMA VEZ após o Angular renderizar o template do componente.
   * É AQUI (e não em ngOnInit) que podemos acessar ViewChild,
   * porque o <canvas> só existe no DOM depois que o template renderizar.
   *
   * Se tentarmos acessar `this.chartCanvas` em ngOnInit → undefined!
   */
  ngAfterViewInit(): void {
    this.initChart();
    this.setupDataStream();
  }

  /**
   * ngOnChanges — Ciclo de vida: mudança de @Input().
   * ────────────────────────────────────────────────────
   * Chamado cada vez que um @Input() muda (from, to, range).
   * SimpleChanges contém o valor anterior e o novo de cada Input.
   *
   * Importante: também é chamado ANTES de ngOnInit, então precisamos
   * verificar se o chart já foi inicializado antes de disparar o refresh.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const relevantChange = changes['from'] || changes['to'] || changes['range'];
    if (this.chart && relevantChange) {
      this.refresh$.next(); // sinaliza para o stream buscar novos dados
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy(); // libera recursos do Chart.js
  }

  private setupDataStream(): void {
    /**
     * Por que este padrão com Subject + switchMap?
     * ─────────────────────────────────────────────
     * refresh$ é um Subject — emite void quando inputs mudam.
     * startWith(null) faz o stream emitir imediatamente na inicialização.
     *
     * switchMap: quando refresh$ emite (nova troca de range/par):
     * 1. CANCELA a requisição HTTP anterior (se ainda estiver em voo)
     * 2. Inicia uma nova requisição com os valores atualizados
     *
     * Resultado: zero race conditions, sempre dados corretos na tela.
     */
    this.refresh$.pipe(
      startWith(null),
      tap(() => {
        this.loading = true;
        this.error = null;
      }),
      switchMap(() => {
        const option = CHART_RANGE_OPTIONS.find(o => o.value === this.range);
        const startDate = this.exchangeService.getStartDateByDays(option?.days ?? 30);

        return this.exchangeService
          .getHistoricalRates(this.from, this.to, startDate)
          .pipe(
            catchError(err => {
              this.error = err.message ?? 'Falha ao carregar o gráfico.';
              this.loading = false;
              return EMPTY; // completa sem valor — o subscriber não é chamado
            })
          );
      }),
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.updateChart(data);
      this.loading = false;
    });
  }

  private initChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradiente de preenchimento abaixo da linha
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
    gradient.addColorStop(0.7, 'rgba(0, 212, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: `${this.from}/${this.to}`,
          data: [],
          borderColor: '#00d4ff',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#00d4ff',
          fill: true,
          tension: 0.3,
        }],
      },
      options: this.buildChartOptions(),
    });
  }

  private buildChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(7, 11, 20, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          titleColor: '#8b9cc8',
          bodyColor: '#f0f4ff',
          padding: 12,
          callbacks: {
            title: ([item]) => item.label,
            label: (item) => ` ${this.from}/${this.to}: ${(item.parsed.y ?? 0).toFixed(4)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#4a5578', maxTicksLimit: 7, maxRotation: 0 },
          border: { display: false },
        },
        y: {
          position: 'right',
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#4a5578', maxTicksLimit: 5 },
          border: { display: false },
        },
      },
    };
  }

  private updateChart(data: HistoricalRateResponse): void {
    if (!this.chart) return;

    const entries = Object.entries(data.rates)
      .sort(([a], [b]) => a.localeCompare(b));

    this.chart.data.labels = entries.map(([date]) => {
      const d = new Date(date + 'T12:00:00'); // evita problema de timezone
      return d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    });

    this.chart.data.datasets[0].data = entries.map(([, rates]) => rates[this.to] ?? 0);
    this.chart.data.datasets[0].label = `${this.from}/${this.to}`;
    this.chart.update('active');
  }
}
