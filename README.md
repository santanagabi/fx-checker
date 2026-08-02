# 💱 FX Checker

> Modern currency exchange application built with Angular, featuring real-time exchange rates, market monitoring, historical data visualization, and currency comparison.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js)

---

## 📖 About

**FX Checker** is a modern currency exchange application built with **Angular 19**.

The project consumes exchange rate data from the **Frankfurter API**, which provides rates based on the **European Central Bank (ECB)**.

Besides offering a clean and responsive user interface, the project demonstrates modern Angular development practices such as Standalone Components, Signals, RxJS, Lazy Loading, Reactive Forms, HTTP Interceptors, and reusable architecture.

---

# 📸 Demo

## 🎥 Application Walkthrough

A quick overview of the main features available in FX Checker.

### Currency Conversion

https://github.com/user-attachments/assets/85790607-b529-4090-a8f0-34f637f21177

---

# ✨ Features

## 💱 Currency Converter

Convert currencies with automatic updates, favorites and conversion history.

### Features

- Real-time currency conversion
- Currency swap
- Automatic conversion while typing
- Favorite currency pairs
- Conversion history persistence


### Preview

<img width="1365" height="582" alt="Currency Converter" src="https://github.com/user-attachments/assets/94c0f680-ef79-4406-b6ce-b325c132b5ee" />

<img width="1914" height="890" alt="Currency Converter Dark Mode" src="https://github.com/user-attachments/assets/cacdce1d-eb70-4944-ac81-1236e4a8c6b5" />

---

## 📈 Market Dashboard

A dashboard to monitor exchange rates with charts and automatic updates.

### Features

- Live exchange rate ticker
- Historical exchange rate charts
- Multiple time ranges
- Automatic polling updates


### Preview

<img width="1918" height="884" alt="Market Dashboard" src="https://github.com/user-attachments/assets/82f82d0a-2b32-4d14-b3b1-12c61faa8dd3" />

---

## 🔄 Currency Comparison

Compare multiple currencies simultaneously.

### Features

- Convert one value into multiple currencies
- Visual comparison bars
- Fast exchange comparison


### Preview

<img width="1905" height="889" alt="Currency Comparison" src="https://github.com/user-attachments/assets/83fd57ad-61bd-478a-b284-ca604599580c" />

<img width="1908" height="886" alt="Currency Comparison Results" src="https://github.com/user-attachments/assets/fdc7e39b-3cea-4909-9c10-0ef23147adfb" />

<img width="1913" height="910" alt="Currency Comparison Charts" src="https://github.com/user-attachments/assets/96cf7db5-5473-42f0-8734-ddd8b9f7c283" />

---

## 🕒 Conversion History

Track previous conversions with local persistence.

### Features

- Persistent conversion history
- Relative timestamps
- Individual deletion
- Clear all history


### Preview

<img width="1916" height="898" alt="Conversion History" src="https://github.com/user-attachments/assets/83a9ba77-2bcc-4cab-9e83-1409367160bf" />

---

## 🎯 Highlights

- Angular 19
- Standalone Components
- Signals
- RxJS
- Lazy Loading
- Reactive Forms
- Dependency Injection
- Functional HTTP Interceptors
- Chart.js integration
- LocalStorage persistence
- Responsive UI
- Accessibility (ARIA + keyboard navigation)
- Dark Theme
- Glassmorphism Design

---

# 🛠 Technologies

| Technology | Description |
|------------|-------------|
| Angular 19 | Front-end framework |
| TypeScript | Main language |
| RxJS | Reactive programming |
| Angular Signals | Local state management |
| Reactive Forms | Forms and validation |
| Angular Router | Navigation |
| HttpClient | API communication |
| Chart.js | Historical charts |
| SCSS | Styling |
| LocalStorage | Local persistence |

---

# 🧩 Angular Concepts Used

| Concept | Usage |
|----------|------|
| Standalone Components | Entire application |
| Dependency Injection | Services and components |
| HttpClient | API requests |
| Signals | Local state |
| Computed Signals | Derived state |
| Observables | API streams |
| Async Pipe | Template subscriptions |
| switchMap | Cancel previous requests |
| forkJoin | Parallel requests |
| debounceTime | Search and auto conversion |
| distinctUntilChanged | Avoid duplicate requests |
| interval | Market polling |
| shareReplay | Currency cache |
| catchError | Error handling |
| finalize | Loading state |
| Functional Interceptors | Global HTTP errors |
| Lazy Loading | Route loading |
| ViewChild | Chart initialization |
| HostListener | Close dropdown |
| trackBy | List performance |

---

# 🚀 Getting Started

## Requirements

- Node.js 18+
- npm 9+
- Angular CLI 19+

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/fx-checker.git
```

```bash
cd fx-checker
```

## Install

```bash
npm install
```

## Development

```bash
npm start
```

or

```bash
ng serve
```

Open

```
http://localhost:4200
```

---

# 📁 Project Structure

```
src/
│
├── app/
│   ├── components/
│   ├── core/
│   ├── interfaces/
│   ├── models/
│   ├── pages/
│   ├── pipes/
│   ├── services/
│   └── shared/
│
├── environments/
│
└── styles.scss
```

---

# 🌐 API

This project consumes data from the **Frankfurter API**.

Base URL

```
https://api.frankfurter.app
```

| Endpoint | Description |
|-----------|-------------|
| GET /currencies | List currencies |
| GET /latest | Current exchange rate |
| GET /latest?to= | Multiple currencies |
| GET /{date}.. | Historical data |

Exchange rates are based on data published by the **European Central Bank (ECB)**.

---

# 🏗 Production Build

```bash
ng build
```

Production files are generated inside

```
dist/fx-checker/browser
```

---

# 🧪 Running Tests

```bash
npm test
```

Coverage

```bash
ng test --code-coverage
```

---

# 🗺 Roadmap

Future improvements planned for the project:

- [ ] Authentication
- [ ] Multi-language support (i18n)
- [ ] PWA support
- [ ] Offline mode
- [ ] More exchange rate providers
- [ ] Custom dashboards
- [ ] Advanced charts
- [ ] Export conversion history
- [ ] Theme customization
- [ ] Unit and E2E test coverage improvements
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] GitHub Actions automation
- [ ] Organize project documentation using **Harness Specs** to improve AI-assisted development workflows and maintain structured project knowledge.

---

# 📚 Documentation

Future documentation will include:

- Architecture overview
- Component documentation
- Service documentation
- API integration guide
- Development guidelines
- Contribution guide
- Harness Specs for AI context and project organization

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using Angular.
