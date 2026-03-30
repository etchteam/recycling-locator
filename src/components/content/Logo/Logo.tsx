import register from 'preact-custom-element';
import { useTranslation } from 'react-i18next';

import { CustomElement } from '@/types/customElement';
import { Locale } from '@/types/locale';

import logoSvg from './logo.svg?raw';
import refillLogoSvg from './refill-logo.svg?raw';

export interface LogoAttributes {
  readonly type?: 'icon-only';
  readonly locale?: Locale;
  readonly variant?: 'refill';
}

export default function Logo({
  type,
  variant,
}: Readonly<Pick<LogoAttributes, 'type' | 'variant'>>) {
  const { t } = useTranslation();

  if (variant === 'refill') {
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: refillLogoSvg }} />
        {type !== 'icon-only' && (
          <span className="locator-logo-text">{t('refill.header.title')}</span>
        )}
      </>
    );
  }

  return <span dangerouslySetInnerHTML={{ __html: logoSvg }} />;
}

register(Logo, 'locator-logo', ['type', 'locale', 'variant']);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-logo': CustomElement<LogoAttributes>;
    }
  }
}
