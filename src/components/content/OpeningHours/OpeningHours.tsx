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
  readonly openingHours: {
    today: string;
    days: string[];
  };
}) {
  const { t } = useTranslation();
  const open = useSignal(false);

  const { today, days } = openingHours;

  if (days.length === 0) {
    return null;
  }

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
        <locator-icon icon="expand" color="positive" />
      </button>
      {days.length > 0 && (
        <evg-collapse id="opening-hours-collapse" open={open.value}>
          <ul>
            {days.map((hours) => (
              <li key={hours}>{hours}</li>
            ))}
          </ul>
        </evg-collapse>
      )}
    </div>
  );
}
