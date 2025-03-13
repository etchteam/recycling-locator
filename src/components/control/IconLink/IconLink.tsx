import { CustomElement } from '@/types/customElement';

export interface IconLinkAttributes {
  border?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-icon-link': CustomElement<IconLinkAttributes>;
    }
  }
}
