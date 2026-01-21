import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import tArray from '@/lib/tArray';

export default function OptionsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <>
      <h2>{t('refill.discover.options.title')}</h2>
      <p>{t('refill.discover.options.intro')}</p>
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/options.webp`} alt="" />
      </evg-img>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.options.commonItems.title')}
      </h3>
      <p>{t('refill.discover.options.commonItems.description')}</p>
      {['foodDryGoods', 'householdCleaning', 'personalCare'].map((category) => (
        <locator-details
          key={category}
          className="evg-spacing-top-sm evg-spacing-bottom-sm"
        >
          <details>
            <summary className="evg-text-weight-bold">
              {t(`refill.discover.options.categories.${category}.title`)}
              <locator-icon icon="expand" />
            </summary>
            <ul>
              {tArray(
                `refill.discover.options.categories.${category}.content`,
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

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.options.localStore.title')}
      </h3>
      <p>{t('refill.discover.options.localStore.content')}</p>
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/options-secondary.webp`} alt="" />
      </evg-img>

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <locator-icon-link border>
        <Link href={`/${postcode}/refill/discover/benefits`}>
          <locator-icon-circle>
            <locator-icon icon="star" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.discover.options.iconLink.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.discover.options.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <evg-button width="full-width" className="evg-spacing-top-md">
        <Link href={`/${postcode}/refill/discover/sign-up`}>
          {t('refill.discover.options.cta')}
        </Link>
      </evg-button>
    </>
  );
}
