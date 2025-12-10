import compact from 'lodash/compact';
import { Suspense } from 'preact/compat';
import register from 'preact-custom-element';

import '@/components/canvas/Hero/Hero';
import '@/components/canvas/Loading/Loading';
import '@/components/content/Icon/Icon';
import { AppStateProvider } from '@/hooks/AppStateProvider';
import { RouterProvider } from '@/hooks/RouterProvider';
import { i18nInit } from '@/lib/i18n';
import '@/lib/sentry';
import StartRoutes from '@/pages/start.routes';

import config from './config';
import { CustomElement } from './types/customElement';
import { Locale } from './types/locale';

export interface RecyclingLocatorAttributes {
  /**
   * The language to use currently only Welsh and English are supported
   */
  readonly locale?: Locale;
  /**
   * How to render
   * - Widget will render as an embed within a page
   * - Standalone will render as a full page and change the browser history upon navigation
   */
  readonly variant?: 'widget' | 'standalone';
  /**
   * The base path for the standalone variant
   */
  readonly basename?: string;
  /**
   * The initial path to load
   * - /{postcode} to pre-fill the location
   * - /home-recycling for home recycling embeds
   * - /material?materials=111&search=Cereal boxes to pre-select a material
   */
  readonly path?: string;
  /**
   * The public URL to load assets from, should end with a /
   * If not provided, jsdelivr CDN will be used
   */
  readonly publicPath?: string;
  /**
   * Sets a preset theme which modifies the primary color
   */
  readonly theme?:
    | 'none'
    | 'green'
    | 'red'
    | 'blue'
    | 'green'
    | 'orange'
    | 'purple'
    | 'brown'
    | 'navy'
    | 'black';
}

/**
 * A flash of this loading fallback often displays before styles or any components have had a
 * chance to load. It'll be swapped out for the actual UI as soon as it's ready.
 */
function Loading() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        // minimum --container-height in case that hasn't loaded yet
        minHeight: '540px',
        // this border will blend in as a fallback in case border styles haven't loaded yet
        border: 'var(--recycling-locator-container-border, 1px solid #cfd1d3)',
        borderRadius: 'var(--recycling-locator-container-border-radius, 0)',
        margin: '-1px -1px 0 -1px',
        boxSizing: 'content-box',
      }}
    />
  );
}

/**
 * The root web component
 * - Registers the recycling-locator custom element
 * - Renders the Preact app within the shadow DOM for style encapsulation
 * - Provides global styles
 * - Init i18n (using suspense to wait for them to load in)
 * - Sets up routing and global app state
 */
export default function RecyclingLocator({
  locale,
  variant = 'widget',
  basename = '/',
  path,
  publicPath = config.publicPath,
  theme = 'green',
}: RecyclingLocatorAttributes) {
  const classes = compact([
    `recycling-locator-variant-${variant}`,
    `theme-preset-${theme}`,
    config.testMode ? 'recycling-locator-test-mode' : undefined,
  ]).join(' ');

  i18nInit(locale, publicPath);

  return (
    <>
      <link rel="stylesheet" href={`${publicPath}styles.css`} />
      <article className={classes}>
        <Suspense fallback={<Loading />}>
          <RouterProvider
            variant={variant}
            basename={basename}
            initialPath={path || '/'}
          >
            <AppStateProvider
              attributes={{
                locale,
                variant,
                basename,
                path,
                publicPath,
                theme,
              }}
            >
              <StartRoutes />
            </AppStateProvider>
          </RouterProvider>
        </Suspense>
      </article>
    </>
  );
}

register(
  RecyclingLocator,
  'recycling-locator',
  ['locale', 'variant', 'basename', 'path', 'public-path', 'theme'],
  {
    shadow: true,
  },
);

declare global {
  interface HTMLElementTagNameMap {
    'recycling-locator': EventSource &
      CustomElement<RecyclingLocatorAttributes>;
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'recycling-locator': CustomElement<RecyclingLocatorAttributes>;
    }
  }
}
