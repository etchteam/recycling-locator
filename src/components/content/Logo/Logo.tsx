import register from 'preact-custom-element';

import config from '@/config';
import { CustomElement } from '@/types/customElement';

export default function Logo() {
  return (
    <img
      src={`${config.imagePath}recycling-locator-logo.webp`}
      alt="Recycling Locator"
      width="230"
      height="42"
    />
  );
}

register(Logo, 'locator-logo');

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-logo': CustomElement;
    }
  }
}
