// Domain Knowledge Base

import { Domain, DomainKnowledge, Technique, Framework, DomainVocabulary } from '../../types';

export class DomainKnowledgeBase {
  private static readonly DOMAIN_KNOWLEDGE: Record<Domain, DomainKnowledge> = {
    marketing: {
      domain: 'marketing',
      principles: [
        'Customer-centric approach',
        'Value proposition clarity',
        'Emotional connection',
        'Social proof utilization',
        'Scarcity and urgency',
        'Call-to-action optimization',
        'Multi-channel consistency',
        'Data-driven decision making'
      ],
      bestPractices: [
        'Know your target audience deeply',
        'Test and iterate campaigns',
        'Use compelling headlines',
        'Include social proof and testimonials',
        'Create clear value propositions',
        'Optimize for mobile devices',
        'Track and measure performance',
        'Personalize content when possible'
      ],
      commonPatterns: [
        'Problem-Solution-Benefit structure',
        'Before-After-Bridge framework',
        'Features-Advantages-Benefits model',
        'Attention-Interest-Desire-Action flow',
        'Pain-Agitation-Solution approach'
      ],
      expertVocabulary: [
        'conversion rate', 'customer acquisition cost', 'lifetime value', 'funnel optimization',
        'attribution modeling', 'segmentation', 'personalization', 'retargeting',
        'brand awareness', 'engagement rate', 'click-through rate', 'cost per acquisition'
      ]
    },

    design: {
      domain: 'design',
      principles: [
        'Visual hierarchy',
        'Contrast and emphasis',
        'Balance and alignment',
        'Consistency and repetition',
        'Proximity and grouping',
        'White space utilization',
        'Color theory application',
        'Typography harmony'
      ],
      bestPractices: [
        'Design for accessibility',
        'Maintain consistent branding',
        'Use grid systems for alignment',
        'Optimize for different screen sizes',
        'Test with real users',
        'Keep interfaces intuitive',
        'Use meaningful icons and imagery',
        'Ensure fast loading times'
      ],
      commonPatterns: [
        'F-pattern for reading flow',
        'Z-pattern for scanning',
        'Golden ratio for proportions',
        'Rule of thirds for composition',
        'Progressive disclosure for complexity'
      ],
      expertVocabulary: [
        'user experience', 'user interface', 'wireframe', 'prototype', 'mockup',
        'design system', 'style guide', 'responsive design', 'accessibility',
        'usability testing', 'information architecture', 'interaction design'
      ]
    },

    coding: {
      domain: 'coding',
      principles: [
        'Single Responsibility Principle',
        'Don\'t Repeat Yourself (DRY)',
        'Keep It Simple, Stupid (KISS)',
        'You Aren\'t Gonna Need It (YAGNI)',
        'Separation of Concerns',
        'Dependency Inversion',
        'Open/Closed Principle',
        'Code readability and maintainability'
      ],
      bestPractices: [
        'Write self-documenting code',
        'Use meaningful variable names',
        'Keep functions small and focused',
        'Handle errors gracefully',
        'Write comprehensive tests',
        'Follow consistent coding standards',
        'Refactor regularly',
        'Use version control effectively'
      ],
      commonPatterns: [
        'Model-View-Controller (MVC)',
        'Repository pattern',
        'Factory pattern',
        'Observer pattern',
        'Singleton pattern',
        'Dependency injection',
        'Event-driven architecture'
      ],
      expertVocabulary: [
        'refactoring', 'technical debt', 'code review', 'continuous integration',
        'test-driven development', 'pair programming', 'agile methodology',
        'microservices', 'API design', 'database optimization', 'performance tuning'
      ]
    },

    psychology: {
      domain: 'psychology',
      principles: [
        'Cognitive load theory',
        'Social proof influence',
        'Authority and credibility',
        'Reciprocity principle',
        'Commitment and consistency',
        'Loss aversion bias',
        'Anchoring effect',
        'Confirmation bias awareness'
      ],
      bestPractices: [
        'Understand user motivations',
        'Apply behavioral triggers ethically',
        'Use social validation effectively',
        'Create emotional connections',
        'Reduce cognitive friction',
        'Leverage psychological shortcuts',
        'Test behavioral hypotheses',
        'Consider cultural differences'
      ],
      commonPatterns: [
        'Trigger-Action-Reward loop',
        'Problem-Emotion-Solution flow',
        'Fear-Relief-Action sequence',
        'Curiosity-Information-Satisfaction cycle',
        'Trust-Credibility-Conversion path'
      ],
      expertVocabulary: [
        'behavioral economics', 'cognitive bias', 'heuristics', 'persuasion techniques',
        'user psychology', 'motivation theory', 'decision-making process',
        'emotional triggers', 'psychological safety', 'behavioral design'
      ]
    },

    business: {
      domain: 'business',
      principles: [
        'Customer value creation',
        'Competitive advantage',
        'Strategic positioning',
        'Operational efficiency',
        'Financial sustainability',
        'Risk management',
        'Innovation and adaptation',
        'Stakeholder alignment'
      ],
      bestPractices: [
        'Focus on core competencies',
        'Understand market dynamics',
        'Build strong partnerships',
        'Invest in talent development',
        'Maintain financial discipline',
        'Embrace digital transformation',
        'Monitor key performance indicators',
        'Plan for scalability'
      ],
      commonPatterns: [
        'Business Model Canvas',
        'Value Chain Analysis',
        'SWOT Analysis framework',
        'Porter\'s Five Forces',
        'Lean Startup methodology',
        'OKR goal setting',
        'Agile business practices'
      ],
      expertVocabulary: [
        'value proposition', 'market segmentation', 'competitive analysis',
        'revenue streams', 'cost structure', 'key partnerships',
        'customer segments', 'distribution channels', 'scalability', 'pivot strategy'
      ]
    },

    creative: {
      domain: 'creative',
      principles: [
        'Originality and uniqueness',
        'Emotional resonance',
        'Narrative structure',
        'Audience engagement',
        'Creative constraints',
        'Iterative refinement',
        'Cross-pollination of ideas',
        'Authentic voice development'
      ],
      bestPractices: [
        'Embrace experimentation',
        'Study diverse creative works',
        'Develop a consistent practice',
        'Seek feedback and critique',
        'Break conventional rules thoughtfully',
        'Use constraints to spark creativity',
        'Collaborate with others',
        'Document the creative process'
      ],
      commonPatterns: [
        'Hero\'s Journey narrative',
        'Three-act structure',
        'Problem-Conflict-Resolution arc',
        'Setup-Confrontation-Resolution flow',
        'Brainstorming-Ideation-Execution cycle'
      ],
      expertVocabulary: [
        'creative process', 'ideation', 'brainstorming', 'storytelling',
        'narrative arc', 'character development', 'world-building',
        'creative brief', 'concept development', 'artistic vision'
      ]
    },

    technical: {
      domain: 'technical',
      principles: [
        'Accuracy and precision',
        'Clarity and conciseness',
        'Logical organization',
        'User-centered approach',
        'Accessibility compliance',
        'Version control',
        'Consistency in terminology',
        'Actionable instructions'
      ],
      bestPractices: [
        'Write for your audience level',
        'Use clear, simple language',
        'Include practical examples',
        'Provide step-by-step instructions',
        'Test documentation with users',
        'Keep content up-to-date',
        'Use visual aids effectively',
        'Enable easy navigation'
      ],
      commonPatterns: [
        'Problem-Solution documentation',
        'Step-by-step tutorials',
        'Reference documentation',
        'Troubleshooting guides',
        'API documentation structure',
        'Installation and setup guides'
      ],
      expertVocabulary: [
        'technical specification', 'system architecture', 'API documentation',
        'user manual', 'troubleshooting guide', 'installation guide',
        'configuration management', 'system requirements', 'technical debt'
      ]
    },

    academic: {
      domain: 'academic',
      principles: [
        'Rigorous methodology',
        'Evidence-based arguments',
        'Peer review standards',
        'Ethical research practices',
        'Objective analysis',
        'Reproducible results',
        'Theoretical grounding',
        'Critical thinking application'
      ],
      bestPractices: [
        'Conduct thorough literature reviews',
        'Use appropriate research methods',
        'Maintain academic integrity',
        'Cite sources properly',
        'Present balanced arguments',
        'Acknowledge limitations',
        'Follow discipline conventions',
        'Engage with scholarly community'
      ],
      commonPatterns: [
        'Introduction-Methods-Results-Discussion',
        'Literature Review-Gap-Contribution',
        'Hypothesis-Testing-Analysis-Conclusion',
        'Problem-Investigation-Solution-Evaluation',
        'Theory-Application-Validation framework'
      ],
      expertVocabulary: [
        'literature review', 'methodology', 'hypothesis', 'peer review',
        'empirical evidence', 'theoretical framework', 'research design',
        'statistical significance', 'scholarly discourse', 'academic rigor'
      ]
    },

    general: {
      domain: 'general',
      principles: [
        'Clear communication',
        'Logical structure',
        'Audience awareness',
        'Purpose-driven content',
        'Concise expression',
        'Engaging presentation',
        'Factual accuracy',
        'Helpful guidance'
      ],
      bestPractices: [
        'Know your audience',
        'Define clear objectives',
        'Use simple, direct language',
        'Organize information logically',
        'Provide relevant examples',
        'Edit and proofread carefully',
        'Seek feedback from others',
        'Adapt to different contexts'
      ],
      commonPatterns: [
        'Introduction-Body-Conclusion',
        'Problem-Solution structure',
        'Chronological organization',
        'Compare-and-contrast format',
        'Question-and-answer approach'
      ],
      expertVocabulary: [
        'communication', 'information', 'explanation', 'guidance',
        'assistance', 'support', 'clarification', 'instruction',
        'overview', 'summary', 'analysis', 'recommendation'
      ]
    }
  };

  static getDomainKnowledge(domain: Domain): DomainKnowledge {
    return this.DOMAIN_KNOWLEDGE[domain] || this.DOMAIN_KNOWLEDGE.general;
  }

  static getAllDomainKnowledge(): DomainKnowledge[] {
    return Object.values(this.DOMAIN_KNOWLEDGE);
  }

  static getRelevantDomains(keywords: string[]): Domain[] {
    const domainScores: Record<Domain, number> = {} as Record<Domain, number>;
    
    // Initialize scores
    Object.keys(this.DOMAIN_KNOWLEDGE).forEach(domain => {
      domainScores[domain as Domain] = 0;
    });

    // Score domains based on keyword matches
    keywords.forEach(keyword => {
      Object.entries(this.DOMAIN_KNOWLEDGE).forEach(([domain, knowledge]) => {
        const allTerms = [
          ...knowledge.expertVocabulary,
          ...knowledge.commonPatterns,
          ...knowledge.bestPractices.join(' ').split(' ')
        ].map(term => term.toLowerCase());

        if (allTerms.some(term => term.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(term))) {
          domainScores[domain as Domain] += 1;
        }
      });
    });

    // Return domains with scores > 0, sorted by score
    return Object.entries(domainScores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([domain]) => domain as Domain);
  }
}