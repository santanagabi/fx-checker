import { Injectable } from '@angular/core';

/**
 * StorageService — Abstração do LocalStorage.
 *
 * Por que abstrair o LocalStorage em vez de usar diretamente?
 * ────────────────────────────────────────────────────────────
 * 1. Centralização: um único ponto de acesso, fácil de encontrar
 * 2. Tratamento de erro: `JSON.parse` pode lançar exceção com dados corrompidos
 * 3. Tipagem: generics garantem que você recebe o tipo correto
 * 4. Testabilidade: em testes unitários, podemos mockar este service
 *    sem depender do `localStorage` real do browser
 * 5. Extensibilidade: se trocar para IndexedDB no futuro, mudamos só aqui
 */
@Injectable({ providedIn: 'root' })
export class StorageService {

  /**
   * Lê e desserializa um valor do LocalStorage.
   * Retorna `null` se a chave não existir ou se o JSON for inválido.
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      console.error(`[StorageService] Falha ao ler chave "${key}"`);
      return null;
    }
  }

  /**
   * Serializa e salva um valor no LocalStorage.
   * Captura erros silenciosamente (ex: modo privado com storage cheio).
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`[StorageService] Falha ao salvar chave "${key}"`);
    }
  }

  /** Remove uma chave do LocalStorage. */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /** Verifica se uma chave existe no LocalStorage. */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
