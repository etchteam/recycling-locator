import { RecyclingMeta } from '@/types/locatorApi';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/content/Icon/Icon';

export default function TipContent({
  tip,
  ctaWidth = 'full-width',
}: {
  readonly tip: RecyclingMeta;
  readonly ctaWidth?: 'full-width' | 'full-width-mobile';
}) {
  return (
    <diamond-enter type="fade">
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
