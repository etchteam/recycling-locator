import { CustomElement } from '@/types/customElement';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-card-link': CustomElement;
      'locator-card-link-img': CustomElement;
      'locator-card-link-content': CustomElement;
    }
  }
}
