import { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import HeaderWithMenu, {
  MenuLayout,
} from '@/components/content/HeaderLayouts/HeaderWithMenu';
import { usePostcode } from '@/hooks/PostcodeProvider';
import formatPostcode from '@/lib/formatPostcode';

export default function RefillLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const { postcode, data: postcodeData } = usePostcode();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithMenu
          logoHref={`/${postcode}`}
          title={t('refill.header.title')}
          subtitle={formatPostcode(postcode)}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
          mainContentId="locator-layout-main"
        >
          {/* TODO: filters? */}
        </HeaderWithMenu>
      </div>
      <div slot="layout-main" id="locator-layout-main">
        <MenuLayout
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          postcode={postcode}
          city={postcodeData?.city}
        >
          {children}
        </MenuLayout>
      </div>
    </locator-layout>
  );
}
