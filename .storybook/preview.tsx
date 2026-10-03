import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import '../src/app/app.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: { layout: 'fullscreen' },
  // app.css의 #root 레이아웃(세로 flex, 높이 100%)을 그대로 받도록 앱과 같은 루트로 감싼다
  decorators: [
    (Story) => (
      <div id="root">
        <Story />
      </div>
    ),
  ],
};

export default preview;
