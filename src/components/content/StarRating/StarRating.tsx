import { CustomElement } from '@/types/customElement';

export interface StarRatingAttributes {
  rating?: 0 | 1 | 2 | 3 | 4 | 5;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-star-rating': CustomElement<StarRatingAttributes>;
    }
  }
}
