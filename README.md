# 💱 FX Checker

> Aplicação Angular de conversão de câmbio em tempo real 

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js)

---

## 📋 Sobre o Projeto

**FX Checker** é um conversor de câmbio moderno baseado no desafio *"Foreign Exchange Currency Converter"* do Frontend Mentor.

O objetivo é **duplo**:
1. Construir uma aplicação funcional e visualmente premium
2. Praticar os principais conceitos do Angular 

Todos os dados vêm da **Frankfurter API** — gratuita, sem necessidade de API key, baseada nos dados do **Banco Central Europeu**.

---

## ✨ Funcionalidades

| Página | Funcionalidades |
|---|---|
| **Conversor** (`/`) | Conversão em tempo real, swap de moedas, favoritar pares, salvar conversão |
| **Mercado** (`/market`) | Ticker ao vivo com 8 pares, gráfico de histórico com 6 rangos de tempo |
| **Comparação** (`/comparison`) | Converte para múltiplas moedas simultaneamente, barras visuais comparativas |
| **Histórico** (`/history`) | Log de conversões com tempo relativo, remoção individual ou total |

**Extras:**
- ⭐ Favoritos persistidos no LocalStorage
- 📋 Log de conversões (até 50 entradas) persistido no LocalStorage
- 📱 Layout responsivo (mobile, tablet, desktop)
- ♿ Navegação por teclado e atributos ARIA
- 🌙 Dark mode premium com glassmorphism

---

## 🛠️ Tecnologias e Conceitos Angular

| Conceito | Onde é usado |
|---|---|
| Standalone Components | Todos os componentes (sem NgModules) |
| Dependency Injection | `inject()` em todos os services e componentes |
| Services | `ExchangeRateService`, `StorageService`, `FavoritesService`, `ConversionLogService` |
| HttpClient | `ExchangeRateService` — todas as chamadas à API |
| Observables + RxJS | Pipeline de conversão, ticker, gráfico |
| `subscribe()` | Comparação de moedas (efeito imperativo) |
| `async pipe` | Conversor (currencies$, result$) |
| `@Input / @Output` | `CurrencyPickerComponent`, `RateChartComponent`, `SwapButtonComponent` |
| Routing | 4 rotas com lazy loading via `loadComponent()` |
| Lazy Loading | Cada página é um chunk separado |
| `*ngFor / *ngIf` | Todos os templates |
| Loading state | Signals + spinner em todas as páginas |
| Tratamento de erro | `catchError` + `httpErrorInterceptor` |
| Interfaces TypeScript | `Currency`, `ExchangeRateResponse`, `ConversionLog`... |
| Pipes customizados | `RateChangePipe`, `CurrencyFormatPipe` |
| Reactive Forms | Conversor e Comparação |
| Signals | `FavoritesService`, `ConversionLogService`, estados locais |
| `computed()` | `maxResult` na Comparação, `activeTickerItem` no Mercado |
| `debounceTime` | Campo de busca do CurrencyPicker, conversão automática |
| `distinctUntilChanged` | Evita chamadas duplicadas na conversão |
| `switchMap` | Cancela requests anteriores (conversor, gráfico) |
| `forkJoin` | Ticker do mercado (8 requisições em paralelo) |
| `interval` | Polling do ticker a cada 60s |
| `shareReplay(1)` | Cache da lista de moedas |
| `startWith` | Dispara a 1ª conversão/polling automaticamente |
| `catchError` | Tratamento de erros sem quebrar o stream |
| `finalize` | Reset de loading após sucesso OU erro |
| `HttpInterceptorFn` | Interceptor funcional para erros globais |
| Environment | `environment.ts` / `environment.prod.ts` |
| `ViewChild` | Acesso ao `<canvas>` do Chart.js |
| `ngAfterViewInit` | Inicialização do Chart.js após o DOM existir |
| `ngOnChanges` | Re-carrega o gráfico ao trocar par/range |
| `HostListener` | Fechar dropdown ao clicar fora |
| `trackBy` | Performance do `*ngFor` |

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- [Angular CLI](https://angular.io/cli) v19

```bash
# Verificar versões
node --version
npm --version
ng version
```

### Passo a Passo

**1. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd fx-checker
```

**2. Instale as dependências**
```bash
npm install
```

**3. Rode em modo de desenvolvimento**
```bash
npm start
# ou
ng serve
```

**4. Acesse no browser**
```
http://localhost:4200
```

A aplicação recarrega automaticamente quando você editar qualquer arquivo.

---

## 📁 Estrutura do Projeto

```
src/app/
├── core/
│   └── interceptors/
│       └── http-error.interceptor.ts   # Tratamento centralizado de erros HTTP
│
├── services/
│   ├── exchange-rate.service.ts        # Toda a comunicação com a Frankfurter API
│   ├── storage.service.ts              # Abstração do LocalStorage (genérica)
│   ├── favorites.service.ts            # Gerencia favoritos com Signals
│   └── conversion-log.service.ts      # Gerencia histórico com Signals
│
├── interfaces/
│   ├── currency.interface.ts           # Currency, CurrencyPair
│   ├── exchange-rate.interface.ts      # ExchangeRateResponse, ConversionResult...
│   └── conversion-log.interface.ts    # ConversionLog
│
├── models/
│   └── chart-range.model.ts           # ChartRange type + CHART_RANGE_OPTIONS
│
├── shared/
│   └── constants.ts                   # STORAGE_KEYS, TICKER_PAIRS, POLL_INTERVAL_MS
│
├── pipes/
│   ├── rate-change.pipe.ts            # Formata +1.23% / -0.45%
│   └── currency-format.pipe.ts        # Formata R$ 4.970,00 via Intl
│
├── components/
│   ├── currency-picker/               # Dropdown com busca (standalone)
│   ├── swap-button/                   # Botão de inversão com animação
│   └── rate-chart/                    # Gráfico Chart.js com ViewChild
│
├── pages/
│   ├── converter/                     # Rota: /
│   ├── market/                        # Rota: /market
│   ├── comparison/                    # Rota: /comparison
│   └── history/                       # Rota: /history
│
├── app.component.ts                   # Shell: navbar + RouterOutlet
├── app.config.ts                      # Providers: Router, HttpClient, Interceptor
└── app.routes.ts                      # Rotas com Lazy Loading
│
src/
├── environments/
│   ├── environment.ts                 # { apiUrl, production: false }
│   └── environment.prod.ts            # { apiUrl, production: true }
├── styles.scss                        # Design system global (CSS custom properties)
└── index.html                         # HTML raiz (Google Fonts, meta tags)
```

---

## 🌐 API — Frankfurter

Base URL: `https://api.frankfurter.app`

| Endpoint | Descrição | Exemplo |
|---|---|---|
| `GET /currencies` | Lista todas as moedas | `/currencies` |
| `GET /latest` | Taxa atual de um par | `/latest?from=USD&to=BRL` |
| `GET /latest` | Taxas para múltiplas moedas | `/latest?from=USD&to=BRL,EUR,GBP` |
| `GET /{data}..` | Histórico desde uma data | `/2024-01-01..?from=USD&to=BRL` |

> **Nota:** A Frankfurter API atualiza os dados 1x por dia (dias úteis) baseado no BCE. O polling a cada 60s demonstra o padrão técnico mesmo que os dados não mudem em tempo real.

---

## 🏗️ Build para Produção

```bash
ng build
```

Os arquivos serão gerados em `dist/fx-checker/browser/`.

---

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Com cobertura
ng test --code-coverage
```

---

## 💡 Conceitos-chave para a Entrevista

### Por que Standalone Components?
Eliminam a necessidade de NgModules. Cada componente declara suas próprias dependências via `imports: []`. Mais simples, mais tree-shakable, mais testável.

### Por que `switchMap` no conversor?
Se o usuário troca de moeda enquanto uma requisição está em voo, `switchMap` **cancela** a anterior e inicia uma nova. Sem ele: race condition — a resposta mais antiga pode chegar depois da mais recente.

### Por que `forkJoin` no ticker?
Dispara 8 requisições em **paralelo** e emite apenas quando todas completam. Alternativa sequencial seria ~8x mais lenta.

### Quando usar Signal vs Observable?
- **Signal**: estado local síncrono (favoritos, log, loading, flags)
- **Observable**: fluxos assíncronos (HTTP, formulários, polling, timers)

### Por que `shareReplay(1)` na lista de moedas?
Dois `CurrencyPickerComponent` (origem e destino) precisam da mesma lista. `shareReplay(1)` garante que apenas **uma** requisição HTTP seja feita, e o resultado em cache é entregue para ambos os subscribers.

---

## 📝 Licença

MIT — sinta-se livre para usar e modificar para seus estudos.
