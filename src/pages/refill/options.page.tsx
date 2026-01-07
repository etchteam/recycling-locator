import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';
import tArray from '@/lib/tArray';

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
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/options.webp`} alt="" />
      </evg-img>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.options.commonItems.title')}
      </h3>
      <p>{t('refill.options.commonItems.description')}</p>
      {['foodDryGoods', 'householdCleaning', 'personalCare'].map((category) => (
        <locator-details
          key={category}
          className="evg-spacing-top-sm evg-spacing-bottom-sm"
        >
          <details>
            <summary className="evg-text-weight-bold">
              {t(`refill.options.categories.${category}.title`)}
              <locator-icon icon="expand" />
            </summary>
            <ul>
              {tArray(`refill.options.categories.${category}.content`).map(
                (item) => (
                  <li key={item}>{item}</li>
                ),
              )}
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

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.options.localStore.title')}
      </h3>
      <p>{t('refill.options.localStore.content')}</p>
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/options-secondary.webp`} alt="" />
      </evg-img>

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <locator-icon-link border>
        <Link href={'/refill/benefits' + postcodeQuery}>
          <locator-icon-circle>
            <locator-icon icon="star" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.options.iconLink.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.options.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <evg-button width="full-width" className="evg-spacing-top-md">
        <Link href={'/refill/sign-up' + postcodeQuery}>
          {t('refill.options.cta')}
        </Link>
      </evg-button>
    </>
  );
}
