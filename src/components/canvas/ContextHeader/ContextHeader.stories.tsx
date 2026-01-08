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
        <span className="evg-text-weight-bold">
          {formatPostcode('EX327RB')}
        </span>{' '}
        &ndash; Barnstaple
      </div>
      <evg-button variant="ghost" size="sm">
        <a href="#link">
          <locator-icon icon="close" color="primary"></locator-icon>
        </a>
      </evg-button>
    </locator-context-header>
  ),
};

export const Search: StoryObj = {
  render: () => (
    <a href="#link" className="text-decoration-none">
      <locator-context-header>
        <div className="evg-text-weight-bold">Plastic milk bottles</div>
        <locator-icon icon="search" color="primary"></locator-icon>
      </locator-context-header>
    </a>
  ),
};
