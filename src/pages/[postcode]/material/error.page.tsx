import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { usePostcode } from '@/lib/PostcodeContext';

/**
 * Material search error boundary
 */
export default function MaterialErrorPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <locator-wrap>
      <diamond-section padding="lg">
        <ErrorPage
          link={`/${postcode}/material/search`}
          message={t('material.error.message')}
          cta={t('actions.searchAgain')}
        />
      </diamond-section>
    </locator-wrap>
  );
}
