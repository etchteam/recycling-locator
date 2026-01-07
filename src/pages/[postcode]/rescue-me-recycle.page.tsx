import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import tArray from '@/lib/tArray';

export default function RescueMeRecyclePage() {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const { data: postcodeData } = usePostcode();
  const postcode = postcodeData?.postcode || '';
  const city = postcodeData?.city || '';

  useEffect(() => {
    recordEvent({
      category: 'RescueMeRecyclePromo',
      action: `${city}, ${postcode}`,
    });
  }, [city, postcode, recordEvent]);

  return (
    <locator-wrap>
      <evg-section padding="lg">
        <h2>{t('rescueMeRecycle.title')}</h2>
        <p>{t('rescueMeRecycle.intro')}</p>
        <h3>{t('rescueMeRecycle.statsTitle')}</h3>
        <ul>
          {tArray('rescueMeRecycle.stats').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>{t('rescueMeRecycle.ctaTitle')}</h3>
        <p>{t('rescueMeRecycle.ctaText')}</p>
        <evg-section padding="sm">
          <ul role="list" className="list-style-none">
            <li>
              <locator-icon-link border className="evg-spacing-top-md">
                <Link href={`/${postcode}`}>
                  <locator-icon-circle>
                    <locator-icon icon="search" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <h4 className="text-size-base evg-spacing-bottom-none">
                      {t('material.title')}
                    </h4>
                    <p className="evg-text-size-body-xs">
                      {t('material.description')}
                    </p>
                  </div>
                </Link>
              </locator-icon-link>
            </li>
            <li>
              <locator-icon-link border className="evg-spacing-top-md">
                <Link href={`/${postcode}/home`}>
                  <locator-icon-circle>
                    <locator-icon icon="home" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <h4 className="text-size-base evg-spacing-bottom-none">
                      {t('postcode.options.home.title')}
                    </h4>
                    <p className="evg-text-size-body-xs">
                      {t('postcode.options.home.description')}
                    </p>
                  </div>
                </Link>
              </locator-icon-link>
            </li>
          </ul>
        </evg-section>
      </evg-section>
    </locator-wrap>
  );
}
