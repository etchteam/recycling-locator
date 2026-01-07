import { useTranslation } from 'react-i18next';

import Footer from '@/components/content/Footer/Footer';

export default function About() {
  const { t } = useTranslation();

  return (
    <evg-enter type="fade">
      <h2>{t('about.title')}</h2>
      <p>{t('about.intro')}</p>
      <h3 className="evg-spacing-top-md">{t('about.becomeAPartner.title')}</h3>
      <p>{t('about.becomeAPartner.description')}</p>
      <evg-button width="full-width">
        <a
          href={t('about.becomeAPartner.url')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('about.becomeAPartner.cta')}
        </a>
      </evg-button>
      <h3 className="evg-spacing-top-md">{t('about.feedback.title')}</h3>
      <p>{t('about.feedback.description')}</p>
      <evg-button width="full-width">
        <a
          href={t('about.feedback.url')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('about.feedback.cta')}
        </a>
      </evg-button>
      <hr className="evg-spacing-bottom-md evg-spacing-top-lg" />
      <Footer />
    </evg-enter>
  );
}
