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

## Application Preview

> Add a screenshot of the application here.

![FX Checker Preview](./docs/images/preview.png)

---

## Video Demonstration

> Add a GIF or a screen recording showing the application's main features.

Example:

```
docs/
└── videos/
    └── demo.mp4
```

Or upload a GitHub Asset and replace the link below.

https://github.com/user-attachments/assets/YOUR_VIDEO_ID

---

## ✨ Features

### Currency Converter

- Real-time currency conversion
- Currency swap
- Automatic conversion while typing
- Favorite currency pairs
- Save conversion history
<img width="1365" height="582" alt="image" src="https://github.com/user-attachments/assets/94c0f680-ef79-4406-b6ce-b325c132b5ee" />

### Market Dashboard

- Live exchange rate ticker
- Historical exchange rate chart
- Multiple time ranges
- Automatic polling

### Currency Comparison

- Convert one value to multiple currencies
- Visual comparison bars
- Fast comparison between exchange rates

### Conversion History

- Persistent conversion history
- Relative timestamps
- Individual deletion
- Clear entire history

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
