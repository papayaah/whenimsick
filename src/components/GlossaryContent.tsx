'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { glossaryService, GlossaryTerm } from '@/services/glossaryService';
import {
  MdSearch,
  MdSort,
  MdAutoStories,
  MdTrendingUp,
  MdSchedule,
  MdAutoAwesome,
  MdLocalLibrary,
  MdStars,
} from 'react-icons/md';

export default function GlossaryContent() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'recent' | 'frequent'>(
    'alphabetical'
  );
  const [stats, setStats] = useState({
    totalTerms: 0,
    recentTerms: 0,
    mostFrequent: null as GlossaryTerm | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadGlossary = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedTerms = await glossaryService.getTermsSorted(sortBy);
      const loadedStats = await glossaryService.getStats();
      setTerms(loadedTerms);
      setFilteredTerms(loadedTerms);
      setStats(loadedStats);
    } catch (error) {
      console.error('Failed to load glossary:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  const searchGlossary = useCallback(async () => {
    try {
      const results = await glossaryService.searchTerms(searchQuery);
      setFilteredTerms(results);
    } catch (error) {
      console.error('Failed to search glossary:', error);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadGlossary();
  }, [loadGlossary]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchGlossary();
    } else {
      setFilteredTerms(terms);
    }
  }, [searchQuery, terms, searchGlossary]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleTermClick = (term: GlossaryTerm) => {
    if (term.firstEncounterEpisodeId && term.firstEncounterEntryId) {
      // Use proper Next.js navigation to the entry route
      const url = `/episodes/${term.firstEncounterEpisodeId}/entries/${term.firstEncounterEntryId}`;
      window.location.href = url;
    }
  };

  return (
    <div className='glossary-layout' style={{ height: '100%' }}>
      {/* Left Panel - Stats and Controls */}
      <div className='glossary-sidebar'>
        <div className='glossary-header'>
          <h2>
            <MdAutoAwesome style={{ display: 'inline', marginRight: '0.5rem', color: '#9D84B7' }} />
            Medical Glossary
          </h2>
          <div className='glossary-subtitle'>
            <span>
              {filteredTerms.length} term{filteredTerms.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className='glossary-controls'>
          {/* Stats Overview */}
          <div className='stats-section'>
            <div className='stat-item'>
              <MdLocalLibrary size={24} style={{ color: '#FF6B9D' }} />
              <div>
                <div className='stat-value'>{stats.totalTerms}</div>
                <div className='stat-label'>Total Terms</div>
              </div>
            </div>

            <div className='stat-item'>
              <MdTrendingUp size={24} style={{ color: '#4A90E2' }} />
              <div>
                <div className='stat-value'>{stats.recentTerms}</div>
                <div className='stat-label'>This Week</div>
              </div>
            </div>

            <div className='stat-item'>
              <MdStars size={24} style={{ color: '#9D84B7' }} />
              <div>
                <div className='stat-value' style={{ fontSize: '1rem' }}>
                  {stats.mostFrequent?.term || 'N/A'}
                </div>
                <div className='stat-label'>Most Frequent</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className='search-section'>
            <div style={{ position: 'relative' }}>
              <MdSearch
                size={20}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              />
              <input
                type='text'
                placeholder='Search terms...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>

          {/* Sort */}
          <div className='sort-section'>
            <label style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', display: 'block' }}>
              <MdSort style={{ display: 'inline', marginRight: '0.375rem' }} />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e =>
                setSortBy(
                  e.target.value as 'alphabetical' | 'recent' | 'frequent'
                )
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              <option value='alphabetical'>A-Z</option>
              <option value='recent'>Recently Seen</option>
              <option value='frequent'>Most Frequent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Panel - Terms List */}
      <div className='glossary-content'>
        {isLoading ? (
          <div className='analysis-panel-empty'>
            <div className='loading-spinner' />
            <span>Loading glossary...</span>
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className='analysis-panel-empty'>
            <div className='empty-state'>
              <div className='empty-icon'>
                <MdAutoAwesome size={64} style={{ color: '#9D84B7' }} />
              </div>
              <h3>No Terms Found</h3>
              <p>
                {searchQuery
                  ? 'No terms found matching your search'
                  : 'No medical terms yet. Start tracking symptoms to build your glossary!'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0' }}>
            {filteredTerms.map((term, index) => {
              const colors = [
                { bg: '#FFE5EC', accent: '#FF6B9D' }, // pastel pink
                { bg: '#E8F4FA', accent: '#4A90E2' }, // pastel blue
                { bg: '#D8F3DC', accent: '#52B788' }, // pastel mint
                { bg: '#F0E6FF', accent: '#9D84B7' }, // pastel lavender
                { bg: '#FFE5D9', accent: '#FF9770' }, // pastel peach
                { bg: '#FFF9E5', accent: '#FFC947' }, // pastel yellow
                { bg: '#FFD6E0', accent: '#FF758F' }, // pastel coral
              ];
              const color = colors[index % colors.length];
              
              return (
                <div
                  key={term.id}
                  style={{
                    padding: '1.5rem',
                    cursor: term.firstEncounterEpisodeId ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    borderBottom:
                      index < filteredTerms.length - 1
                        ? '1px solid #e5e7eb'
                        : 'none',
                    backgroundColor: 'white',
                    borderLeft: `4px solid ${color.accent}`,
                  }}
                  onClick={() => handleTermClick(term)}
                  onMouseEnter={e => {
                    if (term.firstEncounterEpisodeId) {
                      e.currentTarget.style.backgroundColor = color.bg;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {/* Term and definition */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h3
                        style={{
                          color: '#1f2937',
                          fontSize: '1.25rem',
                          fontWeight: '400',
                          margin: 0,
                          fontFamily: 'Montserrat, Inter, sans-serif',
                        }}
                      >
                        {term.term}
                      </h3>
                      {term.timesEncountered > 1 && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: color.accent,
                            backgroundColor: color.bg,
                            padding: '0.375rem 0.75rem',
                            borderRadius: '16px',
                            fontWeight: '400',
                            border: `1px solid ${color.accent}`,
                          }}
                        >
                          Seen {term.timesEncountered}×
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        color: '#4b5563',
                        lineHeight: '1.6',
                        margin: 0,
                        fontSize: '1rem',
                      }}
                    >
                      {term.definition}
                    </p>

                    {/* Metadata */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        paddingTop: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <MdSchedule size={16} style={{ color: color.accent }} />
                        <span>
                          {formatDate(term.firstLearnedDate)}
                        </span>
                      </div>

                      {term.firstEncounterEpisodeId &&
                        term.firstEncounterEntryId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <MdAutoStories size={16} style={{ color: color.accent }} />
                            <span>
                              From{' '}
                              <span
                                style={{
                                  color: color.accent,
                                  fontWeight: '400',
                                }}
                              >
                                {term.firstEncounterEpisodeTitle ||
                                  'Health Episode'}
                              </span>
                            </span>
                          </div>
                        )}

                      {term.lastSeenDate !== term.firstLearnedDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <MdTrendingUp size={16} style={{ color: color.accent }} />
                          <span>
                            Last: {formatDate(term.lastSeenDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
