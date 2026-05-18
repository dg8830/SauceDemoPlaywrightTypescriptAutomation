# Playwright TypeScript Automation Framework (Web UI + API)

## 1) Project Overview
This repository is a **single Playwright + TypeScript automation framework** covering:
- **Web UI E2E testing** for SauceDemo: https://www.saucedemo.com/
- **API testing** for Restful-Booker: https://restful-booker.herokuapp.com/

It includes a scalable folder structure (POM for Web, API client pattern for API), parallel execution, and GitHub Actions CI.

---

## 2) Test Coverage (as required)
### Web UI
- Login Module: ✅ 1 positive + ✅ 1 negative
- Product Catalog: ✅ 1 positive + ✅ 1 negative
- Cart/Checkout: ✅ 1 positive + ✅ 1 negative
- E2E purchase flow: ✅ 1 (Login → Add to Cart → Checkout)

### API
- Authentication (`POST /auth`): ✅ positive + ✅ negative
- Booking GET (`GET /booking`, `GET /booking/:id`): ✅ positive + ✅ negative
- Booking Create/Update (`POST /booking`, `PUT /booking/:id`): ✅ positive + ✅ negative
- Booking Delete (`DELETE /booking/:id`): ✅ positive + ✅ negative
- E2E lifecycle: ✅ 1 (Create → Update → Verify → Delete)

---

## 3) Tech Stack
- Playwright (Web + API) with TypeScript
- Ajv (JSON schema validation)
- dotenv (env management)

---

## 4) Repository Structure
```text
project-root/
├── .github/
│   └── workflows/
│       ├── web-tests.yml
│       ├── api-tests.yml
│       └── all-tests.yml
├── src/
│   ├── web/
│   │   ├── pages/
│   │   │   ├── LoginPage.ts
│   │   │   ├── ProductsPage.ts
│   │   │   ├── CartPage.ts
│   │   │   ├── CheckoutStepOnePage.ts
│   │   │   ├── CheckoutStepTwoPage.ts
│   │   │   └── CheckoutCompletePage.ts
│   │   ├── fixtures/
│   │   │   └── testData.ts
│   │   └── utils/
│   │       └── webHelpers.ts
│   ├── api/
│   │   ├── clients/
│   │   │   └── BookingAPIClient.ts
│   │   ├── models/
│   │   │   ├── BookingModel.ts
│   │   │   └── AuthModel.ts
│   │   ├── fixtures/
│   │   │   └── apiTestData.ts
│   │   └── utils/
│   │       ├── apiHelpers.ts
│   │       └── schemaValidator.ts
│   ├── shared/
│   │   └── config/
│   │       └── environment.ts
│   └── utils/
│       └── logger.ts
├── tests/
│   ├── web/
│   │   ├── login.spec.ts
│   │   ├── products.spec.ts
│   │   ├── cart-checkout.spec.ts
│   │   └── e2e-purchase.spec.ts
│   └── api/
│       ├── auth.spec.ts
│       ├── booking-get.spec.ts
│       ├── booking-create-update.spec.ts
│       ├── booking-delete.spec.ts
│       └── e2e-booking.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 5) Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Install
```bash
npm ci
npx playwright install --with-deps
```

### Environment Variables
Create `.env` (optional — defaults exist):
```bash
# Web
SAUCED_USERNAME=standard_user
SAUCED_PASSWORD=secret_sauce
WEB_BASE_URL=https://www.saucedemo.com

# API
API_BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=admin
API_PASSWORD=password123
```

---

## 6) Running Tests

### Run all tests (Web + API)
```bash
npx playwright test --project=all
```

### Run web tests only
```bash
npx playwright test --project=web
```

### Run api tests only
```bash
npx playwright test --project=api
```

### Run headed mode (UI)
```bash
npx playwright test --project=web --headed
```

### Run a specific spec
```bash
npx playwright test tests/web/login.spec.ts --project=web
```

---

## 7) CI/CD Pipeline (GitHub Actions)
Workflows:
- `.github/workflows/web-tests.yml` → Web UI tests
- `.github/workflows/api-tests.yml` → API tests
- `.github/workflows/all-tests.yml` → triggers both

HTML reports are uploaded as artifacts from `playwright-report/`.

---

## 8) Framework Architecture / Design Patterns
### Web UI
- **Page Object Model (POM)**:
  - Each page exposes methods (actions) + locators encapsulated inside page classes.
- Example:
  - `src/web/pages/LoginPage.ts` provides `login()`, `getErrorMessage()`, `isLoginSuccessful()`

### API
- **API Client pattern**:
  - `src/api/clients/BookingAPIClient.ts` wraps API calls using Playwright `APIRequestContext`.
- `src/api/utils/apiHelpers.ts` centralizes common assertions.
- `src/api/utils/schemaValidator.ts` centralizes Ajv schema validation.

---

## 9) Team Onboarding Guide
1. Install dependencies:
   - `npm ci`
   - `npx playwright install --with-deps`
2. Learn structure:
   - Web POM in `src/web/pages`
   - API client in `src/api/clients`
   - Tests in `tests/web` and `tests/api`
3. Add new tests:
   - Create a spec under the correct folder
   - Reuse POM/API client helpers instead of duplicating logic
4. Add new page objects:
   - Only for new UI pages/modules

---

## 10) Best Practices Implemented
- Async/await for all Playwright operations
- Strong typing via TypeScript interfaces
- Modular separation of concerns (pages/clients/utils/fixtures)
- Shared helpers (webHelpers/apiHelpers)
- Parallel execution (`fullyParallel: true`) and retries in CI
- CI artifacts for easy debugging

---

## 11) Troubleshooting
### “Cannot find module @playwright/test”
- Ensure you ran:
  - `npm ci`
  - `npx playwright install --with-deps`

### App navigation failures (Web)
- Use locators that wait for visibility (`expect(locator).toBeVisible()` pattern).

---
