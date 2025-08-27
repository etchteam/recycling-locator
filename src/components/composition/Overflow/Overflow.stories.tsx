import { Meta, StoryObj } from '@storybook/preact';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';

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
            <diamond-card muted>Item 1</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 2</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 3</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 4</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 5</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 6</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 7</diamond-card>
          </li>
          <li>
            <diamond-card muted>Item 8</diamond-card>
          </li>
        </ul>
      </locator-overflow>
    </div>
  ),
};
