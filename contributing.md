# Contributing

Guidelines for contributions to the Recycling Locator codebase.

## Get started

Before starting, you will need access to [recycle locator proxy](https://github.com/etchteam/recycle-locator) and have it running locally. Alternatively, you can use the UAT proxy.

You will also need to install [nix.dev](https://nix.dev/).

Setup your .env

```bash
cp .env.example .env
```

Start the local development server on [https://rl.localhost](https://rl.localhost)

```bash
nix develop --extra-experimental-features nix-command --extra-experimental-features flakes"
```

For component documentation, start storybook on on [http://localhost:6006/](http://localhost:6006/)

```bash
npm run storybook
```

## Folder structure

- index.html - preview page with controls for theme, locale, variant, and start point
- /public - static assets
- /src
  - /components - all locator specific custom elements
  - /lib - general lib functions
  - /styles - global styles
  - /types - global types
  - /pages - app routes using a file naming convention
    - entrypoint.tsx - sets up the app and routes
    - *.loader.ts - data loader for a route
    - *.action.ts - form submission action for a route
    - *.page.tsx - renders as a page on a route
    - *.routes.ts - route definitions
    - *.layout.tsx - wraps a page routes to provide layout
    - /\[route\] - dynamic route segment
  - config.ts - global app config variables
  - index.tsx - registers the recycling-locator web app and renders /pages/entrypoint.tsx
- /tests
  - /unit - unit tests using Vitest
  - /end-to-end - end-to-end tests using Playwright
  - /mocks - shared mock data for tests
  - /utils – shared utilities for tests

## Public asset URLs

All asset URLs must be prefixed with `config.publicPath` so that the asset is loaded via a full publicly accessible web address.

This is because the embedded version of the widget is designed to be placed within the context of third party sites where the assets won't exist.

## Translations

All content changes must have a Welsh equivalent translation.

The translation files can be found under /public/translations.

- en.json – English language (default)
- cy.json – Welsh language

## Tests

The project uses two separate testing frameworks:
- **Vitest** for unit tests
- **Playwright** for end-to-end tests

### Running tests

#### Unit tests

Run unit tests with Vitest:

```bash
# Run all unit tests once
npm run test:unit

# Run unit tests in watch mode with UI
npm run test:unit:ui
```

#### End-to-end tests

Run end-to-end tests with Playwright:

```bash
# Run all Playwright tests
npm run test:end-to-end

# Run Playwright tests with UI
npm run test:test:end-to-end:ui

# Run Playwright tests in debug mode
npm run test:end-to-end:debug
```

Run all tests:

```bash
npm test
```

### Test Structure

#### Unit Tests

Unit tests exist for lib functions in `/tests/unit` using Vitest. These focus on testing individual functions and components in isolation.

#### End-to-End Tests

End-to-end tests exist in `/tests/end-to-end` using Playwright's test runner. These focus on testing full user flows and integration between components.

End-to-end tests use global fixtures (`tests/end-to-end/fixtures.ts`) to initialize the widget and translations.

When writing a new Playwright test:
1. Import test and expect from the fixtures: `import { test, expect } from './fixtures`
2. Use the global i18next instance for translations: `test({ i18n })`
3. Use the global widget instance to locate elements: `test({ widget })`

## wrap-rlw.js

This file exists on the [recycle locator proxy](https://github.com/etchteam/recycle-locator) under `resources/assets/js/widget/index.js`.

Be aware that any changes to routes, may result in knock on changes being needed in this script.

## Preview build

Build a standalone preview site from `index.html`:

```bash
npm run build:preview
```

This outputs to `/preview` and is used for both the GitHub Pages demo and UAT deployments. Set `VITE_BASE_PATH` to configure the base URL (e.g. `/recycling-locator` for GitHub Pages).

## UAT instance

https://rl-uat.recyclenow.com/

Updates will be automatically deployed when merged to the "uat" branch.
