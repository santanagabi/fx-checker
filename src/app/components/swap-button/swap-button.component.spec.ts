import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SwapButtonComponent } from './swap-button.component';
import { SwapButtonHarness } from './swap-button.harness';

/**
 * Spec com Harness para SwapButtonComponent.
 *
 * Foco: @Output EventEmitter e animação de rotação.
 */
describe('SwapButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapButtonComponent],
    }).compileComponents();
  });

  async function setup() {
    const fixture = TestBed.createComponent(SwapButtonComponent);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SwapButtonHarness);
    return { fixture, harness };
  }

  it('deve criar o componente', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve ter aria-label de acessibilidade', async () => {
    const { harness } = await setup();
    const label = await harness.getAriaLabel();
    expect(label).toBeTruthy();
    expect(label).toContain('nverter');
  });

  it('deve emitir o evento (swap) ao clicar', async () => {
    const fixture = TestBed.createComponent(SwapButtonComponent);
    fixture.detectChanges();

    let swapEmitted = false;
    fixture.componentInstance.swap.subscribe(() => { swapEmitted = true; });

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SwapButtonHarness);
    await harness.click();

    expect(swapEmitted).toBeTrue();
  });

  it('deve adicionar classe .rotating imediatamente após o clique', async () => {
    const { harness } = await setup();
    await harness.click();
    // Imediatamente após o clique, a animação inicia
    const rotating = await harness.isRotating();
    expect(rotating).toBeTrue();
  });

  it('deve remover classe .rotating após 400ms', async () => {
    const fixture = TestBed.createComponent(SwapButtonComponent);
    fixture.detectChanges();

    // Usa jasmine.clock() para controlar setTimeout sem esperar de verdade
    jasmine.clock().install();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SwapButtonHarness);
    await harness.click();

    expect(await harness.isRotating()).toBeTrue();

    jasmine.clock().tick(400);
    fixture.detectChanges();

    expect(await harness.isRotating()).toBeFalse();

    jasmine.clock().uninstall();
  });
});
