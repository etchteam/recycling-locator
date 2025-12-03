import { useLocation } from 'wouter-preact';

import config from '@/config';
import { captureException } from '@/lib/sentry';

import { useAppState } from './AppState';

interface AnalyticsEvent {
  /** Document Title (title for the event) */
  dt: string;
  /** Document Path i.e. /EX32 7RB/places?materialId=1&materialName=Aluminium */
  dp: string;
  /** Document Hostname */
  dh: string;
  /** Viewport in the format `${width}x${height()}` */
  vp: string;
  /** Session id */
  cid: string;
  /** Type for Google Analytics */
  t: 'pageview' | 'event';
  /** Users Locale */
  ul: 'cy-GB' | 'en-GB';
  /** Event Category for Google Analytics */
  ec?: string;
  /** Event Action for Google Analytics */
  ea?: string;
}

async function sendAnalyticsRequest(event: AnalyticsEvent) {
  if (!config.enableAnalytics) {
    return;
  }

  try {
    const query = new URLSearchParams(event as any);
    await fetch(
      encodeURI(`${config.locatorAnalyticsPath}?${query.toString()}`),
      {
        method: 'GET',
        headers: {
          'X-Requested-With': config.packageVersion,
        },
      },
    );
  } catch (error) {
    captureException(error, { analytics: 'sendHit' }, { event });
  }
}

export default function useAnalytics() {
  const { locale, sessionId } = useAppState();
  const [location] = useLocation();

  const path = typeof window !== 'undefined' ? window?.location?.pathname : '/';

  function createEvent(event: Partial<AnalyticsEvent>): AnalyticsEvent {
    // Parse location string into pathname, search, hash
    const [pathname, ...rest] = location.split('?');
    const searchAndHash = rest.join('?');
    const [search, hash] = searchAndHash.split('#');

    return {
      ...event,
      dp: `${pathname}${search ? '?' + search : ''}${hash ? '#' + hash : ''}`,
      cid: sessionId,
      ul: locale === 'cy' ? 'cy-GB' : 'en-GB',
      dh: `${config.hostname}${path}`,
      vp: `${window.innerWidth}x${window.innerHeight}`,
    } as AnalyticsEvent;
  }

  function recordView(title?: string) {
    const event = createEvent({
      dt: title ?? 'View',
      t: 'pageview',
    });

    sendAnalyticsRequest(event);
  }

  function recordEvent({
    category,
    action,
  }: {
    category: string;
    action: string;
  }) {
    const event = createEvent({
      ec: category,
      ea: action,
      t: 'event',
    });

    sendAnalyticsRequest(event);
  }

  return { recordView, recordEvent };
}
