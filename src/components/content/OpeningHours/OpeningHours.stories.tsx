import { Meta, StoryObj } from '@storybook/preact';

import OpeningHoursComponent from './OpeningHours';

const meta: Meta = {
  title: 'Components/Content/OpeningHours',
  component: OpeningHoursComponent,
};

export default meta;

export const OpenToday: StoryObj = {
  render: () => (
    <OpeningHoursComponent
      openingHours={{
        today: '09:00 - 17:00 (open now)',
        days: [
          'Monday: 09:00 - 17:00',
          'Tuesday: 09:00 - 17:00',
          'Wednesday: 09:00 - 17:00',
          'Thursday: 09:00 - 17:00',
          'Friday: 09:00 - 17:00',
          'Saturday: 10:00 - 16:00',
          'Sunday: Closed',
        ],
      }}
    />
  ),
};

export const ClosedToday: StoryObj = {
  render: () => (
    <OpeningHoursComponent
      openingHours={{
        today: 'Closed',
        days: [
          'Sunday: Closed',
          'Monday: 09:00 - 17:00',
          'Tuesday: 09:00 - 17:00',
          'Wednesday: 09:00 - 17:00',
          'Thursday: 09:00 - 17:00',
          'Friday: 09:00 - 17:00',
          'Saturday: 10:00 - 16:00',
        ],
      }}
    />
  ),
};
