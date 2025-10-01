// Domain Vocabulary Enhancement

import { Domain, DomainVocabulary } from '../../types';

export class VocabularyEnhancer {
  private static readonly DOMAIN_VOCABULARIES: Record<Domain, DomainVocabulary> = {
    marketing: {
      domain: 'marketing',
      terms: {
        'customers': 'target audience',
        'buy': 'convert',
        'sell': 'promote',
        'ad': 'campaign',
        'website': 'landing page',
        'email': 'email marketing campaign',
        'social media': 'social media marketing',
        'content': 'content marketing',
        'brand': 'brand identity',
        'sales': 'revenue generation'
      },
      phrases: {
        'get customers': 'acquire customers through targeted campaigns',
        'make money': 'generate revenue and maximize ROI',
        'send emails': 'execute email marketing campaigns',
        'post on social': 'implement social media marketing strategy',
        'create content': 'develop content marketing materials',
        'build brand': 'establish brand identity and awareness'
      },
      concepts: [
        'customer acquisition cost (CAC)',
        'lifetime value (LTV)',
        'conversion rate optimization',
        'marketing qualified leads (MQL)',
        'sales qualified leads (SQL)',
        'attribution modeling',
        'marketing automation',
        'customer journey mapping'
      ]
    },

    design: {
      domain: 'design',
      terms: {
        'look': 'visual aesthetic',
        'pretty': 'visually appealing',
        'nice': 'well-designed',
        'color': 'color palette',
        'font': 'typography',
        'layout': 'visual hierarchy',
        'button': 'call-to-action element',
        'menu': 'navigation system',
        'page': 'user interface',
        'website': 'digital experience'
      },
      phrases: {
        'make it pretty': 'enhance visual appeal and aesthetic quality',
        'change colors': 'optimize color palette for brand consistency',
        'fix layout': 'improve visual hierarchy and information architecture',
        'add buttons': 'implement strategic call-to-action elements',
        'design website': 'create comprehensive user experience design',
        'make responsive': 'implement responsive design principles'
      },
      concepts: [
        'user experience (UX) design',
        'user interface (UI) design',
        'information architecture',
        'interaction design',
        'visual design principles',
        'accessibility compliance',
        'responsive design',
        'design system methodology'
      ]
    },

    coding: {
      domain: 'coding',
      terms: {
        'code': 'implementation',
        'program': 'software application',
        'function': 'method or procedure',
        'variable': 'data container',
        'bug': 'software defect',
        'fix': 'debug and resolve',
        'test': 'unit test or integration test',
        'deploy': 'production deployment',
        'database': 'data persistence layer',
        'api': 'application programming interface'
      },
      phrases: {
        'write code': 'implement software solution',
        'fix bugs': 'debug and resolve software defects',
        'test code': 'implement comprehensive testing strategy',
        'deploy app': 'execute production deployment pipeline',
        'build feature': 'develop and implement new functionality',
        'optimize performance': 'enhance system performance and efficiency'
      },
      concepts: [
        'software architecture patterns',
        'test-driven development (TDD)',
        'continuous integration/deployment (CI/CD)',
        'code review processes',
        'refactoring techniques',
        'design patterns',
        'performance optimization',
        'security best practices'
      ]
    },

    psychology: {
      domain: 'psychology',
      terms: {
        'people': 'users or target audience',
        'behavior': 'behavioral patterns',
        'motivation': 'psychological drivers',
        'persuade': 'influence through psychological principles',
        'convince': 'leverage cognitive biases',
        'trust': 'establish credibility and authority',
        'emotion': 'emotional triggers',
        'decision': 'decision-making process',
        'habit': 'behavioral conditioning',
        'influence': 'psychological persuasion'
      },
      phrases: {
        'change behavior': 'implement behavioral modification strategies',
        'motivate users': 'leverage intrinsic and extrinsic motivation',
        'build trust': 'establish credibility through social proof and authority',
        'influence decisions': 'apply cognitive bias and heuristic principles',
        'create habits': 'design habit-forming behavioral loops',
        'reduce friction': 'minimize cognitive load and decision fatigue'
      },
      concepts: [
        'cognitive behavioral principles',
        'social proof mechanisms',
        'authority and credibility',
        'reciprocity principle',
        'commitment and consistency',
        'loss aversion bias',
        'anchoring effect',
        'behavioral economics'
      ]
    },

    business: {
      domain: 'business',
      terms: {
        'company': 'organization or enterprise',
        'money': 'revenue or capital',
        'profit': 'return on investment (ROI)',
        'growth': 'scalable expansion',
        'strategy': 'strategic planning',
        'team': 'human resources',
        'market': 'target market segment',
        'competition': 'competitive landscape',
        'plan': 'business strategy',
        'success': 'key performance indicators (KPIs)'
      },
      phrases: {
        'make money': 'generate sustainable revenue streams',
        'grow business': 'scale operations and market presence',
        'beat competition': 'achieve competitive advantage',
        'manage team': 'optimize human resource management',
        'increase sales': 'enhance revenue generation capabilities',
        'reduce costs': 'optimize operational efficiency'
      },
      concepts: [
        'business model innovation',
        'strategic competitive advantage',
        'operational excellence',
        'customer value proposition',
        'market positioning strategy',
        'organizational development',
        'financial performance metrics',
        'stakeholder management'
      ]
    },

    creative: {
      domain: 'creative',
      terms: {
        'idea': 'creative concept',
        'story': 'narrative structure',
        'write': 'craft compelling content',
        'create': 'develop original work',
        'imagine': 'conceptualize and visualize',
        'inspire': 'evoke emotional response',
        'original': 'innovative and unique',
        'art': 'creative expression',
        'design': 'aesthetic composition',
        'content': 'creative material'
      },
      phrases: {
        'write story': 'craft compelling narrative with strong character development',
        'create content': 'develop engaging creative materials',
        'generate ideas': 'facilitate ideation and brainstorming processes',
        'inspire audience': 'evoke emotional connection and engagement',
        'be creative': 'apply innovative thinking and artistic expression',
        'tell story': 'construct narrative arc with emotional resonance'
      },
      concepts: [
        'narrative storytelling techniques',
        'creative ideation processes',
        'artistic composition principles',
        'emotional engagement strategies',
        'character development methods',
        'creative problem-solving',
        'innovative thinking frameworks',
        'artistic vision development'
      ]
    },

    technical: {
      domain: 'technical',
      terms: {
        'explain': 'provide technical documentation',
        'guide': 'step-by-step tutorial',
        'help': 'technical support',
        'manual': 'comprehensive documentation',
        'instructions': 'procedural guidelines',
        'setup': 'configuration process',
        'install': 'installation procedure',
        'configure': 'system configuration',
        'troubleshoot': 'diagnostic and resolution',
        'maintain': 'ongoing maintenance procedures'
      },
      phrases: {
        'write manual': 'create comprehensive technical documentation',
        'explain process': 'document step-by-step procedures',
        'help users': 'provide technical support and guidance',
        'create guide': 'develop instructional documentation',
        'document system': 'create technical specification documentation',
        'troubleshoot issues': 'provide diagnostic and resolution procedures'
      },
      concepts: [
        'technical documentation standards',
        'user-centered documentation',
        'procedural writing techniques',
        'information architecture',
        'technical communication',
        'documentation maintenance',
        'accessibility compliance',
        'version control for documentation'
      ]
    },

    academic: {
      domain: 'academic',
      terms: {
        'study': 'research investigation',
        'research': 'scholarly inquiry',
        'paper': 'academic publication',
        'analysis': 'systematic examination',
        'theory': 'theoretical framework',
        'evidence': 'empirical data',
        'conclusion': 'research findings',
        'method': 'research methodology',
        'data': 'empirical evidence',
        'argument': 'scholarly discourse'
      },
      phrases: {
        'do research': 'conduct systematic scholarly investigation',
        'write paper': 'compose academic publication with rigorous methodology',
        'analyze data': 'perform systematic empirical analysis',
        'review literature': 'conduct comprehensive literature review',
        'test hypothesis': 'implement experimental research design',
        'present findings': 'communicate research results and implications'
      },
      concepts: [
        'peer review process',
        'research methodology',
        'empirical evidence standards',
        'theoretical framework development',
        'scholarly discourse',
        'academic integrity',
        'citation and referencing',
        'research ethics'
      ]
    },

    general: {
      domain: 'general',
      terms: {
        'help': 'assistance and support',
        'explain': 'clarify and elaborate',
        'describe': 'provide detailed explanation',
        'show': 'demonstrate and illustrate',
        'tell': 'communicate information',
        'guide': 'provide direction and guidance',
        'teach': 'educate and instruct',
        'support': 'provide assistance',
        'assist': 'offer help and guidance',
        'advise': 'provide recommendations'
      },
      phrases: {
        'help me': 'provide assistance and guidance',
        'explain this': 'clarify and provide detailed explanation',
        'show me how': 'demonstrate step-by-step process',
        'tell me about': 'provide comprehensive information',
        'guide me through': 'offer structured guidance and support',
        'teach me': 'provide educational instruction'
      },
      concepts: [
        'clear communication',
        'structured information',
        'helpful guidance',
        'educational support',
        'problem-solving assistance',
        'informative content',
        'practical advice',
        'actionable recommendations'
      ]
    }
  };

  static getDomainVocabulary(domain: Domain): DomainVocabulary {
    return this.DOMAIN_VOCABULARIES[domain] || this.DOMAIN_VOCABULARIES.general;
  }

  static enhanceText(text: string, domain: Domain): string {
    const vocabulary = this.getDomainVocabulary(domain);
    let enhancedText = text;

    // Replace terms
    Object.entries(vocabulary.terms).forEach(([original, enhanced]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      enhancedText = enhancedText.replace(regex, enhanced);
    });

    // Replace phrases
    Object.entries(vocabulary.phrases).forEach(([original, enhanced]) => {
      const regex = new RegExp(original, 'gi');
      enhancedText = enhancedText.replace(regex, enhanced);
    });

    return enhancedText;
  }

  static suggestEnhancements(text: string, domain: Domain): Array<{
    original: string;
    enhanced: string;
    type: 'term' | 'phrase';
    position: number;
  }> {
    const vocabulary = this.getDomainVocabulary(domain);
    const suggestions: Array<{
      original: string;
      enhanced: string;
      type: 'term' | 'phrase';
      position: number;
    }> = [];

    // Find term matches
    Object.entries(vocabulary.terms).forEach(([original, enhanced]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        suggestions.push({
          original,
          enhanced,
          type: 'term',
          position: match.index
        });
      }
    });

    // Find phrase matches
    Object.entries(vocabulary.phrases).forEach(([original, enhanced]) => {
      const regex = new RegExp(original, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        suggestions.push({
          original,
          enhanced,
          type: 'phrase',
          position: match.index
        });
      }
    });

    return suggestions.sort((a, b) => a.position - b.position);
  }

  static getRelevantConcepts(keywords: string[], domain: Domain): string[] {
    const vocabulary = this.getDomainVocabulary(domain);
    
    return vocabulary.concepts.filter(concept => {
      const conceptLower = concept.toLowerCase();
      return keywords.some(keyword => 
        conceptLower.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(conceptLower.split(' ')[0])
      );
    });
  }

  static getAllVocabularies(): DomainVocabulary[] {
    return Object.values(this.DOMAIN_VOCABULARIES);
  }
}