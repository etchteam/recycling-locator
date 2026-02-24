import { useTranslation } from 'react-i18next';

import { IconAttributes } from '@/components/content/Icon/Icon';
import cleanupAddress from '@/lib/cleanupAddress';
import { Location } from '@/types/locatorApi';

const CATEGORY_ICON_MAP: Record<string, IconAttributes['icon']> = {
  Food: 'refill-food',
  Cleaning: 'refill-cleaning',
  'Personal Care': 'refill-care',
};

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
                {refillCategories.map((cat) => (
                  <li key={cat.id}>
                    <locator-icon
                      icon={CATEGORY_ICON_MAP[cat.name] ?? 'refill-all'}
                      label={cat.name}
                    />
                  </li>
                ))}
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
