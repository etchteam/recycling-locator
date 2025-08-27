import { Meta, StoryObj } from '@storybook/preact';

import './CardLink';

const meta: Meta = {
  title: 'Components/Control/CardLink',
};

export default meta;

export const CardLink: StoryObj = {
  render: () => (
    <locator-card-link>
      <a href="#id">
        <locator-card-link-img>
          <img src="images/refill/benefits.webp" alt="" />
        </locator-card-link-img>
        <locator-card-link-content>
          <h4 className="diamond-text-weight-bold">Guide</h4>
          <p>Getting started with Refill</p>
        </locator-card-link-content>
      </a>
    </locator-card-link>
  ),
};
