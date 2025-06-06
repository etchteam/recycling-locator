/* eslint-disable jsx-a11y/no-autofocus */
import { Signal, signal } from '@preact/signals';
import debounce from 'lodash/debounce';
import { Component, createRef } from 'preact';
import '@etchteam/diamond-ui/control/Input/Input';

import config from '@/config';
import i18n from '@/lib/i18n';
import { captureException } from '@/lib/sentry';
import '@/components/content/Icon/Icon';

interface HereMapsAutosuggestResult {
  items: {
    title: string;
  }[];
}

interface LocationInputProps {
  readonly inputId?: string;
  readonly placeholder?: string;
  readonly valid?: boolean;
  readonly autofocus?: boolean;
  readonly disabled?: boolean;
  readonly handleBlur?: (value: string) => void;
  readonly handleInput?: (value: string) => void;
}

/**
 * An autosuggest input for locations.
 * The autosuggest list will appear after > 3 characters are entered.
 */
export default class LocationInput extends Component<LocationInputProps> {
  apiKey = config.mapsPlacesKey;
  autosuggestEndpoint = 'https://autosuggest.search.hereapi.com/v1/autosuggest';
  boundingBox = '-7.57216793459,49.959999905,1.68153079591,58.6350001085';
  resultTypes = 'address,place';
  locationSuggestions: Signal<string[]>;
  inputRef = createRef<HTMLInputElement>();

  constructor(props: LocationInputProps) {
    super(props);
    this.locationSuggestions = signal([]);
  }

  autosuggest = async (query: string): Promise<HereMapsAutosuggestResult> => {
    try {
      const safeQuery = encodeURIComponent(query);
      const apiKey = `apiKey=${this.apiKey}`;
      const bbox = `in=bbox:${this.boundingBox}`;
      const resultTypes = `result_types=${this.resultTypes}`;
      const response = await fetch(
        `${this.autosuggestEndpoint}?q=${safeQuery}&${apiKey}&${bbox}&${resultTypes}`,
      );
      return response.json();
    } catch (error) {
      captureException(error, { component: 'LocationInput' });
      return Promise.resolve({ items: [] });
    }
  };

  handleInput = debounce(async (query: string) => {
    if (query.length <= 3) {
      return;
    }

    const result = await this.autosuggest(query);
    const locations = result.items.map((item) => item.title);
    this.locationSuggestions.value = locations;
    this.props.handleInput?.(query);
  }, 750);

  handleBlur = (event: preact.JSX.TargetedEvent<HTMLInputElement>) => {
    this.props.handleBlur?.(event.currentTarget.value);
  };

  render() {
    const locations = this.locationSuggestions.value;
    const inputId = this.props['input-id'] ?? 'locator-location-input';
    const listId = `locator-${inputId}-locations`;
    const placeholder = this.props.placeholder ?? '';
    const valid = this.props.valid ?? true;

    return (
      <>
        <diamond-input state={valid ? undefined : 'invalid'}>
          <locator-icon icon="pin" color="primary" />
          <input
            type="text"
            name="location"
            autoFocus={this.props.autofocus}
            disabled={this.props.disabled}
            autoComplete="street-address"
            placeholder={placeholder}
            id={inputId}
            list={listId}
            onInput={(event) => this.handleInput(event.currentTarget?.value)}
            onBlur={this.handleBlur}
            ref={this.inputRef}
            aria-invalid={!valid}
            aria-errormessage={!valid ? 'location-input-error' : undefined}
          />
        </diamond-input>
        {!valid && (
          <p
            id="location-input-error"
            className="text-color-negative diamond-text-size-sm diamond-spacing-top-xs"
            aria-live="polite"
          >
            {i18n.t('components.locationInput.error')}
          </p>
        )}
        <datalist id={listId}>
          {[...new Set(locations)].map((location) => {
            if (location === this.inputRef?.current?.value) {
              return null;
            }

            return (
              <option value={location} key={location}>
                {location}
              </option>
            );
          })}
        </datalist>
      </>
    );
  }
}
