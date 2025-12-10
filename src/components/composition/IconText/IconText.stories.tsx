import type { Meta, StoryObj } from '@storybook/preact';

import './IconText';

const meta: Meta = {
  title: 'Components/Composition/IconText',
};

export default meta;

export const IconText: StoryObj = {
  render: () => (
    <>
      <locator-icon-text className="diamond-spacing-bottom-md">
        <locator-icon-circle>
          <locator-icon icon="search" color="primary"></locator-icon>
        </locator-icon-circle>
        <h3>Text</h3>
      </locator-icon-text>

      <locator-icon-text>
        <locator-icon icon="search" color="primary"></locator-icon>
        <h3>Text</h3>
      </locator-icon-text>
    </>
  ),
};
