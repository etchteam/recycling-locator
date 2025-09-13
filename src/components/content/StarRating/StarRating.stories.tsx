import { Meta, StoryObj } from '@storybook/preact';

import './StarRating';

const meta: Meta = {
  title: 'Components/Content/StarRating',
};

export default meta;

export const StarRating: StoryObj = {
  render: () => (
    <>
      <locator-star-rating rating={5} />
      <locator-star-rating rating={4} />
      <locator-star-rating rating={3} />
      <locator-star-rating rating={2} />
      <locator-star-rating rating={1} />
      <locator-star-rating rating={0} />
    </>
  ),
};
