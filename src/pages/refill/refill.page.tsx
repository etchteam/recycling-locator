import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/canvas/Section/Section';

import RefillLayout from './refill.layout';
const pages = ['guide', 'options', 'benefits'];

const tempReviews = [
  {
    name: 'John Doe',
    rating: 5,
    review:
      'I was amazed by how much money I saved – and the olive oil tastes incredible!',
  },
  {
    name: 'Jane Smith',
    rating: 4,
    review:
      'I was amazed by how much money I saved – and the olive oil tastes incredible!',
  },
  {
    name: 'Joe Bloggs',
    rating: 5,
    review:
      'I was amazed by how much money I saved – and the olive oil tastes incredible!',
  },
  {
    name: 'John Smith',
    rating: 4,
    review:
      'I was amazed by how much money I saved – and the olive oil tastes incredible!',
  },
  {
    name: 'Jo Brown',
    rating: 5,
    review:
      'I was amazed by how much money I saved – and the olive oil tastes incredible!',
  },
];

export default function RefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <RefillLayout>
      <diamond-section padding="lg">
        <h2>{t('refill.start.title')}</h2>
        <h3 className="diamond-text-size-base diamond-text-weight-bold">
          {t('refill.start.comingSoon')}
        </h3>

        <locator-overflow>
          <ul>
            {pages.map((page) => (
              <li key={page}>
                <locator-card-link>
                  <Link
                    to={'/refill/' + page + postcodeQuery}
                    unstable_viewTransition
                  >
                    <locator-card-link-img>
                      <img
                        src={`${publicPath}images/refill/${page}.webp`}
                        alt=""
                      />
                    </locator-card-link-img>
                    <locator-card-link-content>
                      <p className="diamond-text-weight-bold diamond-spacing-bottom-none">
                        {t(`refill.start.nav.${page}.title`)}
                      </p>
                      <p>{t(`refill.start.nav.${page}.description`)}</p>
                    </locator-card-link-content>
                  </Link>
                </locator-card-link>
              </li>
            ))}
          </ul>
        </locator-overflow>

        <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-lg">
          {t('refill.start.reviews.title')}
        </h3>
        <locator-overflow largeScreen>
          <ul>
            {tempReviews.map((review) => (
              <li key={review.name}>
                <diamond-card className="theme-info">
                  <diamond-grid align-items="center" gap="sm">
                    <diamond-grid-item>
                      <h4 className="diamond-spacing-bottom-none">
                        {review.name}
                      </h4>
                    </diamond-grid-item>
                    <diamond-grid-item>
                      <span
                        aria-label={
                          t('refill.start.reviews.rating', {
                            rating: review.rating,
                          }) as string
                        }
                      >
                        <locator-star-rating
                          rating={review.rating}
                          aria-hidden
                        />
                      </span>
                    </diamond-grid-item>
                  </diamond-grid>
                  <p>{review.review}</p>
                </diamond-card>
              </li>
            ))}
          </ul>
        </locator-overflow>

        <locator-icon-link border className="diamond-spacing-top-md">
          <Link to={'/refill/sign-up' + postcodeQuery} unstable_viewTransition>
            <locator-icon-circle>
              <locator-icon icon="home-pin" color="primary"></locator-icon>
            </locator-icon-circle>
            <div>
              <p className="diamond-text-size-base diamond-spacing-bottom-none">
                {t('refill.start.alerts.title')}
              </p>
              <p className="diamond-text-size-sm">
                {t('refill.start.alerts.description')}
              </p>
            </div>
          </Link>
        </locator-icon-link>
      </diamond-section>
    </RefillLayout>
  );
}
