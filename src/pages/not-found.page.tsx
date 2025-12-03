import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/canvas/Tip/Tip';
import '@/components/control/LocationInput/LocationInput';
import StartLayout from '@/pages/start.layout';

import LocationForm from './LocationForm';

function Aside() {
  const { t } = useTranslation();

  const links = [
    {
      href: 'https://www.gov.im/categories/home-and-neighbourhood/recycling/recycling-locations/',
      label: t('notFound.aside.isleOfMan'),
    },
    {
      href: 'https://www.gov.je/Environment/WasteReduceReuseRecycle/pages/default.aspx',
      label: t('notFound.aside.jersey'),
    },
    {
      href: 'https://www.gov.gg/recycling',
      label: t('notFound.aside.guernsey'),
    },
  ];

  return (
    <locator-tip slot="layout-aside">
      <locator-wrap>
        <p>{t('notFound.aside.content')}</p>
        <ul>
          {links.map(({ href, label }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </locator-wrap>
    </locator-tip>
  );
}

/**
 * 404 Not Found page
 * Displayed when the user visits a route that doesn't exist
 */
export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <StartLayout aside={<Aside />}>
      <locator-wrap>
        <diamond-section padding="lg">
          <h2>{t('notFound.title.default')}</h2>
          <LocationForm label={t('notFound.label')} cta={t('notFound.cta')} />
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
