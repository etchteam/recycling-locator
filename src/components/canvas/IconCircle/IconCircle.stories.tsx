import { Meta, StoryObj } from '@storybook/preact';

import './IconCircle';

const meta: Meta = {
  title: 'Components/Canvas/IconCircle',
};

export default meta;

export const Neutral: StoryObj = {
  render: () => (
    <locator-icon-circle>
      <locator-icon icon="search"></locator-icon>
    </locator-icon-circle>
  ),
};

export const Positive: StoryObj = {
  render: () => (
    <locator-icon-circle variant="positive">
      <locator-icon icon="search"></locator-icon>
    </locator-icon-circle>
  ),
};

export const Negative: StoryObj = {
  render: () => (
    <locator-icon-circle variant="negative">
      <locator-icon icon="search"></locator-icon>
    </locator-icon-circle>
  ),
};
