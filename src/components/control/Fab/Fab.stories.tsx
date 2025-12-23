import { Meta, StoryObj } from '@storybook/preact';

import './Fab';

const meta: Meta = {
  title: 'Components/Control/Fab',
};

export default meta;

export const Fab: StoryObj = {
  render: () => (
    <div style="position: relative;height: 200px;overflow-y:scroll;">
      <locator-fab position="top">
        <diamond-button size="sm">
          <button type="button">Floating top button</button>
        </diamond-button>
      </locator-fab>
      {[...Array(50).keys()].map((key) => (
        <div key={key}>
          <a href="#link">
            Clickable content that extends past the scroll area
          </a>
        </div>
      ))}
      <locator-fab>
        <diamond-button variant="primary" size="sm">
          <button type="button">Floating bottom button</button>
        </diamond-button>
      </locator-fab>
    </div>
  ),
};
