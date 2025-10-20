// Medical Glossary Service - stores medical terms learned from AI
import { storageService } from './storageService';
import { MedicalTerm } from '@/types/symptoms';

export interface GlossaryTerm extends MedicalTerm {
  id: string;
  firstLearnedDate: string;
  lastSeenDate: string;
  timesEncountered: number;
  // Track where this term was first encountered
  firstEncounterEpisodeId?: string;
  firstEncounterEntryId?: string;
  firstEncounterEpisodeTitle?: string;
}

class GlossaryService {
  private static instance: GlossaryService | null = null;
  private readonly COLLECTION = 'glossary';

  private constructor() {}

  static getInstance(): GlossaryService {
    if (!GlossaryService.instance) {
      GlossaryService.instance = new GlossaryService();
    }
    return GlossaryService.instance;
  }

  /**
   * Add medical terms to the glossary
   * Updates existing terms or creates new ones
   */
  async addTerms(
    terms: MedicalTerm[],
    episodeContext?: {
      episodeId: string;
      entryId: string;
      episodeTitle?: string;
    }
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existingTerms = await this.getAllTerms();

      for (const term of terms) {
        const termId = this.generateTermId(term.term);
        const existing = existingTerms[termId];

        if (existing) {
          // Update existing term
          const updated: GlossaryTerm = {
            ...existing,
            definition: term.definition, // Update definition in case AI provides better one
            lastSeenDate: now,
            timesEncountered: existing.timesEncountered + 1,
          };
          await storageService.setItem(this.COLLECTION, termId, updated);
        } else {
          // Create new term
          const newTerm: GlossaryTerm = {
            id: termId,
            term: term.term,
            definition: term.definition,
            firstLearnedDate: now,
            lastSeenDate: now,
            timesEncountered: 1,
            // Store episode context for first encounter
            firstEncounterEpisodeId: episodeContext?.episodeId,
            firstEncounterEntryId: episodeContext?.entryId,
            firstEncounterEpisodeTitle: episodeContext?.episodeTitle,
          };
          await storageService.setItem(this.COLLECTION, termId, newTerm);
        }
      }

      console.log(`Added ${terms.length} terms to glossary`);
    } catch (error) {
      console.error('Failed to add terms to glossary:', error);
    }
  }

  /**
   * Get all glossary terms
   */
  async getAllTerms(): Promise<{ [key: string]: GlossaryTerm }> {
    try {
      return await storageService.getAllItems(this.COLLECTION);
    } catch (error) {
      console.error('Failed to get glossary terms:', error);
      return {};
    }
  }

  /**
   * Get glossary terms sorted by various criteria
   */
  async getTermsSorted(
    sortBy: 'alphabetical' | 'recent' | 'frequent' = 'alphabetical'
  ): Promise<GlossaryTerm[]> {
    const terms = await this.getAllTerms();
    const termArray = Object.values(terms);

    switch (sortBy) {
      case 'alphabetical':
        return termArray.sort((a, b) => a.term.localeCompare(b.term));
      case 'recent':
        return termArray.sort(
          (a, b) =>
            new Date(b.lastSeenDate).getTime() -
            new Date(a.lastSeenDate).getTime()
        );
      case 'frequent':
        return termArray.sort(
          (a, b) => b.timesEncountered - a.timesEncountered
        );
      default:
        return termArray;
    }
  }

  /**
   * Search glossary terms
   */
  async searchTerms(query: string): Promise<GlossaryTerm[]> {
    const terms = await this.getAllTerms();
    const lowerQuery = query.toLowerCase();

    return Object.values(terms).filter(
      term =>
        term.term.toLowerCase().includes(lowerQuery) ||
        term.definition.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get glossary statistics
   */
  async getStats(): Promise<{
    totalTerms: number;
    recentTerms: number;
    mostFrequent: GlossaryTerm | null;
  }> {
    const terms = await this.getAllTerms();
    const termArray = Object.values(terms);

    // Terms learned in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTerms = termArray.filter(
      term => new Date(term.firstLearnedDate) > sevenDaysAgo
    );

    // Most frequently encountered term
    const mostFrequent = termArray.reduce<GlossaryTerm | null>(
      (max, term) =>
        !max || term.timesEncountered > max.timesEncountered ? term : max,
      null
    );

    return {
      totalTerms: termArray.length,
      recentTerms: recentTerms.length,
      mostFrequent,
    };
  }

  /**
   * Clear all glossary terms
   */
  async clearGlossary(): Promise<void> {
    try {
      await storageService.clearCollection(this.COLLECTION);
      console.log('Glossary cleared');
    } catch (error) {
      console.error('Failed to clear glossary:', error);
      throw error;
    }
  }

  /**
   * Generate a consistent ID for a term
   */
  private generateTermId(term: string): string {
    return term.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
}

export const glossaryService = GlossaryService.getInstance();
