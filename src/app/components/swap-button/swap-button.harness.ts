import { ComponentHarness } from '@angular/cdk/testing';

/**
 * SwapButtonHarness — Harness para o botão de inversão de moedas.
 */
export class SwapButtonHarness extends ComponentHarness {
  static hostSelector = 'app-swap-button';

  private getButton = this.locatorFor('.swap-btn');

  /** Clica no botão de swap */
  async click(): Promise<void> {
    const btn = await this.getButton();
    await btn.click();
  }

  /** Retorna true se o botão está em animação de rotação */
  async isRotating(): Promise<boolean> {
    const btn = await this.getButton();
    return btn.hasClass('rotating');
  }

  /** Retorna o aria-label do botão */
  async getAriaLabel(): Promise<string | null> {
    const btn = await this.getButton();
    return btn.getAttribute('aria-label');
  }
}
