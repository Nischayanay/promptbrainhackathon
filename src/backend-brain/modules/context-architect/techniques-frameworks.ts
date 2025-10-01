// Techniques and Frameworks Database

import { Domain, Technique, Framework } from '../../types';

export class TechniquesFrameworksDatabase {
  private static readonly TECHNIQUES: Record<Domain, Technique[]> = {
    marketing: [
      {
        id: 'aida',
        name: 'AIDA Framework',
        description: 'Attention, Interest, Desire, Action - classic marketing structure',
        domain: 'marketing',
        applicability: ['email campaigns', 'advertisements', 'sales copy', 'landing pages']
      },
      {
        id: 'pas',
        name: 'Problem-Agitation-Solution',
        description: 'Identify problem, agitate pain points, present solution',
        domain: 'marketing',
        applicability: ['sales letters', 'product descriptions', 'case studies']
      },
      {
        id: 'bab',
        name: 'Before-After-Bridge',
        description: 'Show current state, desired state, and path to get there',
        domain: 'marketing',
        applicability: ['transformation stories', 'service descriptions', 'coaching content']
      },
      {
        id: 'fab',
        name: 'Features-Advantages-Benefits',
        description: 'Present features, explain advantages, highlight benefits',
        domain: 'marketing',
        applicability: ['product descriptions', 'sales presentations', 'brochures']
      }
    ],

    design: [
      {
        id: 'design-thinking',
        name: 'Design Thinking Process',
        description: 'Empathize, Define, Ideate, Prototype, Test methodology',
        domain: 'design',
        applicability: ['product design', 'service design', 'problem solving']
      },
      {
        id: 'atomic-design',
        name: 'Atomic Design System',
        description: 'Atoms, Molecules, Organisms, Templates, Pages hierarchy',
        domain: 'design',
        applicability: ['UI design', 'design systems', 'component libraries']
      },
      {
        id: 'gestalt-principles',
        name: 'Gestalt Design Principles',
        description: 'Proximity, similarity, closure, continuity visual principles',
        domain: 'design',
        applicability: ['visual design', 'layout design', 'information architecture']
      }
    ],

    coding: [
      {
        id: 'solid-principles',
        name: 'SOLID Principles',
        description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
        domain: 'coding',
        applicability: ['object-oriented design', 'software architecture', 'code refactoring']
      },
      {
        id: 'tdd',
        name: 'Test-Driven Development',
        description: 'Red-Green-Refactor cycle for development',
        domain: 'coding',
        applicability: ['unit testing', 'software development', 'quality assurance']
      },
      {
        id: 'clean-architecture',
        name: 'Clean Architecture',
        description: 'Dependency rule and layered architecture approach',
        domain: 'coding',
        applicability: ['system design', 'enterprise applications', 'maintainable code']
      }
    ],

    psychology: [
      {
        id: 'cialdini-principles',
        name: 'Cialdini\'s Persuasion Principles',
        description: 'Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity',
        domain: 'psychology',
        applicability: ['persuasive design', 'marketing psychology', 'behavioral change']
      },
      {
        id: 'fogg-behavior-model',
        name: 'Fogg Behavior Model',
        description: 'Behavior = Motivation × Ability × Trigger',
        domain: 'psychology',
        applicability: ['habit formation', 'user engagement', 'behavioral design']
      },
      {
        id: 'cognitive-load-theory',
        name: 'Cognitive Load Theory',
        description: 'Intrinsic, extraneous, and germane cognitive load management',
        domain: 'psychology',
        applicability: ['learning design', 'user interface', 'information presentation']
      }
    ],

    business: [
      {
        id: 'lean-canvas',
        name: 'Lean Canvas',
        description: 'One-page business model documentation',
        domain: 'business',
        applicability: ['startup planning', 'business model design', 'strategy development']
      },
      {
        id: 'okr',
        name: 'Objectives and Key Results',
        description: 'Goal-setting framework for organizations',
        domain: 'business',
        applicability: ['performance management', 'strategic planning', 'team alignment']
      },
      {
        id: 'swot-analysis',
        name: 'SWOT Analysis',
        description: 'Strengths, Weaknesses, Opportunities, Threats assessment',
        domain: 'business',
        applicability: ['strategic planning', 'competitive analysis', 'decision making']
      }
    ],

    creative: [
      {
        id: 'scamper',
        name: 'SCAMPER Technique',
        description: 'Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse',
        domain: 'creative',
        applicability: ['ideation', 'problem solving', 'innovation']
      },
      {
        id: 'six-thinking-hats',
        name: 'Six Thinking Hats',
        description: 'White, Red, Black, Yellow, Green, Blue thinking perspectives',
        domain: 'creative',
        applicability: ['brainstorming', 'decision making', 'creative thinking']
      },
      {
        id: 'storytelling-arc',
        name: 'Three-Act Story Structure',
        description: 'Setup, Confrontation, Resolution narrative framework',
        domain: 'creative',
        applicability: ['storytelling', 'content creation', 'narrative design']
      }
    ],

    technical: [
      {
        id: 'dita',
        name: 'DITA Documentation',
        description: 'Darwin Information Typing Architecture for structured authoring',
        domain: 'technical',
        applicability: ['technical documentation', 'content management', 'information architecture']
      },
      {
        id: 'docs-as-code',
        name: 'Docs as Code',
        description: 'Treating documentation with same practices as code',
        domain: 'technical',
        applicability: ['developer documentation', 'API docs', 'technical writing']
      }
    ],

    academic: [
      {
        id: 'imrad',
        name: 'IMRAD Structure',
        description: 'Introduction, Methods, Results, and Discussion format',
        domain: 'academic',
        applicability: ['research papers', 'scientific writing', 'academic reports']
      },
      {
        id: 'systematic-review',
        name: 'Systematic Review Methodology',
        description: 'Structured approach to literature review and synthesis',
        domain: 'academic',
        applicability: ['literature reviews', 'meta-analysis', 'evidence synthesis']
      }
    ],

    general: [
      {
        id: 'pyramid-principle',
        name: 'Pyramid Principle',
        description: 'Start with conclusion, then supporting arguments',
        domain: 'general',
        applicability: ['business writing', 'presentations', 'reports']
      },
      {
        id: 'inverted-pyramid',
        name: 'Inverted Pyramid',
        description: 'Most important information first, details follow',
        domain: 'general',
        applicability: ['journalism', 'web content', 'news writing']
      }
    ]
  };

  private static readonly FRAMEWORKS: Record<Domain, Framework[]> = {
    marketing: [
      {
        id: 'customer-journey',
        name: 'Customer Journey Mapping',
        description: 'Visual representation of customer experience touchpoints',
        domain: 'marketing',
        structure: ['Awareness', 'Consideration', 'Purchase', 'Retention', 'Advocacy'],
        examples: ['E-commerce journey', 'SaaS onboarding', 'Service experience']
      },
      {
        id: 'marketing-funnel',
        name: 'Marketing Funnel',
        description: 'Customer acquisition and conversion process',
        domain: 'marketing',
        structure: ['Awareness', 'Interest', 'Consideration', 'Intent', 'Evaluation', 'Purchase'],
        examples: ['Lead generation funnel', 'Sales funnel', 'Content marketing funnel']
      }
    ],

    design: [
      {
        id: 'double-diamond',
        name: 'Double Diamond Design Process',
        description: 'Discover, Define, Develop, Deliver design methodology',
        domain: 'design',
        structure: ['Discover', 'Define', 'Develop', 'Deliver'],
        examples: ['Product design process', 'Service design', 'Innovation projects']
      }
    ],

    coding: [
      {
        id: 'mvc-pattern',
        name: 'Model-View-Controller',
        description: 'Separation of concerns architectural pattern',
        domain: 'coding',
        structure: ['Model (Data)', 'View (Presentation)', 'Controller (Logic)'],
        examples: ['Web applications', 'Desktop applications', 'Mobile apps']
      }
    ],

    psychology: [
      {
        id: 'hook-model',
        name: 'Hook Model',
        description: 'Trigger, Action, Variable Reward, Investment cycle',
        domain: 'psychology',
        structure: ['Trigger', 'Action', 'Variable Reward', 'Investment'],
        examples: ['App engagement', 'Habit formation', 'Product stickiness']
      }
    ],

    business: [
      {
        id: 'business-model-canvas',
        name: 'Business Model Canvas',
        description: 'Nine building blocks of business model',
        domain: 'business',
        structure: [
          'Key Partners', 'Key Activities', 'Key Resources', 'Value Propositions',
          'Customer Relationships', 'Channels', 'Customer Segments', 'Cost Structure', 'Revenue Streams'
        ],
        examples: ['Startup business model', 'Corporate strategy', 'Innovation planning']
      }
    ],

    creative: [
      {
        id: 'creative-process',
        name: 'Creative Problem Solving Process',
        description: 'Structured approach to creative thinking',
        domain: 'creative',
        structure: ['Clarify', 'Ideate', 'Develop', 'Implement'],
        examples: ['Innovation workshops', 'Creative projects', 'Problem solving sessions']
      }
    ],

    technical: [
      {
        id: 'documentation-hierarchy',
        name: 'Documentation Information Hierarchy',
        description: 'Structured approach to technical documentation',
        domain: 'technical',
        structure: ['Overview', 'Getting Started', 'Tutorials', 'How-to Guides', 'Reference', 'Explanation'],
        examples: ['API documentation', 'Software manuals', 'Technical guides']
      }
    ],

    academic: [
      {
        id: 'research-methodology',
        name: 'Research Methodology Framework',
        description: 'Systematic approach to academic research',
        domain: 'academic',
        structure: ['Problem Definition', 'Literature Review', 'Methodology', 'Data Collection', 'Analysis', 'Conclusion'],
        examples: ['Thesis research', 'Academic papers', 'Scientific studies']
      }
    ],

    general: [
      {
        id: 'problem-solving',
        name: 'General Problem Solving Framework',
        description: 'Universal approach to problem resolution',
        domain: 'general',
        structure: ['Define Problem', 'Analyze Causes', 'Generate Solutions', 'Evaluate Options', 'Implement Solution', 'Monitor Results'],
        examples: ['Business problems', 'Personal challenges', 'Team issues']
      }
    ]
  };

  static getTechniques(domain: Domain): Technique[] {
    return this.TECHNIQUES[domain] || [];
  }

  static getFrameworks(domain: Domain): Framework[] {
    return this.FRAMEWORKS[domain] || [];
  }

  static getAllTechniques(): Technique[] {
    return Object.values(this.TECHNIQUES).flat();
  }

  static getAllFrameworks(): Framework[] {
    return Object.values(this.FRAMEWORKS).flat();
  }

  static findTechniqueById(id: string): Technique | undefined {
    return this.getAllTechniques().find(technique => technique.id === id);
  }

  static findFrameworkById(id: string): Framework | undefined {
    return this.getAllFrameworks().find(framework => framework.id === id);
  }

  static getRelevantTechniques(keywords: string[], domain?: Domain): Technique[] {
    const techniques = domain ? this.getTechniques(domain) : this.getAllTechniques();
    
    return techniques.filter(technique => {
      const searchText = `${technique.name} ${technique.description} ${technique.applicability.join(' ')}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }

  static getRelevantFrameworks(keywords: string[], domain?: Domain): Framework[] {
    const frameworks = domain ? this.getFrameworks(domain) : this.getAllFrameworks();
    
    return frameworks.filter(framework => {
      const searchText = `${framework.name} ${framework.description} ${framework.structure.join(' ')} ${framework.examples.join(' ')}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }
}