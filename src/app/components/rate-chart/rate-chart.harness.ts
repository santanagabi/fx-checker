import { ComponentHarness } from '@angular/cdk/testing';
import { ChartRange } from '../../models/chart-range.model';

/**
 * RateChartHarness — Harness para o gráfico de histórico de taxas.
 */
export class RateChartHarness extends ComponentHarness {
  static hostSelector = 'app-rate-chart';

  private getLoadingOverlay = this.locatorForOptional('.chart-loading');
  private getErrorBox       = this.locatorForOptional('.chart-error');
  private getCanvas         = this.locatorForOptional('canvas');

  /** Retorna true se o loading overlay está visível */
  async isLoading(): Promise<boolean> {
    const overlay = await this.getLoadingOverlay();
    return !!overlay;
  }

  /** Retorna a mensagem de erro, ou null se não houver erro */
  async getErrorMessage(): Promise<string | null> {
    const errorEl = await this.getErrorBox();
    if (!errorEl) return null;
    return errorEl.text();
  }

  /** Retorna true se o canvas do gráfico existe no DOM */
  async hasChart(): Promise<boolean> {
    const canvas = await this.getCanvas();
    return !!canvas;
  }
}
