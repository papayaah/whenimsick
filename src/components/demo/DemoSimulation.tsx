'use client';

import React, { useState, useEffect } from 'react';
import { MdAutoAwesome, MdCheckCircle, MdInfo, MdLightbulb, MdTimeline } from 'react-icons/md';
import { FiActivity, FiCheckCircle } from 'react-icons/fi';
import { emitCapyState } from '@/lib/capyState';

const DEMO_SYMPTOMS = [
  { id: 'headache', name: 'Headache' },
  { id: 'fever', name: 'Fever' },
  { id: 'fatigue', name: 'Fatigue' },
  { id: 'cough', name: 'Cough' },
  { id: 'body-aches', name: 'Body Aches' },
];

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDateOffset = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Mock episodes data - multiple episodes with timeline structure
export const MOCK_EPISODES = [
  {
    id: 'demo-episode-1',
    title: 'Viral Infection',
    startDate: getDateOffset(2),
    endDate: null,
    status: 'active',
    severity: 'moderate',
    symptoms: ['Headache', 'Fever', 'Fatigue', 'Cough', 'Body Aches'],
    entryCount: 3,
    aiSummary: 'This appears to be a typical viral infection with symptoms progressing through the expected stages. Your immune system is responding appropriately, and with continued rest and care, you should see improvement over the next few days.',
    entries: [
    {
      id: 'day3',
      date: getTodayDate(),
      dayNumber: 3,
      symptoms: ['Headache', 'Fever', 'Fatigue', 'Cough', 'Body Aches'],
      severity: 'moderate',
      dailySummary: 'Day 3 shows your headache improving while cough is becoming more prominent.',
      analysis: 'Your symptoms are progressing typically for a viral infection. The headache improvement is a good sign, while the developing cough is expected as the infection moves through its natural course. Your immune system is actively working.',
      informationNotes: [
        'Cough development on day 3 is typical for respiratory infections',
        'Improvement in headache suggests inflammation is decreasing',
        'Continued fatigue is normal as your body directs energy to healing'
      ],
      selfCareTips: [
        'Continue resting and avoid strenuous activities',
        'Use honey or cough drops to soothe throat irritation',
        'Maintain hydration to help thin mucus',
        'Consider using a humidifier at night'
      ],
      trend: 'stable',
      medicalConsultationSuggested: false,
      estimatedRecoveryWindow: '3-5 more days with continued care'
    },
    {
      id: 'day2',
      date: getDateOffset(1),
      dayNumber: 2,
      symptoms: ['Headache', 'Fever', 'Fatigue', 'Body Aches'],
      severity: 'moderate',
      dailySummary: 'Day 2 symptoms remain consistent with your viral infection, with continued fever and body aches.',
      analysis: 'Your symptoms are stable compared to yesterday, which is typical for the second day of a viral infection. The persistence of fever and body aches indicates your immune system is still fighting the infection. This is a normal part of the healing process.',
      informationNotes: [
        'Stable symptoms on day 2 are expected for viral infections',
        'Your body needs time to build immunity against the virus',
        'Fever between 100-102°F is the body\'s natural defense mechanism'
      ],
      selfCareTips: [
        'Rest as much as possible today',
        'Take acetaminophen or ibuprofen for fever and aches',
        'Drink plenty of fluids - aim for 8-10 glasses',
        'Eat light, nutritious foods when you have appetite'
      ],
      trend: 'stable',
      medicalConsultationSuggested: false,
      estimatedRecoveryWindow: '5-7 days with proper rest'
    },
    {
      id: 'day1',
      date: getDateOffset(2),
      dayNumber: 1,
      symptoms: ['Headache', 'Fever', 'Fatigue'],
      severity: 'mild',
      dailySummary: 'Starting to feel under the weather with headache, low-grade fever, and tiredness.',
      analysis: 'These are early signs of a viral infection. Your body has detected the virus and is mounting an immune response, which causes the fever and fatigue. Catching symptoms early gives you the best chance to rest and recover quickly.',
      informationNotes: [
        'Early recognition of symptoms helps with better management',
        'Low-grade fever on day 1 is your immune system activating',
        'Fatigue is an early warning sign to rest and recover'
      ],
      selfCareTips: [
        'Start resting now to help your body fight the infection',
        'Begin increasing fluid intake immediately',
        'Take vitamin C and maintain a healthy diet',
        'Avoid close contact with others to prevent spread'
      ],
      trend: 'worsening',
      medicalConsultationSuggested: false,
      estimatedRecoveryWindow: '5-7 days if you rest properly'
    }
  ]
  },
  {
    id: 'demo-episode-2',
    title: 'Spring Allergies',
    startDate: '2024-05-15',
    endDate: '2024-05-18',
    status: 'resolved',
    severity: 'low',
    symptoms: ['Runny Nose', 'Sneezing', 'Itchy Eyes', 'Congestion'],
    entryCount: 2,
    aiSummary: 'Seasonal allergies with typical spring symptoms. Resolved with antihistamines and avoiding outdoor triggers during peak pollen times.',
    entries: [
      {
        id: 'allergy-day2',
        date: '2024-05-16',
        dayNumber: 2,
        symptoms: ['Runny Nose', 'Sneezing', 'Itchy Eyes'],
        severity: 'low',
        dailySummary: 'Allergy symptoms improving with medication.',
        analysis: 'Your allergy symptoms are responding well to treatment. Continue with your current medication regimen.',
        informationNotes: [
          'Spring allergies are common during this time of year',
          'Antihistamines are effective for symptom relief'
        ],
        selfCareTips: [
          'Continue taking antihistamines as directed',
          'Keep windows closed during high pollen times',
          'Shower after being outdoors'
        ],
        trend: 'improving',
        medicalConsultationSuggested: false,
        estimatedRecoveryWindow: '1-2 more days'
      },
      {
        id: 'allergy-day1',
        date: '2024-05-15',
        dayNumber: 1,
        symptoms: ['Runny Nose', 'Sneezing', 'Itchy Eyes', 'Congestion'],
        severity: 'low',
        dailySummary: 'Started experiencing spring allergy symptoms.',
        analysis: 'Typical seasonal allergy symptoms. Consider starting antihistamine treatment.',
        informationNotes: [
          'Spring pollen levels are high',
          'Allergy symptoms usually respond well to over-the-counter medications'
        ],
        selfCareTips: [
          'Start taking antihistamines',
          'Avoid outdoor activities during peak pollen hours',
          'Use saline nasal spray for congestion'
        ],
        trend: 'worsening',
        medicalConsultationSuggested: false,
        estimatedRecoveryWindow: '2-3 days with treatment'
      }
    ]
  }
];

interface DemoSimulationProps {
  onShowEpisodeView?: (show: boolean) => void;
  selectedEpisode?: string;
  selectedEntry?: string;
  onEpisodeSelect?: (episodeId: string, entryId: string) => void;
}

export default function DemoSimulation({ 
  onShowEpisodeView,
  selectedEpisode: selectedEpisodeProp,
  selectedEntry: selectedEntryProp,
  onEpisodeSelect
}: DemoSimulationProps = {}) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEpisodeView, setShowEpisodeView] = useState(false);
  const [showEpisodeTimeline, setShowEpisodeTimeline] = useState(false);
  const selectedEntry = selectedEntryProp || 'day3';
  const selectedEpisode = selectedEpisodeProp || 'demo-episode-1';

  // Notify Cappy when symptoms are selected
  useEffect(() => {
    emitCapyState({ 
      hasSelectedSymptoms: selectedSymptoms.length > 0,
      symptomCount: selectedSymptoms.length
    });
  }, [selectedSymptoms]);

  // Notify Cappy when analyzing
  useEffect(() => {
    if (isAnalyzing) {
      emitCapyState({ isAnalyzing: true });
    }
  }, [isAnalyzing]);

  // Notify Cappy when results are shown
  useEffect(() => {
    if (showResults) {
      emitCapyState({ hasResults: true, isAnalyzing: false });
    }
  }, [showResults]);

  // Automatically show timeline when episode view is shown
  useEffect(() => {
    if (showEpisodeView) {
      setShowEpisodeTimeline(true);
      onShowEpisodeView?.(true);
    }
  }, [showEpisodeView, onShowEpisodeView]);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleRunDemo = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setShowEpisodeTimeline(false);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsAnalyzing(false);
    setShowResults(true);
    
    // No longer transition to episode view - stay on results
  };

  const handleViewEpisode = () => {
    setShowEpisodeView(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowResults(false);
    setShowEpisodeView(false);
    setIsAnalyzing(false);
    setShowEpisodeTimeline(false);
    onEpisodeSelect?.('demo-episode-1', 'day3');
    onShowEpisodeView?.(false);
    
    // Tell Cappy we're back to the form (trigger wake/wave sequence)
    emitCapyState({ 
      hasSelectedSymptoms: false, 
      hasResults: false, 
      isAnalyzing: false 
    });
  };

  const currentEpisode = MOCK_EPISODES.find(e => e.id === selectedEpisode) || MOCK_EPISODES[0];
  const currentEntry = currentEpisode.entries.find(e => e.id === selectedEntry) || currentEpisode.entries[0];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      height: '100%',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 5
    }}>
      {/* Demo Header - Hide when results are shown */}
      {!showEpisodeTimeline && !showResults && (
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-lavender) 100%)',
          borderBottom: '2px solid var(--pastel-blue-dark)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FiActivity size={32} style={{ color: 'var(--accent-blue)' }} />
            <h2 style={{
              fontSize: '1.75rem',
              margin: 0,
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              Try the Demo
            </h2>
          </div>
          <p style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            Experience how our AI-powered symptom tracker works. Select some symptoms and see the analysis!
          </p>
        </div>
      )}

      {/* Demo Content */}
      <div style={{ 
        padding: 0,
        display: 'block',
        flex: 1,
        minHeight: 0,
        position: 'relative',
        overflow: showEpisodeTimeline ? 'visible' : 'hidden'
      }}>
        {!showResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
            {/* Symptom Selection */}
            <div style={{
              background: 'white',
              border: '2px solid var(--pastel-mint-dark)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--accent-mint)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <MdInfo size={24} />
                Select Demo Symptoms
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '0.75rem'
              }}>
                {DEMO_SYMPTOMS.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      style={{
                        padding: '1rem',
                        background: isSelected 
                          ? 'linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-mint-dark) 100%)'
                          : 'var(--pastel-blue)',
                        border: `2px solid ${isSelected ? 'var(--accent-mint)' : 'var(--pastel-blue-dark)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9375rem',
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? 'var(--accent-mint)' : 'var(--text-secondary)',
                        boxShadow: isSelected ? '0 4px 12px rgba(82, 183, 136, 0.2)' : 'none'
                      }}
                    >
                      {symptom.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={handleRunDemo}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem',
                  background: isAnalyzing 
                    ? 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-blue-dark) 100%)'
                    : 'linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-pink-dark) 100%)',
                  border: `2px solid ${isAnalyzing ? 'var(--pastel-blue-dark)' : 'var(--pastel-pink-dark)'}`,
                  borderRadius: '12px',
                  color: isAnalyzing ? 'var(--accent-blue)' : 'var(--accent-pink)',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: selectedSymptoms.length === 0 || isAnalyzing ? 'not-allowed' : 'pointer',
                  opacity: selectedSymptoms.length === 0 || isAnalyzing ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid var(--accent-blue)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <MdAutoAwesome size={24} />
                    <span>Run Demo Analysis</span>
                  </>
                )}
              </button>

              {selectedSymptoms.length > 0 && (
                <button
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    opacity: isAnalyzing ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Info Banner */}
            <div style={{
              background: 'var(--pastel-yellow)',
              border: '2px solid var(--pastel-yellow-dark)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'start'
            }}>
              <MdLightbulb size={24} style={{ color: 'var(--accent-yellow)', flexShrink: 0, marginTop: '0.125rem' }} />
              <p style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                This is a demo using pre-generated sample data. To use real AI-powered analysis with your actual symptoms, 
                set up Chrome AI following the instructions on the left.
              </p>
            </div>
          </div>
        ) : !showEpisodeView ? (
          /* Demo Results - Full Analysis with View Episode Button */
          <div
            className='details-panel'
            style={{
              padding: '2.5rem 3rem',
              background: 'white',
              minHeight: '600px',
              position: 'relative',
              zIndex: 5
            }}
          >
              {/* Header - Newspaper Style */}
              <div
                style={{
                  marginBottom: '3rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
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
                        fontWeight: '400',
                        color: 'var(--accent-pink)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Analysis Results
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      •
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDisplayDate(currentEntry.date)}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      •
                    </span>
                    <span
                      className={`severity-badge severity-${currentEntry.severity}`}
                      style={{
                        padding: '0.25rem 0.625rem',
                        fontSize: '0.6875rem',
                        marginBottom: 0,
                      }}
                    >
                      {currentEntry.severity || 'unrated'}
                    </span>
                  </div>
                  <h1
                    style={{
                      fontSize: '2.5rem',
                      margin: 0,
                      fontWeight: '400',
                      color: 'var(--text-primary)',
                      lineHeight: '1.2',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {currentEpisode.title || 'Health Entry'}
                  </h1>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    {currentEntry.symptoms.join(' • ')}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '1rem 2rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    alignSelf: 'flex-start'
                  }}
                >
                  Reset Demo
                </button>
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
                  {currentEntry.dailySummary && (
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
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Daily Summary
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {currentEntry.dailySummary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Analysis */}
                  {currentEntry.analysis && (
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
                        <MdCheckCircle
                          size={24}
                          style={{ color: 'var(--accent-blue)' }}
                        />
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Analysis
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {currentEntry.analysis}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Self-Care Tips */}
                  {currentEntry.selfCareTips && currentEntry.selfCareTips.length > 0 && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '3px solid var(--accent-yellow)',
                        }}
                      >
                        <MdLightbulb
                          size={24}
                          style={{ color: 'var(--accent-yellow)' }}
                        />
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Self-Care Tips
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '1.25rem',
                            lineHeight: '1.6',
                          }}
                        >
                          {currentEntry.selfCareTips.map((tip, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: '0.75rem',
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                              }}
                            >
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
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
                  {/* Episode Summary */}
                  {currentEpisode.aiSummary && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '3px solid var(--accent-pink)',
                        }}
                      >
                        <MdAutoAwesome
                          size={24}
                          style={{ color: 'var(--accent-pink)' }}
                        />
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Episode Summary
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {currentEpisode.aiSummary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Information Notes */}
                  {currentEntry.informationNotes && currentEntry.informationNotes.length > 0 && (
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
                        <MdInfo
                          size={24}
                          style={{ color: 'var(--accent-coral)' }}
                        />
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Information Notes
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '1.25rem',
                            lineHeight: '1.6',
                          }}
                        >
                          {currentEntry.informationNotes.map((note, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: '0.75rem',
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                              }}
                            >
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Recovery Window */}
                  {currentEntry.estimatedRecoveryWindow && (
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
                        <FiCheckCircle
                          size={24}
                          style={{ color: 'var(--accent-lavender)' }}
                        />
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          Recovery Timeline
                        </h3>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {currentEntry.estimatedRecoveryWindow}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View Episode Button */}
              <div style={{
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '2px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center'
              }}>
                <button
                  onClick={handleViewEpisode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '1.25rem 3rem',
                    background: 'linear-gradient(135deg, var(--pastel-lavender) 0%, var(--pastel-lavender-dark) 100%)',
                    border: '3px solid var(--accent-lavender)',
                    borderRadius: '16px',
                    color: 'var(--accent-lavender)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(157, 132, 183, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(157, 132, 183, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(157, 132, 183, 0.4)';
                  }}
                >
                  <MdTimeline size={28} />
                  <span>View Episode Tracking</span>
                </button>
                <p style={{
                  margin: 0,
                  color: 'var(--text-muted)',
                  fontSize: '0.9375rem',
                  textAlign: 'center',
                  maxWidth: '600px'
                }}>
                  See how the app tracks your symptoms over multiple days with episode timeline and trend analysis
                </p>
              </div>
            </div>
        ) : (
          /* Episode View - Timeline and Entry Details */
          <div
            className='details-panel'
            style={{
              padding: '2.5rem 3rem',
              background: 'white',
              minHeight: '600px',
              position: 'relative',
              zIndex: 5
            }}
          >
              {/* Header - Episode View */}
              <div
                style={{
                  marginBottom: '3rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
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
                        fontWeight: '400',
                        color: 'var(--accent-pink)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Episode Tracking
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      •
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Day {currentEntry.dayNumber}
                    </span>
                  </div>
                  <h1
                    style={{
                      fontSize: '2.5rem',
                      margin: 0,
                      fontWeight: '400',
                      color: 'var(--text-primary)',
                      lineHeight: '1.2',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {currentEpisode.title}
                  </h1>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    {currentEpisode.entries.length} entries • {currentEpisode.status}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-coral) 100%)',
                    border: '3px solid var(--accent-coral)',
                    borderRadius: '16px',
                    color: 'var(--accent-coral)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(255, 117, 143, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    alignSelf: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 117, 143, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 117, 143, 0.4)';
                  }}
                >
                  ← Reset Demo
                </button>
              </div>

              {/* Episode Summary and Timeline Info */}
              <div style={{
                background: 'var(--pastel-mint)',
                border: '2px solid var(--pastel-mint-dark)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--accent-mint)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MdTimeline size={28} />
                  Episode Overview
                </h3>
                <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                  {currentEpisode.aiSummary}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className={`severity-badge severity-${currentEpisode.severity}`}>
                    {currentEpisode.severity}
                  </span>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: currentEpisode.status === 'active' ? 'var(--pastel-yellow)' : 'var(--pastel-blue)',
                    color: currentEpisode.status === 'active' ? 'var(--accent-yellow)' : 'var(--accent-blue)'
                  }}>
                    {currentEpisode.status}
                  </span>
                </div>
              </div>

              {/* Entry Timeline */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '1.5rem'
                }}>
                  Timeline ({currentEpisode.entries.length} entries)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentEpisode.entries.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        background: entry.id === currentEntry.id ? 'var(--pastel-pink)' : 'white',
                        border: `2px solid ${entry.id === currentEntry.id ? 'var(--pastel-pink-dark)' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: entry.id === currentEntry.id ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Day {entry.dayNumber} • {formatDisplayDate(entry.date)}
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                            {entry.symptoms.join(', ')}
                          </div>
                        </div>
                        <span className={`severity-badge severity-${entry.severity}`}>
                          {entry.severity}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {entry.dailySummary}
                      </p>
                      {entry.trend && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)'
                        }}>
                          Trend: <strong>{entry.trend}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
