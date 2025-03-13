import { CustomElement } from '@/types/customElement';

export interface HeroAttributes {
  variant?: 'positive' | 'negative' | 'hazardous';
  size?: 'full' | 'reduced';
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-hero': CustomElement<HeroAttributes>;
    }
  }
}
