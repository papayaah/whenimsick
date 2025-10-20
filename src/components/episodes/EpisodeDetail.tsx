'use client';

import React from 'react';
import { Episode, SymptomEntry } from '@/types/episode';
import { formatDisplayDate, getRelativeDateString } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdAutoAwesome, MdCalendarToday } from 'react-icons/md';
import { episodeService } from '@/services/episodeService';

interface EpisodeWithEntries extends Episode {
  entries: SymptomEntry[];
  isExpanded: boolean;
  isLoadingEntries: boolean;
}

interface EpisodeDetailProps {
  episode: EpisodeWithEntries;
  selectedItem: SymptomEntry | null;
  onEntryClick: (entry: SymptomEntry, episode: EpisodeWithEntries) => void;
  onReload: () => void;
  onDeselect: () => void;
}

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

export default function EpisodeDetail({
  episode,
  onReload,
  onDeselect,
}: EpisodeDetailProps) {
  return (
    <div
      className='details-panel'
      style={{
        padding: '2.5rem 3rem',
        background:
          'linear-gradient(135deg, rgba(255, 229, 236, 0.1) 0%, rgba(232, 244, 250, 0.1) 100%)',
      }}
    >
      {/* Header - Newspaper Style */}
      <div
        style={{
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--accent-pink)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Episode
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            •
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDisplayDate(episode.startDate)} (
            {getRelativeDateString(episode.startDate)})
          </span>
        </div>
        
        {/* Badges row - properly aligned */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <span
            className={`status-badge ${getStatusColor(episode.status)}`}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.6875rem',
              marginBottom: 0,
            }}
          >
            {episode.status}
          </span>
          {episode.severity && (
            <span
              className={`severity-badge ${getSeverityColor(episode.severity)}`}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.6875rem',
                marginBottom: 0,
              }}
            >
              {episode.severity}
            </span>
          )}
        </div>
        <h1
          style={{
            fontSize: '2.5rem',
            margin: 0,
            fontWeight: '800',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            marginBottom: '0.5rem',
          }}
        >
          {episode.title || 'Illness Episode'}
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-muted)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          {episode.symptoms.join(' • ')}
        </p>
      </div>

      {/* Flowing Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '3rem',
          columnGap: '4rem',
        }}
      >
        {/* Column 1 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Episode Overview */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '3px solid var(--accent-mint)',
              }}
            >
              <MdCalendarToday
                size={24}
                style={{ color: 'var(--accent-mint)' }}
              />
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Episode Overview
              </h3>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                paddingLeft: '0.5rem',
                borderLeft: '4px solid var(--pastel-mint)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Started
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {formatDisplayDate(episode.startDate)} (
                  {getRelativeDateString(episode.startDate)})
                </span>
              </div>
              {episode.endDate && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Ended
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {formatDisplayDate(episode.endDate)} (
                    {getRelativeDateString(episode.endDate)})
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Duration
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {formatDuration(episode)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Entries
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {episode.entryCount}
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {episode.aiSummary ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid var(--accent-blue)',
                }}
              >
                <MdAutoAwesome
                  size={24}
                  style={{ color: 'var(--accent-blue)' }}
                />
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  AI Episode Summary
                </h3>
              </div>
              <div
                style={{
                  margin: 0,
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)',
                  fontSize: '1.0625rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '4px solid var(--pastel-blue)',
                }}
              >
                <p style={{ margin: 0 }}>{episode.aiSummary}</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--pastel-blue) 0%, rgba(232, 244, 250, 0.3) 100%)',
                padding: '1.5rem',
                borderLeft: '5px solid var(--accent-blue)',
                borderRadius: '0 12px 12px 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <MdAutoAwesome
                  size={24}
                  style={{ color: 'var(--accent-blue)' }}
                />
                <h4
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--accent-blue)',
                    margin: 0,
                  }}
                >
                  AI Episode Summary
                </h4>
              </div>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  fontStyle: 'italic',
                }}
              >
                No AI summary available for this episode yet. Summaries are
                generated when episodes are resolved or have multiple entries.
              </p>
            </div>
          )}
        </div>

        {/* Column 2 - Condition Trend (Improving / Stable / Worsening) */}
        <div>
          {episode.entries.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '3px solid var(--accent-coral)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Condition Trend
                </h3>
              </div>

              {/* Clean line chart using Recharts */}
              {(() => {
                const severityToNum = (s?: string) =>
                  s === 'high' ? 3 : s === 'moderate' ? 2 : 1;
                
                const severityToColor = (s?: string) =>
                  s === 'high'
                    ? '#ef4444' // red
                    : s === 'moderate'
                    ? '#eab308' // yellow
                    : '#22c55e'; // green

                // Sort oldest to newest for chart (reverse of timeline)
                const ordered = episode.entries
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // Prepare data for Recharts
                const chartData = ordered.map((entry) => ({
                  day: new Date(entry.date).getDate(),
                  severity: severityToNum(entry.severity),
                  severityLabel: entry.severity,
                  date: entry.date,
                  trend: entry.aiAnalysis?.trend || 'stable',
                  color: severityToColor(entry.severity),
                }));

                return (
                  <div
                    style={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="day" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          domain={[0.5, 3.5]}
                          hide={true}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div style={{
                                  background: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}>
                                  <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>
                                    Day {label}
                                  </p>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                    Severity: <span style={{ color: data.color, fontWeight: '500' }}>{data.severityLabel}</span>
                                  </p>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                    Trend: <span style={{ fontWeight: '500' }}>{data.trend}</span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="severity"
                          stroke="#9ca3af"
                          strokeWidth={2}
                          dot={(props) => {
                            const { cx, cy, payload } = props;
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={6}
                                fill={payload.color}
                                stroke="white"
                                strokeWidth={2}
                              />
                            );
                          }}
                          activeDot={(props) => {
                            const { cx, cy, payload } = props;
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={8}
                                fill={payload.color}
                                stroke="white"
                                strokeWidth={3}
                              />
                            );
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Legend */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f3f4f6',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                        <span>Low</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                        <span>Moderate</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Removed daily entries list in episode view (shown on timeline) */}

      {/* Actions */}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-start',
        }}
      >
        {episode.status === 'active' && (
          <button
            className='btn-secondary'
            onClick={() =>
              episodeService
                .resolveEpisode(
                  episode.id,
                  new Date().toISOString().split('T')[0]
                )
                .then(onReload)
            }
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '400',
              borderRadius: '8px',
              background:
                'linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-blue) 100%)',
              border: '2px solid var(--accent-mint)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Mark as Resolved
          </button>
        )}
        <button
          className='btn-danger'
          onClick={() => {
            if (
              confirm(
                'Are you sure you want to delete this episode and all its entries?'
              )
            ) {
              episodeService.deleteEpisode(episode.id).then(() => {
                onDeselect();
                onReload();
              });
            }
          }}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.9375rem',
            fontWeight: '400',
            borderRadius: '8px',
            background:
              'linear-gradient(135deg, var(--pastel-peach) 0%, rgba(255, 229, 217, 0.5) 100%)',
            border: '2px solid var(--accent-peach)',
            color: 'var(--accent-peach)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Delete Episode
        </button>
      </div>
    </div>
  );
}
