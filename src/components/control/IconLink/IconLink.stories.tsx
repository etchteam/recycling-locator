import { Meta, StoryObj } from '@storybook/preact';

import './IconLink';

const meta: Meta = {
  title: 'Components/Control/IconLink',
};

export default meta;

export const IconLink: StoryObj = {
  render: () => (
    <locator-icon-link>
      <a href="#id">
        <locator-icon-circle>
          <locator-icon icon="pin" />
        </locator-icon-circle>
        Nearest places to recycle
      </a>
    </locator-icon-link>
  ),
};
