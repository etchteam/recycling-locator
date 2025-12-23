import { Meta, StoryObj } from '@storybook/preact';

import './Loading';

const meta: Meta = {
  title: 'Components/Canvas/Loading',
};

export default meta;

export const Loading: StoryObj = {
  render: () => (
    <locator-loading>
      <locator-hero>
        <locator-icon icon="distance" color="muted"></locator-icon>
        <h3>Loading...</h3>
      </locator-hero>
    </locator-loading>
  ),
};
