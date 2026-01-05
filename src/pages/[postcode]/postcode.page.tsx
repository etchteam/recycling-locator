import { useEffect } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import MaterialSearchForm from '@/components/control/MaterialSearchForm/MaterialSearchForm';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useLocations } from '@/hooks/useLocations';
import formatPostcode from '@/lib/formatPostcode';
import i18n from '@/lib/i18n';

function Loading() {
  return (
    <diamond-enter type="fade-in-up">
      <locator-loading-card className="diamond-spacing-top-md" />
    </diamond-enter>
  );
}

export default function PostcodePage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const { recordEvent } = useAnalytics();
  const { data: postcodeData } = usePostcode();
  const postcode = postcodeData?.postcode || '';
  const city = postcodeData?.city || '';
  const { data: locations, loading: locationsLoading } = useLocations();
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const locale = i18n.language;

  useEffect(() => {
    if (city && postcode) {
      recordEvent({
        category: 'LocationSearch',
        action: `${city}, ${postcode}`,
      });
    }
  }, [city, postcode, recordEvent]);

  return (
    <>
      <locator-context-header>
        <div>
          <span className="diamond-text-weight-bold">
            {formatPostcode(postcode)}
          </span>
          {city && <>&nbsp;&ndash; {city}</>}
        </div>
        <diamond-button variant="text" size="sm">
          <Link href="/">{t('actions.change')}</Link>
        </diamond-button>
      </locator-context-header>
      <locator-wrap>
        <diamond-section padding="lg">
          <diamond-enter type="fade" className="layer-one">
            <h2
              id="material-search-title"
              className="diamond-text-size-h3 diamond-spacing-bottom-sm"
            >
              {t('postcode.title')}
            </h2>

            <MaterialSearchForm
              path="material"
              label={t('components.materialSearchInput.label')}
              inputLabelledBy="material-search-title"
              autofocus={autofocus}
              includeFeedbackForm
            />
            <p className="diamond-spacing-top-sm">
              <diamond-link>
                <Trans
                  i18nKey={'components.materialSearchInput.searchList'}
                  components={{
                    a: (
                      <Link
                        href={`/${postcode}/places/search/a-z`}
                        className="locator-report-missing-material__toggle"
                      />
                    ),
                  }}
                />
              </diamond-link>
            </p>
          </diamond-enter>

          <diamond-enter type="fade-in-up" delay={0.25}>
            <hr className="diamond-spacing-top-md" />
            <nav className={locale === 'en' ? 'diamond-spacing-bottom-lg' : ''}>
              <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
                {city
                  ? t('postcode.exploreNearby', { city })
                  : t('postcode.exploreOptions')}
              </h3>
              <ul role="list" className="list-style-none">
                <li className="diamond-spacing-top-md">
                  <locator-icon-link border>
                    <Link href={`/${postcode}/home`}>
                      <locator-icon-circle>
                        <locator-icon
                          icon="home"
                          color="primary"
                        ></locator-icon>
                      </locator-icon-circle>
                      <div>
                        <h4 className="diamond-text-size-base diamond-spacing-bottom-none">
                          {t('postcode.options.home.title')}
                        </h4>
                        <p className="diamond-text-size-sm">
                          {t('postcode.options.home.description')}
                        </p>
                      </div>
                    </Link>
                  </locator-icon-link>
                </li>
                <li className="diamond-spacing-top-md">
                  {locationsLoading && <Loading />}
                  {!locationsLoading && locations && (
                    <locator-icon-link border>
                      <Link href={`/${postcode}/places`}>
                        <locator-icon-circle>
                          <locator-icon
                            icon="distance"
                            color="primary"
                          ></locator-icon>
                        </locator-icon-circle>
                        <div>
                          <h4 className="diamond-text-size-base diamond-spacing-bottom-none">
                            {t('postcode.options.nearest.title')}
                          </h4>
                          <p className="diamond-text-size-sm">
                            {t('postcode.options.nearest.description', {
                              count: locations.items?.length ?? 0,
                            })}
                          </p>
                        </div>
                      </Link>
                    </locator-icon-link>
                  )}
                </li>
              </ul>

              <diamond-grid
                className="diamond-spacing-top-sm"
                align-items="center"
              >
                <diamond-grid-item grow>
                  <hr aria-hidden="true" />
                </diamond-grid-item>
                <diamond-grid-item>
                  <span className="diamond-text-size-sm">{t('common.or')}</span>
                </diamond-grid-item>
                <diamond-grid-item grow>
                  <hr aria-hidden="true" />
                </diamond-grid-item>
              </diamond-grid>

              <locator-icon-link border className="diamond-spacing-top-md">
                <Link href={`/refill?${postcode}`}>
                  <locator-icon-circle>
                    <locator-icon icon="refill" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <h4 className="diamond-text-size-base diamond-spacing-bottom-none">
                      {t('postcode.options.refill.title')}
                    </h4>
                    <p className="diamond-text-size-sm">
                      {t('postcode.options.refill.description')}
                    </p>
                  </div>
                </Link>
              </locator-icon-link>
            </nav>
            {locale === 'en' &&
              !window.location.host.includes('walesrecycles') && (
                <locator-rescue-me-recycle-promo>
                  <Link href={`/${postcode}/rescue-me-recycle`}>
                    <img
                      src={`${publicPath}images/rescue-me-recycle.webp`}
                      alt={t('rescueMeRecycle.imgAlt')}
                      width="254"
                      height="120"
                    />
                  </Link>
                </locator-rescue-me-recycle-promo>
              )}
          </diamond-enter>
        </diamond-section>
      </locator-wrap>
    </>
  );
}
