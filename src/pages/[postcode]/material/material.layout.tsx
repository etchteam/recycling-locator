import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import { usePostcode } from '@/hooks/PostcodeProvider';

export default function MaterialLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref={`/${postcode}`}
          title={t('material.title')}
          subtitle={postcode}
          backFallback={`/${postcode}`}
        />
      </div>
      {children}
    </locator-layout>
  );
}
