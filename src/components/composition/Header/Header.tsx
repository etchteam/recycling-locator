import { CustomElement } from '@/types/customElement';

interface HeaderSearchAttributes {
  /**
   * If a search is active
   */
  active?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-header': CustomElement;
      'locator-header-content': CustomElement;
      'locator-header-content-wrap': CustomElement;
      'locator-header-logo': CustomElement;
      'locator-header-search': CustomElement<HeaderSearchAttributes>;
    }
  }
}
