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

export interface OpeningHoursResult {
  today: string;
  days: string[];
}

export default function getOpeningHours(
  location: Location,
): OpeningHoursResult {
  const openingHours = new Map<string, string>();
  const now = toZonedTime(new Date(), 'Europe/London');
  const todayDay = getDay(now);
  const todayName = format(now, 'EEEE');
  let today = '';

  location.locations
    .map((loc) => loc.openingHours)
    .filter(Boolean)
    .forEach((entry) => {
      DAYS.forEach((day) => {
        const key = day.toLowerCase();
        const label = `${day}: `;

        let daySuffix: string;
        let todaySuffix: string;

        if (entry[key]) {
          const open = entry[key]['open'];
          const close = entry[key]['close'];
          const is24Hours = open === '00:00' && close === '00:00';
          const hoursText = is24Hours ? 'Open 24 hours' : `${open} - ${close}`;
          const openStatus = isOpen(open, close, now) ? 'open' : 'closed';
          const openNowSuffix = is24Hours ? '' : ` (${openStatus} now)`;
          daySuffix = hoursText;
          todaySuffix = hoursText + openNowSuffix;
        } else {
          daySuffix = 'Closed';
          todaySuffix = 'Closed';
        }

        openingHours.set(day, label + daySuffix);
        if (day === todayName) {
          today += todaySuffix;
        }
      });
    });

  const daysArray = Array.from(openingHours.values());

  const days = [...daysArray].sort(
    (a, b) =>
      ((daysArray.indexOf(a) - todayDay + 7) % 7) -
      ((daysArray.indexOf(b) - todayDay + 7) % 7),
  );

  return { today, days };
}
