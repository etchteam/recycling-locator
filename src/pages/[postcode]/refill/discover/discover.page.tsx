import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import RefillBrands from '@/components/content/RefillBrands/RefillBrands';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillLocations } from '@/hooks/useRefillLocations';
import tArray from '@/lib/tArray';

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
const reasons = ['moreChoice', 'localStore', 'skipUnpacking', 'simple'];
const moreWaysItems = ['buyLoose', 'shopConcentrate'];

export default function DiscoverRefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const { postcode } = usePostcode();

  const { data: refillLocations, loading: locationsLoading } =
    useRefillLocations();

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref="/refill"
          title={t('refill.header.title')}
          subtitle={postcode}
          backFallback={`/${postcode}/refill`}
        />
      </div>
      <div slot="layout-main" id="locator-layout-main">
        <locator-wrap max-width="extra-wide" gutter="fluid">
          <evg-section padding="lg">
            <h2 className="evg-spacing-bottom-sm">
              {t('refill.discover.title')}
            </h2>
            <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
              <img src={`${publicPath}images/refill/hero.webp`} alt="" />
            </evg-img>

            <h3 className="evg-spacing-top-md">
              {t('refill.discover.steps.title')}
            </h3>
            <p>{t('refill.discover.steps.description')}</p>
            <locator-steps>
              <ol>
                {tArray('refill.discover.steps.items').map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </locator-steps>

            <h3 className="evg-spacing-top-lg">
              {t('refill.discover.reasons.title')}
            </h3>
            <evg-grid wrap="wrap" className="evg-spacing-bottom-md">
              {reasons.map((key) => (
                <evg-grid-item key={key} mobile="12" tablet="6">
                  <evg-img radius="sm" aspect-ratio="2/1" object-fit="cover">
                    <img
                      src={`${publicPath}images/refill/${key}.webp`}
                      alt=""
                    />
                  </evg-img>
                  <h4 className="evg-spacing-top-sm">
                    {t(`refill.discover.reasons.${key}.title`)}
                  </h4>
                  <p>{t(`refill.discover.reasons.${key}.description`)}</p>
                </evg-grid-item>
              ))}
              <evg-grid-item mobile="12" tablet="6" fill="true">
                <evg-card className="theme-positive-muted">
                  <evg-card-content>
                    <h3>{t('refill.discover.reduceWaste.title')}</h3>
                    <ul>
                      {tArray('refill.discover.reduceWaste.items').map(
                        (item) => (
                          <li key={item}>
                            <Trans
                              i18nKey={item}
                              components={{
                                bold: <span className="evg-text-weight-bold" />,
                              }}
                            />
                          </li>
                        ),
                      )}
                    </ul>
                  </evg-card-content>
                </evg-card>
              </evg-grid-item>
              <evg-grid-item mobile="12" tablet="6" fill="true">
                <evg-card className="theme-info">
                  <evg-card-content>
                    <h3>{t('refill.discover.saveMoney.title')}</h3>
                    <ul>
                      {tArray('refill.discover.saveMoney.items').map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </evg-card-content>
                </evg-card>
              </evg-grid-item>
            </evg-grid>

            <RefillBrands
              title={t('refill.discover.brands.title')}
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
                          <h4 className="evg-spacing-bottom-none">
                            {reviewer}
                          </h4>
                        </evg-row>
                        <p>
                          {t(
                            `refill.discover.reviews.testimonials.${reviewer}`,
                          )}
                        </p>
                      </evg-card-content>
                    </evg-card>
                  </li>
                ))}
              </ul>
            </locator-overflow>

            <h3>{t('refill.discover.title')}</h3>
            {questions.map((question) => (
              <locator-details
                key={question}
                className="evg-spacing-top-sm evg-spacing-bottom-sm"
              >
                <details>
                  <summary>
                    {t(`refill.discover.faq.${question}.question`)}
                    <locator-icon icon="expand" />
                  </summary>
                  <p>
                    <span className="evg-text-weight-bold">
                      {t(`refill.discover.faq.${question}.answerBold`)}
                    </span>{' '}
                    {t(`refill.discover.faq.${question}.answer`)}
                  </p>
                </details>
              </locator-details>
            ))}

            <h3 className="evg-spacing-top-lg">
              {t('refill.discover.moreWays.title')}
            </h3>
            <p>{t('refill.discover.moreWays.description')}</p>
            <ul>
              {moreWaysItems.map((item) => (
                <li key={item}>
                  <span className="evg-text-weight-bold">
                    {t(`refill.discover.moreWays.${item}.title`)}
                  </span>
                  <br aria-hidden="true" />
                  <span className="evg-text-size-body-xs">
                    {t(`refill.discover.moreWays.${item}.description`)}
                  </span>
                </li>
              ))}
            </ul>
          </evg-section>
          {!locationsLoading && (
            <evg-section>
              <locator-tip wrap="wrap" type="image">
                <img src="/images/refill/refill-tip.webp" alt="" />
                {refillLocations?.items?.length > 0 ? (
                  <locator-tip-content>
                    <h2>{t('refill.discover.tip.withLocations.title')}</h2>
                    <p>{t('refill.discover.tip.withLocations.description')}</p>
                    <evg-button>
                      <Link href={`/${postcode}/refill/`}>
                        {t('refill.discover.tip.withLocations.cta', {
                          count: refillLocations?.items?.length,
                        })}
                      </Link>
                    </evg-button>
                  </locator-tip-content>
                ) : (
                  <locator-tip-content>
                    <h2>{t('refill.discover.tip.noLocations.title')}</h2>
                    <p>{t('refill.discover.tip.noLocations.description')}</p>
                    <evg-button>
                      <Link href={`/${postcode}/refill/sign-up`}>
                        {t('refill.discover.tip.noLocations.cta')}
                      </Link>
                    </evg-button>
                  </locator-tip-content>
                )}
              </locator-tip>
            </evg-section>
          )}
        </locator-wrap>
      </div>
    </locator-layout>
  );
}
