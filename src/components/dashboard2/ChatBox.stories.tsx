import type { Meta, StoryObj } from '@storybook/react'
import { ChatBox } from './ChatBox'

const meta: Meta<typeof ChatBox> = {
  title: 'Dashboard/ChatBox',
  component: ChatBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The main chat interface for prompt enhancement with ideate and flow modes.',
      },
    },
  },
  argTypes: {
    input: {
      control: 'text',
      description: 'Current input text',
    },
    setInput: {
      action: 'setInput',
      description: 'Function to update input text',
    },
    activeMode: {
      control: 'select',
      options: ['ideate', 'flow'],
      description: 'Current enhancement mode',
    },
    onModeChange: {
      action: 'onModeChange',
      description: 'Function called when mode changes',
    },
    isEnhancing: {
      control: 'boolean',
      description: 'Whether enhancement is in progress',
    },
    onEnhance: {
      action: 'onEnhance',
      description: 'Function called to start enhancement',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChatBox>

export const Default: Story = {
  args: {
    input: '',
    activeMode: 'ideate',
    isEnhancing: false,
  },
}

export const WithInput: Story = {
  args: {
    input: 'Create a marketing strategy for a new AI product',
    activeMode: 'ideate',
    isEnhancing: false,
  },
}

export const FlowMode: Story = {
  args: {
    input: '',
    activeMode: 'flow',
    isEnhancing: false,
  },
}

export const Enhancing: Story = {
  args: {
    input: 'Write a blog post about sustainable technology',
    activeMode: 'ideate',
    isEnhancing: true,
  },
}

export const LongInput: Story = {
  args: {
    input: 'Create a comprehensive business plan for a sustainable fashion startup that focuses on circular economy principles, includes market analysis, financial projections, marketing strategy, and operational plan. The plan should be detailed enough for investor presentations and include specific metrics for measuring success.',
    activeMode: 'ideate',
    isEnhancing: false,
  },
}
