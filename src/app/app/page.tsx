'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SymptomSelector, { UncommonSymptomsColumn } from '@/components/SymptomSelector';
import DatePicker from '@/components/DatePicker';
import MedicalTextProcessor from '@/components/MedicalTextProcessor';
import { aiService } from '@/lib/ai-service';
import { aiSetupService } from '@/services/aiSetupService';
import { FiLoader } from 'react-icons/fi';
import { emitDemoState } from '@/lib/demoState';
import {
  COMMON_SYMPTOMS,
  UNCOMMON_SYMPTOMS,
  SymptomAnalysisResult,
} from '@/types/symptoms';
import { episodeService } from '@/services/episodeService';
import { glossaryService } from '@/services/glossaryService';
import {
  EpisodeCreationResult,
  EpisodeProgressionAnalysis,
} from '@/types/episode';
import { getDeviceId, getTodayDate } from '@/lib/utils';
import { emitCapyState } from '@/lib/capyState';
import {
  MdNoteAdd,
  MdSentimentSatisfied,
  MdSentimentNeutral,
  MdSentimentDissatisfied,
  MdSentimentVeryDissatisfied,
  MdTrendingUp,
  MdWarning,
  MdLightbulb,
  MdInfo,
  MdSchedule,
  MdHelpOutline,
  MdAutoAwesome,
} from 'react-icons/md';
import {
  FiList,
  FiSearch,
  FiCheckCircle,
  FiPlus,
  FiEdit,
  FiActivity,
} from 'react-icons/fi';

// Severity levels matching React Native app
const SEVERITY_LEVELS = [
  { id: 'mild', name: 'Mild', icon: MdSentimentSatisfied, color: '#ffc107' },
  {
    id: 'moderate',
    name: 'Moderate',
    icon: MdSentimentNeutral,
    color: '#fd7e14',
  },
  {
    id: 'severe',
    name: 'Severe',
    icon: MdSentimentDissatisfied,
    color: '#dc3545',
  },
  {
    id: 'extreme',
    name: 'Extreme',
    icon: MdSentimentVeryDissatisfied,
    color: '#6f42c1',
  },
];

export default function SymptomTracker() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SymptomAnalysisResult | null>(null);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null); // Start with null to show loading
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  // Episode states
  const [episodePreview, setEpisodePreview] =
    useState<EpisodeCreationResult | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>(getTodayDate());
  const [deviceId, setDeviceId] = useState<string>('');

  // Add Details state
  const [showDetails, setShowDetails] = useState(false);
  const [optionalValues, setOptionalValues] = useState<
    Record<string, Record<string, string>>
  >({});

  // Uncommon symptoms state
  const [showUncommonSymptoms, setShowUncommonSymptoms] = useState(false);

  // Demo episode view state

  // Check AI setup status on mount
  useEffect(() => {
    const checkSetupAndInitialize = async () => {
      // Set device ID on client side
      setDeviceId(getDeviceId());

      // Check if AI is already set up
      if (!aiSetupService.isAISetup()) {
        // Redirect to setup page if AI is not set up
        router.replace('/setup');
        return;
      }

      // If we reach here, AI is set up - initialize the AI service
      try {
        const status = await aiService.initialize();
        if (status.available) {
          setAiAvailable(true);
          setIsCheckingSetup(false);
          emitDemoState({ isActive: false });
          console.log(`✅ Using ${status.provider === 'gemini' ? 'Gemini API' : 'Chrome AI'}`);
        } else {
          console.warn('AI not available:', status.status);
          // If initialization fails, reset setup status and redirect to setup
          aiSetupService.resetAISetup();
          router.replace('/setup');
        }
      } catch (error) {
        console.error('Failed to initialize AI:', error);
        // If initialization fails, reset setup status and redirect to setup
        aiSetupService.resetAISetup();
        router.replace('/setup');
      }
    };

    checkSetupAndInitialize();
  }, [router]);

  // Clear analysis when symptoms change
  useEffect(() => {
    if (analysisResult) {
      setAnalysisResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymptoms, notes]);

  // Preview episode when symptoms change
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      previewEpisode();
    } else {
      setEpisodePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymptoms]);

  const previewEpisode = async () => {
    if (selectedSymptoms.length === 0 || !deviceId) return;

    setIsLoadingPreview(true);
    try {
      const symptomNames = getSymptomNames();
      const preview = await episodeService.previewEpisodeForEntry({
        deviceId,
        entryDate: currentDate,
        symptoms: symptomNames,
      });
      setEpisodePreview(preview);
    } catch (error) {
      console.error('Failed to preview episode:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const getSymptomNames = () => {
    const allSymptoms = [...COMMON_SYMPTOMS, ...UNCOMMON_SYMPTOMS];
    return selectedSymptoms.map(id => {
      const symptom = allSymptoms.find(s => s.id === id);
      return symptom?.name || id;
    });
  };

  const handleAnalyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0 || !deviceId) return;

    if (!aiAvailable) {
      alert(
        'Chrome AI is not available. Please check the setup instructions below.'
      );
      return;
    }

    // Tell Capy to play analyzing pose
    emitCapyState({ isAnalyzing: true });

    setIsAnalyzing(true);
    try {
      const symptomNames = getSymptomNames();

      // Determine episode and get progression context
      const episodeResult = await episodeService.determineEpisodeForEntry({
        deviceId,
        entryDate: currentDate,
        symptoms: symptomNames,
      });

      let episodeContext: EpisodeProgressionAnalysis | undefined;
      if (!episodeResult.isNewEpisode) {
        episodeContext =
          (await episodeService.analyzeEpisodeProgression(
            episodeResult.episode.id,
            symptomNames
          )) || undefined;
      }

      // Analyze symptoms with episode context using unified AI service
      const result = await aiService.analyzeSymptoms(
        symptomNames,
        notes,
        episodeContext
      );

      // Create symptom entry
      const entry = await episodeService.createSymptomEntry({
        episodeId: episodeResult.episode.id,
        date: currentDate,
        symptoms: symptomNames,
        notes: notes || undefined,
        severity: result.severity,
        aiAnalysis: result,
      });

      // Update episode title if AI provided one (for new episodes or when updating generic titles)
      if (result.episodeTitle) {
        await episodeService.updateEpisodeTitleFromAnalysis(
          episodeResult.episode.id,
          symptomNames,
          result
        );
      }

      // Always update episode summary from the latest analysis
      await episodeService.updateEpisodeSummaryFromAnalysis(
        episodeResult.episode.id,
        result
      );

      setAnalysisResult({
        ...result,
        episodeInfo: {
          isNewEpisode: episodeResult.isNewEpisode,
          message: episodeResult.message,
          episodeId: episodeResult.episode.id,
        },
      });

      // Signal results are available so Capy plays result segment
      emitCapyState({ hasResults: true, isAnalyzing: false });

      // Save medical terms to glossary
      if (result.medicalTerms && result.medicalTerms.length > 0) {
        await glossaryService.addTerms(result.medicalTerms, {
          episodeId: episodeResult.episode.id,
          entryId: entry.id,
          episodeTitle: episodeResult.episode.title,
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearSymptoms = () => {
    setSelectedSymptoms([]);
    setNotes('');
    setAnalysisResult(null);
    setShowNotes(false);
    setShowDetails(false);
    setEpisodePreview(null);
    setOptionalValues({});
    // Leaving results or clearing form → back to wake/chat
    emitCapyState({ hasSelectedSymptoms: false, hasResults: false, isAnalyzing: false });
  };

  // Get symptoms with optional fields
  const getSymptomsWithDetails = () => {
    const allSymptoms = [...COMMON_SYMPTOMS, ...UNCOMMON_SYMPTOMS];
    return allSymptoms.filter(
      symptom => selectedSymptoms.includes(symptom.id) && symptom.optionalFields
    );
  };

  const handleSeveritySelection = (
    symptomId: string,
    fieldType: string,
    level: string
  ) => {
    const currentSelection = optionalValues[symptomId]?.[fieldType];

    // Toggle: if same level is selected, deselect it
    if (currentSelection === level) {
      setOptionalValues(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldType]: _, ...rest } = prev[symptomId] || {};
        return {
          ...prev,
          [symptomId]: rest,
        };
      });
    } else {
      // Set new selection
      setOptionalValues(prev => ({
        ...prev,
        [symptomId]: {
          ...prev[symptomId],
          [fieldType]: level,
        },
      }));
    }
  };

  // Show loading state while checking AI setup
  if (isCheckingSetup) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <FiLoader
          size={32}
          style={{
            color: 'var(--accent-coral)',
            animation: 'spin 1s linear infinite'
          }}
        />
        <div style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
          Checking AI setup...
        </div>
      </div>
    );
  }

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
      {/* Regular Tracker Content */}
      <>
        {/* Dynamic Multi-Column Layout */}
          <div className='symptoms-layout' style={{
            display: 'grid',
            gridTemplateColumns: (() => {
              // If analysis results are shown, hide all form columns
              if (analysisResult) {
                return '1fr'; // Just analysis results
              }
              // Normal column layout when no results
              if (showUncommonSymptoms && selectedSymptoms.length > 0) {
                return '400px 400px 350px 1fr'; // All columns
              } else if (showUncommonSymptoms) {
                return '400px 400px 1fr'; // Common + Uncommon + Analysis
              } else if (selectedSymptoms.length > 0) {
                return '400px 350px 1fr'; // Common + Options + Analysis
              } else {
                return '400px 1fr'; // Common + Analysis
              }
            })(),
            gap: 0,
            transition: 'grid-template-columns 0.3s ease'
          }}>
            {/* Column 1 - Common Symptoms (hidden when results shown) */}
            {!analysisResult && (
              <div className='symptoms-panel'>
              <div className='symptoms-header'>
                <h2>Log Symptoms</h2>
                {selectedSymptoms.length > 0 && (
                  <div className='symptoms-count'>
                    <span>
                      {selectedSymptoms.length} symptom
                      {selectedSymptoms.length === 1 ? '' : 's'}
                    </span>
                  </div>
                )}
              </div>
              <div className='input-panel'>
                {/* Date Selection - Compact */}
                <div className='input-section' style={{ paddingBottom: '1rem' }}>
                  <DatePicker
                    value={currentDate}
                    onChange={setCurrentDate}
                    placeholder='Select date'
                    showTodayBadge={true}
                  />
                </div>

                {/* Symptom Selection */}
                <div className='input-section'>
                  <SymptomSelector
                    selectedSymptoms={selectedSymptoms}
                    onSymptomToggle={handleSymptomToggle}
                    showAllUncommon={showUncommonSymptoms}
                    onToggleUncommon={setShowUncommonSymptoms}
                    optionalValues={optionalValues}
                  />
                </div>
              </div>
            </div>
            )}

            {/* Column 2 - Uncommon Symptoms (conditional, hidden when results shown) */}
            {!analysisResult && showUncommonSymptoms && (
              <div className='symptoms-panel' style={{
                background: 'var(--pastel-lavender)',
                borderRight: '1px solid #e9ecef',
                animation: 'slideInRight 0.3s ease'
              }}>
                <div className='symptoms-header' style={{
                  background: 'linear-gradient(135deg, var(--pastel-lavender) 0%, var(--pastel-lavender-dark) 100%)'
                }}>
                  <h2 style={{ color: 'var(--accent-lavender)' }}>More Symptoms</h2>
                </div>
                <div className='input-panel'>
                  <div className='input-section'>
                    <UncommonSymptomsColumn
                      selectedSymptoms={selectedSymptoms}
                      onSymptomToggle={handleSymptomToggle}
                      optionalValues={optionalValues}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Column 3/2 - Additional Options (only when symptoms selected, hidden when results shown) */}
            {!analysisResult && selectedSymptoms.length > 0 && (
              <div className='options-panel' style={{
                background: 'var(--pastel-peach)',
                borderRight: '1px solid #e9ecef',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideInRight 0.3s ease'
              }}>
                <div className='options-header' style={{
                  padding: '1.5rem',
                  borderBottom: '2px solid var(--pastel-peach-dark)',
                  background: 'linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-peach-dark) 100%)'
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: 'var(--accent-peach)',
                    margin: 0
                  }}>Additional Options</h2>
                </div>

                <div className='options-content' style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 0
                }}>
                  <div className='input-section'>
                    <div className='additional-options'>
                      <button
                        onClick={() => setShowNotes(!showNotes)}
                        className='additional-option-button'
                      >
                        <MdNoteAdd size={16} />
                        <span>Add Notes</span>
                      </button>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className='additional-option-button'
                      >
                        <MdSentimentSatisfied size={16} />
                        <span>Add Details</span>
                      </button>
                    </div>

                    {showNotes && (
                      <div style={{ marginTop: '1rem' }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Any other details you&apos;d like to share? (Optional)
                        </p>
                        <textarea
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder='What activities or things led to these symptoms? Any additional context...'
                          className='text-area'
                          rows={4}
                          maxLength={500}
                        />
                      </div>
                    )}

                    {showDetails && (
                      <div style={{ marginTop: '1rem' }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.75rem',
                            fontWeight: '400'
                          }}
                        >
                          Rate severity (Optional)
                        </p>

                        {getSymptomsWithDetails().length === 0 ? (
                          <p style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            padding: '0.5rem',
                            background: 'var(--pastel-blue)',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            No severity options for selected symptoms
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {getSymptomsWithDetails().map(symptom => (
                              symptom.optionalFields?.map((field, fieldIndex) => {
                                const currentSelection = optionalValues[symptom.id]?.[field.type];

                                return (
                                  <div
                                    key={`${symptom.id}-${fieldIndex}`}
                                    style={{
                                      padding: '0.625rem',
                                      background: 'rgba(255, 255, 255, 0.5)',
                                      borderRadius: '8px'
                                    }}
                                  >
                                    {/* Symptom Name and Description */}
                                    <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{
                      fontWeight: '400',
                      color: 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      marginBottom: '0.125rem'
                    }}>
                                        {symptom.name}
                                      </div>
                                      <div style={{
                                        fontSize: '0.6875rem',
                                        color: 'var(--text-muted)',
                                        lineHeight: '1.3'
                                      }}>
                                        {field.description}
                                      </div>
                                    </div>

                                    {/* Emoji Faces - Right Aligned */}
                                    <div style={{
                                      display: 'flex',
                                      gap: '0.375rem',
                                      justifyContent: 'flex-end'
                                    }}>
                                      {SEVERITY_LEVELS.map(level => {
                                        const isSelected = currentSelection === level.id;
                                        const IconComponent = level.icon;

                                        return (
                                          <button
                                            key={level.id}
                                            onClick={() =>
                                              handleSeveritySelection(
                                                symptom.id,
                                                field.type,
                                                level.id
                                              )
                                            }
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              cursor: 'pointer',
                                              padding: '0.25rem',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              transition: 'all 0.2s ease',
                                              transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                                              opacity: isSelected ? 1 : 0.4,
                                              borderRadius: '4px'
                                            }}
                                            title={level.name}
                                          >
                                            <IconComponent
                                              size={28}
                                              color={level.color}
                                            />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Episode Preview */}
                  {episodePreview && (
                    <div className='input-section'>
                      <h3 className='section-title'>
                        <FiList
                          style={{ display: 'inline', marginRight: '0.5rem' }}
                        />{' '}
                        Episode Preview
                      </h3>
                      {isLoadingPreview ? (
                        <div className='flex-center'>
                          <div className='loading-spinner' />
                          <span>Checking episode...</span>
                        </div>
                      ) : (
                        <div
                          className={`info-box ${episodePreview.isNewEpisode ? 'new-episode' : 'existing-episode'}`}
                        >
                          <p>
                            {episodePreview.isNewEpisode ? (
                              <>
                                <FiCheckCircle
                                  style={{
                                    display: 'inline',
                                    marginRight: '0.25rem',
                                  }}
                                />{' '}
                              </>
                            ) : (
                              <>
                                <MdNoteAdd
                                  style={{
                                    display: 'inline',
                                    marginRight: '0.25rem',
                                  }}
                                />{' '}
                              </>
                            )}
                            {episodePreview.message}
                          </p>
                          {!episodePreview.isNewEpisode && (
                            <p
                              style={{
                                fontSize: '0.875rem',
                                marginTop: '0.5rem',
                                opacity: 0.8,
                              }}
                            >
                              Episode started: {episodePreview.episode.startDate}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='input-section button-section' style={{
                    position: 'sticky',
                    bottom: 0,
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    borderTop: '2px solid #e5e7eb',
                    marginTop: 'auto'
                  }}>
                    <div className='button-group' style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <button
                        onClick={handleAnalyzeSymptoms}
                        disabled={isAnalyzing || !aiAvailable}
                        className='btn-primary'
                        style={{ width: '100%' }}
                      >
                        {isAnalyzing && <div className='loading-spinner' />}
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
                      </button>

                      <button
                        onClick={handleClearSymptoms}
                        className='btn-secondary'
                        style={{ width: '100%' }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Panel - Analysis Results */}
            <div className='analysis-panel' style={{
              background: 'white',
              padding: analysisResult ? '2rem' : 0
            }}>
              {analysisResult ? (
                <div className='analysis-results' style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  height: '100%'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid var(--pastel-pink-dark)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MdAutoAwesome size={28} style={{ color: 'var(--accent-pink)' }} />
                      <h2 style={{
                        fontSize: '1.75rem',
                        margin: 0,
                        fontWeight: '700',
                        color: 'var(--text-primary)'
                      }}>
                        Analysis Results
                      </h2>
                    </div>
                    <button
                      onClick={() => setAnalysisResult(null)}
                      className='btn-secondary'
                      style={{
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        minWidth: 'auto'
                      }}
                    >
                      ← Back to Form
                    </button>
                  </div>

                  {/* Multi-Column Content */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '1.5rem',
                    flex: 1
                  }}>
                    {/* Column 1 - Episode & Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Episode Info */}
                      {analysisResult.episodeInfo && (
                        <div style={{
                          background: analysisResult.episodeInfo.isNewEpisode
                            ? 'var(--pastel-mint)'
                            : 'var(--pastel-blue)',
                          border: `2px solid ${analysisResult.episodeInfo.isNewEpisode
                            ? 'var(--pastel-mint-dark)'
                            : 'var(--pastel-blue-dark)'}`,
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: analysisResult.episodeInfo.isNewEpisode
                              ? 'var(--accent-mint)'
                              : 'var(--accent-blue)',
                            marginBottom: '0.75rem'
                          }}>
                            {analysisResult.episodeInfo.isNewEpisode ? (
                              <FiPlus size={20} />
                            ) : (
                              <FiEdit size={20} />
                            )}
                            {analysisResult.episodeInfo.isNewEpisode ? 'New Episode' : 'Episode Update'}
                          </h3>
                          <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            {analysisResult.episodeInfo.message}
                          </p>
                        </div>
                      )}

                      {/* Severity Badge */}
                      <div style={{
                        background: 'var(--pastel-yellow)',
                        border: '2px solid var(--pastel-yellow-dark)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}>
                        <h3 style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--accent-yellow)',
                          marginBottom: '0.75rem'
                        }}>
                          <MdInfo size={20} />
                          Severity Level
                        </h3>
                        <span
                          className={`severity-badge severity-${analysisResult.severity}`}
                          style={{ margin: 0, display: 'inline-flex' }}
                        >
                          {analysisResult.severity.charAt(0).toUpperCase() +
                            analysisResult.severity.slice(1)}
                        </span>
                      </div>

                      {/* Daily Summary */}
                      <div style={{
                        background: 'var(--pastel-pink)',
                        border: '2px solid var(--pastel-pink-dark)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}>
                        <h3 style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--accent-pink)',
                          marginBottom: '0.75rem'
                        }}>
                          <MdInfo size={20} />
                          Daily Summary
                        </h3>
                        <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          <MedicalTextProcessor
                            text={analysisResult.dailySummary}
                            medicalTerms={analysisResult.medicalTerms}
                          />
                        </p>
                      </div>

                      {/* Progression Info */}
                      {analysisResult.dayNumber && (
                        <div style={{
                          background: 'var(--pastel-lavender)',
                          border: '2px solid var(--pastel-lavender-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-lavender)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdTrendingUp size={20} />
                            Episode Progress
                          </h3>
                          <p style={{ margin: 0, marginBottom: '0.5rem', fontWeight: '400' }}>
                            Day {analysisResult.dayNumber} - Trend: {analysisResult.trend || 'stable'}
                          </p>
                          {analysisResult.symptomChanges && (
                            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                              {analysisResult.symptomChanges.new.length > 0 && (
                                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <FiPlus size={14} />
                                  <span>New: {analysisResult.symptomChanges.new.join(', ')}</span>
                                </p>
                              )}
                              {analysisResult.symptomChanges.resolved.length > 0 && (
                                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <FiCheckCircle size={14} />
                                  <span>Resolved: {analysisResult.symptomChanges.resolved.join(', ')}</span>
                                </p>
                              )}
                              {analysisResult.symptomChanges.ongoing.length > 0 && (
                                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <MdAutoAwesome size={14} />
                                  <span>Ongoing: {analysisResult.symptomChanges.ongoing.join(', ')}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Column 2 - Analysis & Tips */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Analysis */}
                      <div style={{
                        background: 'var(--pastel-blue)',
                        border: '2px solid var(--pastel-blue-dark)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}>
                        <h3 style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--accent-blue)',
                          marginBottom: '0.75rem'
                        }}>
                          <FiSearch size={20} />
                          Analysis
                        </h3>
                        <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          <MedicalTextProcessor
                            text={analysisResult.analysis}
                            medicalTerms={analysisResult.medicalTerms}
                          />
                        </p>
                        <p style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          fontStyle: 'italic',
                          marginTop: '0.75rem',
                          margin: '0.75rem 0 0 0'
                        }}>
                          *This analysis is generated by AI and is for educational purposes only. Not medical advice.
                        </p>

                        {/* Analysis Citations */}
                        {analysisResult.analysisCitations && analysisResult.analysisCitations.length > 0 && (
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--pastel-blue-dark)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                              Sources:
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', lineHeight: '1.5' }}>
                              {analysisResult.analysisCitations.map((citation, index) => (
                                <li key={index} style={{ marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                  <a
                                    href={citation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                                  >
                                    {citation.source} - {citation.title} ({citation.year})
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Medical Consultation */}
                      {analysisResult.medicalConsultationSuggested && (
                        <div style={{
                          background: 'var(--pastel-peach)',
                          border: '2px solid var(--pastel-peach-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-peach)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdWarning size={20} />
                            Medical Consultation Suggested
                          </h3>
                          <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            <MedicalTextProcessor
                              text={analysisResult.reasonForConsultation}
                              medicalTerms={analysisResult.medicalTerms}
                            />
                          </p>
                        </div>
                      )}

                      {/* Self-Care Tips */}
                      {analysisResult.selfCareTips && analysisResult.selfCareTips.length > 0 && (
                        <div style={{
                          background: 'var(--pastel-mint)',
                          border: '2px solid var(--pastel-mint-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-mint)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdLightbulb size={20} />
                            Self-Care Tips
                          </h3>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                            {analysisResult.selfCareTips.map((tip, index) => (
                              <li key={index} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                <MedicalTextProcessor
                                  text={tip}
                                  medicalTerms={analysisResult.medicalTerms}
                                />
                                {/* Self-care Citations for this tip */}
                                {analysisResult.selfCareCitations &&
                                 analysisResult.selfCareCitations[index] &&
                                 analysisResult.selfCareCitations[index].length > 0 && (
                                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {analysisResult.selfCareCitations[index].map((citation, citIndex) => (
                                      <div key={citIndex}>
                                        <a
                                          href={citation.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ color: 'var(--accent-mint)', textDecoration: 'none' }}
                                        >
                                          [{citation.source}]
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                          <p style={{
                            fontSize: '0.6875rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            marginTop: '0.75rem',
                            margin: '0.75rem 0 0 0'
                          }}>
                            *These are general wellness suggestions and do not replace professional medical advice.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Column 3 - Additional Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Information Notes */}
                      {analysisResult.informationNotes && analysisResult.informationNotes.length > 0 && (
                        <div style={{
                          background: 'var(--pastel-coral)',
                          border: '2px solid var(--pastel-coral-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-coral)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdInfo size={20} />
                            Important Notes
                          </h3>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                            {analysisResult.informationNotes.map((note, index) => (
                              <li key={index} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                <MedicalTextProcessor
                                  text={note}
                                  medicalTerms={analysisResult.medicalTerms}
                                />
                                {/* Educational Citations for this note */}
                                {analysisResult.educationalCitations &&
                                 analysisResult.educationalCitations[index] &&
                                 analysisResult.educationalCitations[index].length > 0 && (
                                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {analysisResult.educationalCitations[index].map((citation, citIndex) => (
                                      <div key={citIndex}>
                                        <a
                                          href={citation.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ color: 'var(--accent-coral)', textDecoration: 'none' }}
                                        >
                                          [{citation.source}]
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                          <p style={{
                            fontSize: '0.6875rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            marginTop: '0.75rem',
                            margin: '0.75rem 0 0 0'
                          }}>
                            *Information provided by AI for educational purposes. Consult healthcare providers for medical guidance.
                          </p>
                        </div>
                      )}

                      {/* Recovery Window */}
                      {analysisResult.estimatedRecoveryWindow && (
                        <div style={{
                          background: 'var(--pastel-lavender)',
                          border: '2px solid var(--pastel-lavender-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-lavender)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdSchedule size={20} />
                            Recovery Timeframe
                          </h3>
                          <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            {analysisResult.estimatedRecoveryWindow}
                          </p>
                        </div>
                      )}

                      {/* Follow-up Question */}
                      {analysisResult.followUpQuestion && (
                        <div style={{
                          background: 'var(--pastel-blue)',
                          border: '2px solid var(--pastel-blue-dark)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--accent-blue)',
                            marginBottom: '0.75rem'
                          }}>
                            <MdHelpOutline size={20} />
                            Follow-up
                          </h3>
                          <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            {analysisResult.followUpQuestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='analysis-panel-empty'>
                  <div className='empty-state'>
                    <div className='empty-icon'>
                      <FiActivity size={64} style={{ color: 'var(--accent-pink)', opacity: 0.4 }} />
                    </div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '400' }}>
                      Ready to analyze
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                      Select symptoms and click &quot;Analyze Symptoms&quot; to see results here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
    </div>
  );
}
