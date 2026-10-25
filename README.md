# qa-demo

![QA](https://github.com/mariotalavera32/prueba_mario/actions/workflows/qa.yml/badge.svg)

Proyecto de automatización de pruebas con TypeScript.

- **Unitarias** (Vitest): `unit/`
- **E2E** (Playwright + Page Object): `tests/e2e.spec.ts`, `tests/todo-pom.spec.ts`, `pages/`
- **API** (Playwright `request`): `tests/api.spec.ts`
- **Backend propio** (Express + Mongoose + MongoDB): `src/api/`, API REST de tareas (CRUD, validaciones, paginación)
- **Integración** (Vitest + Supertest + `mongodb-memory-server`): `integration/tasks.test.ts`
- **Login** (POM): `tests/login.spec.ts`, `pages/LoginPage.ts`
- **Accesibilidad** (axe-core): `tests/a11y.spec.ts`
- **Visual** (screenshots, solo Chromium): `tests/visual.spec.ts`; baselines en `tests/__snapshots__/`. Regenerar: `npx playwright test tests/visual.spec.ts --project=chromium --update-snapshots`
- **Navegadores**: Chromium, Firefox y WebKit (`--project=firefox` para uno solo)
- **CI**: GitHub Actions (`.github/workflows/qa.yml`)

## Uso

```
npm ci
npx playwright install chromium firefox webkit
npm test               # unitarias + e2e
npm run test:unit
npm run test:integration   # API + MongoDB en memoria
npm start               # API en :3000 (requiere MongoDB; MONGO_URI opcional)
npm run db              # MongoDB real y persistente en .data/db (puerto 27017), sin instalar nada
npm run db:seed         # carga tareas de ejemplo
docker compose up -d    # alternativa con Docker
npm run test:e2e
npm run test:coverage   # cobertura de unitarias
npx playwright show-report
```
