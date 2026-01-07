import { useAppState } from '@/hooks/AppStateProvider';
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
    <evg-enter type="fade">
      {showImage && (
        <img className="evg-spacing-bottom-sm" src={tipImgSrc} alt="" />
      )}
      {tip.subtitle && <p className="evg-text-weight-bold">{tip.subtitle}</p>}
      <h2>{tip.title}</h2>
      {tip.content && <p>{tip.content}</p>}
      {tip.cta && tip.ctaLink && (
        <evg-button width={ctaWidth} className="evg-spacing-top-md">
          <a href={tip.ctaLink} target="_blank" rel="noopener noreferrer">
            {tip.cta}
            <locator-icon icon="external"></locator-icon>
          </a>
        </evg-button>
      )}
    </evg-enter>
  );
}
