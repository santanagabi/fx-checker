import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, ElementRef, HostListener,
  ViewChild, inject,
} from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Currency } from '../../interfaces/currency.interface';

/**
 * CurrencyPickerComponent — Dropdown customizado de seleção de moeda.
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │  Por que @Input e @Output?                                        │
 * │                                                                    │
 * │  @Input()  → dados fluem do PAI → FILHO (parent to child)        │
 * │  @Output() → eventos fluem do FILHO → PAI (child to parent)      │
 * │                                                                    │
 * │  Padrão "props down, events up":                                  │
 * │  - O pai fornece a lista de moedas e a selecionada (@Input)       │
 * │  - Quando o user escolhe, emitimos o código (@Output)             │
 * │  - O pai decide o que fazer com o evento                          │
 * │                                                                    │
 * │  Isso torna o componente 100% reutilizável: pode ser usado no    │
 * │  Conversor, na Comparação, etc — sem conhecer o contexto.         │
 * └────────────────────────────────────────────────────────────────────┘
 */
@Component({
  selector: 'app-currency-picker',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './currency-picker.component.html',
  styleUrl: './currency-picker.component.scss',
})
export class CurrencyPickerComponent implements OnInit, OnDestroy {
  /** Lista de moedas disponíveis — vem do componente pai */
  @Input() currencies: Currency[] = [];
  /** Código da moeda selecionada atualmente */
  @Input() selected = '';
  /** Desabilita o picker durante loading */
  @Input() disabled = false;
  /** Emite o código da nova moeda quando o usuário seleciona */
  @Output() selectedChange = new EventEmitter<string>();

  /**
   * ViewChild: acessa uma referência ao elemento do template.
   * '#searchInput' → a variável de template no <input>.
   * Usamos para auto-focar o campo de busca ao abrir o dropdown.
   */
  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  /**
   * ElementRef: referência ao elemento DOM raiz do componente.
   * Usado no HostListener para detectar cliques fora do dropdown.
   * Injetado via inject() — forma moderna (Angular 14+) de DI.
   */
  private readonly elRef = inject(ElementRef);
  private readonly destroy$ = new Subject<void>();

  isOpen = false;
  readonly searchControl = new FormControl('');
  filteredCurrencies: Currency[] = [];

  get selectedCurrency(): Currency | undefined {
    return this.currencies.find(c => c.code === this.selected);
  }

  /**
   * ngOnInit — Ciclo de vida do componente.
   * ──────────────────────────────────────────
   * Chamado UMA VEZ após o Angular inicializar as propriedades do componente.
   * É aqui que @Input() já estão disponíveis — diferente do construtor.
   *
   * Construtor  → instanciar/injetar dependências, sem lógica complexa
   * ngOnInit    → lógica de inicialização que depende de @Input() ou DI
   * ngOnChanges → reagir a mudanças em @Input() ao longo do tempo
   *
   * Por que debounceTime + distinctUntilChanged?
   * ──────────────────────────────────────────────
   * searchControl.valueChanges emite a CADA tecla pressionada.
   * debounceTime(200): aguarda 200ms de silêncio → evita filtrar a cada tecla
   * distinctUntilChanged: não refiltra se o valor não mudou
   */
  ngOnInit(): void {
    this.filteredCurrencies = this.currencies;

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$), // unsubscribe automático quando o componente é destruído
    ).subscribe(term => {
      const q = (term ?? '').toLowerCase().trim();
      this.filteredCurrencies = q
        ? this.currencies.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
          )
        : [...this.currencies];
    });
  }

  /**
   * ngOnDestroy — Ciclo de vida: limpeza.
   * Chamado quando o componente é removido do DOM.
   * destroy$.next() faz o takeUntil() completar todos os streams,
   * prevenindo memory leaks de subscriptions ativas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchControl.setValue('', { emitEvent: false });
      this.filteredCurrencies = [...this.currencies];
      setTimeout(() => this.searchInputRef?.nativeElement.focus(), 50);
    }
  }

  select(code: string): void {
    this.selectedChange.emit(code);
    this.isOpen = false;
    this.searchControl.setValue('', { emitEvent: false });
  }

  /**
   * HostListener — escuta eventos no nível do documento.
   * Quando o clique ocorre FORA deste componente, fechamos o dropdown.
   * `elRef.nativeElement.contains()` verifica se o alvo do clique
   * é um descendente do elemento raiz deste componente.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  /** trackBy no *ngFor: reutiliza elementos DOM existentes ao invés de recriar tudo */
  trackByCurrencyCode(_: number, currency: Currency): string {
    return currency.code;
  }

  /** Converte código ISO 4217 para emoji de bandeira */
  getFlag(code: string): string {
    if (!code || code.length < 2) return '🌐';
    const specials: Record<string, string> = { EUR: '🇪🇺', XAU: '🥇', XAG: '🥈', XDR: '🌐' };
    if (specials[code]) return specials[code];
    try {
      return [...code.substring(0, 2).toUpperCase()]
        .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('');
    } catch { return '🌐'; }
  }
}
