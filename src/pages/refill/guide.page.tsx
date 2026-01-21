import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';

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
    <>
      <h2>{t('refill.discover.guide.title')}</h2>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.guide.steps.title')}
      </h3>
      <locator-steps>
        <ol>
          <li>{t('refill.discover.guide.steps.items.0')}</li>
          <li>{t('refill.discover.guide.steps.items.1')}</li>
          <li>{t('refill.discover.guide.steps.items.2')}</li>
        </ol>
      </locator-steps>
      <evg-img radius="sm" className="evg-spacing-top-md">
        <img src={`${publicPath}images/refill/guide.webp`} alt="" />
      </evg-img>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.guide.simple.title')}
      </h3>
      <p>{t('refill.discover.guide.simple.content.browseFillPay')}</p>
      <p>{t('refill.discover.guide.simple.content.friendlyStaff')}</p>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
        {t('refill.discover.guide.shopping.title')}
      </h3>
      <p>{t('refill.discover.guide.shopping.content')}</p>
      <evg-img radius="sm">
        <img src={`${publicPath}images/refill/guide-secondary.webp`} alt="" />
      </evg-img>
      {questions.map((question) => (
        <locator-details
          key={question}
          className="evg-spacing-top-sm evg-spacing-bottom-sm"
        >
          <details>
            <summary>
              {t(`refill.discover.guide.faq.${question}.question`)}
              <locator-icon icon="expand" />
            </summary>
            <p>
              <span className="evg-text-weight-bold">
                {t(`refill.discover.guide.faq.${question}.answerBold`)}
              </span>{' '}
              {t(`refill.discover.guide.faq.${question}.answer`)}
            </p>
          </details>
        </locator-details>
      ))}

      <hr className="evg-spacing-top-md evg-spacing-bottom-md" />

      <locator-icon-link border>
        <Link href={'/refill/options' + postcodeQuery}>
          <locator-icon-circle>
            <locator-icon
              icon="shopping-cart-add"
              color="primary"
            ></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.discover.guide.nextSection.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.discover.guide.nextSection.description')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
      <evg-button width="full-width" className="evg-spacing-top-md">
        <Link href={'/refill/sign-up' + postcodeQuery}>
          {t('refill.discover.guide.ctaButton')}
        </Link>
      </evg-button>
    </>
  );
}
