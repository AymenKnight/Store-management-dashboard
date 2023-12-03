import type { Meta, StoryObj } from '@storybook/react';
import ShowInformationsWithIcon from './ShowInformationsWithIcon';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'ShowInformationsWithIcon',
  component: ShowInformationsWithIcon,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ShowInformationsWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'title',
    titleIcon: 'titleIcon',
    details: 'details',
    detailsIcon: 'detailsIcon',
    icon: 'icon',
    iconText: 'iconText',
    iconTextColor: 'iconTextColor',
  },
};
