import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { CurrencyPair } from '../interfaces/currency.interface';
import { STORAGE_KEYS } from '../shared/constants';

/**
 * FavoritesService — Gerencia pares favoritos com Signals.
 *
 * ┌───────────────────────────────────────────────────────────────┐
 * │  Quando usar Signals vs Observables?                         │
 * │                                                               │
 * │  SIGNALS → estado local e SÍNCRONO                           │
 * │  - Favoritos: lista que muda ao clicar em um botão           │
 * │  - Contadores, flags de UI, toggles                          │
 * │  - Reatividade fine-grained: só re-renderiza o que mudou     │
 * │  - Sem operadores RxJS, sem subscribe/unsubscribe             │
 * │                                                               │
 * │  OBSERVABLES → fluxos ASSÍNCRONOS                            │
 * │  - Chamadas HTTP                                              │
 * │  - Eventos de formulário (valueChanges)                      │
 * │  - Polling, WebSockets, timers                               │
 * │  - Operadores poderosos: switchMap, forkJoin, debounce...    │
 * │                                                               │
 * │  Em resumo: se você precisaria de BehaviorSubject, use Signal│
 * │  Se você precisaria de Observable puro, use RxJS             │
 * └───────────────────────────────────────────────────────────────┘
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);

  /**
   * Signal que mantém a lista de pares favoritos.
   *
   * signal() cria um valor reativo. Quando ele muda com .set() ou .update(),
   * todos os lugares que o leem (template, computed, effect) re-executam
   * automaticamente — sem Subject, sem BehaviorSubject, sem pipe.
   */
  readonly favorites = signal<CurrencyPair[]>(
    this.storage.get<CurrencyPair[]>(STORAGE_KEYS.FAVORITES) ?? []
  );

  /**
   * computed() deriva um valor de um Signal.
   * Recalcula automaticamente quando `favorites` muda.
   * Equivalente a um `map` síncrono sobre um Observable.
   */
  readonly count = computed(() => this.favorites().length);

  /** Verifica se um par já está nos favoritos. */
  isFavorite(pair: CurrencyPair): boolean {
    return this.favorites().some(
      f => f.from === pair.from && f.to === pair.to
    );
  }

  /** Adiciona um par aos favoritos. */
  add(pair: CurrencyPair): void {
    if (this.isFavorite(pair)) return;

    // signal.update() recebe a lista atual e retorna a nova.
    // Sempre cria um NOVO array (imutabilidade) para que o Angular
    // detecte a mudança corretamente.
    this.favorites.update(list => [...list, pair]);
    this.persist();
  }

  /** Remove um par dos favoritos. */
  remove(pair: CurrencyPair): void {
    this.favorites.update(list =>
      list.filter(f => !(f.from === pair.from && f.to === pair.to))
    );
    this.persist();
  }

  /** Adiciona se não existe, remove se existe. */
  toggle(pair: CurrencyPair): void {
    this.isFavorite(pair) ? this.remove(pair) : this.add(pair);
  }

  /** Salva o estado atual no LocalStorage. */
  private persist(): void {
    this.storage.set(STORAGE_KEYS.FAVORITES, this.favorites());
  }
}
