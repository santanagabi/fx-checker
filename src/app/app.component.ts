import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

/**
 * AppComponent — Shell da aplicação (Navbar + RouterOutlet).
 *
 * É o componente raiz: sempre está na tela.
 * O RouterOutlet renderiza a página correspondente à rota atual.
 *
 * Conceitos demonstrados:
 * ─────────────────────────────────────────────────────────────────────────
 * ✓ RouterOutlet: ponto onde as rotas renderizam seus componentes
 * ✓ RouterLink: diretiva de navegação (substitui href — sem reload da página)
 * ✓ RouterLinkActive: adiciona classe CSS quando a rota está ativa
 * ✓ *ngFor: renderiza os nav links a partir de um array
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly navItems = [
    { path: '/converter',  label: 'Conversor',  icon: '⇄'  },
    { path: '/market',     label: 'Mercado',    icon: '📈'  },
    { path: '/comparison', label: 'Comparar',   icon: '⚖️' },
    { path: '/history',    label: 'Histórico',  icon: '🕐'  },
  ];

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
