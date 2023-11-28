import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: (config) => {
    config.define = {
      'process.env': {},
    };
    config.resolve = {
      alias: {
        // Define your module aliases here
        '@components': path.resolve('src/renderer/src/ui/components'),
        '@buttons': path.resolve('src/renderer/src/ui/components/buttons'),
        '@containers': path.resolve('src/renderer/src/ui/containers'),
        '@layers': path.resolve(__dirname, 'src/renderer/src/ui/layers'),
        '@assets': path.resolve(__dirname, 'src/renderer/src/assets'),
        '@libs': path.resolve(__dirname, 'src/renderer/src/libs'),
        '@constants': path.resolve('src/renderer/src/utils/constants'),
        '@helpers': path.resolve('src/renderer/src/utils/helpers'),
        '@models': path.resolve('src/renderer/src/models'),
        toSvg: path.resolve('src/renderer/src/assets/svg'),
        toPng: path.resolve('src/renderer/src/assets/pictures'),
        '@api': path.resolve('src/renderer/src/API'),
        '@colors': path.resolve('src/renderer/src/assets/styles/color.ts'),
        '@stores': path.resolve('src/renderer/src/services/zustand'),
        '@services': path.resolve('src/renderer/src/services'),
        '~styles': path.resolve('src/renderer/src/assets/styles/'),
        '~font': path.resolve('src/renderer/src/assets/font/'),
      },
    };
    console.log('config', config);
    return config;
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
