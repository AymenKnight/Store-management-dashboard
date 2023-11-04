[
  {
    name: 'react',
    variants: ['componentName'],
    template: [
      [
        '{{componentName}sc}/{{componentName}pc}.tsx',
        `import './style/index.scss';
interface {{componentName}pc}Props {}
export default function {{componentName}pc}({}: {{componentName}pc}Props) {
  return <div className="{{componentName}kc}"></div>;
}
`,
      ],
      [
        '{{componentName}sc}/index.ts',
        `import {{componentName}pc} from './{{componentName}pc}';
export default {{componentName}pc};
`,
      ],
      [
        '{{componentName}sc}/style/index.scss',
        `@use '~styles/appColors' as *;
.{{componentName}kc} {
}
`,
      ],
      [
        '{{componentName}sc}/{{componentName}pc}.stories.tsx',
        `import type { Meta, StoryObj } from '@storybook/react';
import {{componentName}pc} from './{{componentName}pc}';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: '{{componentName}pc}',
  component: {{componentName}pc},
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    
  },
} satisfies Meta<typeof {{componentName}pc}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  
  },
};

`,
      ],
    ],
  },
  {
    name: 'zustand',
    variants: ['storeName'],
    template: [
      [
        '{{storeName}cc}Store.ts',
        `import create from 'zustand';

interface {{storeName}pc}State {}

export const use{{storeName}pc}Store = create<{{storeName}pc}State>(
  (set) => ({}),
);
`,
      ],
    ],
  },
];
