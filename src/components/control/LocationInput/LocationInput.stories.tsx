import { StoryObj } from '@storybook/preact';

import LocationInputComponent from './LocationInput';

const meta = {
  title: 'Components/Control/LocationInput',
  component: LocationInputComponent,
};

export default meta;

export const LocationInput: StoryObj = {
  render: () => (
    <>
      <label htmlFor="custom-location-input">Enter a town or postcode</label>
      <LocationInputComponent input-id="custom-location-input" />
    </>
  ),
};
