import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/**
 * CurrencyPickerHarness — Harness para testes do CurrencyPickerComponent.
 *
 * O que é um Component Harness?
 * ────────────────────────────────────────────────────────────────────
 * Um Harness é uma camada de abstração sobre o DOM para uso em testes.
 * Em vez de buscar elementos por CSS selector (frágil), o harness expõe
 * uma API de alto nível que espelha o comportamento do componente:
 *
 *   ❌ Sem harness:  fixture.nativeElement.querySelector('.picker-trigger').click()
 *   ✅ Com harness:  (await harness).open()
 *
 * Vantagens:
 * 1. Testes não quebram ao renomear classes CSS
 * 2. API legível — o teste descreve INTENÇÃO, não implementação
 * 3. Reutilizável em vários spec files
 * 4. Compatível com TestbedHarnessEnvironment e Playwright/Cypress
 *
 * Uso nos specs:
 * ─────────────────────────────────────────────────────────────────────
 * const loader = TestbedHarnessEnvironment.loader(fixture);
 * const picker = await loader.getHarness(CurrencyPickerHarness);
 * await picker.open();
 * await picker.search('dol');
 * await picker.selectCurrency('USD');
 */
export class CurrencyPickerHarness extends ComponentHarness {
  static hostSelector = 'app-currency-picker';

  // ─── Locators internos ────────────────────────────────────────────────────
  private getTrigger       = this.locatorFor('.picker-trigger');
  private getDropdown      = this.locatorForOptional('.dropdown');
  private getSearchInput   = this.locatorForOptional('.search-input');
  private getOptions       = this.locatorForAll('.currency-option');
  private getNoResults     = this.locatorForOptional('.no-results');

  // ─── API pública ──────────────────────────────────────────────────────────

  /** Clica no trigger para abrir o dropdown */
  async open(): Promise<void> {
    const trigger = await this.getTrigger();
    await trigger.click();
  }

  /** Fecha o dropdown (clicando no trigger quando aberto) */
  async close(): Promise<void> {
    const dropdown = await this.getDropdown();
    if (dropdown) {
      const trigger = await this.getTrigger();
      await trigger.click();
    }
  }

  /** Retorna true se o dropdown está aberto */
  async isOpen(): Promise<boolean> {
    const dropdown = await this.getDropdown();
    return !!dropdown;
  }

  /** Retorna o código da moeda atualmente selecionada (ex: 'USD') */
  async getSelectedCode(): Promise<string> {
    const trigger = await this.getTrigger();
    const text = await trigger.text();
    // O trigger exibe: flag code name ▾
    const parts = text.trim().split(/\s+/);
    return parts[1] ?? ''; // índice 1 = código (após a flag)
  }

  /** Digita no campo de busca */
  async search(term: string): Promise<void> {
    await this.open();
    const input = await this.getSearchInput();
    if (!input) throw new Error('Dropdown não está aberto ou campo de busca não encontrado');
    await input.clear();
    await input.sendKeys(term);
  }

  /** Seleciona uma moeda pelo código (ex: 'USD') */
  async selectCurrency(code: string): Promise<void> {
    if (!(await this.isOpen())) await this.open();
    const options = await this.getOptions();
    for (const option of options) {
      const text = await option.text();
      if (text.includes(code)) {
        await option.click();
        return;
      }
    }
    throw new Error(`Moeda "${code}" não encontrada nas opções`);
  }

  /** Retorna os códigos de todas as opções visíveis */
  async getVisibleOptions(): Promise<string[]> {
    if (!(await this.isOpen())) await this.open();
    const options = await this.getOptions();
    const texts = await Promise.all(options.map(o => o.text()));
    return texts.map(t => t.trim().split(/\s+/)[1] ?? '');
  }

  /** Retorna o texto da mensagem de "nenhuma moeda encontrada" */
  async getNoResultsText(): Promise<string | null> {
    const el = await this.getNoResults();
    return el ? el.text() : null;
  }

  /** Verifica se o componente está desabilitado */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return host.hasClass('disabled');
  }
}
