import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';

import '@etchteam/diamond-ui/canvas/Section/Section';

export default function OptionsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <>
      <h2>{t('refill.options.title')}</h2>
      <p>{t('refill.options.intro')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options.webp`} alt="" />
      </diamond-img>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.options.commonItems.title')}
      </h3>
      <p>{t('refill.options.commonItems.description')}</p>
      {['foodDryGoods', 'householdCleaning', 'personalCare'].map((category) => (
        <locator-details
          key={category}
          className="diamond-spacing-top-sm diamond-spacing-bottom-sm"
        >
          <details>
            <summary className="diamond-text-weight-bold">
              {t(`refill.options.categories.${category}.title`)}
              <locator-icon icon="expand" />
            </summary>
            <ul>
              {(
                t(`refill.options.categories.${category}.content`) as string[]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <locator-highlight className="theme-info">
              <locator-icon-text>
                <locator-icon icon="info" />
                {t(`refill.options.categories.${category}.highlight`)}
              </locator-icon-text>
            </locator-highlight>
          </details>
        </locator-details>
      ))}

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.options.localStore.title')}
      </h3>
      <p>{t('refill.options.localStore.content')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/options-secondary.webp`} alt="" />
      </diamond-img>

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link href={'/refill/benefits' + postcodeQuery}>
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
        <Link href={'/refill/sign-up' + postcodeQuery}>
          {t('refill.options.cta')}
        </Link>
      </diamond-button>
    </>
  );
}
