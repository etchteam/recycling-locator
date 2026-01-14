import register from 'preact-custom-element';

import { CustomElement } from '@/types/customElement';
import { Locale } from '@/types/locale';

import LogoSvg from './logo.svg?react';

export interface LogoAttributes {
  readonly type?: 'icon-only';
  readonly locale?: Locale;
}

export default function Logo() {
  return <LogoSvg />;
}

register(Logo, 'locator-logo', ['type', 'locale']);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-logo': CustomElement<LogoAttributes>;
    }
  }
}
