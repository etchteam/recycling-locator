import { CustomElement } from '@/types/customElement';

export interface WrapAttributes {
  gutter?: 'fluid';
  'max-width'?: 'none';
  'large-screen-only'?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-wrap': CustomElement<WrapAttributes>;
    }
  }
}
