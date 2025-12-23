import { Meta, StoryObj } from '@storybook/preact';

const meta: Meta = {
  title: 'Styles/Button',
};

export default meta;

export const Button: StoryObj = {
  render: () => (
    <diamond-grid wrap="wrap">
      <diamond-grid-item>
        <diamond-button>
          <button>Button</button>
        </diamond-button>
      </diamond-grid-item>
      <diamond-grid-item>
        <diamond-button>
          <button disabled>Button</button>
        </diamond-button>
      </diamond-grid-item>
    </diamond-grid>
  ),
};

export const Primary: StoryObj = {
  render: () => (
    <diamond-grid wrap="wrap">
      <diamond-grid-item>
        <diamond-button variant="primary">
          <button>Button</button>
        </diamond-button>
      </diamond-grid-item>
      <diamond-grid-item>
        <diamond-button variant="primary">
          <button disabled>Button</button>
        </diamond-button>
      </diamond-grid-item>
    </diamond-grid>
  ),
};
