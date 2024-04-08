import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import config from '@/config';
import { RecyclingMeta } from '@/types/locatorApi';
import '@/components/content/Icon/Icon';

export default function TipContent({
  tip,
  ctaWidth = 'full-width',
}: {
  readonly tip?: RecyclingMeta;
  readonly ctaWidth?: 'full-width' | 'full-width-mobile';
}) {
  if (!tip) {
    return null;
  }

  return (
    <diamond-enter type="fade">
      <img
        className="diamond-spacing-bottom-sm"
        src={tip.image ?? config.imagePath + 'material-tip.svg'}
        alt=""
      />
      <p className="diamond-text-weight-bold">{tip.subtitle}</p>
      <h2>{tip.title}</h2>
      <p>{tip.content}</p>
      {tip.cta && tip.ctaLink && (
        <diamond-button width={ctaWidth} className="diamond-spacing-top-md">
          <a href={tip.ctaLink} target="_blank" rel="noopener noreferrer">
            {tip.cta}
            <locator-icon icon="external"></locator-icon>
          </a>
        </diamond-button>
      )}
    </diamond-enter>
  );
}
