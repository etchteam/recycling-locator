import { Meta, StoryObj } from '@storybook/preact';

import './PlacesHeader';

const meta: Meta = {
  title: 'Components/Composition/PlacesHeader',
};

export default meta;

export const PlacesHeader: StoryObj = {
  render: () => (
    <locator-places-header>
      <locator-header-title>
        <evg-button>
          <a href="#link">
            <locator-icon icon="arrow-left" label="Back"></locator-icon>
          </a>
        </evg-button>
        <div>
          <h2>Places to recycle</h2>
          <p>EX327RB</p>
        </div>
      </locator-header-title>
      <locator-places-header-search>
        <a href="#link">
          Recycle a specific item...
          <locator-icon icon="search" color="primary" />
        </a>
      </locator-places-header-search>
    </locator-places-header>
  ),
};
