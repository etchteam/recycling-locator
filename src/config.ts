/*
 * import.meta.env can be unreliable in some environments, such as tests.
 * This function falls back to process.env for those cases.
 */
function envVar(varName: string, defaultValue?: string) {
  return import.meta?.env?.[varName] ?? process?.env?.[varName] ?? defaultValue;
}

const LOCATOR_API = envVar(
  'VITE_RECYCLING_LOCATOR_API',
  'https://rl.recyclenow.com/widget/',
);
const hostname =
  typeof window !== 'undefined' ? window?.location?.hostname : 'localhost'; // Can be undefined in tests

const config = {
  hostname,
  packageVersion: envVar('VITE_PACKAGE_VERSION', '1.0.0'),
  publicPath: envVar('VITE_PUBLIC_PATH', '/'),
  mapsPlacesKey: envVar('VITE_HERE_MAPS_PLACES_KEY'),
  enableAnalytics: envVar('VITE_ENABLE_ANALYTICS') === 'true',
  locatorApiPath: `${LOCATOR_API}${encodeURIComponent(hostname)}/`,
  locatorAnalyticsPath: `${LOCATOR_API}analytics/record`,
  testMode: envVar('VITE_TEST') === 'true',
};

export default config;
