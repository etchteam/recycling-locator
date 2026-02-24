import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import { usePostcode } from '@/hooks/PostcodeProvider';
import formatPostcode from '@/lib/formatPostcode';

export default function RefillPlacesLayout({
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
          logoHref={`/${postcode}/refill`}
          title={t('refill.homeDelivery.pageTitle')}
          subtitle={formatPostcode(postcode)}
          backFallback={`/${postcode}/refill`}
        />
      </div>
      <div slot="layout-main" id="locator-layout-main">
        {children}
      </div>
    </locator-layout>
  );
}
