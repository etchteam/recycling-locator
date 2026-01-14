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
    <evg-enter type="fade-in-up">
      <locator-loading-card className="evg-spacing-top-md" />
    </evg-enter>
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
          <span className="evg-text-weight-bold">
            {formatPostcode(postcode)}
          </span>
          {city && <>&nbsp;&ndash; {city}</>}
        </div>
        <evg-button variant="ghost" size="sm">
          <Link href="/">{t('actions.change')}</Link>
        </evg-button>
      </locator-context-header>
      <locator-wrap>
        <evg-section padding="lg">
          <evg-enter type="fade" className="layer-one">
            <h2
              id="material-search-title"
              className="evg-text-size-heading-md evg-spacing-bottom-sm"
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
            <p className="evg-spacing-top-sm">
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
            </p>
          </evg-enter>

          <evg-enter type="fade-in-up" delay={0.25}>
            <hr className="evg-spacing-top-md" />
            <nav className={locale === 'en' ? 'evg-spacing-bottom-lg' : ''}>
              <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-md">
                {city
                  ? t('postcode.exploreNearby', { city })
                  : t('postcode.exploreOptions')}
              </h3>
              <ul role="list" className="list-style-none">
                <li className="evg-spacing-top-md">
                  <locator-icon-link border>
                    <Link href={`/${postcode}/home`}>
                      <locator-icon-circle>
                        <locator-icon
                          icon="home"
                          color="primary"
                        ></locator-icon>
                      </locator-icon-circle>
                      <div>
                        <h4 className="text-size-base evg-spacing-bottom-none">
                          {t('postcode.options.home.title')}
                        </h4>
                        <p className="evg-text-size-body-xs">
                          {t('postcode.options.home.description')}
                        </p>
                      </div>
                    </Link>
                  </locator-icon-link>
                </li>
                <li className="evg-spacing-top-md">
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
                          <h4 className="text-size-base evg-spacing-bottom-none">
                            {t('postcode.options.nearest.title')}
                          </h4>
                          <p className="evg-text-size-body-xs">
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

              <evg-grid className="evg-spacing-top-sm" align-items="center">
                <evg-grid-item grow>
                  <hr aria-hidden="true" />
                </evg-grid-item>
                <evg-grid-item>
                  <span className="evg-text-size-body-xs">
                    {t('common.or')}
                  </span>
                </evg-grid-item>
                <evg-grid-item grow>
                  <hr aria-hidden="true" />
                </evg-grid-item>
              </evg-grid>

              <locator-icon-link border className="evg-spacing-top-md">
                <Link href={`/refill?postcode=${encodeURIComponent(postcode)}`}>
                  <locator-icon-circle>
                    <locator-icon icon="refill" color="primary"></locator-icon>
                  </locator-icon-circle>
                  <div>
                    <h4 className="text-size-base evg-spacing-bottom-none">
                      {t('postcode.options.refill.title')}
                    </h4>
                    <p className="evg-text-size-body-xs">
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
          </evg-enter>
        </evg-section>
      </locator-wrap>
    </>
  );
}
