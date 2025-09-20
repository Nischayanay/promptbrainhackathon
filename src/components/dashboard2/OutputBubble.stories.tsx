import type { Meta, StoryObj } from '@storybook/react'
import { OutputBubble } from './OutputBubble'

const meta: Meta<typeof OutputBubble> = {
  title: 'Dashboard/OutputBubble',
  component: OutputBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays enhanced prompt output with copy and reuse functionality.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'object',
      description: 'Chat message object containing input and output',
    },
    onCopy: {
      action: 'onCopy',
      description: 'Function called when copy button is clicked',
    },
    onReuse: {
      action: 'onReuse',
      description: 'Function called when reuse button is clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof OutputBubble>

const sampleMessage = {
  id: '1',
  mode: 'ideate' as const,
  timestamp: new Date().toISOString(),
  input: 'Create a marketing strategy for a new AI product',
  output: `✨ Enhanced Creative Prompt:

"Create a comprehensive marketing strategy for a new AI product that revolutionizes customer service automation"

🎯 Key Improvements:
• Added specific context about the product type (customer service automation)
• Clarified the revolutionary aspect to emphasize innovation
• Enhanced with strategic direction for comprehensive approach
• Optimized for AI understanding with clear structure

This refined prompt will generate more focused and actionable marketing strategies.`,
  title: 'Enhanced Idea • enhance'
}

export const Default: Story = {
  args: {
    message: sampleMessage,
  },
}

export const FlowMode: Story = {
  args: {
    message: {
      ...sampleMessage,
      mode: 'flow',
      output: `🌊 Structured Workflow for: "Create a marketing strategy for a new AI product"

📋 Step-by-step Process:

1. **Market Research Phase**
   - Analyze target audience demographics
   - Study competitor positioning
   - Identify market gaps and opportunities

2. **Strategy Development Phase**
   - Define unique value proposition
   - Create messaging framework
   - Develop channel strategy

3. **Implementation Phase**
   - Launch awareness campaigns
   - Execute content marketing
   - Monitor and optimize performance

4. **Evaluation Phase**
   - Measure campaign effectiveness
   - Gather customer feedback
   - Iterate and improve strategy`
    },
  },
}

export const LongOutput: Story = {
  args: {
    message: {
      ...sampleMessage,
      output: `✨ Enhanced Creative Prompt:

"Create a comprehensive marketing strategy for a new AI product that revolutionizes customer service automation"

🎯 Key Improvements:
• Added specific context about the product type (customer service automation)
• Clarified the revolutionary aspect to emphasize innovation
• Enhanced with strategic direction for comprehensive approach
• Optimized for AI understanding with clear structure

📊 Strategic Framework:
1. Market Analysis
   - Target audience identification
   - Competitive landscape assessment
   - Market opportunity sizing

2. Positioning Strategy
   - Unique value proposition development
   - Brand messaging framework
   - Competitive differentiation

3. Channel Strategy
   - Digital marketing channels
   - Content marketing approach
   - Partnership opportunities

4. Implementation Plan
   - Timeline and milestones
   - Resource allocation
   - Success metrics

This refined prompt will generate more focused and actionable marketing strategies with detailed implementation guidance.`
    },
  },
}

export const Loading: Story = {
  args: {
    message: {
      ...sampleMessage,
      output: ''
    },
    isLoading: true,
  },
}
