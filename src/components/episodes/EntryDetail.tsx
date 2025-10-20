'use client';

import React from 'react';
import { Episode, SymptomEntry } from '@/types/episode';
import { formatDisplayDate, getRelativeDateString } from '@/lib/utils';
import MedicalTextProcessor from '../MedicalTextProcessor';
import {
  MdAutoAwesome,
  MdLightbulb,
  MdSearch,
  MdInfo,
  MdWarning,
  MdSchedule,
  MdHelpOutline,
} from 'react-icons/md';

interface EpisodeWithEntries extends Episode {
  entries: SymptomEntry[];
  isExpanded: boolean;
  isLoadingEntries: boolean;
}

interface EntryDetailProps {
  entry: SymptomEntry;
  episode: EpisodeWithEntries;
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

export default function EntryDetail({ entry, episode }: EntryDetailProps) {
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
            Entry
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            •
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDisplayDate(entry.date)} ({getRelativeDateString(entry.date)}
            )
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            •
          </span>
          <span
            className={`severity-badge ${getSeverityColor(entry.severity)}`}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.6875rem',
              marginBottom: 0,
            }}
          >
            {entry.severity || 'unrated'}
          </span>
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
          {episode.title || 'Health Entry'}
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-muted)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          {entry.symptoms.join(' • ')}
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
          {/* Daily Summary - Featured */}
          {entry.aiAnalysis && (
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
                <MdAutoAwesome
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
                  Daily Summary
                </h3>
              </div>
              <div
                style={{
                  margin: 0,
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)',
                  fontSize: '1.0625rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '4px solid var(--pastel-mint)',
                }}
              >
                <MedicalTextProcessor
                  text={entry.aiAnalysis.dailySummary}
                  medicalTerms={entry.aiAnalysis.medicalTerms}
                />
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--pastel-yellow) 0%, rgba(255, 249, 229, 0.3) 100%)',
                padding: '1.5rem',
                borderLeft: '5px solid var(--accent-yellow)',
                borderRadius: '0 12px 12px 0',
              }}
            >
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: 'var(--accent-yellow)',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Your Notes
              </h4>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                fontSize: '0.9375rem',
              }}
            >
              &quot;{entry.notes}&quot;
            </p>
            </div>
          )}

          {/* Self-Care Tips */}
          {entry.aiAnalysis?.selfCareTips &&
            entry.aiAnalysis.selfCareTips.length > 0 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '3px solid var(--accent-lavender)',
                  }}
                >
                  <MdLightbulb
                    size={24}
                    style={{ color: 'var(--accent-lavender)' }}
                  />
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Self-Care Tips
                  </h3>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '2rem',
                    lineHeight: '1.7',
                    borderLeft: '4px solid var(--pastel-lavender)',
                    paddingTop: '0.25rem',
                  }}
                >
                  {entry.aiAnalysis.selfCareTips.map((tip, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                      }}
                    >
                      <MedicalTextProcessor
                        text={tip}
                        medicalTerms={entry.aiAnalysis?.medicalTerms}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Column 2 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Detailed Analysis */}
          {entry.aiAnalysis && (
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
                <MdSearch size={24} style={{ color: 'var(--accent-blue)' }} />
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Analysis
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
                <MedicalTextProcessor
                  text={entry.aiAnalysis.analysis}
                  medicalTerms={entry.aiAnalysis.medicalTerms}
                />
              </div>
              {/* Citations */}
              {entry.aiAnalysis?.citations && entry.aiAnalysis.citations.length > 0 && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: '0 0 0.75rem 0',
                    }}
                  >
                    Sources & References
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {entry.aiAnalysis.citations.map((citation, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                        }}
                      >
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--accent-blue)',
                            textDecoration: 'none',
                            fontWeight: '500',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none';
                          }}
                        >
                          {citation.title} ↗
                        </a>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            lineHeight: '1.4',
                          }}
                        >
                          {citation.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginTop: '1rem',
                  paddingLeft: '0.5rem',
                  opacity: 0.7,
                }}
              >
                *AI-generated for educational purposes only. Not medical advice.
              </p>
            </div>
          )}

          {/* Medical Consultation - Highlighted */}
          {entry.aiAnalysis?.medicalConsultationSuggested && (
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--pastel-peach) 0%, rgba(255, 229, 217, 0.5) 100%)',
                padding: '1.5rem',
                borderLeft: '5px solid var(--accent-peach)',
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
                <MdWarning size={24} style={{ color: 'var(--accent-peach)' }} />
                <h4
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--accent-peach)',
                    margin: 0,
                  }}
                >
                  Medical Consultation Suggested
                </h4>
              </div>
              <div
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}
              >
                <MedicalTextProcessor
                  text={entry.aiAnalysis.reasonForConsultation}
                  medicalTerms={entry.aiAnalysis.medicalTerms}
                />
              </div>
            </div>
          )}

          {/* Information Notes */}
          {entry.aiAnalysis?.informationNotes &&
            entry.aiAnalysis.informationNotes.length > 0 && (
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
                  <MdInfo size={24} style={{ color: 'var(--accent-coral)' }} />
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Important Notes
                  </h3>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '2rem',
                    lineHeight: '1.7',
                    borderLeft: '4px solid var(--pastel-coral)',
                    paddingTop: '0.25rem',
                  }}
                >
                  {entry.aiAnalysis.informationNotes.map((note, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                      }}
                    >
                      <MedicalTextProcessor
                        text={note}
                        medicalTerms={entry.aiAnalysis?.medicalTerms}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Recovery Window */}
          {entry.aiAnalysis?.estimatedRecoveryWindow && (
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--pastel-lavender) 0%, rgba(240, 230, 255, 0.3) 100%)',
                padding: '1.5rem',
                borderLeft: '5px solid var(--accent-lavender)',
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
                <MdSchedule
                  size={24}
                  style={{ color: 'var(--accent-lavender)' }}
                />
                <h4
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--accent-lavender)',
                    margin: 0,
                  }}
                >
                  Recovery Timeframe
                </h4>
              </div>
              <div
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}
              >
                <MedicalTextProcessor
                  text={entry.aiAnalysis.estimatedRecoveryWindow}
                  medicalTerms={entry.aiAnalysis.medicalTerms}
                />
              </div>
            </div>
          )}

          {/* Follow-up Question */}
          {entry.aiAnalysis?.followUpQuestion && (
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
                <MdHelpOutline
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
                  Follow-up Question
                </h4>
              </div>
              <div
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}
              >
                <MedicalTextProcessor
                  text={entry.aiAnalysis.followUpQuestion}
                  medicalTerms={entry.aiAnalysis.medicalTerms}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show message if no AI analysis */}
      {!entry.aiAnalysis && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            opacity: 0.6,
          }}
        >
          <MdAutoAwesome
            size={64}
            style={{
              color: 'var(--accent-blue)',
              opacity: 0.3,
              marginBottom: '1rem',
            }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: '400',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            No AI Analysis Available
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              margin: 0,
              fontSize: '1rem',
            }}
          >
            Analysis is generated automatically when symptoms are logged.
          </p>
        </div>
      )}
    </div>
  );
}
