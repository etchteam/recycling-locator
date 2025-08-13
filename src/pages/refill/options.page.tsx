import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Section/Section';

export default function OptionsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.options.title')}</h2>
      <p>{t('refill.options.intro')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options.webp`} alt="" />
      </diamond-img>
      <locator-details className="diamond-spacing-top-sm diamond-spacing-bottom-sm">
        <details>
          <summary className="diamond-text-weight-bold">
            {t('refill.options.categories.foodDryGoods.title')}
            <locator-icon icon="expand" />
          </summary>
          <ul>
            {(
              t('refill.options.categories.foodDryGoods.content') as string[]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <locator-highlight className="theme-info">
            <locator-icon-text>
              <locator-icon icon="info" />
              {t('refill.options.categories.foodDryGoods.highlight')}
            </locator-icon-text>
          </locator-highlight>
        </details>
      </locator-details>
      <locator-details className="diamond-spacing-top-sm diamond-spacing-bottom-sm">
        <details>
          <summary className="diamond-text-weight-bold">
            {t('refill.options.categories.householdCleaning.title')}
            <locator-icon icon="expand" />
          </summary>
          <ul>
            {(
              t(
                'refill.options.categories.householdCleaning.content',
              ) as string[]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <locator-highlight className="theme-info">
            <locator-icon-text>
              <locator-icon icon="info" />
              {t('refill.options.categories.householdCleaning.highlight')}
            </locator-icon-text>
          </locator-highlight>
        </details>
      </locator-details>
      <locator-details className="diamond-spacing-top-sm diamond-spacing-bottom-sm">
        <details>
          <summary className="diamond-text-weight-bold">
            {t('refill.options.categories.personalCare.title')}
            <locator-icon icon="expand" />
          </summary>
          <ul>
            {(
              t('refill.options.categories.personalCare.content') as string[]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <locator-highlight className="theme-info">
            <locator-icon-text>
              <locator-icon icon="info" />
              {t('refill.options.categories.personalCare.highlight')}
            </locator-icon-text>
          </locator-highlight>
        </details>
      </locator-details>

      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.options.localStore.title')}
      </h3>
      <p>{t('refill.options.localStore.content')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options-secondary.webp`} alt="" />
      </diamond-img>

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link to={'/refill/benefits' + postcodeQuery}>
          <locator-icon-circle>
            <locator-icon icon="star" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="diamond-text-size-base diamond-spacing-bottom-none">
              {t('refill.options.iconLink.title')}
            </p>
            <p className="diamond-text-size-sm">
              {t('refill.options.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <diamond-button width="full-width" className="diamond-spacing-top-md">
        <Link to={'/refill/sign-up' + postcodeQuery}>
          {t('refill.options.cta')}
        </Link>
      </diamond-button>
    </diamond-section>
  );
}
