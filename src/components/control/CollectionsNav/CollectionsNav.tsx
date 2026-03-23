import { useSignal } from '@preact/signals';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';

export default function CollectionsNav({
  propertyTypes,
  hasBulkyWaste,
  currentlySelected,
}: {
  readonly propertyTypes: string[];
  readonly hasBulkyWaste: boolean;
  readonly currentlySelected: string;
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const menuOpen = useSignal(false);

  function handleMenuItemClick() {
    menuOpen.value = false;
    menuRef.current?.removeAttribute('open');
  }

  return (
    <locator-context-header>
      {propertyTypes.length > 1 ? (
        <locator-details menu>
          <details ref={menuRef}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <summary onClick={() => (menuOpen.value = !menuOpen.value)}>
              {menuOpen.value
                ? t('homeRecycling.collection.summary')
                : currentlySelected}
              <locator-icon icon="expand" />
            </summary>
            <nav>
              <ul>
                {propertyTypes.map((type) => (
                  <li key={type}>
                    <Link
                      href={`/${postcode}/home/collection?propertyType=${type}`}
                      onClick={handleMenuItemClick}
                    >
                      <evg-grid align-items="center" gap="xs">
                        <evg-grid-item grow shrink>
                          {type}
                        </evg-grid-item>
                        <evg-grid-item>
                          <locator-icon icon="arrow-right" />
                        </evg-grid-item>
                      </evg-grid>
                    </Link>
                  </li>
                ))}
                {hasBulkyWaste && (
                  <li>
                    <Link
                      href={`/${postcode}/home/bulky-collection`}
                      onClick={handleMenuItemClick}
                    >
                      <evg-grid align-items="center" gap="xs">
                        <evg-grid-item grow shrink>
                          {t('homeRecycling.bulkyCollection.title')}
                        </evg-grid-item>
                        <evg-grid-item>
                          <locator-icon icon="arrow-right" />
                        </evg-grid-item>
                      </evg-grid>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </details>
        </locator-details>
      ) : (
        <span className="evg-text-weight-bold">{currentlySelected}</span>
      )}
    </locator-context-header>
  );
}
