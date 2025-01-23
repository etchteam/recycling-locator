import { CustomElement } from '@/types/customElement';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-container': CustomElement;
      'locator-container-icon': CustomElement;
      'locator-container-name': CustomElement;
      'locator-container-content': CustomElement;
    }
  }
}
