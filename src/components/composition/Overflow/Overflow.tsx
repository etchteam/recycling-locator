import { CustomElement } from '@/types/customElement';

export interface OverflowAttributes {
  largeScreen?: boolean;
  wrapCards?: boolean;
  centerXLarge?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-overflow': CustomElement<OverflowAttributes>;
    }
  }
}
