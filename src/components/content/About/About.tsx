import { useTranslation } from 'react-i18next';
import { useRoute } from 'wouter-preact';

import Footer from '@/components/content/Footer/Footer';

export default function About() {
  const { t } = useTranslation();
  const [isRefillHome] = useRoute('/:postcode/refill');
  const [isRefillStart] = useRoute('/refill');
  const isRefill = isRefillStart || isRefillHome;

  return (
    <evg-enter type="fade" className="about">
      <h2>{t('about.title')}</h2>
      <p>{t(isRefill ? 'about.refillIntro' : 'about.intro')}</p>
      <h3>{t('about.becomeAPartner.title')}</h3>
      <p>
        {t(
          isRefill
            ? 'about.becomeAPartner.refillDescription'
            : 'about.becomeAPartner.description',
        )}
      </p>
      <evg-button width="full-width">
        <a
          href={t('about.becomeAPartner.url')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('about.becomeAPartner.cta')}
        </a>
      </evg-button>
      <h3>{t('about.feedback.title')}</h3>
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
      {isRefill && (
        <>
          <h3>{t('about.relatedService.title')}</h3>
          <p>{t('about.relatedService.description')}</p>
          <evg-button width="full-width">
            <a
              href="https://www.refill.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('about.relatedService.cta')}
            </a>
          </evg-button>
        </>
      )}
      <hr />
      <Footer />
    </evg-enter>
  );
}
