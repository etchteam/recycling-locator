import register from 'preact-custom-element';

import { captureException } from '@/lib/sentry';
import { CustomElement } from '@/types/customElement';

import icons from './icons';

export interface IconAttributes {
  readonly icon:
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-outward'
    | 'arrow-up'
    | 'call'
    | 'cleaning'
    | 'close'
    | 'collection'
    | 'cross-circle'
    | 'distance'
    | 'docs'
    | 'doorstep-collection'
    | 'dry'
    | 'expand'
    | 'external'
    | 'food'
    | 'garden'
    | 'home'
    | 'home-pin'
    | 'info'
    | 'link'
    | 'list-add'
    | 'list-tick'
    | 'list'
    | 'map'
    | 'menu'
    | 'mixed-food'
    | 'personal-care'
    | 'pin'
    | 'place-hwrc'
    | 'place'
    | 'recycle'
    | 'refill'
    | 'refill-all'
    | 'schedule'
    | 'search'
    | 'star'
    | 'shopping-cart-add'
    | 'sync'
    | 'thumb-down'
    | 'thumb-up'
    | 'tick-circle'
    | 'tick'
    | 'warning'
    | 'web-link';
  readonly color?: 'primary' | 'muted' | 'positive' | 'negative' | 'white';
  readonly label?: string;
}

function addSvgA11y(svg: string, label?: string): string {
  const escapedLabel = label
    ?.replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;');
  const ariaAttrs = escapedLabel
    ? ` role="img" aria-label="${escapedLabel}"`
    : ' aria-hidden="true"';

  return svg.replace('<svg', `<svg${ariaAttrs}`);
}

export default function Icon({ icon, label }: IconAttributes) {
  if (!icon || (icon as string) === 'undefined') {
    return null;
  }

  const svg = icons[icon];

  if (!svg) {
    captureException(new Error(`Missing icon: ${icon}`), {
      component: 'Icon',
      iconName: icon,
    });
    return null;
  }

  return <span dangerouslySetInnerHTML={{ __html: addSvgA11y(svg, label) }} />;
}

register(Icon, 'locator-icon', ['icon', 'label']);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-icon': CustomElement<IconAttributes>;
    }
  }
}
