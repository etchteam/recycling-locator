import { Meta, StoryObj } from '@storybook/preact';

import './PlaceSummary';

const meta: Meta = {
  title: 'Components/Content/PlaceSummary',
};

export default meta;

export const PlaceSummary: StoryObj = {
  render: () => (
    <diamond-card border radius>
      <locator-place-summary>
        <h4>Place name if this is really long it gets truncated</h4>
        <p>Address, if this is really long it also gets truncated</p>
        <dl>
          <dd>0.42</dd>
          <dt>miles</dt>
          <dd>9</dd>
          <dt>materials accepted</dt>
        </dl>
      </locator-place-summary>
    </diamond-card>
  ),
};
