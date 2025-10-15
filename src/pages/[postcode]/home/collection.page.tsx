import { useSignal } from '@preact/signals';
import { Suspense } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Link,
  useParams,
  useSearchParams,
  Form,
  useLoaderData,
  Await,
  useNavigation,
  useLocation,
} from 'react-router';
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
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import TipContent from '@/components/template/TipContent/TipContent';
import getContainerList from '@/lib/getContainerList';
import sortPropertyTypes from '@/lib/sortPropertyTypes';
import useAnalytics from '@/lib/useAnalytics';
import useFormValidation from '@/lib/useFormValidation';
import useScrollRestoration from '@/lib/useScrollRestoration';
import { LocalAuthority } from '@/types/locatorApi';

import ContainerList from './ContainerList';
import { HomeCollectionLoaderResponse } from './collection.loader';
import { useHomeRecyclingLoaderData } from './home.loader';

function CollectionPageContent({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { postcode } = useParams();
  const location = useLocation();
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
  const isLoadingNewPath =
    navigation.state === 'loading' &&
    !navigation.location?.search.includes(propertyType.replace(' ', '+'));

  useEffect(() => {
    if (search) {
      recordEvent({
        category: 'HomeRecyclingBins::MaterialSearch',
        action: search,
      });
    }

    form.submitting.value = false;
  }, [search, location]);

  function handleMenuItemClick() {
    menuOpen.value = false;
    menuRef.current?.removeAttribute('open');
  }

  return (
    <>
      <locator-context-header>
        {propertyTypes.length > 1 ? (
          <locator-details menu>
            <details ref={menuRef}>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <summary onClick={() => (menuOpen.value = !menuOpen.value)}>
                {menuOpen.value || isLoadingNewPath
                  ? t('homeRecycling.collection.summary')
                  : propertyType}
                <locator-icon icon="expand" />
              </summary>
              <nav>
                <ul>
                  {propertyTypes.map((type) => (
                    <li key={type}>
                      <Link
                        to={`/${postcode}/home/collection?propertyType=${type}`}
                        onClick={handleMenuItemClick}
                        unstable_viewTransition
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
      {!isLoadingNewPath && (
        <diamond-enter type="fade">
          <diamond-section padding="lg">
            <locator-wrap>
              <h3 id="bin-search-title" className="diamond-spacing-bottom-md">
                {t('homeRecycling.collection.search.label')}
              </h3>

              <Form method="get" onSubmit={form.handleSubmit}>
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
                  checkMaterial={true}
                ></MaterialSearchInput>
              </Form>

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
      )}
    </>
  );
}

export default function CollectionPage() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const { localAuthority: localAuthorityPromise } =
    useHomeRecyclingLoaderData();
  const { tip: tipPromise } = useLoaderData() as HomeCollectionLoaderResponse;
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <div slot="layout-header">
        <locator-header>
          <locator-header-logo>
            <Link to={`/${postcode}`} unstable_viewTransition>
              <locator-logo type="logo-only"></locator-logo>
            </Link>
          </locator-header-logo>
          <locator-header-content>
            <locator-header-title>
              <diamond-button>
                <Link to={`/${postcode}/home`} unstable_viewTransition>
                  <locator-icon icon="arrow-left" label="Back"></locator-icon>
                </Link>
              </diamond-button>
              <div>
                <h2>{t('homeRecycling.collection.title')}</h2>
                <Suspense fallback={null}>
                  <Await resolve={localAuthorityPromise}>
                    {(localAuthority) => (
                      <diamond-enter type="fade">
                        <p>{localAuthority.name}</p>
                      </diamond-enter>
                    )}
                  </Await>
                </Suspense>
              </div>
            </locator-header-title>
          </locator-header-content>
        </locator-header>
      </div>
      <div slot="layout-main" ref={layoutRef}>
        <Suspense fallback={null}>
          <Await resolve={localAuthorityPromise}>
            {(localAuthority) => (
              <CollectionPageContent localAuthority={localAuthority} />
            )}
          </Await>
        </Suspense>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          <Suspense fallback={null}>
            <Await resolve={tipPromise}>
              {(tip) => <TipContent tip={tip} />}
            </Await>
          </Suspense>
        </locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
