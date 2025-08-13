import { Meta, StoryObj } from '@storybook/preact';
import '@etchteam/diamond-ui/canvas/Card/Card';

import './Steps';

const meta: Meta = {
  title: 'Components/Content/Steps',
};

export default meta;

export const Steps: StoryObj = {
  render: () => (
    <locator-steps>
      <ol>
        <li>Use the locator to find a refill store near you</li>
        <li>Take along empty containers to fill up</li>
        <li>Pick and choose what you want to refill</li>
      </ol>
    </locator-steps>
  ),
};
