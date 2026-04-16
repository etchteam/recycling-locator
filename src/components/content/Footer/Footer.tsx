import { useTranslation } from 'react-i18next';

import i18n from '@/lib/i18n';
import { CustomElement } from '@/types/customElement';

import recycleLogo from './recycle-logo.svg?raw';
import walesRecyclesLogo from './wales-recycles-logo.svg?raw';

export default function Footer() {
  const { t } = useTranslation();
  const locale = i18n.language;
  const svg = locale === 'cy' ? walesRecyclesLogo : recycleLogo;

  const links = ['privacy', 'cookies', 'accessibility'].map((item) => ({
    href: t(`components.footer.nav.${item}Link`),
    label: t(`components.footer.nav.${item}Label`),
  }));

  return (
    <locator-footer>
      <h2 className="locator-footer-title">
        {t('components.footer.poweredBy')}{' '}
        <div
          role="img"
          aria-label={t('components.footer.recycleNow')}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </h2>
      <p>{t('components.footer.inPartnership')} Valpak</p>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href as string}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </locator-footer>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-footer': CustomElement;
    }
  }
}
