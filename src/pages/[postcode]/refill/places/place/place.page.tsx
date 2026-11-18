import camelCase from 'lodash/camelCase';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'wouter-preact';

import OpeningHours from '@/components/content/OpeningHours/OpeningHours';
import PlaceNotes from '@/components/content/PlaceNotes/PlaceNotes';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillPlace } from '@/hooks/useRefillPlace';
import cleanupAddress from '@/lib/cleanupAddress';
import getRefillPlaceDetails from '@/lib/details/getRefillPlaceDetails';
import getBrandLinkText from '@/lib/getBrandLinkText';
import { REFILL_CATEGORIES } from '@/lib/refillCategories';
import { Location, RefillCategory } from '@/types/locatorApi';

const StoreBrands = new Set(['marksAndSpencer']);

function Categories({
  categoriesList,
}: {
  readonly categoriesList: RefillCategory[];
}) {
  return (
    <span>
      {categoriesList.map((cat, idx) => (
        <>
          {idx > 0 && (idx === categoriesList.length - 1 ? ' and ' : ', ')}
          <strong>{cat.name}</strong>
        </>
      ))}
    </span>
  );
}

function RefillProductsContent({
  categoriesList,
}: {
  readonly categoriesList: RefillCategory[];
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <>
      <p className="evg-text-weight-bold evg-spacing-bottom-none">
        {t('refill.place.products')}
      </p>
      {categoriesList.map((cat) => {
        const category = REFILL_CATEGORIES.find((c) => c.key === cat.name);

        if (!category?.slug) {
          return null;
        }

        return (
          <evg-chip key={cat.id}>
            <Link
              href={`/${postcode}/refill/places?categories=${category.param}`}
            >
              <locator-icon
                icon={category.slug}
                className="evg-spacing-right-xs"
              />
              {t(`refill.category.${category.slug}`)}
            </Link>
          </evg-chip>
        );
      })}
      <p className="evg-text-size-body-xs evg-spacing-top-xs evg-spacing-bottom-sm">
        {t('refill.place.disclaimer')}
      </p>
    </>
  );
}

function RefillCompanyContent({ location }: { readonly location: Location }) {
  const { t } = useTranslation();
  const { publicPath } = useAppState();

  const brands = location.brands ?? [];

  if (brands.length === 0) {
    return null;
  }

  return (
    <>
      {brands.map((brand) => {
        const key = camelCase(brand.name);

        if (StoreBrands.has(key)) {
          return (
            <div key={brand.id} className="evg-spacing-top-md">
              {brand.logo && (
                <evg-img>
                  <img
                    src={brand.logo}
                    alt={brand.name + ' logo'}
                    width="100"
                    height="50"
                  />
                </evg-img>
              )}
              {brand.description && <p>{brand.description}</p>}
              <evg-img radius="sm">
                <img
                  src={`${publicPath}images/refill/brand-images/${key}.webp`}
                  alt={'A picture of the ' + brand.name + ' store'}
                />
              </evg-img>
              <hr />
            </div>
          );
        }

        return (
          <div key={brand.id} className="evg-spacing-top-md">
            <p className="evg-text-weight-bold evg-font-size-sm evg-spacing-bottom-md">
              {t('refill.place.supplied', { place: location.name })}
            </p>
            <evg-row>
              {brand.logo && (
                <evg-img radius="sm">
                  <img
                    src={brand.logo}
                    alt={brand.name + ' logo'}
                    width="48"
                    height="48"
                  />
                </evg-img>
              )}
              <div>
                <p className="evg-text-weight-bold evg-spacing-bottom-none">
                  {brand.name}
                </p>
                {brand.url && (
                  <evg-chip variant="light">
                    <a
                      href={brand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <locator-icon
                        icon="web-link"
                        className="evg-spacing-right-xs"
                      />
                      {getBrandLinkText(brand.url)}
                    </a>
                  </evg-chip>
                )}
              </div>
            </evg-row>
            {brand.description && <p>{brand.description}</p>}
            <hr />
          </div>
        );
      })}
    </>
  );
}

function RefillPlaceContent({ location }: { readonly location: Location }) {
  const { t } = useTranslation();

  if (location.error) {
    throw new Error(location.error);
  }

  const { phoneNumber, website, openingHours, note } =
    getRefillPlaceDetails(location);
  const address = cleanupAddress(location.address);
  const storeBrand = location.brands?.find((brand) =>
    StoreBrands.has(camelCase(brand.name)),
  );

  return (
    <>
      <locator-bordered-list size="sm" className="evg-spacing-bottom-md">
        <dl>
          <OpeningHours openingHours={openingHours} />
          {phoneNumber && (
            <div>
              <dt>{t('place.details.phone')}</dt>
              <dd>
                <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
              </dd>
            </div>
          )}
          {website && (
            <div>
              <dt>{t('place.details.website')}</dt>
              <dd>
                <a
                  href={`${website.url}?utm_source=wrap-recycling-locator`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('refill.place.websiteLinkText', {
                    place: location.name,
                  })}
                </a>
              </dd>
            </div>
          )}
          {storeBrand?.url && (
            <div>
              <dt>{t('place.details.website')}</dt>
              <dd>
                <a
                  href={`${storeBrand.url}?utm_source=wrap-recycling-locator`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('refill.place.refillSchemeLinkText', {
                    brand: storeBrand.name,
                  })}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt>{t('place.details.address')}</dt>
            <dd>{address}</dd>
          </div>
          {note && (
            <div>
              <dt>{t('place.details.notes')}</dt>
              <PlaceNotes notes={[note]} />
            </div>
          )}
        </dl>
      </locator-bordered-list>

      <RateThisInfo />
    </>
  );
}

export default function RefillPlacePage() {
  const params = useParams<{ id: string }>();
  const { data: location, loading, error } = useRefillPlace(params.id);

  if (error) {
    throw error;
  }

  if (loading || !location) {
    return null;
  }

  const categoriesList = location.locations
    .flatMap((loc) => loc.company?.refillCategories ?? [])
    .filter(
      (category, index, arr) =>
        arr.findIndex((c) => c.id === category.id) === index,
    );

  return (
    <>
      <h3 className="evg-spacing-bottom-md">
        <Trans
          i18nKey="refill.place.title"
          components={{
            categories: <Categories categoriesList={categoriesList} />,
          }}
        />
      </h3>
      <hr />
      <evg-enter type="fade-in-up">
        <RefillCompanyContent location={location} />
        <RefillProductsContent categoriesList={categoriesList} />
        <RefillPlaceContent location={location} />
      </evg-enter>
    </>
  );
}
