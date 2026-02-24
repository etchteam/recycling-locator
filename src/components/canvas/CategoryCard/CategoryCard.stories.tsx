import { Meta, StoryObj } from '@storybook/preact';

import './CategoryCard';

const meta: Meta = {
  title: 'Components/Canvas/CategoryCard',
};

export default meta;

export const MixedFood: StoryObj = {
  render: () => (
    <div style={{ width: '180px' }}>
      <locator-category-card>
        <a href="#link">
          <img
            src="/images/refill/categories/mixed-food.webp"
            alt=""
            width="180"
            height="220"
          />
          <evg-chip variant="light">
            <span>
              <locator-icon icon="mixed-food"></locator-icon>
              Mixed food
            </span>
          </evg-chip>
        </a>
      </locator-category-card>
    </div>
  ),
};

export const Cleaning: StoryObj = {
  render: () => (
    <div style={{ width: '180px' }}>
      <locator-category-card>
        <a href="#link">
          <img
            src="/images/refill/categories/cleaning.webp"
            alt=""
            width="180"
            height="220"
          />
          <evg-chip variant="light">
            <span>
              <locator-icon icon="cleaning"></locator-icon>
              Cleaning
            </span>
          </evg-chip>
        </a>
      </locator-category-card>
    </div>
  ),
};

export const PersonalCare: StoryObj = {
  render: () => (
    <div style={{ width: '180px' }}>
      <locator-category-card>
        <a href="#link">
          <img
            src="/images/refill/categories/personal-care.webp"
            alt=""
            width="180"
            height="220"
          />
          <evg-chip variant="light">
            <span>
              <locator-icon icon="personal-care"></locator-icon>
              Personal care
            </span>
          </evg-chip>
        </a>
      </locator-category-card>
    </div>
  ),
};

export const AllCategories: StoryObj = {
  render: () => (
    <ul
      style={{
        display: 'flex',
        gap: '1rem',
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {[
        { category: 'mixed-food', label: 'Mixed food' },
        { category: 'cleaning', label: 'Cleaning' },
        { category: 'personal-care', label: 'Personal care' },
      ].map(({ category, label }) => (
        <li key={category} style={{ width: '180px' }}>
          <locator-category-card>
            <a href="#link">
              <img
                src={`/images/refill/categories/${category}.webp`}
                alt=""
                width="180"
                height="220"
              />
              <evg-chip variant="light">
                <span>
                  <locator-icon icon={category as never}></locator-icon>
                  {label}
                </span>
              </evg-chip>
            </a>
          </locator-category-card>
        </li>
      ))}
    </ul>
  ),
};
