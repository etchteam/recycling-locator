import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Section/Section';

export default function OptionsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode } = useParams();

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.discover.options.title')}</h2>
      <p>{t('refill.discover.options.intro')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options.webp`} alt="" />
      </diamond-img>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.options.commonItems.title')}
      </h3>
      <p>{t('refill.discover.options.commonItems.description')}</p>
      {['foodDryGoods', 'householdCleaning', 'personalCare'].map((category) => (
        <locator-details
          key={category}
          className="diamond-spacing-top-sm diamond-spacing-bottom-sm"
        >
          <details>
            <summary className="diamond-text-weight-bold">
              {t(`refill.discover.options.categories.${category}.title`)}
              <locator-icon icon="expand" />
            </summary>
            <ul>
              {(
                t(
                  `refill.discover.options.categories.${category}.content`,
                ) as string[]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <locator-highlight className="theme-info">
              <locator-icon-text>
                <locator-icon icon="info" />
                {t(`refill.discover.options.categories.${category}.highlight`)}
              </locator-icon-text>
            </locator-highlight>
          </details>
        </locator-details>
      ))}

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.options.localStore.title')}
      </h3>
      <p>{t('refill.discover.options.localStore.content')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options-secondary.webp`} alt="" />
      </diamond-img>

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link to={`/${postcode}/refill/discover/benefits`}>
          <locator-icon-circle>
            <locator-icon icon="star" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="diamond-text-size-base diamond-spacing-bottom-none">
              {t('refill.discover.options.iconLink.title')}
            </p>
            <p className="diamond-text-size-sm">
              {t('refill.discover.options.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <diamond-button width="full-width" className="diamond-spacing-top-md">
        <Link to={`/${postcode}/refill/discover/sign-up`}>
          {t('refill.discover.options.cta')}
        </Link>
      </diamond-button>
    </diamond-section>
  );
}
