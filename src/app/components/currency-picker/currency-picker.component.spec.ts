import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CurrencyPickerComponent } from './currency-picker.component';
import { CurrencyPickerHarness } from './currency-picker.harness';
import { Currency } from '../../interfaces/currency.interface';

/**
 * Spec com Component Harness para CurrencyPickerComponent.
 *
 * Por que usar Harness em vez de querySelector?
 * ─────────────────────────────────────────────
 * querySelector('.picker-trigger') → frágil (quebra ao renomear classe)
 * harness.open()                   → estável (API de comportamento)
 *
 * O Angular CDK fornece TestbedHarnessEnvironment para integrar
 * harnesses com o TestBed do Angular.
 */

const MOCK_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];

describe('CurrencyPickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyPickerComponent],
    }).compileComponents();
  });

  /** Helper: cria o componente configurado e retorna o harness */
  async function setup(
    selected = 'USD',
    currencies = MOCK_CURRENCIES,
    disabled = false
  ) {
    const fixture = TestBed.createComponent(CurrencyPickerComponent);
    fixture.componentRef.setInput('currencies', currencies);
    fixture.componentRef.setInput('selected', selected);
    fixture.componentRef.setInput('disabled', disabled);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(CurrencyPickerHarness);
    return { fixture, harness };
  }

  // ─── Renderização inicial ────────────────────────────────────────────────
  describe('Renderização inicial', () => {
    it('deve renderizar com a moeda selecionada correta', async () => {
      const { harness } = await setup('BRL');
      const selected = await harness.getSelectedCode();
      expect(selected).toBe('BRL');
    });

    it('deve começar com o dropdown fechado', async () => {
      const { harness } = await setup();
      const isOpen = await harness.isOpen();
      expect(isOpen).toBeFalse();
    });

    it('deve estar desabilitado quando [disabled]="true"', async () => {
      const { harness } = await setup('USD', MOCK_CURRENCIES, true);
      const isDisabled = await harness.isDisabled();
      expect(isDisabled).toBeTrue();
    });
  });

  // ─── Abertura/Fechamento do dropdown ─────────────────────────────────────
  describe('Dropdown', () => {
    it('deve abrir ao clicar no trigger', async () => {
      const { harness } = await setup();
      await harness.open();
      expect(await harness.isOpen()).toBeTrue();
    });

    it('deve fechar ao clicar no trigger novamente', async () => {
      const { harness } = await setup();
      await harness.open();
      await harness.close();
      expect(await harness.isOpen()).toBeFalse();
    });

    it('deve exibir todas as moedas quando aberto sem busca', async () => {
      const { harness } = await setup();
      const options = await harness.getVisibleOptions();
      expect(options.length).toBe(MOCK_CURRENCIES.length);
    });
  });

  // ─── Busca (debounceTime) ─────────────────────────────────────────────────
  describe('Busca com debounceTime', () => {
    it('deve filtrar moedas pelo código', async () => {
      const { harness, fixture } = await setup();
      await harness.search('USD');

      // debounceTime(200ms) — precisamos avançar o tempo virtual
      await fixture.whenStable();
      fixture.detectChanges();

      const options = await harness.getVisibleOptions();
      expect(options).toContain('USD');
      expect(options).not.toContain('BRL');
    });

    it('deve exibir mensagem de "nenhuma moeda" para busca sem resultado', async () => {
      const { harness, fixture } = await setup();
      await harness.search('XYZ_INEXISTENTE');
      await fixture.whenStable();
      fixture.detectChanges();

      const noResultsText = await harness.getNoResultsText();
      expect(noResultsText).toBeTruthy();
    });

    it('deve exibir todas as moedas ao limpar a busca', async () => {
      const { harness, fixture } = await setup();
      await harness.search('');
      await fixture.whenStable();
      fixture.detectChanges();

      const options = await harness.getVisibleOptions();
      expect(options.length).toBe(MOCK_CURRENCIES.length);
    });
  });

  // ─── Seleção de moeda (@Output) ───────────────────────────────────────────
  describe('Seleção de moeda', () => {
    it('deve emitir (selectedChange) ao selecionar uma moeda', async () => {
      const fixture = TestBed.createComponent(CurrencyPickerComponent);
      fixture.componentRef.setInput('currencies', MOCK_CURRENCIES);
      fixture.componentRef.setInput('selected', 'USD');
      fixture.detectChanges();

      // Captura a emissão do @Output
      let emittedCode: string | undefined;
      fixture.componentInstance.selectedChange.subscribe((code: string) => {
        emittedCode = code;
      });

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const harness = await loader.getHarness(CurrencyPickerHarness);
      await harness.selectCurrency('BRL');

      expect(emittedCode).toBe('BRL');
    });

    it('deve fechar o dropdown após selecionar', async () => {
      const { harness } = await setup();
      await harness.selectCurrency('EUR');
      expect(await harness.isOpen()).toBeFalse();
    });

    it('deve lançar erro ao tentar selecionar moeda inexistente', async () => {
      const { harness } = await setup();
      await expectAsync(harness.selectCurrency('XYZ')).toBeRejected();
    });
  });

  // ─── Acessibilidade ────────────────────────────────────────────────────────
  describe('Acessibilidade', () => {
    it('o trigger deve ter aria-expanded=false quando fechado', async () => {
      const fixture = TestBed.createComponent(CurrencyPickerComponent);
      fixture.componentRef.setInput('currencies', MOCK_CURRENCIES);
      fixture.componentRef.setInput('selected', 'USD');
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.picker-trigger'));
      expect(trigger.attributes['aria-expanded']).toBe('false');
    });

    it('o trigger deve ter aria-expanded=true quando aberto', async () => {
      const { harness, fixture } = await setup();
      await harness.open();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.picker-trigger'));
      expect(trigger.attributes['aria-expanded']).toBe('true');
    });
  });
});
