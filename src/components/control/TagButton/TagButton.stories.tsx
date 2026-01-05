import { Meta, StoryObj } from '@storybook/preact';

import './TagButton';

const meta: Meta = {
  title: 'Components/Control/TagButton',
};

export default meta;

export const TagButton: StoryObj = {
  render: () => (
    <locator-tag-button>
      <button type="button">
        Tag Button if the text gets too long it truncates
        <locator-icon icon="close" />
      </button>
    </locator-tag-button>
  ),
};

export const TagButtonPositive: StoryObj = {
  render: () => (
    <locator-tag-button variant="positive">
      <button type="button">
        Tag Button
        <locator-icon icon="close" />
      </button>
    </locator-tag-button>
  ),
};

export const TagButtonNegative: StoryObj = {
  render: () => (
    <locator-tag-button variant="negative">
      <button type="button">
        Tag Button
        <locator-icon icon="close" />
      </button>
    </locator-tag-button>
  ),
};
