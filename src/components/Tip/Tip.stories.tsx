import { Meta, StoryObj } from '@storybook/preact';

import './Tip';

const meta: Meta = {
  title: 'Components/Tip',
};

export default meta;

export const Tip: StoryObj = {
  render: () => (
    <locator-tip>
      <p>Use this service to:</p>
      <ul>
        <li>see your nearest places to recycle</li>
        <li>find out how to recycle a specific item</li>
        <li>check what you can recycle at home</li>
      </ul>
      <img src="/images/recycling-technology.webp" alt="" />
    </locator-tip>
  ),
};

export const CenteredContent: StoryObj = {
  render: () => (
    <locator-tip text-align="center">
      <img src="/images/recycling-technology.webp" alt="" />
      <h2>How to check if your electricals can be recycled</h2>
      <p>
        Any items that have a plug, use batteries, need charging or have a
        picture of a crossed out wheelie bin on, are known as Waste Electrical
        and Electronic Equipment (WEEE). These items should not be sent to
        landfill and should be recycled at Recycling Centres, electrical item
        bring banks or via electrical retailers
      </p>
    </locator-tip>
  ),
};
