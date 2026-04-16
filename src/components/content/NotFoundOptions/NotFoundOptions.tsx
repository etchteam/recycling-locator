import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import OrSeparator from '@/components/content/OrSeparator/OrSeparator';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';

function RecyclingOption() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { theme } = useAppState();

  return (
    <locator-icon-link
      border
      className={`evg-spacing-top-md${theme ? '' : ' theme-preset-green'}`}
    >
      <Link href={`/${postcode}`}>
        <locator-icon-circle>
          <locator-icon icon="recycle" color="primary"></locator-icon>
        </locator-icon-circle>
        <div>
          <p className="evg-text-size-body-xs">
            {t('refill.explore.recyclingOptions.title')}
          </p>
        </div>
      </Link>
    </locator-icon-link>
  );
}

function RefillOption() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { theme } = useAppState();

  return (
    <locator-icon-link
      border
      className={`evg-spacing-top-md${theme ? '' : ' theme-preset-purple'}`}
    >
      <Link href={`/${postcode}/refill`}>
        <locator-icon-circle>
          <locator-icon icon="refill" color="primary"></locator-icon>
        </locator-icon-circle>
        <div>
          <p className="evg-text-size-body-xs">{t('refill.explore.title')}</p>
        </div>
      </Link>
    </locator-icon-link>
  );
}

export default function NotFoundOptions({
  variant,
}: {
  readonly variant: 'recycling' | 'refill';
}) {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('notFound.title.default')}</h2>
      {variant === 'refill' ? (
        <>
          <RefillOption />
          <OrSeparator />
          <RecyclingOption />
        </>
      ) : (
        <>
          <RecyclingOption />
          <OrSeparator />
          <RefillOption />
        </>
      )}
    </>
  );
}
