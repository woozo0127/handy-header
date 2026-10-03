import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.tsx'],
  // 프로젝트 vite.config의 crx 플러그인은 manifest 빌드용이라 Storybook에서는 뺀다
  viteFinal: (config) => ({
    ...config,
    plugins: config.plugins
      ?.flat()
      .filter(
        (p) =>
          !(
            p &&
            typeof p === 'object' &&
            'name' in p &&
            p.name.startsWith('crx:')
          ),
      ),
  }),
};

export default config;
