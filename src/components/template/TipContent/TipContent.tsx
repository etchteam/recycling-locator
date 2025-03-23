import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/content/Icon/Icon';
import { useAppState } from '@/lib/AppState';
import { RecyclingMeta } from '@/types/locatorApi';

interface TipContentProps {
  readonly tip?: RecyclingMeta;
  readonly ctaWidth?: 'full-width' | 'full-width-mobile';
  readonly showImage?: boolean;
}

export default function TipContent({
  tip,
  ctaWidth = 'full-width',
  showImage = true,
}: TipContentProps) {
  const { publicPath } = useAppState();

  if (!tip) {
    return null;
  }

  const tipImgSrc = tip.image ?? `${publicPath}images/material-tip.svg`;

  return (
    <diamond-enter type="fade">
      {showImage && (
        <img className="diamond-spacing-bottom-sm" src={tipImgSrc} alt="" />
      )}
      {tip.subtitle && (
        <p className="diamond-text-weight-bold">{tip.subtitle}</p>
      )}
      <h2>{tip.title}</h2>
      {tip.content && <p>{tip.content}</p>}
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
