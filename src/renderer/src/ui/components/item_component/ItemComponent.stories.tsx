import type { Meta, StoryObj } from '@storybook/react';
import ItemComponent from './ItemComponent';
import user_image from 'toPng/user_profile_test.png';
import { title } from 'process';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'ItemComponent',
  component: ItemComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    width: 100,
    height: 100,
    category: 'category',
    price: '1000 DZ',
    src: user_image,
    title: 'title',
  },
};
