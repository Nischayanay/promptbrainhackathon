// Domain Detection System

import { Domain, Entity } from '../../types';

export class DomainDetector {
  private domainKeywords: Record<Domain, string[]> = {
    marketing: [
      'marketing', 'campaign', 'advertisement', 'promotion', 'brand', 'customer', 'sales',
      'conversion', 'engagement', 'audience', 'target', 'funnel', 'roi', 'ctr', 'email',
      'social media', 'content marketing', 'seo', 'ppc', 'lead generation', 'aida',
      'persona', 'segmentation', 'analytics', 'metrics', 'kpi'
    ],
    design: [
      'design', 'ui', 'ux', 'interface', 'layout', 'color', 'typography', 'visual',
      'aesthetic', 'wireframe', 'prototype', 'mockup', 'branding', 'logo', 'graphic',
      'illustration', 'icon', 'button', 'navigation', 'responsive', 'mobile', 'web design',
      'user experience', 'user interface', 'accessibility', 'usability'
    ],
    coding: [
      'code', 'programming', 'development', 'software', 'algorithm', 'function', 'variable',
      'class', 'method', 'api', 'database', 'framework', 'library', 'javascript', 'python',
      'react', 'node', 'typescript', 'html', 'css', 'sql', 'git', 'debugging', 'testing',
      'deployment', 'architecture', 'microservices', 'backend', 'frontend'
    ],
    psychology: [
      'psychology', 'behavior', 'cognitive', 'emotion', 'motivation', 'persuasion',
      'influence', 'decision making', 'bias', 'mental', 'therapy', 'counseling',
      'personality', 'social psychology', 'behavioral economics', 'neuroscience',
      'mindset', 'habit', 'learning', 'memory', 'attention', 'perception'
    ],
    business: [
      'business', 'strategy', 'management', 'leadership', 'operations', 'finance',
      'revenue', 'profit', 'growth', 'market', 'competition', 'analysis', 'planning',
      'execution', 'team', 'organization', 'process', 'efficiency', 'productivity',
      'innovation', 'entrepreneurship', 'startup', 'investment', 'valuation'
    ],
    creative: [
      'creative', 'writing', 'story', 'narrative', 'character', 'plot', 'dialogue',
      'poetry', 'fiction', 'non-fiction', 'blog', 'article', 'content', 'copywriting',
      'screenplay', 'script', 'novel', 'book', 'publishing', 'editing', 'proofreading',
      'brainstorming', 'ideation', 'inspiration', 'imagination'
    ],
    technical: [
      'technical', 'documentation', 'manual', 'guide', 'tutorial', 'specification',
      'requirements', 'architecture', 'system', 'infrastructure', 'network', 'security',
      'performance', 'optimization', 'troubleshooting', 'maintenance', 'support',
      'engineering', 'implementation', 'integration', 'configuration'
    ],
    academic: [
      'research', 'study', 'analysis', 'thesis', 'paper', 'journal', 'publication',
      'academic', 'scholarly', 'literature review', 'methodology', 'data', 'statistics',
      'hypothesis', 'experiment', 'survey', 'interview', 'case study', 'theory',
      'framework', 'model', 'citation', 'reference', 'bibliography'
    ],
    general: [
      'help', 'assist', 'support', 'advice', 'guidance', 'information', 'question',
      'answer', 'explain', 'describe', 'summarize', 'list', 'compare', 'contrast',
      'analyze', 'evaluate', 'discuss', 'review', 'overview', 'introduction'
    ]
  };

  detectDomain(text: string, entities: Entity[]): { domain: Domain; confidence: number }[] {
    const textLower = text.toLowerCase();
    const domainScores: Record<Domain, number> = {} as Record<Domain, number>;

    // Initialize scores
    Object.keys(this.domainKeywords).forEach(domain => {
      domainScores[domain as Domain] = 0;
    });

    // Score based on keyword matches
    Object.entries(this.domainKeywords).forEach(([domain, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          domainScores[domain as Domain] += matches.length * (keyword.length > 5 ? 2 : 1);
        }
      });
    });

    // Score based on entities
    entities.forEach(entity => {
      const entityText = entity.text.toLowerCase();
      Object.entries(this.domainKeywords).forEach(([domain, keywords]) => {
        if (keywords.some(keyword => keyword.includes(entityText) || entityText.includes(keyword))) {
          domainScores[domain as Domain] += entity.confidence;
        }
      });
    });

    // Normalize scores
    const maxScore = Math.max(...Object.values(domainScores));
    if (maxScore === 0) {
      return [{ domain: 'general', confidence: 0.5 }];
    }

    // Convert to confidence scores and sort
    const results = Object.entries(domainScores)
      .map(([domain, score]) => ({
        domain: domain as Domain,
        confidence: Math.min(score / maxScore, 1.0)
      }))
      .filter(result => result.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence);

    return results.length > 0 ? results : [{ domain: 'general', confidence: 0.5 }];
  }

  getPrimaryDomain(text: string, entities: Entity[]): Domain {
    const results = this.detectDomain(text, entities);
    return results[0]?.domain || 'general';
  }

  getDomainConfidence(text: string, entities: Entity[], targetDomain: Domain): number {
    const results = this.detectDomain(text, entities);
    const result = results.find(r => r.domain === targetDomain);
    return result?.confidence || 0;
  }

  suggestDomains(text: string, entities: Entity[], threshold: number = 0.3): Domain[] {
    const results = this.detectDomain(text, entities);
    return results
      .filter(result => result.confidence >= threshold)
      .map(result => result.domain);
  }
}