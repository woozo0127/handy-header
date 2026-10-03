import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { sampleState } from '../../.storybook/fixtures';
import { STATE_KEY, saveCompileError } from '../shared/storage';
import type { AppState } from '../shared/types';
import { App } from './App';

// App은 chrome.storage에서 상태를 읽으므로 스토리마다 메모리 저장소를 끼워 넣는다
function stubChromeStorage(state: AppState) {
  const data: Record<string, unknown> = {
    [STATE_KEY]: structuredClone(state),
  };
  Object.assign(globalThis, {
    chrome: {
      storage: {
        local: {
          get: async (key: string) => ({ [key]: data[key] }),
          set: async (items: Record<string, unknown>) => {
            Object.assign(data, items);
          },
        },
        onChanged: { addListener: () => {} },
      },
    },
  });
}

const meta = {
  component: App,
  beforeEach: () => stubChromeStorage(sampleState),
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RedirectTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Redirect' }),
    );
  },
};

export const ProfileMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('button', { name: /Default/ }),
    );
  },
};

export const CompileError: Story = {
  beforeEach: async () => {
    await saveCompileError(
      'Rule 1: "https://api.example.com/*" is not a valid URL filter',
    );
  },
};
