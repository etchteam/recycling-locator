import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import HomeCollectionContainers from '@/components/content/HomeCollectionContainers/HomeCollectionContainers';
import TipContent from '@/components/content/TipContent/TipContent';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import useFormValidation from '@/hooks/useFormValidation';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { useTip } from '@/hooks/useTip';
import getContainerList from '@/lib/getContainerList';
import sortPropertyTypes from '@/lib/sortPropertyTypes';
import { LocalAuthority } from '@/types/locatorApi';

function CollectionPageContent({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();
  const form = useFormValidation('search');
  const properties = sortPropertyTypes(localAuthority.properties);
  const propertyTypes = Object.keys(properties);
  const menuOpen = useSignal(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const propertyType = searchParams.get('propertyType') ?? propertyTypes[0];
  const property = properties[propertyType];
  const containerList = getContainerList(property);

  useEffect(() => {
    // Reset submitting state after search params have been updated
    form.submitting.value = false;
  }, [search, form.submitting]);

  function handleMenuItemClick() {
    menuOpen.value = false;
    menuRef.current?.removeAttribute('open');
  }

  function handleFormSubmit(event: Event) {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const searchValue = formData.get('search') as string;
    const propertyTypeValue = formData.get('propertyType') as string;

    if (!searchValue) {
      form.valid.value = false;
      return;
    }

    form.submitting.value = true;

    recordEvent({
      category: 'HomeRecyclingBins::MaterialSearch',
      action: searchValue,
    });

    setSearchParams({
      search: searchValue,
      propertyType: propertyTypeValue,
    });
  }

  return (
    <>
      <locator-context-header>
        {propertyTypes.length > 1 ? (
          <locator-details menu>
            <details ref={menuRef}>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <summary onClick={() => (menuOpen.value = !menuOpen.value)}>
                {menuOpen.value
                  ? t('homeRecycling.collection.summary')
                  : propertyType}
                <locator-icon icon="expand" />
              </summary>
              <nav>
                <ul>
                  {propertyTypes.map((type) => (
                    <li key={type}>
                      <Link
                        href={`/${postcode}/home/collection?propertyType=${type}`}
                        onClick={handleMenuItemClick}
                      >
                        <evg-grid align-items="center" gap="xs">
                          <evg-grid-item grow shrink>
                            {type}
                          </evg-grid-item>
                          <evg-grid-item>
                            <locator-icon icon="arrow-right" />
                          </evg-grid-item>
                        </evg-grid>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </locator-details>
        ) : (
          <span className="evg-text-weight-bold">{propertyType}</span>
        )}
      </locator-context-header>
      <evg-enter type="fade">
        <evg-section padding="lg">
          <locator-wrap>
            <h3 id="bin-search-title" className="evg-spacing-bottom-md">
              {t('homeRecycling.collection.search.label')}
            </h3>

            <form onSubmit={handleFormSubmit}>
              <input type="hidden" name="propertyType" value={propertyType} />
              <MaterialSearchInput
                inputLabelledBy="bin-search-title"
                defaultValue={search}
                handleInput={form.handleInput}
                handleReset={() =>
                  setSearchParams({ propertyType, search: '' })
                }
                submitting={form.submitting.value}
                valid={form.valid.value}
                checkMaterial
              ></MaterialSearchInput>
            </form>

            <div className="evg-spacing-bottom-sm" />

            <HomeCollectionContainers
              localAuthority={localAuthority}
              containerList={containerList}
              search={search}
            />

            <RateThisInfo />
          </locator-wrap>
        </evg-section>
      </evg-enter>
    </>
  );
}

export default function CollectionPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { data: localAuthority, loading: loadingLocalAuthority } =
    useLocalAuthority();
  const { data: tip, loading: loadingTip } = useTip({
    path: `/${postcode}/home/collection`,
  });
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  const hasLoadedLocalAuthority = !loadingLocalAuthority && localAuthority;
  const hasLoadedTip = !loadingTip && tip;

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoHref={`/${postcode}`}
          title={t('homeRecycling.collection.title')}
          subtitle={hasLoadedLocalAuthority ? localAuthority.name : ''}
          backFallback={`/${postcode}/home`}
        />
      </div>
      <div slot="layout-main" ref={layoutRef}>
        {hasLoadedLocalAuthority && (
          <CollectionPageContent localAuthority={localAuthority} />
        )}
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>{hasLoadedTip && <TipContent tip={tip} />}</locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
