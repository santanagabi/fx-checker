import { Component, inject } from '@angular/core';
import { NgIf, NgFor, DatePipe, DecimalPipe } from '@angular/common';
import { ConversionLogService } from '../../services/conversion-log.service';
import { ConversionLog } from '../../interfaces/conversion-log.interface';

/**
 * HistoryComponent — Histórico de conversões.
 *
 * Conceitos demonstrados:
 * ─────────────────────────────────────────────────────────────────────────
 * ✓ Signals via ConversionLogService.log() — leitura direta no template
 * ✓ *ngFor sobre um Signal — a lista re-renderiza quando o Signal muda
 * ✓ *ngIf para estado vazio
 * ✓ Interação com Service: remove() e clear()
 *
 * Por que este componente é "simples"?
 * ──────────────────────────────────────
 * Não há HTTP aqui — todos os dados vêm do LocalStorage via Signal.
 * Isso demonstra a separação de responsabilidades:
 * - ConversionLogService → persistência e estado
 * - HistoryComponent → apenas exibição e delegação de ações
 *
 * O componente não precisa de ngOnInit, subscriptions nem Observables.
 * Signals tornam o código muito mais simples para estado local.
 */
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, DecimalPipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  // logService é público para que o template acesse logService.log()
  readonly logService = inject(ConversionLogService);

  remove(id: string): void  { this.logService.remove(id); }
  clear(): void             { this.logService.clear(); }

  /**
   * Converte timestamp ISO para texto relativo: "há 5 min", "há 2h", etc.
   * Não usa DatePipe pois ele não faz tempo relativo nativamente.
   */
  timeAgo(timestamp: string): string {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 5)    return 'agora mesmo';
    if (seconds < 60)   return `há ${seconds}s`;
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400)return `há ${Math.floor(seconds / 3600)}h`;
    return `há ${Math.floor(seconds / 86400)} dia(s)`;
  }

  getFlag(code: string): string {
    const s: Record<string, string> = { EUR: '🇪🇺', XAU: '🥇', XAG: '🥈' };
    if (s[code]) return s[code];
    try {
      return [...code.substring(0, 2).toUpperCase()]
        .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');
    } catch { return '🌐'; }
  }

  trackById(_: number, entry: ConversionLog): string { return entry.id; }
}
