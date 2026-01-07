import { Meta, StoryObj } from '@storybook/preact';

const meta: Meta = {
  title: 'Styles/Button',
};

export default meta;

export const Button: StoryObj = {
  render: () => (
    <evg-grid wrap="wrap">
      <evg-grid-item>
        <evg-button>
          <button>Button</button>
        </evg-button>
      </evg-grid-item>
      <evg-grid-item>
        <evg-button>
          <button disabled>Button</button>
        </evg-button>
      </evg-grid-item>
    </evg-grid>
  ),
};

export const Primary: StoryObj = {
  render: () => (
    <evg-grid wrap="wrap">
      <evg-grid-item>
        <evg-button variant="primary">
          <button>Button</button>
        </evg-button>
      </evg-grid-item>
      <evg-grid-item>
        <evg-button variant="primary">
          <button disabled>Button</button>
        </evg-button>
      </evg-grid-item>
    </evg-grid>
  ),
};
