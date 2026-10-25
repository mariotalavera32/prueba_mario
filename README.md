# qa-demo

![QA](https://github.com/mariotalavera32/prueba_mario/actions/workflows/qa.yml/badge.svg)

Proyecto de automatización de pruebas con TypeScript.

- **Unitarias** (Vitest): `unit/`
- **E2E** (Playwright + Page Object): `tests/e2e.spec.ts`, `tests/todo-pom.spec.ts`, `pages/`
- **API** (Playwright `request`): `tests/api.spec.ts`
- **Login** (POM): `tests/login.spec.ts`, `pages/LoginPage.ts`
- **Accesibilidad** (axe-core): `tests/a11y.spec.ts`
- **Navegadores**: Chromium, Firefox y WebKit (`--project=firefox` para uno solo)
- **CI**: GitHub Actions (`.github/workflows/qa.yml`)

## Uso

```
npm ci
npx playwright install chromium firefox webkit
npm test               # unitarias + e2e
npm run test:unit
npm run test:e2e
npm run test:coverage   # cobertura de unitarias
npx playwright show-report
```
