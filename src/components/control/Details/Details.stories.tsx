import { Meta, StoryObj } from '@storybook/preact';

import './Details';

const meta: Meta = {
  title: 'Components/Control/Details',
};

export default meta;

export const Details: StoryObj = {
  render: () => (
    <locator-details>
      <details>
        <summary>
          Details
          <locator-icon icon="expand" />
        </summary>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </details>
    </locator-details>
  ),
};

export const Menu: StoryObj = {
  render: () => (
    <locator-details menu>
      <details>
        <summary>
          Details
          <locator-icon icon="expand" />
        </summary>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </details>
    </locator-details>
  ),
};
