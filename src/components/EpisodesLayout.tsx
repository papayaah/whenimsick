'use client';

import React, { useState, useEffect } from 'react';
import { Episode, SymptomEntry } from '@/types/episode';
import { episodeService } from '@/services/episodeService';
import { MdTimeline } from 'react-icons/md';
import { FiHeart } from 'react-icons/fi';
import { TimelineItem, EpisodeDetail, EntryDetail } from './episodes';

interface EpisodesLayoutProps {
  deviceId: string;
  initialSelectedEpisodeId?: string | null;
  initialSelectedEntryId?: string | null;
}

interface EpisodeWithEntries extends Episode {
  entries: SymptomEntry[];
  isExpanded: boolean;
  isLoadingEntries: boolean;
}

type SelectedItem =
  | {
      type: 'episode';
      episode: EpisodeWithEntries;
    }
  | {
      type: 'entry';
      entry: SymptomEntry;
      episode: EpisodeWithEntries;
    }
  | null;

export default function EpisodesLayout({
  deviceId,
  initialSelectedEpisodeId,
  initialSelectedEntryId,
}: EpisodesLayoutProps) {
  const [episodes, setEpisodes] = useState<EpisodeWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  // Auto-select episode and entry from URL parameters
  useEffect(() => {
    if (episodes.length === 0) return;

    if (initialSelectedEpisodeId) {
      const episode = episodes.find(ep => ep.id === initialSelectedEpisodeId);
      if (episode) {
        if (initialSelectedEntryId) {
          const entry = episode.entries.find(
            e => e.id === initialSelectedEntryId
          );
          if (entry) {
            setSelectedItem({
              type: 'entry',
              entry: entry as SymptomEntry,
              episode,
            });
          } else {
            setSelectedItem({ type: 'episode', episode });
          }
        } else {
          setSelectedItem({ type: 'episode', episode });
        }
      }
    } else {
      // If no episode ID is provided, clear selection
      setSelectedItem(null);
    }
  }, [initialSelectedEpisodeId, initialSelectedEntryId, episodes]);

  useEffect(() => {
    if (deviceId) {
      loadEpisodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const loadEpisodesInternal = async () => {
    try {
      setLoading(true);
      const episodeData = await episodeService.getEpisodesByDevice(deviceId);

      // Priority loading: If we have a specific episode to show, load it first
      if (initialSelectedEpisodeId) {
        const priorityEpisode = episodeData.find(
          ep => ep.id === initialSelectedEpisodeId
        );
        if (priorityEpisode) {
          // Load the priority episode's entries immediately
          try {
            const { entries } = await episodeService.getEpisodeWithEntries(
              priorityEpisode.id
            );
            const episodeWithEntries = {
              ...priorityEpisode,
              entries: entries as SymptomEntry[],
              isExpanded: false,
              isLoadingEntries: false,
            };

            // Set this episode immediately so user sees it
            const otherEpisodesStub = episodeData
              .filter(ep => ep.id !== priorityEpisode.id)
              .map(ep => ({
                ...ep,
                entries: [],
                isExpanded: false,
                isLoadingEntries: true,
              }));

            setEpisodes([episodeWithEntries, ...otherEpisodesStub]);
            setLoading(false);

            // Load remaining episodes in background
            const remainingEpisodes = await Promise.all(
              episodeData
                .filter(ep => ep.id !== priorityEpisode.id)
                .map(async episode => {
                  try {
                    const { entries } =
                      await episodeService.getEpisodeWithEntries(episode.id);
                    return {
                      ...episode,
                      entries: entries as SymptomEntry[],
                      isExpanded: false,
                      isLoadingEntries: false,
                    };
                  } catch (error) {
                    console.error(
                      'Error loading entries for episode:',
                      episode.id,
                      error
                    );
                    return {
                      ...episode,
                      entries: [],
                      isExpanded: false,
                      isLoadingEntries: false,
                    };
                  }
                })
            );

            setEpisodes([episodeWithEntries, ...remainingEpisodes]);
            return;
          } catch (error) {
            console.error('Error loading priority episode:', error);
          }
        }
      }

      // Standard loading: Load all episodes with entries
      const episodesWithEntries = await Promise.all(
        episodeData.map(async episode => {
          try {
            const { entries } = await episodeService.getEpisodeWithEntries(
              episode.id
            );
            return {
              ...episode,
              entries: entries as SymptomEntry[],
              isExpanded: false,
              isLoadingEntries: false,
            };
          } catch (error) {
            console.error(
              'Error loading entries for episode:',
              episode.id,
              error
            );
            return {
              ...episode,
              entries: [],
              isExpanded: false,
              isLoadingEntries: false,
            };
          }
        })
      );

      setEpisodes(episodesWithEntries);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rename internal to loadEpisodes to maintain compatibility
  const loadEpisodes = loadEpisodesInternal;

  const handleEpisodeClick = (episode: EpisodeWithEntries) => {
    setSelectedItem({ type: 'episode', episode });
    // Update URL without page reload
    window.history.pushState({}, '', `/episodes/${episode.id}`);
  };

  const handleEntryClick = (
    entry: SymptomEntry,
    episode: EpisodeWithEntries
  ) => {
    setSelectedItem({ type: 'entry', entry, episode });
    // Update URL without page reload
    window.history.pushState(
      {},
      '',
      `/episodes/${episode.id}/entries/${entry.id}`
    );
  };

  const renderSelectedContent = () => {
    if (!selectedItem) {
      return (
        <div className='details-panel-empty'>
          <div className='empty-state'>
            <div className='empty-icon'>
              <MdTimeline size={64} style={{ color: '#FF6B9D' }} />
            </div>
            <h3>Select an Episode or Entry</h3>
            <p>
              Click on an episode or entry from the timeline to view detailed
              information and AI analysis here.
            </p>
          </div>
        </div>
      );
    }

    if (selectedItem.type === 'episode') {
      return (
        <EpisodeDetail
          episode={selectedItem.episode}
          selectedItem={null}
          onEntryClick={handleEntryClick}
          onReload={loadEpisodes}
          onDeselect={() => setSelectedItem(null)}
        />
      );
    }

    if (selectedItem.type === 'entry') {
      return (
        <EntryDetail
          entry={selectedItem.entry}
          episode={selectedItem.episode}
        />
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className='episodes-layout'>
        <div className='timeline-panel'>
          <div className='timeline-loading'>
            <div className='loading-spinner' />
            <p>Loading your episodes...</p>
          </div>
        </div>
        <div className='details-panel'>
          <div className='details-panel-empty'>
            <div className='loading-spinner' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='episodes-layout'>
      {/* Left Panel - Timeline */}
      <div className='timeline-panel'>
        <div className='timeline-header'>
          <h2>Sick Log</h2>
          <div className='timeline-stats'>
            <span>
              {episodes.length} episode{episodes.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {episodes.length === 0 ? (
          <div className='timeline-empty'>
            <div className='empty-icon'>
              <FiHeart size={64} style={{ color: '#FF6B9D' }} />
            </div>
            <h3>No illness episodes recorded</h3>
            <p>Start tracking your health by logging symptoms</p>
          </div>
        ) : (
          <div className='timeline-list'>
            {episodes
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )
              .map((episode, index) => (
                <TimelineItem
                  key={episode.id}
                  episode={episode}
                  index={index}
                  isSelected={
                    selectedItem?.type === 'episode' &&
                    selectedItem.episode.id === episode.id
                  }
                  onEpisodeClick={handleEpisodeClick}
                  onEntryClick={handleEntryClick}
                />
              ))}
          </div>
        )}
      </div>

      {/* Right Panel - Details */}
      <div className='details-panel'>{renderSelectedContent()}</div>
    </div>
  );
}
