import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { ConversionLog } from '../interfaces/conversion-log.interface';
import { STORAGE_KEYS, MAX_LOG_ENTRIES } from '../shared/constants';

/**
 * ConversionLogService — Gerencia o histórico de conversões com Signals.
 *
 * Usa Signal pelo mesmo motivo do FavoritesService:
 * o log é estado local síncrono que precisa de reatividade imediata
 * no template (adicionar/remover itens deve atualizar a lista instantaneamente).
 *
 * crypto.randomUUID() é nativo nos browsers modernos — gera UUID v4
 * sem dependência externa, garantindo IDs únicos para cada entrada.
 */
@Injectable({ providedIn: 'root' })
export class ConversionLogService {
  private readonly storage = inject(StorageService);

  /** Signal com o log de conversões — carregado do LocalStorage na inicialização */
  readonly log = signal<ConversionLog[]>(
    this.storage.get<ConversionLog[]>(STORAGE_KEYS.CONVERSION_LOG) ?? []
  );

  /**
   * Adiciona uma nova entrada ao log.
   *
   * `Omit<ConversionLog, 'id' | 'timestamp'>` — TypeScript garante que o
   * chamador não precisa fornecer os campos gerados automaticamente.
   * O contrato fica claro: "me dê os dados da conversão, eu cuido do resto".
   */
  add(entry: Omit<ConversionLog, 'id' | 'timestamp'>): void {
    const newEntry: ConversionLog = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    this.log.update(list =>
      // Novo item vai para o início. Limite de MAX_LOG_ENTRIES entradas.
      [newEntry, ...list].slice(0, MAX_LOG_ENTRIES)
    );
    this.persist();
  }

  /** Remove uma entrada específica pelo id. */
  remove(id: string): void {
    this.log.update(list => list.filter(entry => entry.id !== id));
    this.persist();
  }

  /** Limpa todo o log. */
  clear(): void {
    this.log.set([]);
    this.storage.remove(STORAGE_KEYS.CONVERSION_LOG);
  }

  /** Persiste o estado atual no LocalStorage. */
  private persist(): void {
    this.storage.set(STORAGE_KEYS.CONVERSION_LOG, this.log());
  }
}
