import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/control/Link/Link';

import '@/components/canvas/ContextHeader/ContextHeader';
import '@/components/canvas/IconCircle/IconCircle';
import '@/components/canvas/Loading/Loading';
import '@/components/canvas/Hero/Hero';
import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import '@/components/content/Icon/Icon';
import '@/components/content/RescueMeRecyclePromo/RescueMeRecyclePromo';
import '@/components/control/IconLink/IconLink';
import '@/components/canvas/LoadingCard/LoadingCard';
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
      <diamond-section padding="lg">
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
        <diamond-section padding="sm">
          <nav className="diamond-spacing-bottom-lg">
            <dl>
              <locator-icon-link border className="diamond-spacing-top-md">
                <Link href={`/${postcode}`}>
                  <locator-icon-circle>
                    <locator-icon icon="search" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <dt>{t('material.title')}</dt>
                    <dd className="diamond-text-size-sm">
                      {t('material.description')}
                    </dd>
                  </div>
                </Link>
              </locator-icon-link>
              <locator-icon-link border className="diamond-spacing-top-md">
                <Link href={`/${postcode}/home`}>
                  <locator-icon-circle>
                    <locator-icon icon="home" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <dt>{t('postcode.options.home.title')}</dt>
                    <dd className="diamond-text-size-sm">
                      {t('postcode.options.home.description')}
                    </dd>
                  </div>
                </Link>
              </locator-icon-link>
            </dl>
          </nav>
        </diamond-section>
      </diamond-section>
    </locator-wrap>
  );
}
