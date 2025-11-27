import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Section/Section';

export default function BenfitsPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode } = useParams();

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.discover.benefits.title')}</h2>
      <p>{t('refill.discover.benefits.intro')}</p>
      <diamond-card className="theme-positive diamond-spacing-bottom-md" muted>
        <p className="diamond-text-weight-bold diamond-spacing-bottom-none">
          {t('refill.discover.benefits.card.holiday.question')}
        </p>
        <p style={{ textAlign: 'right' }}>
          {t('refill.discover.benefits.card.holiday.answer')}
        </p>

        <p className="diamond-text-weight-bold diamond-spacing-bottom-none">
          {t('refill.discover.benefits.card.hosting.question')}
        </p>
        <p style={{ textAlign: 'right' }}>
          {t('refill.discover.benefits.card.hosting.answer')}
        </p>

        <p className="diamond-text-weight-bold diamond-spacing-bottom-none">
          {t('refill.discover.benefits.card.recipe.question')}
        </p>
        <p style={{ textAlign: 'right' }}>
          {t('refill.discover.benefits.card.recipe.answer')}
        </p>
      </diamond-card>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/benefits.webp`} alt="" />
      </diamond-img>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.benefits.communitySupport.title')}
      </h3>
      <p>{t('refill.discover.benefits.communitySupport.content.chains')}</p>
      <p>{t('refill.discover.benefits.communitySupport.content.community')}</p>
      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />
      <h3 className="diamond-text-size-base diamond-text-weight-bold">
        {t('refill.discover.benefits.withoutRefillStore.title')}
      </h3>
      <p>{t('refill.discover.benefits.withoutRefillStore.intro')}</p>
      <ul>
        <li>
          <span className="diamond-text-weight-bold">
            {t('refill.discover.benefits.withoutRefillStore.buyLoose.title')}
          </span>
          <br aria-hidden="true" />
          <span className="diamond-text-size-sm">
            {t(
              'refill.discover.benefits.withoutRefillStore.buyLoose.description',
            )}
          </span>
        </li>
        <li>
          <span className="diamond-text-weight-bold">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopConcentrate.title',
            )}
          </span>
          <br aria-hidden="true" />
          <span className="diamond-text-size-sm">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopConcentrate.description',
            )}
          </span>
        </li>
        <li>
          <span className="diamond-text-weight-bold">
            {t('refill.discover.benefits.withoutRefillStore.shopOnline.title')}
          </span>
          <br aria-hidden="true" />
          <span className="diamond-text-size-sm">
            {t(
              'refill.discover.benefits.withoutRefillStore.shopOnline.description',
            )}
          </span>
        </li>
      </ul>
      <diamond-img radius>
        <img
          src={`${publicPath}images/refill/benefits-secondary.webp`}
          alt=""
        />
      </diamond-img>

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link
          to={`/${postcode}/refill/discover/options`}
          unstable_viewTransition
        >
          <locator-icon-circle>
            <locator-icon icon="refill" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="diamond-text-size-base diamond-spacing-bottom-none">
              {t('refill.discover.benefits.iconLink.title')}
            </p>
            <p className="diamond-text-size-sm">
              {t('refill.discover.benefits.iconLink.content')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <diamond-button width="full-width" className="diamond-spacing-top-md">
        <Link
          to={`/${postcode}/refill/discover/sign-up`}
          unstable_viewTransition
        >
          {t('refill.discover.benefits.cta')}
        </Link>
      </diamond-button>
    </diamond-section>
  );
}
