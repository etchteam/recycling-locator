import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import materialExistsSearch from '@/lib/materialExistsSearch';

export default function ContainerList({
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
        <diamond-enter type="fade">
          <diamond-card
            className={`theme-${searchResult ? 'positive' : 'negative'}`}
            padding="sm"
            radius
          >
            <locator-icon-text>
              <locator-icon
                icon={`${searchResult ? 'tick' : 'cross'}-circle`}
              ></locator-icon>
              <p className="diamond-text-size-sm">{message}</p>
            </locator-icon-text>
          </diamond-card>
        </diamond-enter>
      )}
    </>
  );
}
