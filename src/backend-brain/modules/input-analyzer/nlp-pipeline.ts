// NLP Pipeline for Input Analysis

import { Entity, EntityType, Constraint, ConstraintType, Domain } from '../../types';

export class NLPPipeline {
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];
    
    // Person detection
    const personPatterns = /\b(I|you|he|she|they|user|customer|client|person|people)\b/gi;
    const personMatches = text.match(personPatterns);
    if (personMatches) {
      personMatches.forEach(match => {
        entities.push({
          text: match,
          type: 'PERSON',
          confidence: 0.8
        });
      });
    }

    // Organization detection
    const orgPatterns = /\b(company|business|organization|team|startup|corporation)\b/gi;
    const orgMatches = text.match(orgPatterns);
    if (orgMatches) {
      orgMatches.forEach(match => {
        entities.push({
          text: match,
          type: 'ORG',
          confidence: 0.7
        });
      });
    }

    // Action detection
    const actionPatterns = /\b(write|create|generate|build|design|develop|analyze|optimize)\b/gi;
    const actionMatches = text.match(actionPatterns);
    if (actionMatches) {
      actionMatches.forEach(match => {
        entities.push({
          text: match,
          type: 'ACTION',
          confidence: 0.9
        });
      });
    }

    // Concept detection
    const conceptPatterns = /\b(email|website|app|product|service|content|strategy|campaign)\b/gi;
    const conceptMatches = text.match(conceptPatterns);
    if (conceptMatches) {
      conceptMatches.forEach(match => {
        entities.push({
          text: match,
          type: 'CONCEPT',
          confidence: 0.8
        });
      });
    }

    return entities;
  }

  extractKeywords(text: string): string[] {
    const tokens = this.tokenize(text);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must']);
    
    const keywords = tokens
      .filter(token => !stopWords.has(token) && token.length > 2)
      .reduce((acc, token) => {
        acc[token] = (acc[token] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  detectConstraints(text: string): Constraint[] {
    const constraints: Constraint[] = [];

    // Length constraints
    if (text.includes('short') || text.includes('brief') || text.includes('concise')) {
      constraints.push({
        type: 'LENGTH',
        value: 'short',
        description: 'Keep output concise and brief'
      });
    }
    
    if (text.includes('long') || text.includes('detailed') || text.includes('comprehensive')) {
      constraints.push({
        type: 'LENGTH',
        value: 'long',
        description: 'Provide detailed and comprehensive output'
      });
    }

    // Tone constraints
    if (text.includes('professional') || text.includes('formal')) {
      constraints.push({
        type: 'TONE',
        value: 'professional',
        description: 'Use professional and formal tone'
      });
    }

    if (text.includes('casual') || text.includes('friendly') || text.includes('conversational')) {
      constraints.push({
        type: 'TONE',
        value: 'casual',
        description: 'Use casual and friendly tone'
      });
    }

    // Format constraints
    if (text.includes('list') || text.includes('bullet') || text.includes('points')) {
      constraints.push({
        type: 'FORMAT',
        value: 'list',
        description: 'Format as a list or bullet points'
      });
    }

    if (text.includes('paragraph') || text.includes('essay') || text.includes('article')) {
      constraints.push({
        type: 'FORMAT',
        value: 'paragraph',
        description: 'Format as paragraphs or essay'
      });
    }

    return constraints;
  }

  calculateContextScore(text: string, entities: Entity[], keywords: string[]): number {
    let score = 0;

    // Base score from text length
    score += Math.min(text.length / 100, 0.3);

    // Score from entities
    score += Math.min(entities.length * 0.1, 0.3);

    // Score from keywords
    score += Math.min(keywords.length * 0.05, 0.2);

    // Score from specificity
    const specificWords = ['specific', 'detailed', 'particular', 'exact', 'precise'];
    const hasSpecificWords = specificWords.some(word => text.toLowerCase().includes(word));
    if (hasSpecificWords) score += 0.2;

    return Math.min(score, 1.0);
  }
}