import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';

import Place from '@/components/content/Place/Place';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import directions from '@/lib/directions';
import { Location } from '@/types/locatorApi';

export interface PlacesMapCardProps {
  /**
   * 'interactive' - Used on searchable map: shows place details + close button + actions
   * 'preview' - Used on static map (place detail page): shows only actions
   */
  readonly variant: 'interactive' | 'preview';
  /** Location to display and use for directions */
  readonly location: Location;
  /** Handler for close button (required for 'interactive' variant) */
  readonly onClose?: () => void;
  /** Render prop for the primary action (should include evg-button wrapper) */
  readonly primaryAction: () => ComponentChildren;
}

/**
 * Card component for displaying location info and actions on maps
 * Renders locator-places-map-card for styling with variant-based content
 */
export default function PlacesMapCard({
  variant,
  location,
  onClose,
  primaryAction,
}: PlacesMapCardProps) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();

  const handleDirectionsClick = () => {
    recordEvent({
      category: 'PlacesMap::Directions',
      action: location.address,
    });
  };

  return (
    <locator-places-map-card>
      {variant === 'interactive' && (
        <div className="locator-places-map-card__header">
          <Place location={location} withAddress={false} />
          <evg-button variant="ghost">
            <button type="button" onClick={onClose}>
              <locator-icon
                icon="close"
                color="primary"
                label={t('actions.close')}
              />
            </button>
          </evg-button>
        </div>
      )}
      <div className="locator-places-map-card__actions">
        {primaryAction()}
        <evg-button width="full-width" size="sm">
          <a
            href={directions(postcode, location.address)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDirectionsClick}
          >
            {t('actions.directions')}
            <locator-icon icon="external" />
          </a>
        </evg-button>
      </div>
    </locator-places-map-card>
  );
}
