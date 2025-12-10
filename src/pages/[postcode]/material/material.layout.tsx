import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
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

export default function MaterialLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          <Link href={`/${postcode}`}>
            <locator-logo type="logo-only"></locator-logo>
          </Link>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <diamond-button>
              <Link href={`/${postcode}`}>
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
      {children}
    </locator-layout>
  );
}
