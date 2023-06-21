import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: 'Example/Atom/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    bgColor: {
      control: { type: 'select' },
      options: [
        'bgRed',
        'bgBlue',
        'bgYellow',
        'bgOrange',
        'bgGreen',
        'bgBlack',
        'bgWhite',
        'bgGray',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Default',
  },
}
