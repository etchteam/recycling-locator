import { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter-preact';

import About from '@/components/content/About/About';
import HeaderWithInfoButton from '@/components/content/HeaderLayouts/HeaderWithInfoButton';
import TipContent from '@/components/content/TipContent/TipContent';
import { useAppState } from '@/hooks/AppStateProvider';
import { useTip } from '@/hooks/useTip';

export function DefaultTip() {
  const { publicPath } = useAppState();
  const generalTipImgSrc = `${publicPath}images/general-tip.svg`;

  return (
    <locator-tip type="image">
      <locator-wrap>
        <img src={generalTipImgSrc} alt="" />
      </locator-wrap>
    </locator-tip>
  );
}

export function LoadingTip() {
  return (
    <locator-tip>
      <locator-wrap></locator-wrap>
    </locator-tip>
  );
}

export function DefaultAside() {
  const [location] = useLocation();
  const { data: tip, loading } = useTip({ path: location });

  if (loading) {
    return <LoadingTip />;
  }

  return tip ? (
    <locator-tip type="promo" text-align="center">
      <locator-wrap>
        <TipContent tip={tip} />
      </locator-wrap>
    </locator-tip>
  ) : (
    <DefaultTip />
  );
}

export function NotFoundAside() {
  const { t } = useTranslation();

  const links = [
    {
      href: 'https://www.gov.im/categories/home-and-neighbourhood/recycling/recycling-locations/',
      label: t('notFound.aside.isleOfMan'),
    },
    {
      href: 'https://www.gov.je/Environment/WasteReduceReuseRecycle/pages/default.aspx',
      label: t('notFound.aside.jersey'),
    },
    {
      href: 'https://www.gov.gg/recycling',
      label: t('notFound.aside.guernsey'),
    },
  ];

  return (
    <locator-tip>
      <locator-wrap>
        <p>{t('notFound.aside.content')}</p>
        <ul>
          {links.map(({ href, label }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </locator-wrap>
    </locator-tip>
  );
}

export default function StartLayout({
  children,
}: {
  readonly children: ComponentChildren;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [location] = useLocation();
  const isNotFoundPage = !['/', '/home-recycling', '/material'].includes(
    location,
  );

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithInfoButton
          infoOpen={infoOpen}
          onToggleInfo={() => setInfoOpen(!infoOpen)}
        />
      </div>
      <div slot="layout-main" id="locator-layout-main">
        <locator-wrap>
          <evg-section padding="lg">
            {infoOpen ? <About /> : children}
          </evg-section>
        </locator-wrap>
      </div>
      <div slot="layout-aside" className="display-contents">
        {isNotFoundPage ? <NotFoundAside /> : <DefaultAside />}
      </div>
    </locator-layout>
  );
}
