import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from '@sentry/browser';

import config from '@/config';

const DSN = import.meta.env.VITE_SENTRY_DSN;

// filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(
    defaultIntegration.name,
  );
});

const client = new BrowserClient({
  enabled: Boolean(DSN),
  dsn: DSN,
  release: `recycling-locator@${config.packageVersion}`,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations,
});

/**
 * Use a scope to isolate the error context from any parent sites.
 *
 * When capturing errors or messages, any tags or extras set will need
 * to be cleared after the error is sent to Sentry, to attempt to avoid
 * leaking information between different errors and messages. Use the
 * `.clear()` method to achieve this.
 */
const scope = new Scope();

scope.setClient(client);
client.init();

export function captureException(
  error: unknown,
  tags: { [key: string]: string },
  extras?: { [key: string]: unknown },
): void {
  console.error(error, { tags, extras });
  scope.setTags(tags);

  if (extras) {
    scope.setExtras(extras);
  }

  scope.captureException(error);
  scope.clear();
}

export default scope;
