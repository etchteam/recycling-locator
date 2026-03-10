import { useTranslation } from 'react-i18next';

import RefillBrands from '@/components/content/RefillBrands/RefillBrands';
import { useAppState } from '@/hooks/AppStateProvider';

const questions = [
  'whatCanRefill',
  'doesRefillCostMore',
  'specialContainers',
  'makeDifference',
];
const reviewers = [
  'Fiona C',
  'Aidan W',
  'Hamish F',
  'Jen M',
  'Alex K',
  'Helen P',
];

export default function DiscoverRefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();

  return (
    <>
      <h2 className="evg-spacing-bottom-sm">
        {t('refill.discover.intro.title')}
      </h2>
      <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
        <img src={`${publicPath}images/refill/guide.webp`} alt="" />
      </evg-img>

      <h3 className="evg-spacing-top-md">
        {t('refill.discover.intro.howItWorks.title')}
      </h3>
      <p>{t('refill.discover.intro.howItWorks.description')}</p>
      <locator-steps>
        <ol>
          <li>{t('refill.discover.guide.steps.items.0')}</li>
          <li>{t('refill.discover.guide.steps.items.1')}</li>
          <li>{t('refill.discover.guide.steps.items.2')}</li>
        </ol>
      </locator-steps>

      <h3 className="evg-spacing-top-lg">
        {t('refill.discover.intro.reasonsTitle')}
      </h3>
      <evg-grid wrap="wrap" className="evg-spacing-bottom-md">
        <evg-grid-item mobile="12" tablet="6">
          <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
            <img src={`${publicPath}images/refill/options.webp`} alt="" />
          </evg-img>
          <h4 className="evg-spacing-top-sm">
            {t('refill.discover.options.title')}
          </h4>
          <p>{t('refill.discover.intro.reasons.moreChoice.description')}</p>
        </evg-grid-item>
        <evg-grid-item mobile="12" tablet="6">
          <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
            <img
              src={`${publicPath}images/refill/options-secondary.webp`}
              alt=""
            />
          </evg-img>
          <h4 className="evg-spacing-top-sm">
            {t('refill.discover.intro.reasons.localStore.title')}
          </h4>
          <p>{t('refill.discover.intro.reasons.localStore.description')}</p>
        </evg-grid-item>
        <evg-grid-item mobile="12" tablet="6">
          <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
            <img
              src={`${publicPath}images/refill/guide-secondary.webp`}
              alt=""
            />
          </evg-img>
          <h4 className="evg-spacing-top-sm">
            {t('refill.discover.intro.reasons.skipUnpacking.title')}
          </h4>
          <p>{t('refill.discover.intro.reasons.skipUnpacking.description')}</p>
        </evg-grid-item>
        <evg-grid-item mobile="12" tablet="6">
          <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
            <img src={`${publicPath}images/refill/benefits.webp`} alt="" />
          </evg-img>
          <h4 className="evg-spacing-top-sm">
            {t('refill.discover.guide.simple.title')}
          </h4>
          <p>{t('refill.discover.benefits.intro')}</p>
        </evg-grid-item>
        <evg-grid-item mobile="12" tablet="6" fill="true">
          <evg-card className="theme-positive-muted">
            <evg-card-content>
              <h3>{t('refill.discover.intro.reduceWaste.title')}</h3>
              <ul>
                <li>
                  <span className="evg-text-weight-bold">
                    {t('refill.discover.intro.reduceWaste.items.0.bold')}
                  </span>{' '}
                  {t('refill.discover.intro.reduceWaste.items.0.text')}
                </li>
                <li>
                  {t('refill.discover.intro.reduceWaste.items.1.preText')}{' '}
                  <span className="evg-text-weight-bold">
                    {t('refill.discover.intro.reduceWaste.items.1.bold')}
                  </span>
                </li>
                <li>
                  <span className="evg-text-weight-bold">
                    {t('refill.discover.intro.reduceWaste.items.2.bold')}
                  </span>{' '}
                  {t('refill.discover.intro.reduceWaste.items.2.text')}
                </li>
              </ul>
            </evg-card-content>
          </evg-card>
        </evg-grid-item>
        <evg-grid-item mobile="12" tablet="6" fill="true">
          <evg-card className="theme-info">
            <evg-card-content>
              <h3>{t('refill.discover.intro.saveMoney.title')}</h3>
              <ul>
                <li>{t('refill.discover.intro.saveMoney.items.0')}</li>
                <li>{t('refill.discover.intro.saveMoney.items.1')}</li>
                <li>{t('refill.discover.intro.saveMoney.items.2')}</li>
              </ul>
            </evg-card-content>
          </evg-card>
        </evg-grid-item>
      </evg-grid>

      <RefillBrands
        title={t('refill.brands.guideTitle')}
        companyNames={[
          'sesi',
          'milkAndMore',
          'abelAndCole',
          'ocado',
          'faithInNature',
          'bioD',
        ]}
      />

      <h3 className="evg-spacing-top-lg">
        {t('refill.discover.reviews.title')}
      </h3>
      <locator-overflow largeScreen>
        <ul>
          {reviewers.map((reviewer) => (
            <li key={reviewer}>
              <evg-card className="theme-info" padding="sm">
                <evg-card-content>
                  <evg-row gap="sm">
                    <h4 className="evg-spacing-bottom-none">{reviewer}</h4>
                  </evg-row>
                  <p>{t(`refill.discover.reviews.testimonials.${reviewer}`)}</p>
                </evg-card-content>
              </evg-card>
            </li>
          ))}
        </ul>
      </locator-overflow>

      <h3>{t('refill.discover.intro.gotAQuestion')}</h3>
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

      <h3 className="evg-spacing-top-lg">
        {t('refill.discover.intro.moreWays.title')}
      </h3>
      <p>{t('refill.discover.intro.moreWays.description')}</p>
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
      </ul>
    </>
  );
}
