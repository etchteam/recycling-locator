import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
import i18n from '@/lib/i18n';
import tArray from '@/lib/tArray';
import useAnalytics from '@/lib/useAnalytics';

import { usePostcodeLoaderData } from './postcode.loader';
import { PostcodeAside } from './postcode.page';

export default function RescueMeRecyclePage() {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const { postcode, city } = usePostcodeLoaderData();
  const locale = i18n.language;

  useEffect(() => {
    recordEvent({
      category: 'RescueMeRecyclePromo',
      action: `${city}, ${postcode}`,
    });
  }, [city, postcode, recordEvent]);

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-content>
          <locator-logo locale={locale}></locator-logo>
          <diamond-button variant="text" width="square">
            <Link to={`/${postcode}`}>
              <locator-icon
                icon="close"
                label="Back"
                color="primary"
              ></locator-icon>
            </Link>
          </diamond-button>
        </locator-header-content>
      </locator-header>
      <div slot="layout-main" id="locator-layout-main">
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
                    <Link to={`/${postcode}`} unstable_viewTransition>
                      <locator-icon-circle>
                        <locator-icon
                          icon="search"
                          color="primary"
                        ></locator-icon>
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
                    <Link to={`/${postcode}/home`} unstable_viewTransition>
                      <locator-icon-circle>
                        <locator-icon
                          icon="home"
                          color="primary"
                        ></locator-icon>
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
      </div>
      <div slot="layout-aside" className="display-contents">
        <PostcodeAside postcode={postcode} />
      </div>
    </locator-layout>
  );
}
