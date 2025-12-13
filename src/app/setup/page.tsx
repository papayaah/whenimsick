'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aiService } from '@/lib/ai-service';
import { aiSetupService } from '@/services/aiSetupService';
import { DemoSimulation, MOCK_EPISODES, formatDisplayDate } from '@/components/demo';
import {
  MdAutoAwesome,
  MdCheckCircle,
  MdSettings,
} from 'react-icons/md';
import { FiCalendar } from 'react-icons/fi';

export default function SetupPage() {
  const router = useRouter();
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [showDemoEpisodeView, setShowDemoEpisodeView] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('demo-episode-1');
  const [selectedEntry, setSelectedEntry] = useState<string>('day3');

  useEffect(() => {
    const checkAI = async () => {
      // Check if AI is already set up first
      if (aiSetupService.isAISetup()) {
        // If already set up, redirect immediately without showing content
        router.replace('/app');
        return;
      }

      // Show setup content only if AI is not set up
      setIsCheckingSetup(false);
      const status = await aiService.initialize();
      setAiAvailable(status.available);

      // If AI is available, mark it as set up and redirect to home immediately
      if (status.available) {
        const provider = status.provider || 'chrome';
        aiSetupService.markAISetup(provider);
        console.log(`✅ AI setup complete with ${provider === 'gemini' ? 'Gemini API' : 'Chrome AI'}`);
        // Redirect immediately, no delay
        router.replace('/app');
      }
    };
    checkAI();
  }, [router]);

  const getAIStatusMessage = () => {
    if (aiAvailable === null) {
      return 'Checking Chrome AI availability...';
    }

    if (aiAvailable) {
      return 'Chrome AI is ready! You can now use AI-powered symptom analysis.';
    }

    return 'Chrome AI is not enabled on this device. Please follow the setup instructions below to enable the required features.';
  };



  // Show loading state while checking if AI is already set up
  if (isCheckingSetup) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)'
        }}>
          Checking setup status...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '450px 1fr',
        gap: 0,
        flex: 1,
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Timeline Drawer - Sibling to both columns, slides from split */}
        {showDemoEpisodeView && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 450,
              width: '450px',
              height: '100%',
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              borderRight: '2px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1,
              animation: 'drawerSlide 0.5s ease-out forwards',
              overflow: 'hidden'
            }}
          >
            {/* Timeline Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid var(--pastel-pink-dark)',
              background: 'linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-pink-dark) 100%)',
              flexShrink: 0
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                color: 'var(--accent-pink)',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiCalendar size={24} />
                Sick Log
              </h2>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{MOCK_EPISODES.length} episodes</span>
              </div>
            </div>

            {/* Timeline */}
            <div style={{
              flex: 1,
              padding: '1rem',
              position: 'relative',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0'
              }}>
                {MOCK_EPISODES.map((episode, index) => {
                  const startDate = new Date(episode.startDate);
                  const month = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  const startDay = startDate.getDate();
                  const year = startDate.getFullYear();
                  const isSelected = selectedEpisode === episode.id;

                  // Calculate end date
                  const lastEntry = episode.entries[episode.entries.length - 1];
                  const endDate = new Date(lastEntry.date);
                  const endDay = endDate.getDate();
                  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  const endYear = endDate.getFullYear();
                  const showEndDate = endDate.toDateString() !== startDate.toDateString();

                  const cardColors = [
                    { bg: '#FFE5EC', border: '#FF6B9D', line: '#FF6B9D' },
                    { bg: '#E8F4FA', border: '#4A90E2', line: '#4A90E2' },
                    { bg: '#D8F3DC', border: '#52B788', line: '#52B788' },
                    { bg: '#F0E6FF', border: '#9D84B7', line: '#9D84B7' },
                  ];
                  const colors = cardColors[index % cardColors.length];

                  return (
                    <div key={episode.id}
                      className="timeline-row"
                      style={{
                        display: 'flex',
                        marginBottom: '0',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        setSelectedEpisode(episode.id);
                        setSelectedEntry(episode.entries[0].id);
                      }}
                    >
                      <div className="timeline-column" style={{
                        width: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '8px'
                      }}>
                        <div className="timeline-month" style={{
                          fontSize: '10px',
                          fontWeight: '400',
                          color: colors.border,
                          marginBottom: '2px',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          {month}
                        </div>
                        <div className="timeline-year" style={{
                          fontSize: '10px',
                          fontWeight: '400',
                          color: colors.border,
                          marginBottom: '4px',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          {year}
                        </div>
                        <div className="timeline-date-circle" style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: colors.border,
                          marginBottom: '4px'
                        }}>
                          <span className="timeline-date-text" style={{
                            fontSize: '14px',
                            fontWeight: '400',
                            color: 'white'
                          }}>
                            {startDay}
                          </span>
                        </div>
                        <div className="timeline-line" style={{
                          width: '3px',
                          flex: '1',
                          minHeight: showEndDate ? '60px' : (index < MOCK_EPISODES.length - 1 ? '60px' : '0'),
                          backgroundColor: colors.line,
                          transition: 'min-height 0.3s ease'
                        }} />
                        {showEndDate && (
                          <>
                            <div className="timeline-date-circle" style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: colors.border,
                              marginTop: '4px',
                              marginBottom: '4px'
                            }}>
                              <span className="timeline-date-text" style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: 'white'
                              }}>
                                {endDay}
                              </span>
                            </div>
                            {(endMonth !== month || endYear !== year) && (
                              <>
                                <div className="timeline-month" style={{
                                  fontSize: '10px',
                                  fontWeight: '400',
                                  color: colors.border,
                                  marginTop: '2px',
                                  textAlign: 'center',
                                  lineHeight: '1.2'
                                }}>
                                  {endMonth}
                                </div>
                                {endYear !== year && (
                                  <div className="timeline-year" style={{
                                    fontSize: '10px',
                                    fontWeight: '400',
                                    color: colors.border,
                                    marginTop: '2px',
                                    textAlign: 'center',
                                    lineHeight: '1.2'
                                  }}>
                                    {endYear}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {index < MOCK_EPISODES.length - 1 && (
                          <div className="timeline-line" style={{
                            width: '3px',
                            flex: '0 0 auto',
                            minHeight: '20px',
                            backgroundColor: colors.line,
                            transition: 'min-height 0.3s ease'
                          }} />
                        )}
                      </div>

                      <div className="episode-column" style={{
                        flex: '1',
                        paddingLeft: '16px',
                        paddingBottom: '16px'
                      }}>
                        <div className="episode-container" style={{
                          backgroundColor: isSelected ? 'white' : colors.bg,
                          borderColor: colors.border,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '12px',
                          padding: '1.5rem',
                          boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.2s ease'
                        }}>
                          <div className="episode-card">
                            <h3 className="episode-title" style={{
                              margin: '0 0 0.5rem 0',
                              fontSize: '1.25rem',
                              fontWeight: '500',
                              color: 'var(--text-primary)'
                            }}>
                              {episode.title}
                            </h3>

                            <div className="episode-subtitle-row" style={{
                              marginBottom: '1rem'
                            }}>
                              <span className="episode-subtitle" style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                              }}>
                                {episode.entryCount} entr{episode.entryCount === 1 ? 'y' : 'ies'}
                              </span>
                            </div>

                            {episode.aiSummary && (
                              <p className="episode-summary" style={{
                                margin: '0 0 1rem 0',
                                color: 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                lineHeight: '1.5'
                              }}>
                                {episode.aiSummary}
                              </p>
                            )}

                            <div className="episode-badges" style={{
                              display: 'flex',
                              gap: '0.5rem',
                              flexWrap: 'wrap'
                            }}>
                              <span className="status-badge" style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '400',
                                backgroundColor: episode.status === 'active' ? '#FFE5EC' : '#D8F3DC',
                                color: episode.status === 'active' ? '#FF6B9D' : '#52B788'
                              }}>
                                {episode.status}
                              </span>
                              <span className="severity-badge" style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '400',
                                backgroundColor: episode.severity === 'moderate' ? '#FFF9E5' : '#E8F4FA',
                                color: episode.severity === 'moderate' ? '#FFC947' : '#4A90E2'
                              }}>
                                {episode.severity}
                              </span>
                            </div>

                            {isSelected && (
                              <div style={{ marginTop: '1rem' }}>
                                <h4 style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '400',
                                  color: 'var(--text-primary)',
                                  margin: '0 0 0.5rem 0'
                                }}>
                                  All Entries ({episode.entries.length})
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {episode.entries.map((entry) => (
                                    <div
                                      key={entry.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEntry(entry.id);
                                      }}
                                      style={{
                                        background: selectedEntry === entry.id ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: selectedEntry === entry.id ? `1px solid ${colors.border}` : '1px solid transparent'
                                      }}
                                    >
                                      <div style={{
                                        fontSize: '0.8125rem',
                                        fontWeight: '400',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.25rem'
                                      }}>
                                        {formatDisplayDate(entry.date)}
                                      </div>
                                      <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)'
                                      }}>
                                        {entry.symptoms.slice(0, 2).join(', ')}
                                        {entry.symptoms.length > 2 && '...'}
                                      </div>
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
                })}
              </div>
            </div>
          </div>
        )}

        {/* Left: Setup Instructions */}
        <div style={{
          background: 'linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-coral) 100%)',
          borderRight: '2px solid var(--pastel-peach-dark)',
          display: 'flex',
          flexDirection: 'column',
          transform: showDemoEpisodeView ? 'translateX(-450px)' : 'translateX(0)',
          transition: 'transform 0.5s ease',
          willChange: 'transform',
          pointerEvents: showDemoEpisodeView ? 'none' : 'auto'
        }}>
          <div style={{ padding: '2rem', flex: 1 }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '400',
                color: 'var(--accent-peach)',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <MdAutoAwesome size={32} />
                Setup & Demo
              </h1>
              <p style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '1.125rem',
                lineHeight: '1.6'
              }}>
                Get Chrome AI ready and try our demo
              </p>
            </div>

            {/* AI Status */}
            {/* AI Status Card */}
            <div style={{
              background: 'white',
              border: '2px solid var(--pastel-coral-dark)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '400',
                  color: 'var(--accent-coral)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: aiAvailable ? '#10b981' : '#ef4444'
                  }} />
                  AI Status
                </h3>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Refresh
                </button>
              </div>
              <p style={{
                margin: 0,
                fontSize: '1rem',
                color: aiAvailable ? '#065f46' : '#991b1b',
                fontWeight: '500'
              }}>
                {aiAvailable ? 'AI Model Available' : 'AI Model Not Available'}
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                {getAIStatusMessage()}
              </p>
            </div>

            {!aiAvailable && (
              <>
                {/* Option 1: Use Gemini API via Supabase */}
                <div style={{
                  background: 'white',
                  border: '2px solid #10b981',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '400',
                    color: '#10b981',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <MdCheckCircle size={20} />
                    Option 1: Use Gemini API (Recommended)
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    Works on any browser! Uses Gemini API for AI-powered symptom analysis with medical citations.
                  </p>

                  <button
                    onClick={async () => {
                      // Mark as setup with Gemini provider
                      aiSetupService.markAISetup('gemini');
                      console.log('✅ User selected Gemini API');
                      // Redirect to home
                      router.replace('/app');
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '1rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    Use Gemini API
                  </button>

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <p style={{
                      margin: 0,
                      color: '#065f46',
                      fontSize: '0.875rem',
                      lineHeight: '1.6'
                    }}>
                      ✅ <strong>Benefits:</strong> Works on Safari, Chrome, Firefox, and all browsers. Better analysis quality with medical citations.
                    </p>
                  </div>
                </div>

                {/* Option 2: Enable Chrome AI Section */}
                <div style={{
                  background: 'white',
                  border: '2px solid var(--pastel-coral-dark)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '400',
                    color: 'var(--accent-coral)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <MdSettings size={20} />
                    Option 2: Enable Chrome AI (Chrome Only)
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    To use the real AI-powered features, enable these 3 Chrome flags:
                  </p>

                  {/* Step 1 */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#ef4444',
                      margin: '0 0 0.75rem 0'
                    }}>
                      STEP 1 - Enable Gemini Nano
                    </h4>
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      marginBottom: '0.75rem',
                      wordBreak: 'break-all'
                    }}>
                      chrome://flags/#prompt-api-for-gemini-nano
                    </div>
                    <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem' }}>
                      Set to: <strong>Enabled</strong>
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#ef4444',
                      margin: '0 0 0.75rem 0'
                    }}>
                      STEP 2 - Enable Multimodal Input
                    </h4>
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      marginBottom: '0.75rem',
                      wordBreak: 'break-all'
                    }}>
                      chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
                    </div>
                    <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem' }}>
                      Set to: <strong>Enabled</strong>
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#ef4444',
                      margin: '0 0 0.75rem 0'
                    }}>
                      STEP 3 - Enable On-Device Model
                    </h4>
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      marginBottom: '0.75rem',
                      wordBreak: 'break-all'
                    }}>
                      chrome://flags/#optimization-guide-on-device-model
                    </div>
                    <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem' }}>
                      Set to: <strong>Enabled BypassPerfRequirement</strong>
                    </p>
                  </div>

                  {/* Final Instruction */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.25rem'
                  }}>
                    <p style={{
                      margin: 0,
                      color: '#374151',
                      fontSize: '0.9375rem',
                      lineHeight: '1.6'
                    }}>
                      After enabling these flags, restart Chrome and reload this page.
                    </p>
                  </div>
                </div>
              </>
            )}

            {aiAvailable && (
              <div style={{
                background: 'white',
                border: '2px solid var(--pastel-coral-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  color: '#10b981',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MdCheckCircle size={20} />
                  Chrome AI Ready
                </h3>
                <div style={{ color: '#065f46', lineHeight: '1.6' }}>
                  <p>
                    Chrome AI is successfully enabled! You can now use
                    AI-powered symptom analysis and get personalized health
                    insights.
                  </p>
                </div>
              </div>
            )}

            <div style={{
              background: 'var(--pastel-yellow)',
              border: '2px solid var(--pastel-yellow-dark)',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6' }}>
                <strong>Note:</strong> While setting up, try our demo on the right to see how the app works!
              </p>
            </div>
          </div>
        </div>

        {/* Right: Demo Simulation */}
        <DemoSimulation
          onShowEpisodeView={setShowDemoEpisodeView}
          selectedEpisode={selectedEpisode}
          selectedEntry={selectedEntry}
          onEpisodeSelect={(episodeId, entryId) => {
            setSelectedEpisode(episodeId);
            setSelectedEntry(entryId);
          }}
        />
      </div>

      <style jsx>{`
        @keyframes drawerSlide {
          from {
            left: 450px;
          }
          to {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
