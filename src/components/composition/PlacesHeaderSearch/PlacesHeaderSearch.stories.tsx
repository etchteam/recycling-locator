import { Meta, StoryObj } from '@storybook/preact';

import '../Header/Header';
import './PlacesHeaderSearch';

const meta: Meta = {
  title: 'Components/Composition/PlacesHeaderSearch',
};

export default meta;

export const PlacesHeaderSearch: StoryObj = {
  render: () => (
    <locator-header-content-wrap>
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
    </locator-header-content-wrap>
  ),
};
