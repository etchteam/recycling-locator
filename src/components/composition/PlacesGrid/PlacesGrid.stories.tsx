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
              <evg-card radius="sm">Place 1</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-2">
              <evg-card radius="sm">Place 2</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-3">
              <evg-card radius="sm">Place 3</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-4">
              <evg-card radius="sm">Place 4</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-5">
              <evg-card radius="sm">Place 5</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-6">
              <evg-card radius="sm">Place 6</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-7">
              <evg-card radius="sm">Place 7</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-8">
              <evg-card radius="sm">Place 8</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-9">
              <evg-card radius="sm">Place 9</evg-card>
            </a>
          </li>
          <li>
            <a href="#place-10">
              <evg-card radius="sm">Place 10</evg-card>
            </a>
          </li>
        </ul>
      </nav>
    </locator-places-grid>
  ),
};
