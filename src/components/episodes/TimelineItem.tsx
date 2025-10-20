'use client';

import React from 'react';
import { Episode, SymptomEntry } from '@/types/episode';
import { formatDisplayDate } from '@/lib/utils';

interface EpisodeWithEntries extends Episode {
  entries: SymptomEntry[];
  isExpanded: boolean;
  isLoadingEntries: boolean;
}

interface TimelineItemProps {
  episode: EpisodeWithEntries;
  index: number;
  isSelected: boolean;
  onEpisodeClick: (episode: EpisodeWithEntries) => void;
  onEntryClick: (entry: SymptomEntry, episode: EpisodeWithEntries) => void;
}

const getEpisodeCardColor = (index: number) => {
  const colors = [
    { bg: '#FFE5EC', border: '#FF6B9D', line: '#FF6B9D' }, // pastel pink
    { bg: '#E8F4FA', border: '#4A90E2', line: '#4A90E2' }, // pastel blue
    { bg: '#D8F3DC', border: '#52B788', line: '#52B788' }, // pastel mint
    { bg: '#F0E6FF', border: '#9D84B7', line: '#9D84B7' }, // pastel lavender
    { bg: '#FFE5D9', border: '#FF9770', line: '#FF9770' }, // pastel peach
    { bg: '#FFF9E5', border: '#FFC947', line: '#FFC947' }, // pastel yellow
    { bg: '#FFD6E0', border: '#FF758F', line: '#FF758F' }, // pastel coral
  ];
  return colors[index % colors.length];
};

const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'low':
      return 'severity-low';
    case 'moderate':
      return 'severity-moderate';
    case 'high':
      return 'severity-high';
    default:
      return 'severity-low';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'status-active';
    case 'resolved':
      return 'status-resolved';
    case 'archived':
      return 'status-archived';
    default:
      return 'status-active';
  }
};

const getSeverityDotColor = (severity?: string) => {
  switch (severity) {
    case 'low':
      return 'var(--accent-mint)'; // Green for low severity
    case 'moderate':
      return 'var(--accent-yellow)'; // Yellow for moderate severity
    case 'high':
      return 'var(--accent-coral)'; // Coral/red for high severity
    default:
      return 'var(--accent-mint)'; // Default to green for low
  }
};

const formatDuration = (episode: EpisodeWithEntries): string => {
  const start = new Date(episode.startDate);
  let end: Date;

  if (episode.endDate) {
    // Episode has been resolved
    end = new Date(episode.endDate);
  } else if (episode.entries && episode.entries.length > 0) {
    // Use the date of the last entry
    const lastEntry = episode.entries.reduce((latest, entry) =>
      new Date(entry.date) > new Date(latest.date) ? entry : latest
    );
    end = new Date(lastEntry.date);
  } else {
    // Fallback to start date (single day episode)
    end = start;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
};

export default function TimelineItem({
  episode,
  index,
  isSelected,
  onEpisodeClick,
  onEntryClick,
}: TimelineItemProps) {
  const startDate = new Date(episode.startDate);
  const month = startDate
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
  const startDay = startDate.getDate();
  const cardColors = getEpisodeCardColor(index);

  // Calculate end date
  let endDate: Date;
  let showEndDate = false;

  if (episode.endDate) {
    endDate = new Date(episode.endDate);
    showEndDate = true;
  } else if (episode.entries && episode.entries.length > 0) {
    const lastEntry = episode.entries.reduce((latest, entry) =>
      new Date(entry.date) > new Date(latest.date) ? entry : latest
    );
    endDate = new Date(lastEntry.date);
    // Only show end date if it's different from start date
    showEndDate = endDate.toDateString() !== startDate.toDateString();
  } else {
    endDate = startDate;
    showEndDate = false;
  }

  const endDay = endDate.getDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endYear = endDate.getFullYear();

  return (
    <div
      className={`timeline-row ${isSelected ? 'selected' : ''}`}
      onClick={() => onEpisodeClick(episode)}
    >
      {/* Timeline Column - Left */}
      <div className='timeline-column'>
        <div className='timeline-month'>{month}</div>
        <div className='timeline-year'>{startDate.getFullYear()}</div>
        <div
          className='timeline-date-circle'
          style={{ backgroundColor: cardColors.border }}
        >
          <span className='timeline-date-text'>{startDay}</span>
        </div>
        <div
          className='timeline-line'
          style={{ backgroundColor: cardColors.line }}
        />
        {showEndDate && (
          <>
            <div
              className='timeline-date-circle'
              style={{ 
                backgroundColor: cardColors.border,
                marginTop: 'auto'
              }}
            >
              <span className='timeline-date-text'>{endDay}</span>
            </div>
            {(endMonth !== month || endYear !== startDate.getFullYear()) && (
              <>
                <div className='timeline-month' style={{ marginTop: '0.5rem' }}>
                  {endMonth}
                </div>
                {endYear !== startDate.getFullYear() && (
                  <div className='timeline-year'>{endYear}</div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Episode Content - Right */}
      <div className='episode-column'>
        <div
          className='episode-container'
          style={{
            backgroundColor: isSelected ? 'white' : cardColors.bg,
            borderColor: cardColors.border,
            boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
          }}
        >
          <div className='episode-card'>
            <h3 className='episode-title'>
              {episode.title || 'Illness Episode'}
            </h3>

            <div className='episode-subtitle-row'>
              <span className='episode-subtitle'>
                {formatDuration(episode)} • {episode.entryCount} entr
                {episode.entryCount === 1 ? 'y' : 'ies'}
              </span>
            </div>

            {/* Remove AI summary snippet in the timeline card per request */}

            <div className='episode-badges'>
              <span
                className={`status-badge ${getStatusColor(episode.status)}`}
              >
                {episode.status}
              </span>
              {episode.severity && (
                <span
                  className={`severity-badge ${getSeverityColor(episode.severity)}`}
                >
                  {episode.severity}
                </span>
              )}
            </div>

            {/* Entry List */}
            {episode.entries.length > 0 && (
              <div className='entries-preview'>
                <h4>All Entries ({episode.entries.length})</h4>
                <div className='entries-preview-list'>
                  {episode.entries
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map(entry => (
                      <div
                        key={entry.id}
                        className='entry-preview'
                        onClick={e => {
                          e.stopPropagation();
                          onEntryClick(entry, episode);
                        }}
                        style={{
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(255, 255, 255, 0.9)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow =
                            '0 2px 8px rgba(0, 0, 0, 0.1)';
                          const arrow = e.currentTarget.querySelector(
                            '.entry-preview-arrow'
                          ) as HTMLElement;
                          if (arrow) arrow.style.opacity = '1';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = '';
                          const arrow = e.currentTarget.querySelector(
                            '.entry-preview-arrow'
                          ) as HTMLElement;
                          if (arrow) arrow.style.opacity = '0';
                        }}
                      >
                        {/* Colored dot showing severity level */}
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getSeverityDotColor(entry.severity),
                            marginRight: '0.5rem',
                            flexShrink: 0,
                          }}
                        />
                        <span className='entry-preview-date'>
                          {formatDisplayDate(entry.date)}
                        </span>
                        <span className='entry-preview-symptoms'>
                          {entry.symptoms.slice(0, 2).join(', ')}
                          {entry.symptoms.length > 2 && '...'}
                        </span>
                        <span
                          className='entry-preview-arrow'
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1rem',
                            color: cardColors.border,
                            opacity: '0',
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          →
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
