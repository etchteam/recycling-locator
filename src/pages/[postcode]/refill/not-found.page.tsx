import { useState } from 'preact/hooks';

import About from '@/components/content/About/About';
import HeaderWithInfoButton from '@/components/content/HeaderLayouts/HeaderWithInfoButton';
import NotFoundOptions from '@/components/content/NotFoundOptions/NotFoundOptions';

export default function RefillNotFoundPage() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithInfoButton
          logoHref="/refill"
          infoOpen={infoOpen}
          onToggleInfo={() => setInfoOpen(!infoOpen)}
          mainContentId="locator-layout-main"
        />
      </div>
      <div slot="layout-main" id="locator-layout-main">
        <locator-wrap>
          <evg-section padding="lg">
            {infoOpen ? <About /> : <NotFoundOptions variant="refill" />}
          </evg-section>
        </locator-wrap>
      </div>
    </locator-layout>
  );
}
