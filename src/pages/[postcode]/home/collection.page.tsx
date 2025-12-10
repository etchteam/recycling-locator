import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/canvas/Tip/Tip';
import '@/components/canvas/ContextHeader/ContextHeader';
import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/composition/Wrap/Wrap';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';
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

import ContainerList from './ContainerList';

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
                        <diamond-grid align-items="center" gap="xs">
                          <diamond-grid-item grow shrink>
                            {type}
                          </diamond-grid-item>
                          <diamond-grid-item>
                            <locator-icon icon="arrow-right" />
                          </diamond-grid-item>
                        </diamond-grid>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </locator-details>
        ) : (
          <span className="diamond-text-weight-bold">{propertyType}</span>
        )}
      </locator-context-header>
      <diamond-enter type="fade">
        <diamond-section padding="lg">
          <locator-wrap>
            <h3 id="bin-search-title" className="diamond-spacing-bottom-md">
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

            <div className="diamond-spacing-bottom-sm" />

            <ContainerList
              localAuthority={localAuthority}
              containerList={containerList}
              search={search}
            />

            <RateThisInfo />
          </locator-wrap>
        </diamond-section>
      </diamond-enter>
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
      <div slot="layout-header">
        <locator-header>
          <locator-header-logo>
            <Link href={`/${postcode}`}>
              <locator-logo type="logo-only"></locator-logo>
            </Link>
          </locator-header-logo>
          <locator-header-content>
            <locator-header-title>
              <diamond-button>
                <Link href={`/${postcode}/home`}>
                  <locator-icon icon="arrow-left" label="Back"></locator-icon>
                </Link>
              </diamond-button>
              <div>
                <h2>{t('homeRecycling.collection.title')}</h2>
                {hasLoadedLocalAuthority && (
                  <diamond-enter type="fade">
                    <p>{localAuthority.name}</p>
                  </diamond-enter>
                )}
              </div>
            </locator-header-title>
          </locator-header-content>
        </locator-header>
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
