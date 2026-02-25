import { useTranslation } from 'react-i18next';

import LinkCard from '@/components/control/LinkCard/LinkCard';
import tArray from '@/lib/tArray';

interface DeliveryProvider {
  id: string;
  category: 'mixed-food' | 'cleaning' | 'personal-care';
  url: string;
}

const deliveryProviders: DeliveryProvider[] = [
  {
    id: 'abel-and-cole',
    category: 'mixed-food',
    url: 'https://www.abelandcole.co.uk',
  },
  {
    id: 'beauty-kitchen',
    category: 'personal-care',
    url: 'https://www.abelandcole.co.uk',
  },
  {
    id: 'milk-and-more',
    category: 'mixed-food',
    url: 'https://www.milkandmore.co.uk',
  },
  {
    id: 'the-modern-milkman',
    category: 'mixed-food',
    url: 'https://www.abelandcole.co.uk',
  },
  {
    id: 'yoyo',
    category: 'mixed-food',
    url: 'https://www.abelandcole.co.uk',
  },
  {
    id: 'ocado',
    category: 'mixed-food',
    url: 'https://www.abelandcole.co.uk',
  },
];

export default function HomeDeliveryPage() {
  const { t } = useTranslation();

  return (
    <evg-enter type="fade">
      <evg-section padding="md" className="theme-positive-muted">
        <locator-wrap max-width="none" gutter="fluid">
          <evg-grid
            gap="md"
            align-items="center"
            justifyContent="space-between"
            wrap="wrap"
          >
            <evg-grid-item shrink small-mobile="12" large-tablet="8">
              <h2>{t('refill.homeDelivery.title')}</h2>
              <p className="evg-text-weight-bold">
                {t('refill.homeDelivery.subtitle')}
              </p>
              <ol>
                {tArray('refill.homeDelivery.steps.items').map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </evg-grid-item>
            <evg-grid-item small-mobile="12" large-tablet="4">
              <evg-img>
                <img
                  src="/images/refill/home-delivery-hero.webp"
                  alt=""
                  width="300"
                  height="200"
                />
              </evg-img>
            </evg-grid-item>
          </evg-grid>
        </locator-wrap>
      </evg-section>
      <locator-wrap
        max-width="none"
        gutter="fluid"
        className="evg-spacing-top-lg"
      >
        <h3
          id="provides-title"
          className="evg-text-size-body-sm evg-text-weight-bold"
        >
          {t('refill.homeDelivery.providersTitle')}
        </h3>

        <locator-places-grid className="evg-spacing-bottom-lg">
          <nav aria-labelledby="provides-title">
            <ul>
              {deliveryProviders.map((provider) => {
                const providerName = t(
                  `refill.homeDelivery.providers.${provider.id}.name`,
                );
                return (
                  <li key={provider.id}>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <evg-enter type="fade">
                        <LinkCard>
                          <evg-card-content>
                            <evg-row gap="sm">
                              <evg-img radius="sm">
                                <img
                                  src={`/images/refill/logos/${provider.id}.webp`}
                                  alt={`${providerName} logo`}
                                  width="48"
                                  height="48"
                                />
                              </evg-img>
                              <div>
                                <h4 className="evg-spacing-bottom-xs">
                                  {providerName}
                                </h4>
                                <evg-row gap="sm">
                                  <locator-icon
                                    icon={provider.category}
                                    color="primary"
                                  />
                                  <p className="evg-text-size-body-xs evg-spacing-bottom-none">
                                    {t(`refill.category.${provider.category}`)}
                                  </p>
                                </evg-row>
                              </div>
                            </evg-row>
                            <p className="evg-text-size-body-sm hidden visible-tablet">
                              {t(
                                `refill.homeDelivery.providers.${provider.id}.description`,
                              )}
                            </p>
                          </evg-card-content>
                        </LinkCard>
                      </evg-enter>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </locator-places-grid>
      </locator-wrap>
    </evg-enter>
  );
}
