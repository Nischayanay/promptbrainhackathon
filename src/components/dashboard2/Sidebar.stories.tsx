import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Dashboard/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navigation sidebar with collapsible functionality and recent history.',
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
    onToggle: {
      action: 'onToggle',
      description: 'Function called when toggle button is clicked',
    },
    activeItem: {
      control: 'select',
      options: ['home', 'enhance', 'history', 'profile', 'logout'],
      description: 'Currently active navigation item',
    },
    onItemSelect: {
      action: 'onItemSelect',
      description: 'Function called when navigation item is selected',
    },
    recentHistory: {
      control: 'object',
      description: 'Array of recent chat messages for history display',
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const sampleHistory = [
  {
    id: '1',
    mode: 'ideate' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    input: 'Create a marketing strategy for a new AI product',
    output: 'Enhanced marketing strategy...',
    title: 'Enhanced Idea • enhance'
  },
  {
    id: '2',
    mode: 'flow' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    input: 'Write a business plan for a startup',
    output: 'Structured business plan...',
    title: 'Enhanced Flow • enhance'
  },
  {
    id: '3',
    mode: 'ideate' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    input: 'Design a user interface for a mobile app',
    output: 'Enhanced UI design...',
    title: 'Enhanced Idea • enhance'
  },
]

export const Expanded: Story = {
  args: {
    collapsed: false,
    activeItem: 'enhance',
    recentHistory: sampleHistory,
  },
}

export const Collapsed: Story = {
  args: {
    collapsed: true,
    activeItem: 'enhance',
    recentHistory: sampleHistory,
  },
}

export const WithHistory: Story = {
  args: {
    collapsed: false,
    activeItem: 'history',
    recentHistory: sampleHistory,
  },
}

export const EmptyHistory: Story = {
  args: {
    collapsed: false,
    activeItem: 'enhance',
    recentHistory: [],
  },
}

export const LongHistory: Story = {
  args: {
    collapsed: false,
    activeItem: 'enhance',
    recentHistory: [
      ...sampleHistory,
      {
        id: '4',
        mode: 'flow' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        input: 'Create a content calendar for social media',
        output: 'Enhanced content calendar...',
        title: 'Enhanced Flow • enhance'
      },
      {
        id: '5',
        mode: 'ideate' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        input: 'Write a technical specification document',
        output: 'Enhanced technical spec...',
        title: 'Enhanced Idea • enhance'
      },
    ],
  },
}
