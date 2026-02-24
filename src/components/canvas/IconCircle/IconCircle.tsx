import { CustomElement } from '@/types/customElement';

export interface IconCircleAttributes {
  variant?: 'positive' | 'negative' | 'primary';
  transparent?: boolean;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-icon-circle': CustomElement<IconCircleAttributes>;
    }
  }
}
