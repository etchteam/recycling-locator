import groupBy from 'lodash/groupBy';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
import { useMaterials } from '@/hooks/useMaterials';
import tArray from '@/lib/tArray';
import { Material } from '@/types/locatorApi';

function AtoZPageContent({
  materials,
}: {
  readonly materials: readonly Material[];
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const alphabet = tArray('places.search.aToZ.alphabet');
  const multiLetterChars = alphabet.filter((letter) => letter.length > 1);
  const groupedMaterials = groupBy(materials, (material) => {
    // Wales alphabet has multi-letter characters, need to match them first
    const multiLetterChar = multiLetterChars.find(
      (letter) => material.name.slice(0, letter.length) === letter,
    );
    return multiLetterChar || material.name[0].toUpperCase();
  });
  const availableLetters = Object.keys(groupedMaterials).sort(
    (letterA, letterB) => {
      return letterA.localeCompare(letterB);
    },
  );

  function scrollToLetter(event: Event, letter: string) {
    event?.preventDefault();
    const element = (event.currentTarget as HTMLAnchorElement)
      ?.closest('locator-wrap')
      ?.querySelector(`#letter-${letter}`);

    if (element?.hasAttribute('disabled')) {
      return;
    }

    element?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function backToTop(event: Event) {
    event?.preventDefault();
    const element = (event.currentTarget as HTMLAnchorElement)
      ?.closest('locator-wrap')
      ?.querySelector('locator-alphabet-nav');

    element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  return (
    <diamond-enter type="fade">
      <locator-alphabet-nav className="diamond-spacing-bottom-lg">
        <nav>
          <ul>
            {alphabet.map((letter) => (
              <li key={letter}>
                <diamond-button width="square">
                  <Link
                    href={`#letter-${letter}`}
                    disabled={!availableLetters.includes(letter)}
                    aria-hidden={!availableLetters.includes(letter)}
                    onClick={(event) => scrollToLetter(event, letter)}
                  >
                    {letter}
                  </Link>
                </diamond-button>
              </li>
            ))}
          </ul>
        </nav>
      </locator-alphabet-nav>
      {availableLetters.map((letter) => (
        <>
          <diamond-grid>
            <diamond-grid-item grow shrink>
              <h3
                className="diamond-text-weight-bold diamond-text-size-h4 scroll-anchor"
                id={`letter-${letter}`}
              >
                {letter}
              </h3>
            </diamond-grid-item>
            <diamond-grid-item>
              <diamond-button variant="text" width="square" size="sm">
                <button type="button" onClick={backToTop}>
                  <locator-icon
                    icon="arrow-up"
                    label={t('places.search.aToZ.backToTop')}
                    color="primary"
                  />
                </button>
              </diamond-button>
            </diamond-grid-item>
          </diamond-grid>
          <locator-bordered-list
            className="diamond-spacing-bottom-md"
            size="sm"
          >
            <nav>
              <ul>
                {groupedMaterials[letter].map((material) => {
                  const placesSearchParams = new URLSearchParams();
                  placesSearchParams.set('materials', material.id);
                  placesSearchParams.set('search', material.name);

                  return (
                    <li key={material.id}>
                      <Link
                        href={`/${postcode}/places?${placesSearchParams.toString()}`}
                      >
                        {material.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </locator-bordered-list>
        </>
      ))}
    </diamond-enter>
  );
}

export default function AtoZPage() {
  const { data: materials, loading } = useMaterials();

  if (loading || !materials) {
    return null;
  }

  return (
    <diamond-section padding="lg">
      <locator-wrap>
        <AtoZPageContent materials={materials} />
      </locator-wrap>
    </diamond-section>
  );
}
