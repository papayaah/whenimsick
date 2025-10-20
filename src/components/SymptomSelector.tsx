'use client';

import React from 'react';
import * as MdIcons from 'react-icons/md';
import { COMMON_SYMPTOMS, UNCOMMON_SYMPTOMS, SymptomData } from '@/types/symptoms';
import {
  MdSentimentSatisfied,
  MdSentimentNeutral,
  MdSentimentDissatisfied,
  MdSentimentVeryDissatisfied,
} from 'react-icons/md';

const SEVERITY_LEVELS = [
  { id: 'mild', name: 'Mild', icon: MdSentimentSatisfied, color: '#ffc107' },
  { id: 'moderate', name: 'Moderate', icon: MdSentimentNeutral, color: '#fd7e14' },
  { id: 'severe', name: 'Severe', icon: MdSentimentDissatisfied, color: '#dc3545' },
  { id: 'extreme', name: 'Extreme', icon: MdSentimentVeryDissatisfied, color: '#6f42c1' },
];

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomToggle: (symptomId: string) => void;
  showUncommonSymptoms?: boolean;
  showAllUncommon?: boolean;
  onToggleUncommon?: (show: boolean) => void;
  optionalValues?: Record<string, Record<string, string>>;
}

export default function SymptomSelector({ 
  selectedSymptoms, 
  onSymptomToggle,
  showAllUncommon = false,
  onToggleUncommon,
  optionalValues = {}
}: SymptomSelectorProps) {

  const renderSymptom = (symptom: SymptomData) => {
    const isSelected = selectedSymptoms.includes(symptom.id);
    const IconComponent = symptom.icon ? (MdIcons as Record<string, React.ComponentType<{ size?: number }>>)[symptom.icon] : null;
    
    // Get severity selection for this symptom
    const symptomValues = optionalValues[symptom.id];
    let severityIcon = null;
    let severityColor = null;
    
    if (symptomValues && symptom.optionalFields) {
      // Find the first field type (usually 'severity')
      const fieldType = symptom.optionalFields[0]?.type;
      if (fieldType && symptomValues[fieldType]) {
        const severityLevel = SEVERITY_LEVELS.find(level => level.id === symptomValues[fieldType]);
        if (severityLevel) {
          severityIcon = severityLevel.icon;
          severityColor = severityLevel.color;
        }
      }
    }
    
    return (
      <button
        key={symptom.id}
        onClick={() => onSymptomToggle(symptom.id)}
        className={`symptom-button ${isSelected ? 'selected' : ''}`}
        style={{ position: 'relative' }}
      >
        {IconComponent ? (
          <IconComponent size={40} />
        ) : (
          <span className="symptom-icon">•</span>
        )}
        <span style={{ textAlign: 'center', lineHeight: '1.25' }}>{symptom.name}</span>
        
        {/* Severity Badge */}
        {severityIcon && isSelected && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 10
          }}>
            {React.createElement(severityIcon, { size: 16, color: severityColor || undefined })}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Common Symptoms */}
      <div>
        <h3 className="section-title">How are you feeling?</h3>
        <div className="symptom-grid">
          {COMMON_SYMPTOMS.map(renderSymptom)}
        </div>
      </div>

      {/* Show More Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => onToggleUncommon?.(!showAllUncommon)}
          className="btn-secondary"
          style={{ 
            minWidth: '200px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {showAllUncommon ? '◀ Hide' : 'Show More ▶'}
        </button>
      </div>
    </div>
  );
}

export function UncommonSymptomsColumn({ 
  selectedSymptoms, 
  onSymptomToggle,
  optionalValues = {}
}: { 
  selectedSymptoms: string[]; 
  onSymptomToggle: (symptomId: string) => void;
  optionalValues?: Record<string, Record<string, string>>;
}) {
  return (
    <div>
      <h3 className="section-title" style={{ fontSize: '0.9375rem' }}>Less Common Symptoms</h3>
      <div className="symptom-grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
        gap: '0.625rem'
      }}>
        {UNCOMMON_SYMPTOMS.map(symptom => {
          const isSelected = selectedSymptoms.includes(symptom.id);
          const IconComponent = symptom.icon ? (MdIcons as Record<string, React.ComponentType<{ size?: number }>>)[symptom.icon] : null;
          
          // Get severity selection for this symptom
          const symptomValues = optionalValues[symptom.id];
          let severityIcon = null;
          let severityColor = null;
          
          if (symptomValues && symptom.optionalFields) {
            const fieldType = symptom.optionalFields[0]?.type;
            if (fieldType && symptomValues[fieldType]) {
              const severityLevel = SEVERITY_LEVELS.find(level => level.id === symptomValues[fieldType]);
              if (severityLevel) {
                severityIcon = severityLevel.icon;
                severityColor = severityLevel.color;
              }
            }
          }
          
          return (
            <button
              key={symptom.id}
              onClick={() => onSymptomToggle(symptom.id)}
              className={`symptom-button ${isSelected ? 'selected' : ''}`}
              style={{ 
                position: 'relative',
                minHeight: '80px',
                padding: '0.75rem 0.5rem',
                fontSize: '0.75rem'
              }}
            >
              {IconComponent ? (
                <IconComponent size={32} />
              ) : (
                <span style={{ fontSize: '1.25rem' }}>•</span>
              )}
              <span style={{ textAlign: 'center', lineHeight: '1.2', fontSize: '0.75rem' }}>{symptom.name}</span>
              
              {/* Severity Badge */}
              {severityIcon && isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  background: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  zIndex: 10
                }}>
                  {React.createElement(severityIcon, { size: 12, color: severityColor || undefined })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}