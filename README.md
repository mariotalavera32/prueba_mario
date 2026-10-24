# qa-demo

![QA](https://github.com/mariotalavera32/prueba_mario/actions/workflows/qa.yml/badge.svg)

Proyecto de automatización de pruebas con TypeScript.

- **Unitarias** (Vitest): `unit/`
- **E2E** (Playwright + Page Object): `tests/e2e.spec.ts`, `tests/todo-pom.spec.ts`, `pages/`
- **API** (Playwright `request`): `tests/api.spec.ts`
- **CI**: GitHub Actions (`.github/workflows/qa.yml`)

## Uso

```
npm ci
npx playwright install chromium
npm test               # unitarias + e2e
npm run test:unit
npm run test:e2e
npx playwright show-report
```
