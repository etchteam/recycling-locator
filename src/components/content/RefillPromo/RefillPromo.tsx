import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';

interface RefillPromoProps {
  readonly count: number;
}

export default function RefillPromo({ count }: RefillPromoProps) {
  const { t } = useTranslation();
  const { publicPath, theme } = useAppState();
  const { postcode } = usePostcode();

  return (
    <evg-card
      padding="none"
      radius="sm"
      className={theme ? '' : 'theme-preset-purple'}
    >
      <evg-card>
        <evg-card-content>
          <locator-icon-text className="evg-spacing-bottom-xs">
            <locator-icon-circle>
              <locator-icon icon="refill" color="primary"></locator-icon>
            </locator-icon-circle>
            <h3>{t('material.refillPromo.title')}</h3>
          </locator-icon-text>
          <p className="evg-text-size-body-xs">
            {t('material.refillPromo.description')}
          </p>
        </evg-card-content>
      </evg-card>
      <evg-img block responsive>
        <img src={`${publicPath}images/refill/simple.webp`} alt="" />
      </evg-img>
      <evg-card>
        <evg-card-content>
          <evg-button width="full-width">
            <Link href={`/${postcode}/refill`}>
              {t('material.refillPromo.cta', { count })}
            </Link>
          </evg-button>
        </evg-card-content>
      </evg-card>
    </evg-card>
  );
}
