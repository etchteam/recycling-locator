import { useTranslation } from 'react-i18next';

import '@/components/content/PlaceSummary/PlaceSummary';
import cleanupAddress from '@/lib/cleanupAddress';
import { Location } from '@/types/locatorApi';

export default function Place({
  location,
  withAddress = true,
}: {
  readonly location: Location;
  readonly withAddress?: boolean;
}) {
  const { t } = useTranslation();
  const materialsCount = location.locations.flatMap((l) => l.materials).length;

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
        <dd>{materialsCount}</dd>
        <dt>
          {t('common.materialsAccepted', {
            count: materialsCount,
          })}
        </dt>
      </dl>
    </locator-place-summary>
  );
}
