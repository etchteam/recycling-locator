import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/content/Img/Img';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/composition/IconText/IconText';
import '@/components/content/Icon/Icon';
import { LocalAuthority } from '@/types/locatorApi';

export default function NotRecyclable({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const tContext = 'material.notRecyclable';

  return (
    <diamond-card border radius>
      <locator-icon-text className="diamond-spacing-bottom-xs">
        <locator-icon-circle variant="negative">
          <locator-icon icon="close"></locator-icon>
        </locator-icon-circle>
        <h3>{t(`${tContext}.title`)}</h3>
      </locator-icon-text>
      <p className="diamond-text-size-sm">{t(`${tContext}.content`)}</p>
      <diamond-button width="full-width">
        <a
          href={`${localAuthority.recyclingUri}?referrer=wrap-recycling-locator`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {localAuthority.name}
        </a>
      </diamond-button>
    </diamond-card>
  );
}
