import { CustomElement } from '@/types/customElement';

interface PlacesHeaderSearchAttributes {
  /**
   * If a search is active
   */
  active?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-places-header-search': CustomElement<PlacesHeaderSearchAttributes>;
    }
  }
}
