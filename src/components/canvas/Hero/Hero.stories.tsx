import { Meta, StoryObj } from '@storybook/preact';

import './Hero';

const meta: Meta = {
  title: 'Components/Canvas/Hero',
};

export default meta;

export const Neutral: StoryObj = {
  render: () => (
    <>
      <locator-hero size="full">
        <locator-wrap>
          <locator-icon icon="distance" />
          <h3>Searching this area...</h3>
        </locator-wrap>
      </locator-hero>
      <locator-wrap>
        <diamond-card border radius>
          <p>Overlapping content</p>
        </diamond-card>
      </locator-wrap>
    </>
  ),
};

export const Positive: StoryObj = {
  render: () => (
    <>
      <locator-hero variant="positive" size="full">
        <locator-wrap>
          <locator-icon icon="tick-circle" />
          <h3>Yes, it can be recycled!</h3>
        </locator-wrap>
      </locator-hero>
      <locator-wrap>
        <diamond-card border radius>
          <p>Overlapping content</p>
        </diamond-card>
      </locator-wrap>
    </>
  ),
};

export const Negative: StoryObj = {
  render: () => (
    <>
      <locator-hero variant="negative" size="full">
        <locator-wrap>
          <locator-icon icon="cross-circle" />
          <h3>No, it can’t be recycled!</h3>
        </locator-wrap>
      </locator-hero>
      <locator-wrap>
        <diamond-card border radius>
          <p>Overlapping content</p>
        </diamond-card>
      </locator-wrap>
    </>
  ),
};

export const Hazardous: StoryObj = {
  render: () => (
    <>
      <locator-hero variant="hazardous" size="full">
        <locator-wrap>
          <locator-icon icon="warning" />
          <h3>This is hazardous waste!</h3>
        </locator-wrap>
      </locator-hero>
      <locator-wrap>
        <diamond-card border radius>
          <p>Overlapping content</p>
        </diamond-card>
      </locator-wrap>
    </>
  ),
};

export const PositiveReduced: StoryObj = {
  render: () => (
    <>
      <locator-hero variant="positive" size="reduced">
        <locator-wrap>
          <locator-icon-text>
            <locator-icon icon="tick-circle" />
            <h3>Yes, it can be recycled!</h3>
          </locator-icon-text>
        </locator-wrap>
      </locator-hero>
      <locator-wrap className="diamond-spacing-top-md">
        <diamond-card border radius>
          <p>Non-overlapping content</p>
        </diamond-card>
      </locator-wrap>
    </>
  ),
};
