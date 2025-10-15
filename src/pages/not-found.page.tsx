import { useTranslation } from 'react-i18next';
import { useRouteError, ErrorResponse, Link } from 'react-router';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/canvas/Tip/Tip';
import '@/components/control/LocationInput/LocationInput';
import PostCodeResolver from '@/lib/PostcodeResolver';
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
 * This is both an error boundary and a 404 page, so the user could end up here if:
 * - They visit a route that doesn't exist
 * - An exception is thrown in a child route
 */
export default function NotFoundPage() {
  const { t } = useTranslation();
  const error = useRouteError() as ErrorResponse | undefined;

  if (error && error.status !== 404) {
    // If this isn't a 404, bubble the exception up to the generic error boundary
    throw error;
  }

  const notInUk = error?.data === PostCodeResolver.ERROR_NOT_IN_UK;
  const postcodeTypo = error?.data === PostCodeResolver.ERROR_POSTCODE_TYPO;
  const suggestedPostcode = postcodeTypo ? error?.statusText : null;

  return (
    <StartLayout aside={<Aside />}>
      <locator-wrap>
        <diamond-section padding="lg">
          <h2>{t(`notFound.title.${notInUk ? 'notInTheUK' : 'default'}`)}</h2>
          {notInUk && <p>{t('notFound.ukOnly')}</p>}
          {postcodeTypo && suggestedPostcode && (
            <p>
              {t('notFound.didYouMean')}
              <Link to={`/${suggestedPostcode}`}>{suggestedPostcode}</Link>
            </p>
          )}
          <LocationForm label={t('notFound.label')} cta={t('notFound.cta')} />
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
