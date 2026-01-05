import { Meta, StoryObj } from '@storybook/preact';

import formatPostcode from '@/lib/formatPostcode';
import './ContextHeader';

const meta: Meta = {
  title: 'Components/Canvas/ContextHeader',
};

export default meta;

export const Postcode: StoryObj = {
  render: () => (
    <locator-context-header>
      <div>
        <span className="diamond-text-weight-bold">
          {formatPostcode('EX327RB')}
        </span>{' '}
        &ndash; Barnstaple
      </div>
      <diamond-button variant="text" size="sm">
        <a href="#link">
          <locator-icon icon="close" color="primary"></locator-icon>
        </a>
      </diamond-button>
    </locator-context-header>
  ),
};

export const Search: StoryObj = {
  render: () => (
    <a href="#link" className="diamond-text-decoration-none">
      <locator-context-header>
        <div className="diamond-text-weight-bold">Plastic milk bottles</div>
        <locator-icon icon="search" color="primary"></locator-icon>
      </locator-context-header>
    </a>
  ),
};
