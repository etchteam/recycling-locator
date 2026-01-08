import { Meta, StoryObj } from '@storybook/preact';

import './Overflow';

const meta: Meta = {
  title: 'Components/Composition/Overflow',
};

export default meta;

export const Overflow: StoryObj = {
  render: () => (
    <div style="max-width: 200px;">
      <locator-overflow>
        <ul>
          <li>
            <evg-card>Item 1</evg-card>
          </li>
          <li>
            <evg-card>Item 2</evg-card>
          </li>
          <li>
            <evg-card>Item 3</evg-card>
          </li>
          <li>
            <evg-card>Item 4</evg-card>
          </li>
          <li>
            <evg-card>Item 5</evg-card>
          </li>
          <li>
            <evg-card>Item 6</evg-card>
          </li>
          <li>
            <evg-card>Item 7</evg-card>
          </li>
          <li>
            <evg-card>Item 8</evg-card>
          </li>
        </ul>
      </locator-overflow>
    </div>
  ),
};
