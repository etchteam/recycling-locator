import { CustomElement } from '@/types/customElement';

export interface OverflowAttributes {
  largeScreen?: boolean;
  wrapCards?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-overflow': CustomElement<OverflowAttributes>;
    }
  }
}
