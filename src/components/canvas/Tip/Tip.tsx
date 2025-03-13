import { CustomElement } from '@/types/customElement';

export interface TipAttributes {
  type?: 'image' | 'promo';
  wrap?: 'wrap';
  'text-align'?: 'center';
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-tip': CustomElement<TipAttributes>;
      'locator-tip-content': CustomElement;
    }
  }
}
