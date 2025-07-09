import { set, isWithinInterval, getDay, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { Location } from '@/types/locatorApi';

const DAYS = new Set<string>([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);

function getTime(time: string, now: Date): Date {
  const [hour, minute] = time.split(':').map(Number);

  return set(now, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  });
}

function isOpen(open: string, close: string, now: Date): boolean {
  const openTime = getTime(open, now);
  const closeTime = getTime(close, now);

  return (
    isWithinInterval(now, { start: openTime, end: closeTime }) &&
    now.getTime() < closeTime.getTime()
  );
}

export default function getOpeningHours(location: Location) {
  const openingHours = new Map<string, string>();
  const now = toZonedTime(new Date(), 'Europe/London');
  const todayDay = getDay(now);

  location.locations
    .map((loc) => loc.openingHours)
    .filter(Boolean)
    .forEach((entry) => {
      DAYS.forEach((day) => {
        const key = day.toLowerCase();
        let label = `${day}: `;

        if (entry[key]) {
          const open = entry[key]['open'];
          const close = entry[key]['close'];

          if (open === '00:00' && close === '00:00') {
            label += 'Open 24 hours';
          } else {
            label += `${open} - ${close}`;

            if (day === format(now, 'EEEE')) {
              label += ` (${isOpen(open, close, now) ? 'open' : 'closed'} now)`;
            }
          }
          openingHours.set(day, label);
        } else {
          openingHours.set(day, `${label}Closed`);
        }
      });
    });

  const daysArray = Array.from(openingHours.values());

  return daysArray.sort(
    (a, b) =>
      ((daysArray.indexOf(a) - todayDay + 7) % 7) -
      ((daysArray.indexOf(b) - todayDay + 7) % 7),
  );
}
