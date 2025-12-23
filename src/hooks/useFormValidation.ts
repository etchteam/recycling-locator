import { useSignal } from '@preact/signals';

/**
 * Basic validation and submit handling for a form with a single input.
 */
export default function useFormValidation(fieldName: string) {
  const valid = useSignal(true);
  const submitting = useSignal(false);

  const handleSubmit = (event) => {
    const form = event?.submitter?.form ?? undefined;
    const value = new FormData(form).get(fieldName) as string;

    if (value) {
      submitting.value = true;
    } else {
      event.preventDefault();
      valid.value = false;
    }
  };

  const handleBlur = (value: string) => {
    valid.value = Boolean(value);
  };

  const handleInput = (value: string) => {
    if (value) {
      valid.value = true;
    }
  };

  return {
    valid,
    submitting,
    handleSubmit,
    handleBlur,
    handleInput,
  };
}
