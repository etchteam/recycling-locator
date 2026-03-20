import { CustomElement } from '@/types/customElement';

export interface OverflowAttributes {
  largeScreen?: boolean;
  wrapCards?: boolean;
  centerXLarge?: boolean;
}

let counter = 0;

class LocatorOverflow extends HTMLElement {
  connectedCallback() {
    this.style.setProperty('--anchor-name', `--carousel-${++counter}`);
  }
}

customElements.define('locator-overflow', LocatorOverflow);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-overflow': CustomElement<OverflowAttributes>;
    }
  }
}
