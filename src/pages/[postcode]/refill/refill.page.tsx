import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';

export default function RefillPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <evg-section padding="md">
        <section className="evg-spacing-bottom-lg">
          <locator-icon-link border className="evg-spacing-top-md">
            <Link href={`/${postcode}/refill/discover`}>
              <locator-icon-circle>
                <locator-icon icon="refill" color="primary"></locator-icon>
              </locator-icon-circle>
              <div>
                <h4 className="text-size-base evg-spacing-bottom-none">
                  {t('postcode.options.refill.title')}
                </h4>
                <p className="evg-text-size-body-xs">
                  {t('postcode.options.refill.description')}
                </p>
              </div>
            </Link>
          </locator-icon-link>
          {/* TODO: Refill locations */}
        </section>
      </evg-section>
      <evg-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <evg-button size="sm" variant="primary">
            <Link href={`/${postcode}/refill/map?${searchParams.toString()}`}>
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </evg-button>
        </locator-fab>
      </evg-enter>
    </locator-wrap>
  );
}
