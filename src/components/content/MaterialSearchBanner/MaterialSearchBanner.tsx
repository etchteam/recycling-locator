import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import materialExistsSearch from '@/lib/materialExistsSearch';

export default function MaterialSearchBanner({
  search,
  searchResult,
  message,
}: {
  readonly search: string;
  readonly searchResult: boolean;
  readonly message: string;
}) {
  const materialExists = useSignal<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      materialExists.value = await materialExistsSearch(search);
    };
    fetchData();
  }, [search]);

  return (
    <>
      {materialExists.value && (
        <evg-enter type="fade">
          <evg-card
            className={`theme-${searchResult ? 'positive' : 'negative'}`}
            padding="sm"
            radius="sm"
          >
            <evg-card-content>
              <locator-icon-text>
                <locator-icon
                  icon={`${searchResult ? 'tick' : 'cross'}-circle`}
                  color={searchResult ? undefined : 'white'}
                ></locator-icon>
                <p
                  className={`evg-text-size-body-xs${searchResult ? '' : ' text-color-white'}`}
                >
                  {message}
                </p>
              </locator-icon-text>
            </evg-card-content>
          </evg-card>
        </evg-enter>
      )}
    </>
  );
}
