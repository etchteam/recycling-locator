import { Meta, StoryObj } from '@storybook/preact';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/content/Icon/Icon';
import './HeaderTitle';

const meta: Meta = {
  title: 'Components/Content/HeaderTitle',
};

export default meta;

export const HeaderTitle: StoryObj = {
  render: () => (
    <locator-header-title>
      <diamond-button>
        <a href="#link">
          <locator-icon icon="arrow-left" label="Back"></locator-icon>
        </a>
      </diamond-button>
      <div>
        <h2>Recycle a specific item</h2>
        <p>EX327RB</p>
      </div>
    </locator-header-title>
  ),
};
