import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import '@etchteam/diamond-ui/control/Button/Button';

export default function ErrorPage({
  link = '/',
  message,
  cta,
}: {
  readonly link?: string;
  readonly message?: string;
  readonly cta?: string;
}) {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('error.title')}</h2>
      {message && <p>{message}</p>}
      <p className="diamond-text-size-sm">{t('error.message')}</p>
      <p className="diamond-spacing-bottom-md diamond-text-weight-bold">
        {t('error.label')}
      </p>
      <diamond-button width="full-width" variant="primary">
        <Link to={link}>{cta ?? t('error.cta')}</Link>
      </diamond-button>
    </>
  );
}
