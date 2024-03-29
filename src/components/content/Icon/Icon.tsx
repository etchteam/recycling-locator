import { Suspense, lazy } from 'preact/compat';
import register from 'preact-custom-element';

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
    | 'warning'
    | 'cross-circle'
    | 'tick-circle'
    | 'tick'
    | 'place'
    | 'external'
    | 'expand'
    | 'list'
    | 'sync'
    | 'menu';
  readonly color?: 'primary' | 'muted' | 'positive' | 'negative';
  readonly label?: string;
}

export default function Icon({ icon, label }: IconAttributes) {
  const IconSvg = lazy(() => import(`./svg/${icon}.svg?react`));

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
