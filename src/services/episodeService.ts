import {
  Episode,
  SymptomEntry,
  CreateEpisodeParams,
  CreateSymptomEntryParams,
  EpisodeDeterminationParams,
  EpisodeCreationResult,
  EpisodeProgressionAnalysis,
} from '@/types/episode';
import { storageService, invalidateEpisodesCache } from './storageService';
import { generateId } from '@/lib/utils';

class EpisodeService {
  private static instance: EpisodeService | null = null;
  private readonly DEFAULT_DAY_THRESHOLD = 2; // Days to consider as same episode

  private constructor() {}

  static getInstance(): EpisodeService {
    if (!EpisodeService.instance) {
      EpisodeService.instance = new EpisodeService();
    }
    return EpisodeService.instance;
  }

  /**
   * Preview which episode this entry would belong to WITHOUT creating records
   */
  async previewEpisodeForEntry(
    params: EpisodeDeterminationParams
  ): Promise<EpisodeCreationResult> {
    const {
      deviceId,
      entryDate,
      symptoms,
      dayThreshold = this.DEFAULT_DAY_THRESHOLD,
    } = params;

    try {
      const activeEpisodes =
        await storageService.getActiveEpisodesByDevice(deviceId);
      const matchingEpisode = await this.findMatchingEpisode(
        activeEpisodes,
        entryDate,
        dayThreshold
      );

      if (matchingEpisode) {
        const isRetroactive = await this.isRetroactiveEntry(
          matchingEpisode.id,
          entryDate
        );

        return {
          episode: matchingEpisode,
          isNewEpisode: false,
          message: `Would be added to existing episode${isRetroactive ? ' (retroactive entry)' : ''}`,
          needsReanalysis: isRetroactive,
        };
      } else {
        const mockEpisode: Episode = {
          id: 'preview-episode',
          deviceId,
          startDate: entryDate,
          symptoms,
          status: 'active',
          entryCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          episode: mockEpisode,
          isNewEpisode: true,
          message: 'Would start new illness episode',
          needsReanalysis: false,
        };
      }
    } catch (error) {
      console.error('Error previewing episode for entry:', error);
      throw error;
    }
  }

  /**
   * Determine which episode this entry should belong to and handle creation/updating
   */
  async determineEpisodeForEntry(
    params: EpisodeDeterminationParams
  ): Promise<EpisodeCreationResult> {
    const {
      deviceId,
      entryDate,
      symptoms,
      dayThreshold = this.DEFAULT_DAY_THRESHOLD,
    } = params;

    try {
      const activeEpisodes =
        await storageService.getActiveEpisodesByDevice(deviceId);
      const matchingEpisode = await this.findMatchingEpisode(
        activeEpisodes,
        entryDate,
        dayThreshold
      );

      if (matchingEpisode) {
        const isRetroactive = await this.isRetroactiveEntry(
          matchingEpisode.id,
          entryDate
        );

        if (isRetroactive) {
          await this.updateEpisodeStartDate(matchingEpisode.id, entryDate);
        }

        await this.incrementEntryCount(matchingEpisode.id);

        return {
          episode: matchingEpisode,
          isNewEpisode: false,
          message: `Added to existing episode${isRetroactive ? ' (retroactive entry)' : ''}`,
          needsReanalysis: isRetroactive,
        };
      } else {
        // Auto-resolve old episodes that are no longer active
        await this.autoResolveOldEpisodes(deviceId, entryDate);
        
        const newEpisode = await this.createNewEpisode({
          deviceId,
          startDate: entryDate,
          symptoms,
        });

        return {
          episode: newEpisode,
          isNewEpisode: true,
          message: 'Started new illness episode',
          needsReanalysis: false,
        };
      }
    } catch (error) {
      console.error('Error determining episode for entry:', error);
      throw error;
    }
  }

  /**
   * Create a new episode
   */
  async createNewEpisode(params: CreateEpisodeParams): Promise<Episode> {
    const episode: Episode = {
      id: generateId(),
      deviceId: params.deviceId,
      startDate: params.startDate,
      title: this.generateTitle(params.symptoms), // Generate initial title
      symptoms: params.symptoms,
      severity: params.severity,
      notes: params.notes,
      status: 'active',
      entryCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.setItem('episodes', episode.id, episode);
    return episode;
  }

  /**
   * Create a new symptom entry
   */
  async createSymptomEntry(
    params: CreateSymptomEntryParams
  ): Promise<SymptomEntry> {
    const entry: SymptomEntry = {
      id: generateId(),
      episodeId: params.episodeId,
      date: params.date,
      symptoms: params.symptoms,
      notes: params.notes,
      severity: params.severity,
      aiAnalysis: params.aiAnalysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.setItem('symptom_entries', entry.id, entry);
    invalidateEpisodesCache(); // Invalidate cache when entries are modified
    return entry;
  }

  /**
   * Find matching episode using day threshold rule
   */
  private async findMatchingEpisode(
    episodes: Episode[],
    entryDate: string,
    dayThreshold: number
  ): Promise<Episode | null> {
    const entryDateTime = new Date(entryDate).getTime();

    for (const episode of episodes) {
      const entries = await storageService.getSymptomEntriesByEpisode(
        episode.id
      );

      if (entries.length === 0) {
        // Episode has no entries yet, check against start date
        const startDateTime = new Date(episode.startDate).getTime();
        const daysDiff = Math.abs(
          (entryDateTime - startDateTime) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= dayThreshold) {
          return episode;
        }
      } else {
        // Check against existing entries - sort by date descending to get most recent first
        const sortedEntries = entries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const lastEntryDate = new Date(sortedEntries[0].date).getTime();
        
        // Calculate days between the new entry and the most recent entry
        const daysSinceLastEntry = Math.abs(
          (entryDateTime - lastEntryDate) / (1000 * 60 * 60 * 24)
        );

        // If the gap is within the threshold, add to existing episode
        if (daysSinceLastEntry <= dayThreshold) {
          console.log(`Adding entry to existing episode ${episode.id}: ${daysSinceLastEntry.toFixed(1)} days since last entry`);
          return episode;
        }
        
        console.log(`Creating new episode: ${daysSinceLastEntry.toFixed(1)} days since last entry (threshold: ${dayThreshold} days)`);
      }
    }

    return null;
  }

  /**
   * Check if entry is retroactive (earlier than existing entries)
   */
  private async isRetroactiveEntry(
    episodeId: string,
    entryDate: string
  ): Promise<boolean> {
    const entries = await storageService.getSymptomEntriesByEpisode(episodeId);

    if (entries.length === 0) return false;

    const earliestEntry = entries.reduce((earliest, entry) =>
      new Date(entry.date) < new Date(earliest.date) ? entry : earliest
    );

    return new Date(entryDate) < new Date(earliestEntry.date);
  }

  /**
   * Update episode start date
   */
  private async updateEpisodeStartDate(
    episodeId: string,
    newStartDate: string
  ): Promise<void> {
    const episode = await storageService.getItem<Episode>(
      'episodes',
      episodeId
    );
    if (episode) {
      episode.startDate = newStartDate;
      episode.updatedAt = new Date().toISOString();
      await storageService.setItem('episodes', episodeId, episode);
    }
  }

  /**
   * Increment episode entry count
   */
  private async incrementEntryCount(episodeId: string): Promise<void> {
    const episode = await storageService.getItem<Episode>(
      'episodes',
      episodeId
    );
    if (episode) {
      episode.entryCount += 1;
      episode.updatedAt = new Date().toISOString();
      await storageService.setItem('episodes', episodeId, episode);
    }
  }

  /**
   * Auto-resolve episodes that haven't had entries for more than the threshold
   */
  private async autoResolveOldEpisodes(deviceId: string, currentEntryDate: string): Promise<void> {
    try {
      const activeEpisodes = await storageService.getActiveEpisodesByDevice(deviceId);
      const currentDate = new Date(currentEntryDate).getTime();
      
      for (const episode of activeEpisodes) {
        const entries = await storageService.getSymptomEntriesByEpisode(episode.id);
        
        if (entries.length > 0) {
          // Sort entries by date descending to get most recent
          const sortedEntries = entries.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          const lastEntryDate = new Date(sortedEntries[0].date).getTime();
          
          // Calculate days since last entry
          const daysSinceLastEntry = Math.abs(
            (currentDate - lastEntryDate) / (1000 * 60 * 60 * 24)
          );
          
          // If more than threshold days have passed, auto-resolve the episode
          if (daysSinceLastEntry > this.DEFAULT_DAY_THRESHOLD) {
            console.log(`Auto-resolving episode ${episode.id}: ${daysSinceLastEntry.toFixed(1)} days since last entry`);
            await this.resolveEpisode(episode.id, sortedEntries[0].date);
          }
        }
      }
    } catch (error) {
      console.error('Error auto-resolving old episodes:', error);
    }
  }

  /**
   * Analyze episode progression based on previous entries
   */
  async analyzeEpisodeProgression(
    episodeId: string,
    currentSymptoms: string[]
  ): Promise<EpisodeProgressionAnalysis | null> {
    try {
      const entries =
        await storageService.getSymptomEntriesByEpisode(episodeId);

      if (entries.length === 0) return null;

      const sortedEntries = entries.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const previousEntry = sortedEntries[sortedEntries.length - 1];
      const previousSymptoms = previousEntry.symptoms;

      // Analyze symptom changes
      const newSymptoms = currentSymptoms.filter(
        s => !previousSymptoms.includes(s)
      );
      const resolvedSymptoms = previousSymptoms.filter(
        s => !currentSymptoms.includes(s)
      );
      const ongoingSymptoms = currentSymptoms.filter(s =>
        previousSymptoms.includes(s)
      );

      // Determine trend
      let trend: 'improving' | 'stable' | 'worsening' = 'stable';
      if (newSymptoms.length > resolvedSymptoms.length) {
        trend = 'worsening';
      } else if (resolvedSymptoms.length > newSymptoms.length) {
        trend = 'improving';
      }

      const dayNumber = sortedEntries.length + 1;

      let progressionSummary = `Day ${dayNumber} of illness episode. `;
      if (trend === 'improving') {
        progressionSummary += `Symptoms appear to be improving with ${resolvedSymptoms.length} symptoms resolved.`;
      } else if (trend === 'worsening') {
        progressionSummary += `New symptoms have appeared (${newSymptoms.join(', ')}).`;
      } else {
        progressionSummary += `Symptoms remain similar to previous day.`;
      }

      return {
        trend,
        symptomChanges: {
          new: newSymptoms,
          resolved: resolvedSymptoms,
          ongoing: ongoingSymptoms,
          severityChanges: [], // Could be enhanced later
        },
        dayNumber,
        progressionSummary,
        previousEntries: sortedEntries,
      };
    } catch (error) {
      console.error('Error analyzing episode progression:', error);
      return null;
    }
  }

  /**
   * Get all episodes for a device
   */
  async getEpisodesByDevice(deviceId: string): Promise<Episode[]> {
    return await storageService.getEpisodesByDevice(deviceId);
  }

  /**
   * Get active episodes for a device
   */
  async getActiveEpisodesByDevice(deviceId: string): Promise<Episode[]> {
    return await storageService.getActiveEpisodesByDevice(deviceId);
  }

  /**
   * Get episode with its entries
   */
  async getEpisodeWithEntries(
    episodeId: string
  ): Promise<{ episode: Episode | null; entries: SymptomEntry[] }> {
    const episode = await storageService.getItem<Episode>(
      'episodes',
      episodeId
    );
    const entries = await storageService.getSymptomEntriesByEpisode(episodeId);

    return { episode, entries };
  }

  /**
   * Mark episode as resolved
   */
  async resolveEpisode(episodeId: string, endDate: string): Promise<void> {
    const episode = await storageService.getItem<Episode>(
      'episodes',
      episodeId
    );
    if (episode) {
      episode.status = 'resolved';
      episode.endDate = endDate;
      episode.updatedAt = new Date().toISOString();
      await storageService.setItem('episodes', episodeId, episode);
    }
  }

  /**
   * Delete episode and all its entries
   */
  async deleteEpisode(episodeId: string): Promise<void> {
    const entries = await storageService.getSymptomEntriesByEpisode(episodeId);

    // Delete all entries
    for (const entry of entries) {
      await storageService.removeItem('symptom_entries', entry.id);
    }

    // Delete episode
    await storageService.removeItem('episodes', episodeId);
  }

  /**
   * Get recent symptom entries for context
   */
  async getRecentEntriesForContext(
    deviceId: string,
    days: number = 7
  ): Promise<SymptomEntry[]> {
    return await storageService.getRecentSymptomEntries(deviceId, days);
  }

  /**
   * Generate episode title based on symptoms and AI analysis
   */
  private generateTitle(symptoms: string[], aiAnalysis?: { analysis?: string; episodeTitle?: string }): string {
    if (!symptoms || symptoms.length === 0) {
      return 'Illness Episode';
    }

    // If AI analysis has specific insights, use them
    if (aiAnalysis?.analysis) {
      const analysis = aiAnalysis.analysis.toLowerCase();
      if (analysis.includes('flu') || analysis.includes('influenza')) {
        return 'Flu Episode';
      }
      if (analysis.includes('cold') || analysis.includes('common cold')) {
        return 'Cold Episode';
      }
      if (analysis.includes('covid') || analysis.includes('coronavirus')) {
        return 'COVID-19 Episode';
      }
      if (analysis.includes('stomach') || analysis.includes('gastro')) {
        return 'Stomach Bug Episode';
      }
      if (analysis.includes('migraine') || analysis.includes('headache')) {
        return 'Headache Episode';
      }
    }

    // Fallback to primary symptom
    const primarySymptom = symptoms[0];
    if (primarySymptom) {
      return `${primarySymptom} Episode`;
    }

    return 'Illness Episode';
  }

  /**
   * Update episode title from AI analysis
   */
  async updateEpisodeTitleFromAnalysis(
    episodeId: string,
    symptoms: string[],
    aiAnalysis: { episodeTitle?: string; analysis?: string }
  ): Promise<void> {
    try {
      // Use AI-generated title if available, otherwise fall back to generated title
      const title =
        aiAnalysis?.episodeTitle || this.generateTitle(symptoms, aiAnalysis);

      const episode = await storageService.getItem<Episode>(
        'episodes',
        episodeId
      );
      if (episode) {
        episode.title = title;
        episode.updatedAt = new Date().toISOString();
        await storageService.setItem('episodes', episodeId, episode);

        console.log(`📝 Updated episode title: ${episodeId} -> ${title}`);
      }
    } catch (error) {
      console.error('❌ Error updating episode title:', error);
      throw error;
    }
  }

  /**
   * Update episode AI summary from latest analysis
   */
  async updateEpisodeSummaryFromAnalysis(
    episodeId: string,
    aiAnalysis: { analysis?: string; dailySummary?: string; estimatedRecoveryWindow?: string }
  ): Promise<void> {
    try {
      const episode = await storageService.getItem<Episode>('episodes', episodeId);
      if (!episode) return;

      // Prefer the full analysis, otherwise fall back to the daily summary
      const parts: string[] = [];
      if (aiAnalysis.analysis && aiAnalysis.analysis.trim().length > 0) {
        parts.push(aiAnalysis.analysis.trim());
      } else if (aiAnalysis.dailySummary && aiAnalysis.dailySummary.trim().length > 0) {
        parts.push(aiAnalysis.dailySummary.trim());
      }
      if (aiAnalysis.estimatedRecoveryWindow && aiAnalysis.estimatedRecoveryWindow.trim().length > 0) {
        parts.push(`Estimated recovery: ${aiAnalysis.estimatedRecoveryWindow.trim()}`);
      }

      const summaryText = parts.join(' ');
      if (summaryText.length === 0) return;

      episode.aiSummary = summaryText;
      episode.updatedAt = new Date().toISOString();
      await storageService.setItem('episodes', episodeId, episode);
    } catch (error) {
      console.error('❌ Error updating episode summary:', error);
    }
  }

}

export const episodeService = EpisodeService.getInstance();
