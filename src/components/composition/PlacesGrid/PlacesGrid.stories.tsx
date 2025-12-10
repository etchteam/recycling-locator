import { Meta, StoryObj } from '@storybook/preact';

import './PlacesGrid';

const meta: Meta = {
  title: 'Components/Composition/PlacesGrid',
};

export default meta;

export const PlacesGrid: StoryObj = {
  render: () => (
    <locator-places-grid>
      <nav>
        <ul>
          <li>
            <a href="#place-1">
              <diamond-card border radius>
                Place 1
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-2">
              <diamond-card border radius>
                Place 2
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-3">
              <diamond-card border radius>
                Place 3
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-4">
              <diamond-card border radius>
                Place 4
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-5">
              <diamond-card border radius>
                Place 5
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-6">
              <diamond-card border radius>
                Place 6
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-7">
              <diamond-card border radius>
                Place 7
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-8">
              <diamond-card border radius>
                Place 8
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-9">
              <diamond-card border radius>
                Place 9
              </diamond-card>
            </a>
          </li>
          <li>
            <a href="#place-10">
              <diamond-card border radius>
                Place 10
              </diamond-card>
            </a>
          </li>
        </ul>
      </nav>
    </locator-places-grid>
  ),
};
