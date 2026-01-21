import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';

export default function BenfitsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <>
      <h2>{t('refill.discover.benefits.title')}</h2>
      <p>{t('refill.discover.benefits.intro')}</p>
      <evg-card className="theme-positive-muted evg-spacing-bottom-md">
        <evg-card-content>
          {['holiday', 'hosting', 'recipe'].map((activity) => (
            <evg-grid
              key={activity}
              className="evg-spacing-bottom-sm"
              justifyContent="space-between"
              wrap="wrap"
              gap="xs"
            >
              <evg-grid-item grow>
                <p className="evg-text-weight-bold">
                  {t(`refill.discover.benefits.card.${activity}.question`)}
                </p>
              </evg-grid-item>
              <evg-grid-item>
                <p className="evg-text-align-right">
                  {t(`refill.discover.benefits.card.${activity}.answer`)}
                </p>
              </evg-grid-item>
            </evg-grid>
          ))}
        </evg-card-content>
      </evg-card>
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/benefits.webp`} alt="" />
      </evg-img>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.benefits.communitySupport.title')}
      </h3>
      <p>{t('refill.discover.benefits.communitySupport.content.chains')}</p>
      <p>{t('refill.discover.benefits.communitySupport.content.community')}</p>
      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />
      <h3 className="text-size-base evg-text-weight-bold">
        {t('refill.discover.benefits.withoutRefillStore.title')}
      </h3>
      <p>{t('refill.discover.benefits.withoutRefillStore.intro')}</p>
      <ul>
        <li>
          <span className="evg-text-weight-bold">
            {t('refill.discover.benefits.withoutRefillStore.buyLoose.title')}
          </span>
          <br aria-hidden="true" />
          <span className="evg-text-size-body-xs">
            {t(
              'refill.discover.benefits.withoutRefillStore.buyLoose.description',
            )}
          </span>
        </li>
        <li>
          <span className="evg-text-weight-bold">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopConcentrate.title',
            )}
          </span>
          <br aria-hidden="true" />
          <span className="evg-text-size-body-xs">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopConcentrate.description',
            )}
          </span>
        </li>
        <li>
          <span className="evg-text-weight-bold">
            {t('refill.discover.benefits.withoutRefillStore.shopOnline.title')}
          </span>
          <br aria-hidden="true" />
          <span className="evg-text-size-body-xs">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopOnline.description',
            )}
          </span>
        </li>
      </ul>
      <evg-img radius="sm">
        <img
          src={`${publicPath}images/refill/benefits-secondary.webp`}
          alt=""
        />
      </evg-img>

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <locator-icon-link border>
        <Link href={'/refill/options' + postcodeQuery}>
          <locator-icon-circle>
            <locator-icon icon="refill" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.discover.benefits.iconLink.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.discover.benefits.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <evg-button width="full-width" className="evg-spacing-top-md">
        <Link href={'/refill/sign-up' + postcodeQuery}>
          {t('refill.discover.benefits.cta')}
        </Link>
      </evg-button>
    </>
  );
}
