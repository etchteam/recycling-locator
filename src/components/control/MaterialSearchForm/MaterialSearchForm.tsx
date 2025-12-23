import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation, useSearchParams } from 'wouter-preact';

import MaterialSearchInput, {
  MaterialSearchInputProps,
} from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useFormValidation from '@/hooks/useFormValidation';
import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import { MaterialSearch } from '@/types/locatorApi';

export default function MaterialSearchForm({
  path = 'material',
  label,
  children,
  ...inputProps
}: MaterialSearchInputProps & {
  readonly path?: 'material' | 'places';
  readonly label?: string;
  readonly children?: ComponentChildren;
}) {
  const { postcode } = usePostcode();
  const [location, setLocation] = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const form = useFormValidation('search');

  useEffect(() => {
    form.submitting.value = false;
  }, [search, location, form.submitting]);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const searchValue = formData.get('search') as string;

    if (!searchValue || !form.valid.value) {
      form.valid.value = false;
      return;
    }

    form.submitting.value = true;

    try {
      const materials = await LocatorApi.getInstance().post<MaterialSearch[]>(
        'materials',
        formData,
      );
      const material =
        materials.find(
          (m) =>
            m.name.toLocaleLowerCase() ===
            searchValue.toLocaleLowerCase().trim(),
        ) ?? materials[0];
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('search', material?.name ?? searchValue);

      if (!material) {
        setLocation(
          `/${postcode}/${path}/search?${newSearchParams.toString()}`,
        );
        return;
      }

      const searchType =
        material.type === 'LocatorMaterialCategory' ? 'category' : 'materials';
      newSearchParams.set(searchType, material.id);
      setLocation(`/${postcode}/${path}?${newSearchParams.toString()}`);
    } catch (error) {
      form.submitting.value = false;
      captureException(error, {
        component: 'MaterialSearchForm',
      });
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <diamond-form-group>
        {label && <label htmlFor="locator-material-input">{label}</label>}
        <MaterialSearchInput {...inputProps} />
      </diamond-form-group>
      {children}
    </form>
  );
}
