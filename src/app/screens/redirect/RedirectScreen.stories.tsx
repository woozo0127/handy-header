import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  emptyProfile,
  longContentProfile,
  noopActions,
  sampleProfile,
} from '../../../../.storybook/fixtures';
import { RedirectScreen } from './RedirectScreen';

const meta = {
  component: RedirectScreen,
  args: { profile: sampleProfile, actions: noopActions },
  decorators: [
    (Story) => (
      <main className="panel rl-scroll">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof RedirectScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { profile: emptyProfile } };

export const LongUrls: Story = { args: { profile: longContentProfile } };
