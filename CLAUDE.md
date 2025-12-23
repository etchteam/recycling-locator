# CLAUDE.md

This file provides guidance to AI agents when working with the recycling-locator codebase.

## Project Overview

A web component widget that helps users find places to recycle, refill, or reuse items. Built with Preact and distributed as a custom element `<recycling-locator>` that can be embedded on any website.

## Tech Stack

- **Framework**: Preact (lightweight React alternative)
- **Routing**: Wouter with memory routing (widget) or browser routing (standalone)
- **Styling**: CSS with custom elements, Shadow DOM for encapsulation
- **API Client**: Axios with axios-cache-interceptor for request caching/deduplication
- **State**: Preact Signals for local component state, Context for shared state
- **i18n**: i18next with react-i18next
- **Build**: Vite
- **Testing**: Vitest (unit), Playwright (E2E)

## Common Commands

```bash
npm start          # Start dev server (builds CSS then runs Vite)
npm run build      # Production build
npm run test       # Run unit + E2E tests
npm run test:unit  # Unit tests only
npm run test:end-to-end  # Playwright E2E tests
npm run lint       # ESLint + Stylelint
npm run storybook  # Component documentation
```

## Project Structure

```
src/
├── components/    # Reusable UI components (custom elements)
├── hooks/         # Custom React hooks for data fetching
├── lib/           # Utilities, API client, contexts
├── pages/         # Page components organized by route
│   ├── [postcode]/  # Postcode-scoped routes
│   │   ├── home/    # Home recycling pages
│   │   ├── material/# Material search pages
│   │   └── places/  # Nearby places pages
│   └── refill/      # Refill section pages
├── styles/        # Global CSS
└── types/         # TypeScript type definitions
```

## Key Patterns

### Widget vs Standalone Mode

The widget operates in two modes controlled by the `variant` attribute:
- **widget** (default): Uses memory routing, no browser URL changes, isolated per instance
- **standalone**: Uses browser routing, manages URL history

```html
<recycling-locator variant="widget" path="/EX32 7RB"></recycling-locator>
<recycling-locator variant="standalone" basename="/locator"></recycling-locator>
```

### Data Fetching Hooks

Data fetching uses custom hooks that return `{ loading, data, error }`:

```tsx
function MyComponent({ postcode }) {
  const { data, loading, error } = useLocalAuthority(postcode);

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <Content data={data} />;
}
```

### API Requests

All API requests go through `LocatorApi` singleton with built-in caching:

```tsx
import LocatorApi from '@/lib/LocatorApi';

const data = await LocatorApi.getInstance().get(`local-authority/${postcode}`);
```

### Postcode Validation

Postcodes are validated via `PostCodeResolver` which uses HERE Maps API:

```tsx
import PostCodeResolver from '@/lib/PostcodeResolver';

try {
  const geocode = await PostCodeResolver.getValidGeocodeData(postcode);
  // geocode.items[0].address contains city, state, etc.
} catch (error) {
  // Handle invalid postcode
}
```

### Custom Elements

UI components are registered as custom elements with the `locator-` prefix:

```tsx
// Usage in JSX
<locator-hero size="full">
  <locator-icon icon="recycle" />
  <h3>Title</h3>
</locator-hero>
```

### Form Handling

Forms use standard HTML with async submit handlers:

```tsx
const [, navigate] = useLocation();

async function handleSubmit(e: Event) {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  try {
    const result = await processForm(formData);
    navigate(result.url);
  } catch (error) {
    // Handle error
  }
}

<form onSubmit={handleSubmit}>
```

## Code Style

- Use async/await with try/catch (not .then/.catch)
- Use curly braces for all if statements, even single lines
- Prefer Preact Signals for local component state
- Use TypeScript strict mode
- Follow existing naming conventions:
  - `*.page.tsx` for page components
  - `*.layout.tsx` for layout wrappers
  - `use*.ts` for hooks

## Testing

- Unit tests alongside source files or in `__tests__` directories
- E2E tests in `tests/` directory using Playwright
- Test both widget and standalone modes for routing changes

## Important Notes

- The widget renders in Shadow DOM for style isolation
- Multiple widget instances on the same page must remain independent
- API responses are cached by axios-cache-interceptor - be aware when testing
- Wales and Welsh language
  - `cy-GB` locale is for Wales postcodes using English language
  - `cy` locale is for Welsh language
