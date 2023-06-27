import type { Meta, StoryObj } from '@storybook/react'

import { HamburgerButton } from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof HamburgerButton> = {
  title: 'Example/Atom/HamburgerButton',
  component: HamburgerButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HamburgerButton>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {}
