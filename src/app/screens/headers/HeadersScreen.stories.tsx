import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  emptyProfile,
  longContentProfile,
  noopActions,
  sampleProfile,
} from '../../../../.storybook/fixtures';
import { HeadersScreen } from './HeadersScreen';

const meta = {
  component: HeadersScreen,
  args: { profile: sampleProfile, actions: noopActions },
  decorators: [
    (Story) => (
      <main className="panel rl-scroll">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof HeadersScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { profile: emptyProfile } };

export const LongNamesAndValues: Story = {
  args: { profile: longContentProfile },
};
