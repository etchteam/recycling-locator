import { useTranslation } from 'react-i18next';
import { Link, Outlet, useParams } from 'react-router';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';

import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/canvas/ContextHeader/ContextHeader';
import '@/components/canvas/Tip/Tip';
import '@/components/composition/Wrap/Wrap';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';

export default function MaterialLayout() {
  const { t } = useTranslation();
  const { postcode } = useParams();

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          <Link to={`/${postcode}`}>
            <locator-logo type="logo-only"></locator-logo>
          </Link>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <diamond-button>
              <Link to={`/${postcode}`}>
                <locator-icon icon="arrow-left" label="Back"></locator-icon>
              </Link>
            </diamond-button>
            <div>
              <h2>{t('material.title')}</h2>
              <p>{postcode}</p>
            </div>
          </locator-header-title>
        </locator-header-content>
      </locator-header>
      <Outlet />
    </locator-layout>
  );
}
