/* eslint-disable jsx-a11y/no-autofocus */
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Signal, signal } from '@preact/signals';
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import { Component, createRef } from 'preact';
import '@etchteam/diamond-ui/control/Input/Input';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/content/Icon/Icon';
import ReportMissingMaterial from '../ReportMissingMaterial/ReportMissingMaterial';
import LocatorApi from '@/lib/LocatorApi';
import i18n from '@/lib/i18n';
import { captureException } from '@/lib/sentry';
import { CustomElement } from '@/types/customElement';
import { Material } from '@/types/locatorApi';

interface MaterialSearchInputProps {
  readonly inputId?: string;
  readonly inputLabelledBy?: string;
  readonly placeholder?: string;
  readonly submitting?: boolean | string;
  readonly defaultValue?: string;
  readonly valid?: boolean;
  readonly autofocus?: boolean;
  readonly includeFeedbackForm?: boolean;
  readonly handleBlur?: (value: string) => void;
  readonly handleInput?: (value: string) => void;
  readonly handleReset?: () => void;
}

/**
 * An autosuggest input for materials.
 * The autosuggest list will appear after > 3 characters are entered.
 */
export default class MaterialSearchInput extends Component<MaterialSearchInputProps> {
  materialSuggestions: Signal<Material[]>;
  materialNotFound: Signal<string | null>;
  inputValue: Signal<string>;
  inputRef = createRef<HTMLInputElement>();
  buttonRef = createRef<HTMLButtonElement>();

  constructor(props: MaterialSearchInputProps) {
    super(props);
    this.materialSuggestions = signal([]);
    this.materialNotFound = signal(null);
    this.inputValue = signal(this.props.defaultValue ?? '');
  }

  autosuggest = async (query: string): Promise<Material[]> => {
    try {
      const body = new FormData();
      body.append('search', query);
      return LocatorApi.post('materials', body);
    } catch (error) {
      captureException(error, { component: 'MaterialSearchInput' });
      return Promise.resolve([]);
    }
  };

  handleInput = debounce(
    async (query: string) => {
      this.inputValue.value = query ?? '';

      if ((query ?? '').length < 3) {
        return;
      }

      const materials = await this.autosuggest(query);
      this.materialSuggestions.value = materials;
      this.props.handleInput?.(query);
    },
    250,
    { leading: true },
  );

  handleBlur = () => {
    this.props.handleBlur?.(this.inputValue.value);
  };

  handleOptionSelected = async (query: string) => {
    this.materialNotFound.value = null;
    // Manually set the value of the input field to the selected option
    // using a ref because combobox doesn't render the value update fast enough
    this.inputRef.current.value = query ?? '';
    // Optimistically submit the form
    this.buttonRef.current?.click();
    // Send the usual input event in case submission fails
    this.handleInput(query);
  };

  handleKeyPress = (
    event: preact.JSX.TargetedKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      this.handleOptionSelected(event.currentTarget?.value ?? '');
    }
  };

  handleButtonClick = (event: Event) => {
    const query = this.inputRef.current.value;

    const matchingMaterialNames =
      this.materialSuggestions.value
        ?.filter?.(
          (material) =>
            material.name.toLocaleLowerCase() === query.toLocaleLowerCase(),
        )
        .map((material) => material.name) ?? [];

    const isRealMaterial = matchingMaterialNames?.length > 0;

    // Update the query value when it matches a real material but the capitalisation is different
    if (isRealMaterial && !matchingMaterialNames.includes(query)) {
      this.inputRef.current.value = matchingMaterialNames[0];
    }

    if (!isRealMaterial && query) {
      event.preventDefault();
      this.materialNotFound.value = query;
    }
  };

  render() {
    const inputId = this.props.inputId ?? 'locator-material-input';
    const submitting = this.props.submitting ?? false;
    const materialNotFound = this.materialNotFound.value;
    const valid = materialNotFound === null && (this.props.valid ?? true);
    const placeholder =
      this.props.placeholder ??
      i18n.t('components.materialSearchInput.placeholder');
    const materials = [...new Set(this.materialSuggestions.value)];
    let showMaterials = this.inputValue.value && materials.length > 0;

    if (
      this.inputValue.value &&
      materials.length === 1 &&
      materials[0].name === this.inputValue.value
    ) {
      showMaterials = false;
    }

    return (
      <>
        <locator-material-search-input>
          <Combobox
            value={this.inputValue.value}
            onChange={this.handleOptionSelected}
          >
            {(open) => (
              <>
                <diamond-input state={valid ? undefined : 'invalid'}>
                  <ComboboxInput
                    name="search"
                    type="text"
                    autoComplete="off"
                    ref={this.inputRef}
                    placeholder={placeholder}
                    onChange={(event) =>
                      this.handleInput(event.currentTarget?.value)
                    }
                    onBlur={this.handleBlur}
                    onKeyUp={this.handleKeyPress}
                    id={inputId}
                    autoFocus={this.props.autofocus}
                    aria-labelledby={this.props.inputLabelledBy}
                    aria-invalid={!valid}
                    aria-errormessage={
                      !valid ? `${this.props.inputId}-error` : undefined
                    }
                  />
                  {this.inputValue.value && (
                    <button
                      type="reset"
                      onClick={() => {
                        this.inputValue.value = '';
                        this.materialNotFound.value = null;
                        this.props.handleReset?.();
                      }}
                    >
                      <locator-icon
                        icon="close"
                        label={i18n.t('actions.resetSearch')}
                      />
                    </button>
                  )}
                </diamond-input>
                {open && showMaterials && (
                  <ComboboxOptions static>
                    {materials.map((material) => {
                      const displayName = this.inputValue.value
                        ? material.name.replace(
                            RegExp(escapeRegExp(this.inputValue.value), 'ig'),
                            (match) =>
                              `<span class="diamond-text-weight-bold">${match}</span>`,
                          )
                        : material.name;

                      return (
                        <ComboboxOption
                          key={material.id}
                          value={material.name}
                          dangerouslySetInnerHTML={{ __html: displayName }}
                        />
                      );
                    })}
                  </ComboboxOptions>
                )}
              </>
            )}
          </Combobox>
          <diamond-button width="square" variant="primary">
            <button
              type="submit"
              ref={this.buttonRef}
              disabled={submitting && submitting !== 'false'}
              onClick={this.handleButtonClick}
            >
              <locator-icon
                icon="search"
                label={i18n.t('actions.search')}
              ></locator-icon>
            </button>
          </diamond-button>
        </locator-material-search-input>
        {!valid && (
          <p
            id={`${this.props.inputId}-error`}
            className="text-color-negative diamond-spacing-top-sm"
            aria-live="polite"
          >
            {materialNotFound
              ? i18n.t('components.materialSearchInput.notFound')
              : i18n.t('components.materialSearchInput.error')}
          </p>
        )}
        {materialNotFound && this.props.includeFeedbackForm && (
          <ReportMissingMaterial
            missingMaterial={this.materialNotFound.value}
          />
        )}
      </>
    );
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-material-search-input': CustomElement;
    }
  }
}
