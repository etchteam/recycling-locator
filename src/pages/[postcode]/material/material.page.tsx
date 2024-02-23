import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useAsyncValue, Await } from 'react-router-dom';

import '@/components/canvas/Loading/Loading';
import '@/components/content/Icon/Icon';
import getDryContainersByMaterial from '@/lib/getDryContainersByMaterial';

import RecycleAtHome from './RecycleAtHome';
import { MaterialLoaderResponse } from './material.loader';

function Loading() {
  const { t } = useTranslation();

  return (
    <locator-loading>
      <locator-hero>
        <locator-icon icon="distance" color="muted" />
        <h3>{t('material.loading')}</h3>
      </locator-hero>
    </locator-loading>
  );
}

function MaterialPageContent() {
  const { t } = useTranslation();
  const { home, locations, materialId } =
    useAsyncValue() as MaterialLoaderResponse;
  const schemes = getDryContainersByMaterial(materialId, home.dryStreams);
  const recyclableAtHome = schemes.some(
    (scheme) => scheme.containers.length > 0,
  );
  const recyclableNearby = locations.length > 0;
  const recyclable = recyclableAtHome || recyclableNearby;

  return (
    <>
      <locator-hero variant={recyclable ? 'positive' : 'negative'}>
        <locator-wrap>
          <locator-icon icon={recyclable ? 'tick-circle' : 'cross-circle'} />
          <h3>{t(`material.hero.${recyclable ? 'yes' : 'no'}`)}</h3>
        </locator-wrap>
      </locator-hero>
      <locator-wrap>
        <RecycleAtHome schemes={schemes} />
      </locator-wrap>
    </>
  );
}

export default function MaterialPage() {
  const { data } = useLoaderData() as { data: Promise<MaterialLoaderResponse> };

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data}>
        <MaterialPageContent />
      </Await>
    </Suspense>
  );
}
