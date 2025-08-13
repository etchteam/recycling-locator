import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

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

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.guide.title')}</h2>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.guide.steps.title')}
      </h3>
      <locator-steps>
        <ol>
          <li>{t('refill.guide.steps.items.0')}</li>
          <li>{t('refill.guide.steps.items.1')}</li>
          <li>{t('refill.guide.steps.items.2')}</li>
        </ol>
      </locator-steps>
      <diamond-img radius className="diamond-spacing-top-md">
        <img src={`${publicPath}images/refill/guide.webp`} alt="" />
      </diamond-img>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.guide.simple.title')}
      </h3>
      <p>{t('refill.guide.simple.content.browseFillPay')}</p>
      <p>{t('refill.guide.simple.content.friendlyStaff')}</p>
      <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
        {t('refill.guide.shopping.title')}
      </h3>
      <p>{t('refill.guide.shopping.content')}</p>
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
              {t(`refill.guide.faq.${question}.question`)}
              <locator-icon icon="expand" />
            </summary>
            <p>
              <span className="diamond-text-weight-bold">
                {t(`refill.guide.faq.${question}.answerBold`)}
              </span>{' '}
              {t(`refill.guide.faq.${question}.answer`)}
            </p>
          </details>
        </locator-details>
      ))}

      <hr className="diamond-spacing-top-md diamond-spacing-bottom-md" />

      <locator-icon-link border>
        <Link to={'/refill/options' + postcodeQuery} unstable_viewTransition>
          <locator-icon-circle>
            <locator-icon
              icon="shopping-cart-add"
              color="primary"
            ></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="diamond-text-size-base diamond-spacing-bottom-none">
              {t('refill.guide.nextSection.title')}
            </p>
            <p className="diamond-text-size-sm">
              {t('refill.guide.nextSection.description')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <diamond-button width="full-width" className="diamond-spacing-top-md">
        <Link to={'/'} unstable_viewTransition>
          {t('refill.guide.ctaButton')}
        </Link>
      </diamond-button>
    </diamond-section>
  );
}
