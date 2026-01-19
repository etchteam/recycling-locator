import { useTranslation } from 'react-i18next';

export interface LoadingPlacesListProps {
  /** Number of skeleton cards to display (default: 3) */
  readonly cardCount?: number;
}

/**
 * Loading skeleton for places list pages
 * Shows a heading and animated skeleton cards in a grid
 */
export default function LoadingPlacesList({
  cardCount = 3,
}: LoadingPlacesListProps) {
  const { t } = useTranslation();

  const delays = [0, 0.5, 1];

  return (
    <>
      <h3 className="evg-text-size-body-lg evg-spacing-bottom-md">
        {t('places.loading')}
      </h3>
      <locator-places-grid>
        <ul>
          {Array.from({ length: cardCount }, (_, index) => (
            <li key={index}>
              <evg-enter
                type="fade-in-up"
                delay={delays[index % delays.length]}
              >
                <locator-loading-card></locator-loading-card>
              </evg-enter>
            </li>
          ))}
        </ul>
      </locator-places-grid>
    </>
  );
}
