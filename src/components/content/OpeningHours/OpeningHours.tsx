import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';

function getTodayClass(hours: string): string {
  if (hours.toLocaleLowerCase().includes('open')) {
    return 'text-color-positive';
  }

  return 'text-color-negative';
}

export default function OpeningHours({
  openingHours,
}: {
  readonly openingHours: string[];
}) {
  const { t } = useTranslation();
  const open = useSignal(false);

  if (openingHours.length === 0) {
    return null;
  }

  const [today] = openingHours;

  return (
    <div className="locator-opening-hours">
      <button
        type="button"
        aria-expanded={open.value}
        aria-controls="opening-hours-collapse"
        onClick={() => (open.value = !open.value)}
      >
        <span>
          <strong>{t('place.details.openHours')} </strong>
          <span className={getTodayClass(today)}>{today}</span>
        </span>
        <locator-icon icon="expand" className="evg-spacing-left-xs" />
      </button>
      {openingHours.length > 0 && (
        <evg-collapse id="opening-hours-collapse" open={open.value}>
          <ul>
            {openingHours.map((hours) => (
              <li key={hours}>{hours}</li>
            ))}
          </ul>
        </evg-collapse>
      )}
    </div>
  );
}
