import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExchangeRateResponse, HistoricalRateResponse } from '../interfaces/exchange-rate.interface';

/**
 * ExchangeRateService — A única classe que conversa com a Frankfurter API.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Por que criar um Service?                              │
 * │                                                         │
 * │  Single Responsibility Principle (SOLID):               │
 * │  Este service tem UMA responsabilidade: buscar dados    │
 * │  de câmbio. Componentes têm outra responsabilidade:     │
 * │  exibir dados. Ao separar, cada parte é mais fácil de   │
 * │  testar, manter e substituir.                           │
 * │                                                         │
 * │  Se amanhã a API mudar, alteramos APENAS este arquivo.  │
 * └─────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Por que Dependency Injection?                          │
 * │                                                         │
 * │  `inject(HttpClient)` → o Angular fornece a instância   │
 * │  correta do HttpClient, configurada com interceptors.   │
 * │                                                         │
 * │  Sem DI: teríamos que instanciar HttpClient manualmente │
 * │  e não poderíamos substituir por um mock nos testes.    │
 * └─────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Por que Observable e não Promise?                      │
 * │                                                         │
 * │  1. Cancelável: `switchMap` cancela a request anterior  │
 * │  2. Composível: `forkJoin`, `combineLatest`, `map`...   │
 * │  3. Lazy: só executa quando alguém faz subscribe()      │
 * │  4. Cancelamento automático com takeUntil/async pipe    │
 * └─────────────────────────────────────────────────────────┘
 *
 * `providedIn: 'root'` → instância singleton compartilhada por toda a app.
 * O Angular cria uma única instância e a injeta onde for pedida.
 */
@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  // `inject()` é a forma moderna de DI (Angular 14+).
  // Equivalente ao construtor: constructor(private http: HttpClient) {}
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ─── Endpoint: /currencies ──────────────────────────────────────────────

  /**
   * Retorna todas as moedas disponíveis.
   * Resposta: { "AUD": "Australian Dollar", "BRL": "Brazilian Real", ... }
   *
   * Quando usar subscribe() vs async pipe?
   * ──────────────────────────────────────
   * - `async pipe` no template: Angular faz subscribe/unsubscribe automático.
   *   Evita memory leak. Preferir sempre que possível.
   * - `subscribe()` no código: quando você precisa realizar um efeito
   *   colateral (salvar no storage, atualizar um Signal, etc.)
   */
  getCurrencies(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.apiUrl}/currencies`);
  }

  // ─── Endpoint: /latest ──────────────────────────────────────────────────

  /**
   * Taxa atual de um par específico.
   * Ex: GET /latest?from=USD&to=BRL
   * Resposta: { "amount": 1, "base": "USD", "date": "...", "rates": { "BRL": 4.97 } }
   */
  getLatestRate(from: string, to: string): Observable<ExchangeRateResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<ExchangeRateResponse>(`${this.apiUrl}/latest`, { params });
  }

  /**
   * Taxas atuais para múltiplas moedas destino.
   * Ex: GET /latest?from=USD&to=BRL,EUR,GBP
   * Usado no ticker de mercado ao vivo.
   */
  getLatestRates(from: string, targets: string[]): Observable<ExchangeRateResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', targets.join(','));
    return this.http.get<ExchangeRateResponse>(`${this.apiUrl}/latest`, { params });
  }

  // ─── Endpoint: /{startDate}.. ────────────────────────────────────────────

  /**
   * Histórico de taxas de um par a partir de uma data.
   * Ex: GET /2024-01-01..?from=USD&to=BRL
   *
   * Por que switchMap ao trocar o range ou par?
   * ──────────────────────────────────────────────
   * Sem switchMap: usuário troca de "1M" para "6M" rapidamente.
   * Dois requests em voo. O de "1M" responde depois do "6M".
   * O gráfico exibe dados de "1M" — race condition!
   *
   * Com switchMap: ao emitir o novo valor (nova troca), o operador
   * CANCELA o request anterior e inicia apenas o novo.
   * Resultado: sempre o dado mais recente, sem race condition.
   */
  getHistoricalRates(from: string, to: string, startDate: string): Observable<HistoricalRateResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<HistoricalRateResponse>(
      `${this.apiUrl}/${startDate}..`,
      { params }
    );
  }

  /**
   * Compara a moeda base com múltiplos destinos (uma só request).
   * Retorna rates para todos os targets de uma vez.
   *
   * Por que forkJoin na ComparisonPage?
   * ────────────────────────────────────
   * Quando usamos forkJoin([obs1$, obs2$, obs3$]):
   * - Os 3 requests são disparados EM PARALELO (não sequencial)
   * - Só emite quando TODOS completam
   * - Ideal para exibir N resultados simultaneamente
   *
   * Alternativa ruim: encadear requests com switchMap seria sequencial:
   * request1 → aguarda → request2 → aguarda → request3 (lento!)
   *
   * Neste caso específico, como a Frankfurter suporta múltiplos targets
   * em uma request, usamos getComparisonRates para evitar N chamadas.
   * forkJoin entra quando precisamos combinar Observables independentes.
   */
  getComparisonRates(base: string, targets: string[]): Observable<ExchangeRateResponse> {
    const params = new HttpParams()
      .set('from', base)
      .set('to', targets.join(','));
    return this.http.get<ExchangeRateResponse>(`${this.apiUrl}/latest`, { params });
  }

  // ─── Utilitário: calcular data de início ────────────────────────────────

  /** Retorna uma data no passado formatada como 'YYYY-MM-DD' */
  getStartDateByDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}
