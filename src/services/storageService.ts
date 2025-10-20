// Local storage service for episode and symptom data persistence
import { Episode, SymptomEntry } from '@/types/episode';

// Episodes cache to avoid repeated localStorage.getAllItems calls
let episodesCache: { episodes: Episode[]; timestamp: number; deviceId: string } | null = null;
const EPISODES_CACHE_DURATION = 10000; // 10 seconds

export interface StorageItem {
  id: string;
  data: unknown;
  timestamp: string;
}

export interface StorageCollection<T> {
  [key: string]: T;
}

class StorageService {
  private static instance: StorageService | null = null;
  private readonly STORAGE_PREFIX = 'whenimsick_';

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private getKey(collection: string, id?: string): string {
    return `${this.STORAGE_PREFIX}${collection}${id ? `_${id}` : ''}`;
  }

  // Generic storage methods
  async setItem<T>(collection: string, id: string, data: T): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const item: StorageItem = {
        id,
        data,
        timestamp: new Date().toISOString(),
      };
      const key = this.getKey(collection, id);
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(
        `Failed to store item ${id} in collection ${collection}:`,
        error
      );
      throw error;
    }
  }

  async getItem<T>(collection: string, id: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    try {
      const key = this.getKey(collection, id);
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const item: StorageItem = JSON.parse(stored);
      return item.data as T;
    } catch (error) {
      console.error(
        `Failed to retrieve item ${id} from collection ${collection}:`,
        error
      );
      return null;
    }
  }

  async getAllItems<T>(collection: string): Promise<StorageCollection<T>> {
    if (typeof window === 'undefined') return {};
    try {
      const items: StorageCollection<T> = {};
      const prefix = this.getKey(collection);

      // Use Object.keys to get all localStorage keys more efficiently
      const keys = Object.keys(localStorage);
      const matchingKeys = keys.filter(key => key.startsWith(prefix + '_'));
      
      // Process matching keys in batches to avoid blocking the UI
      const batchSize = 10;
      for (let i = 0; i < matchingKeys.length; i += batchSize) {
        const batch = matchingKeys.slice(i, i + batchSize);
        
        for (const key of batch) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const item: StorageItem = JSON.parse(stored);
              items[item.id] = item.data as T;
            } catch (parseError) {
              console.warn(`Failed to parse stored item ${key}:`, parseError);
            }
          }
        }
        
        // Yield control to the browser between batches
        if (i + batchSize < matchingKeys.length) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      return items;
    } catch (error) {
      console.error(
        `Failed to retrieve all items from collection ${collection}:`,
        error
      );
      return {};
    }
  }

  async removeItem(collection: string, id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const key = this.getKey(collection, id);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Failed to remove item ${id} from collection ${collection}:`,
        error
      );
      throw error;
    }
  }

  async clearCollection(collection: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const prefix = this.getKey(collection);
      const keys = Object.keys(localStorage);
      const keysToRemove = keys.filter(key => key.startsWith(prefix));

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`Failed to clear collection ${collection}:`, error);
      throw error;
    }
  }

  // Episode-specific methods
  async getEpisodesByDevice(deviceId: string): Promise<Episode[]> {
    try {
      // Check cache first
      if (episodesCache && 
          episodesCache.deviceId === deviceId && 
          (Date.now() - episodesCache.timestamp) < EPISODES_CACHE_DURATION) {
        return episodesCache.episodes;
      }

      const episodes = await this.getAllItems<Episode>('episodes');
      const filteredEpisodes = Object.values(episodes).filter(
        episode => episode.deviceId === deviceId
      );

      // Cache the result
      episodesCache = { 
        episodes: filteredEpisodes, 
        timestamp: Date.now(), 
        deviceId 
      };

      return filteredEpisodes;
    } catch (error) {
      console.error('Failed to get episodes:', error);
      return [];
    }
  }

  async getActiveEpisodesByDevice(deviceId: string): Promise<Episode[]> {
    try {
      // Use cached episodes if available
      if (episodesCache && 
          episodesCache.deviceId === deviceId && 
          (Date.now() - episodesCache.timestamp) < EPISODES_CACHE_DURATION) {
        return episodesCache.episodes.filter(episode => episode.status === 'active');
      }

      const episodes = await this.getAllItems<Episode>('episodes');
      const filteredEpisodes = Object.values(episodes).filter(
        episode => episode.deviceId === deviceId && episode.status === 'active'
      );

      // Cache all episodes for this device
      const allEpisodes = Object.values(episodes).filter(
        episode => episode.deviceId === deviceId
      );
      episodesCache = { 
        episodes: allEpisodes, 
        timestamp: Date.now(), 
        deviceId 
      };

      return filteredEpisodes;
    } catch (error) {
      console.error('Failed to get active episodes:', error);
      return [];
    }
  }

  async getSymptomEntriesByEpisode(episodeId: string): Promise<SymptomEntry[]> {
    try {
      const entries = await this.getAllItems<SymptomEntry>('symptom_entries');
      return Object.values(entries)
        .filter(entry => entry.episodeId === episodeId)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    } catch (error) {
      console.error('Failed to get symptom entries:', error);
      return [];
    }
  }

  async getRecentSymptomEntries(
    deviceId: string,
    days: number = 7
  ): Promise<SymptomEntry[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const episodes = await this.getActiveEpisodesByDevice(deviceId);
      const recentEntries: SymptomEntry[] = [];

      for (const episode of episodes) {
        const entries = await this.getSymptomEntriesByEpisode(episode.id);
        const filteredEntries = entries.filter(
          entry => new Date(entry.date) >= cutoffDate
        );
        recentEntries.push(...filteredEntries);
      }

      return recentEntries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Failed to get recent symptom entries:', error);
      return [];
    }
  }

  // Utility methods
  async exportData(): Promise<string> {
    try {
      const data = {
        episodes: await this.getAllItems('episodes'),
        symptomEntries: await this.getAllItems('symptom_entries'),
        glossary: await this.getAllItems('glossary'),
        exportDate: new Date().toISOString(),
        version: '1.1',
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      if (data.episodes) {
        await this.clearCollection('episodes');
        for (const [id, episode] of Object.entries(data.episodes)) {
          await this.setItem('episodes', id, episode);
        }
      }

      if (data.symptomEntries) {
        await this.clearCollection('symptom_entries');
        for (const [id, entry] of Object.entries(data.symptomEntries)) {
          await this.setItem('symptom_entries', id, entry);
        }
      }

      if (data.glossary) {
        await this.clearCollection('glossary');
        for (const [id, term] of Object.entries(data.glossary)) {
          await this.setItem('glossary', id, term);
        }
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  async getStorageStats(): Promise<{
    episodeCount: number;
    entryCount: number;
    storageUsed: string;
  }> {
    try {
      const episodes = await this.getAllItems('episodes');
      const entries = await this.getAllItems('symptom_entries');

      // Estimate storage usage
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          totalSize += (key.length + (value?.length || 0)) * 2; // UTF-16 uses 2 bytes per character
        }
      }

      const storageUsed =
        totalSize > 1024 * 1024
          ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
          : totalSize > 1024
            ? `${(totalSize / 1024).toFixed(2)} KB`
            : `${totalSize} bytes`;

      return {
        episodeCount: Object.keys(episodes).length,
        entryCount: Object.keys(entries).length,
        storageUsed,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { episodeCount: 0, entryCount: 0, storageUsed: '0 bytes' };
    }
  }
}

// Invalidate episodes cache when episodes are modified
export function invalidateEpisodesCache() {
  episodesCache = null;
}

export const storageService = StorageService.getInstance();
