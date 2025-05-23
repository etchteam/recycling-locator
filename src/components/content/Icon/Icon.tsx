import { Suspense, lazy } from 'preact/compat';
import register from 'preact-custom-element';

import { captureException } from '@/lib/sentry';
import { CustomElement } from '@/types/customElement';

// The blank svg takes up the same space as an icon would whilst the icon is loading
import BlankSvg from './svg/blank.svg?react';

export interface IconAttributes {
  readonly icon:
    | 'pin'
    | 'info'
    | 'close'
    | 'home'
    | 'distance'
    | 'search'
    | 'map'
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-up'
    | 'warning'
    | 'cross-circle'
    | 'tick-circle'
    | 'tick'
    | 'place'
    | 'place-hwrc'
    | 'external'
    | 'expand'
    | 'list'
    | 'sync'
    | 'menu'
    | 'food'
    | 'garden'
    | 'dry'
    | 'thumb-up'
    | 'thumb-down'
    | 'list-add'
    | 'list-tick';
  readonly color?: 'primary' | 'muted' | 'positive' | 'negative';
  readonly label?: string;
}

export default function Icon({ icon, label }: IconAttributes) {
  if (!icon || (icon as string) === 'undefined') {
    return null;
  }

  const IconSvg = lazy(() => {
    return import(`./svg/${icon}.svg?react`).catch((error) => {
      captureException(error, {
        component: 'IconSvg',
        iconName: icon,
      });
      return Promise.resolve({ default: BlankSvg });
    });
  });

  return (
    <Suspense fallback={BlankSvg}>
      <IconSvg aria-label={label} aria-hidden={!label} />
    </Suspense>
  );
}

register(Icon, 'locator-icon', ['icon', 'label']);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-icon': CustomElement<IconAttributes>;
    }
  }
}
