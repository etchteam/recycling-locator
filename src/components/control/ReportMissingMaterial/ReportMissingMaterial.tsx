import { useSignal } from '@preact/signals';
import { useCallback, useEffect } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';

import useAnalytics from '@/hooks/useAnalytics';
import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import { CustomElement } from '@/types/customElement';
import { MaterialCategory } from '@/types/locatorApi';

export default function ReportMissingMaterial({
  missingMaterial,
}: {
  readonly missingMaterial: string;
}) {
  const { t } = useTranslation();
  const tContext = 'components.reportMissingMaterial';
  const feedbackFormOpen = useSignal(false);
  const materialCategories = useSignal<string[]>([]);
  const selectedCategory = useSignal<string | null>(null);
  const showCategoryError = useSignal(false);
  const hasSubmittedFeedback = useSignal(false);
  const { recordEvent } = useAnalytics();

  useEffect(() => {
    // Reset the form state when the missing material changes
    feedbackFormOpen.value = false;
    selectedCategory.value = null;
    hasSubmittedFeedback.value = false;
  }, [missingMaterial]);

  const toggleFeedbackForm = useCallback(async () => {
    feedbackFormOpen.value = !feedbackFormOpen.value;

    if (materialCategories.value.length > 0) {
      return;
    }

    try {
      const materialCategoriesResponse = await LocatorApi.getInstance().get<
        MaterialCategory[]
      >('material-categories');

      materialCategories.value = materialCategoriesResponse.map(
        (category) => category.name,
      );
    } catch (error) {
      captureException(error, { component: 'ReportMissingMaterial' });
    }
  }, []);

  const sendFeedback = useCallback(() => {
    if (!selectedCategory.value) {
      showCategoryError.value = true;
      return;
    }

    recordEvent({
      category: 'Material::Feedback',
      action: `Missing material: ${missingMaterial}, Suggested category: ${selectedCategory.value}`,
    });

    hasSubmittedFeedback.value = true;
    feedbackFormOpen.value = false;
  }, []);

  function handleCategoryChange(event: Event) {
    selectedCategory.value = (event.target as HTMLSelectElement).value;
    showCategoryError.value = false;
  }

  if (!missingMaterial) {
    return null;
  }

  return (
    <locator-report-missing-material>
      <locator-icon-text>
        <locator-icon-circle
          variant={hasSubmittedFeedback.value ? 'positive' : undefined}
        >
          <locator-icon
            icon={hasSubmittedFeedback.value ? 'list-tick' : 'list-add'}
            color={hasSubmittedFeedback.value ? undefined : 'primary'}
          ></locator-icon>
        </locator-icon-circle>
        {!hasSubmittedFeedback.value && (
          <p>
            <Trans
              i18nKey={`${tContext}.title`}
              components={{
                button: (
                  <button
                    type="button"
                    className="locator-report-missing-material__toggle"
                    onClick={toggleFeedbackForm}
                    aria-controls="report-missing-material-collapse"
                    aria-expanded={feedbackFormOpen.value}
                  />
                ),
              }}
            />
          </p>
        )}
        <output htmlFor="suggested-category">
          {hasSubmittedFeedback.value ? t(`${tContext}.confirmation`) : ''}
        </output>
      </locator-icon-text>
      <diamond-collapse
        id="report-missing-material-collapse"
        open={feedbackFormOpen.value}
      >
        <diamond-form-group className="diamond-spacing-bottom-md">
          <label
            htmlFor="report-missing-material-category"
            className="diamond-sr-only"
          >
            {t(`${tContext}.placeholder`)}
          </label>
          <diamond-input
            state={showCategoryError.value ? 'invalid' : undefined}
          >
            <select
              id="report-missing-material-category"
              name="suggested-category"
              disabled={!feedbackFormOpen.value}
              onChange={handleCategoryChange}
              aria-invalid={showCategoryError.value}
              aria-errormessage={
                !showCategoryError.value
                  ? 'report-missing-material-category-error'
                  : undefined
              }
            >
              <option value="">{t(`${tContext}.placeholder`)}</option>
              {materialCategories.value.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <locator-icon icon="expand"></locator-icon>
          </diamond-input>
          {showCategoryError.value && (
            <p
              id="report-missing-material-category-error"
              className="text-color-negative diamond-text-size-sm diamond-spacing-top-xs"
              aria-live="polite"
            >
              {t(`${tContext}.error`)}
            </p>
          )}
        </diamond-form-group>
        <diamond-button width="full-width">
          <button type="button" onClick={sendFeedback}>
            {t(`${tContext}.cta`)}
          </button>
        </diamond-button>
      </diamond-collapse>
    </locator-report-missing-material>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-report-missing-material': CustomElement;
    }
  }
}
