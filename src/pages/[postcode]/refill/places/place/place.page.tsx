import Linkify from 'linkify-react';
import camelCase from 'lodash/camelCase';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'wouter-preact';

import { IconAttributes } from '@/components/content/Icon/Icon';
import OpeningHours from '@/components/content/OpeningHours/OpeningHours';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillPlace } from '@/hooks/useRefillPlace';
import cleanupAddress from '@/lib/cleanupAddress';
import getNotes from '@/lib/details/getNotes';
import getOpeningHours from '@/lib/details/getOpeningHours';
import getPhoneNumbers from '@/lib/details/getPhoneNumbers';
import getWebsites from '@/lib/details/getWebsites';
import { Location, RefillCategory } from '@/types/locatorApi';

const CATEGORY_ICON_MAP: Record<string, IconAttributes['icon']> = {
  Food: 'mixed-food',
  Cleaning: 'cleaning',
  'Personal Care': 'personal-care',
};

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
      <p className="evg-text-weight-bold evg-spacing-bottom-none">Products</p>
      {categoriesList.map((cat) => (
        <evg-chip key={cat.id}>
          <Link href={`/${postcode}/refill/places?category=${cat.name}`}>
            <locator-icon
              icon={CATEGORY_ICON_MAP[cat.name]}
              className="evg-spacing-right-xs"
            />
            {t(`refill.category.${CATEGORY_ICON_MAP[cat.name]}`)}
          </Link>
        </evg-chip>
      ))}
      <p className="evg-text-size-body-xs evg-spacing-top-xs evg-spacing-bottom-sm">
        {t('refill.place.disclaimer')}
      </p>
    </>
  );
}

function RefillCompanyContent({ location }: { readonly location: Location }) {
  const { t } = useTranslation();

  const companies: string[] = location.locations
    .map((loc) => loc.company?.name)
    .filter((name): name is string => Boolean(name))
    .filter((name, index, arr) => arr.indexOf(name) === index)
    .map(camelCase);

  if (companies.length === 0) {
    return null;
  }

  return (
    <>
      {companies.map((company) => {
        if (StoreBrands.has(company)) {
          return (
            <div key={company} className="evg-spacing-top-md">
              <evg-img>
                <img
                  src={`/images/refill/logos/${company}.webp`}
                  alt={t(`refill.place.suppliers.${company}.name`) + ' logo'}
                  width="100"
                  height="50"
                />
              </evg-img>
              <p>{t(`refill.place.suppliers.${company}.description`)}</p>
              <evg-img radius="sm">
                <img
                  src={`/images/refill/brand-images/${company}.webp`}
                  alt={
                    'A picture of the ' +
                    t(`refill.place.suppliers.${company}.name`) +
                    ' store'
                  }
                />
              </evg-img>
              <hr />
            </div>
          );
        }

        return (
          <div key={company} className="evg-spacing-top-md">
            <p className="evg-text-weight-bold evg-font-size-sm evg-spacing-bottom-md">
              {t('refill.place.supplied', { place: location.name })}
            </p>
            <evg-row>
              <evg-img radius="sm">
                <img
                  src={`/images/refill/logos/${company}.webp`}
                  alt={t(`refill.place.suppliers.${company}.name`) + ' logo'}
                  width="48"
                  height="48"
                />
              </evg-img>
              <div>
                <p className="evg-text-weight-bold evg-spacing-bottom-none">
                  {t(`refill.place.suppliers.${company}.name`)}
                </p>
                <evg-chip variant="light">
                  <a
                    href={t(`refill.place.suppliers.${company}.url`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <locator-icon
                      icon="web-link"
                      className="evg-spacing-right-xs"
                    />
                    {t(`refill.place.suppliers.${company}.urlText`)}
                  </a>
                </evg-chip>
              </div>
            </evg-row>
            <p>{t(`refill.place.suppliers.${company}.description`)}</p>
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

  const phoneNumbers = getPhoneNumbers(location);
  const websites = getWebsites(location);
  const openingHours = getOpeningHours(location);
  const notes = getNotes(location);
  const address = cleanupAddress(location.address);

  return (
    <>
      <locator-bordered-list size="sm" className="evg-spacing-bottom-md">
        <dl>
          <OpeningHours openingHours={openingHours} />
          {phoneNumbers.length > 0 && (
            <div>
              <dt>{t('place.details.phone')}</dt>
              {phoneNumbers.map((num) => (
                <dd key={num}>
                  <a href={`tel:${num}`}>{num}</a>
                </dd>
              ))}
            </div>
          )}
          {websites?.size > 0 && (
            <div>
              <dt>{t('place.details.website')}</dt>
              {[...websites].map(([site]) => (
                <dd key={site}>
                  <a
                    href={`${site}?utm_source=wrap-recycling-locator`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('refill.place.websiteLinkText', {
                      place: location.name,
                    })}
                  </a>
                </dd>
              ))}
            </div>
          )}
          {StoreBrands.has(
            camelCase(location.locations[0].company?.name ?? ''),
          ) && (
            <div>
              <dt>{t('place.details.website')}</dt>
              <dd>
                <a
                  href={`${t('refill.place.suppliers.marksAndSpencer.url')}?utm_source=wrap-recycling-locator`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('refill.place.suppliers.marksAndSpencer.urlText')}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt>{t('place.details.address')}</dt>
            <dd>{address}</dd>
          </div>
          {notes.length > 0 && (
            <div>
              <dt>{t('place.details.notes')}</dt>
              {notes.map((note) => (
                <dd key={note}>
                  {
                    <Linkify
                      options={{
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        nl2br: true,
                        defaultProtocol: 'https',
                        format: (value) => {
                          return value.includes('https://what3words.com')
                            ? value.replace('https://what3words.com/', '///')
                            : value;
                        },
                      }}
                    >
                      {note}
                    </Linkify>
                  }
                </dd>
              ))}
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
  const { data: location, loading } = useRefillPlace(params.id);

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
