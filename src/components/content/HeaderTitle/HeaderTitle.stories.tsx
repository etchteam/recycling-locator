import { Meta, StoryObj } from '@storybook/preact';

import './HeaderTitle';

const meta: Meta = {
  title: 'Components/Content/HeaderTitle',
};

export default meta;

export const HeaderTitle: StoryObj = {
  render: () => (
    <locator-header-title>
      <evg-button>
        <a href="#link">
          <locator-icon icon="arrow-left" label="Back"></locator-icon>
        </a>
      </evg-button>
      <div>
        <h2>Recycle a specific item</h2>
        <p>EX327RB</p>
      </div>
    </locator-header-title>
  ),
};
