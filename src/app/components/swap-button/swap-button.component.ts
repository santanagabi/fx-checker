import { Component, Output, EventEmitter } from '@angular/core';

/**
 * SwapButtonComponent — Botão de inversão de moedas.
 *
 * Intencionalmente simples: emite um evento (swap) e gerencia
 * apenas a animação de rotação. Nenhuma lógica de negócio.
 *
 * Template inline: para componentes muito simples, o template pode
 * ficar no próprio arquivo .ts. Isso evita criar arquivos extras.
 * Porém, para componentes maiores, sempre prefira arquivos separados.
 */
@Component({
  selector: 'app-swap-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="swap-btn"
      [class.rotating]="isRotating"
      (click)="onSwap()"
      aria-label="Inverter moedas"
      title="Inverter moedas"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M7 16V4m0 0L3 8m4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `,
  styles: [`
    .swap-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1px solid var(--color-border-strong);
      background: var(--color-bg-card);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-normal);
      align-self: flex-end;
      margin-bottom: 2px;

      &:hover {
        background: var(--color-primary-dim);
        border-color: var(--color-primary);
        color: var(--color-primary);
        transform: rotate(180deg);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      &.rotating {
        animation: swapSpin 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    }

    @keyframes swapSpin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(180deg); }
    }
  `],
})
export class SwapButtonComponent {
  @Output() swap = new EventEmitter<void>();

  isRotating = false;

  onSwap(): void {
    this.isRotating = true;
    this.swap.emit();
    // Reset após a animação completar
    setTimeout(() => (this.isRotating = false), 400);
  }
}
