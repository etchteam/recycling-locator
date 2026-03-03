import { useTranslation } from 'react-i18next';

import cleanupAddress from '@/lib/cleanupAddress';
import { REFILL_CATEGORIES } from '@/lib/refillCategories';
import { Location } from '@/types/locatorApi';

export default function Place({
  location,
  withAddress = true,
  variant = 'recycle',
}: {
  readonly location: Location;
  readonly withAddress?: boolean;
  readonly variant?: 'recycle' | 'refill';
}) {
  const { t } = useTranslation();
  const materialsCount = location.locations.flatMap((l) => l.materials).length;
  const refillCategories = location.locations.flatMap(
    (l) => l.company?.refillCategories ?? [],
  );

  return (
    <locator-place-summary>
      <h4>{location.name}</h4>
      {withAddress && <p>{cleanupAddress(location.address)}</p>}
      <dl>
        <dd>{location.distance.toFixed(2)}</dd>
        <dt>
          {t('common.miles', {
            count: location.distance,
          })}
        </dt>
        {variant === 'refill' ? (
          refillCategories.length > 0 && (
            <dt>
              <ul className="list-style-none refill-categories">
                {refillCategories.map((cat) => {
                  const icon = REFILL_CATEGORIES.find(
                    (c) => c.key === cat.name,
                  )?.slug;

                  return (
                    <li key={cat.id}>
                      <locator-icon
                        icon={icon ?? 'refill-all'}
                        label={cat.name}
                      />
                    </li>
                  );
                })}
              </ul>
            </dt>
          )
        ) : (
          <>
            <dd>{materialsCount}</dd>
            <dt>
              {t('common.materialsAccepted', {
                count: materialsCount,
              })}
            </dt>
          </>
        )}
      </dl>
    </locator-place-summary>
  );
}
