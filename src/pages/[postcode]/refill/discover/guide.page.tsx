import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Section/Section';

const questions = [
  'whatCanRefill',
  'doesRefillCostMore',
  'specialContainers',
  'makeDifference',
];

export default function GuidePage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode } = useParams();

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.discover.guide.title')}</h2>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.guide.steps.title')}
      </h3>
      <locator-steps>
        <ol>
          <li>{t('refill.discover.guide.steps.items.0')}</li>
          <li>{t('refill.discover.guide.steps.items.1')}</li>
          <li>{t('refill.discover.guide.steps.items.2')}</li>
        </ol>
      </locator-steps>
      <diamond-img radius className="diamond-spacing-top-md">
        <img src={`${publicPath}images/refill/guide.webp`} alt="" />
      </diamond-img>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.guide.simple.title')}
      </h3>
      <p>{t('refill.discover.guide.simple.content.browseFillPay')}</p>
      <p>{t('refill.discover.guide.simple.content.friendlyStaff')}</p>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.discover.guide.shopping.title')}
      </h3>
      <p>{t('refill.discover.guide.shopping.content')}</p>
      <diamond-img radius>
        <img src={`${publicPath}images/refill/guide-secondary.webp`} alt="" />
      </diamond-img>
      {questions.map((question) => (
        <locator-details
          key={question}
          className="diamond-spacing-top-sm diamond-spacing-bottom-sm"
        >
          <details>
            <summary>
              {t(`refill.discover.guide.faq.${question}.question`)}
              <locator-icon icon="expand" />
            </summary>
            <p>
              <span className="diamond-text-weight-bold">
                {t(`refill.discover.guide.faq.${question}.answerBold`)}
              </span>{' '}
              {t(`refill.discover.guide.faq.${question}.answer`)}
            </p>
          </details>
        </locator-details>
      ))}

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link
          to={`/${postcode}/refill/discover/options`}
          unstable_viewTransition
        >
          <locator-icon-circle>
            <locator-icon
              icon="shopping-cart-add"
              color="primary"
            ></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="diamond-text-size-base diamond-spacing-bottom-none">
              {t('refill.discover.guide.nextSection.title')}
            </p>
            <p className="diamond-text-size-sm">
              {t('refill.discover.guide.nextSection.description')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <diamond-button width="full-width" className="diamond-spacing-top-md">
        <Link
          to={`/${postcode}/refill/discover/sign-up`}
          unstable_viewTransition
        >
          {t('refill.discover.guide.ctaButton')}
        </Link>
      </diamond-button>
    </diamond-section>
  );
}
