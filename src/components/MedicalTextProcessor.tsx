'use client';

import React from 'react';
import MedicalTooltip from './MedicalTooltip';
import { MedicalTerm } from '@/types/symptoms';

interface MedicalTextProcessorProps {
  text: string;
  medicalTerms?: MedicalTerm[];
  className?: string;
}

export default function MedicalTextProcessor({
  text,
  medicalTerms = [],
  className,
}: MedicalTextProcessorProps) {
  // Map of common terms to medical terms for automatic replacement
  const commonToMedicalMap: Record<string, string> = {
    // Symptoms
    'sore throat': 'pharyngitis',
    'runny nose': 'rhinorrhea',
    'body aches': 'myalgia',
    'muscle pain': 'myalgia',
    'muscle aches': 'myalgia',
    fever: 'pyrexia',
    headache: 'cephalgia',
    'stomach pain': 'gastralgia',
    nausea: 'nausea',
    vomiting: 'emesis',
    dizziness: 'vertigo',
    'joint pain': 'arthralgia',
    'difficulty breathing': 'dyspnea',
    'shortness of breath': 'dyspnea',
    'stuffy nose': 'nasal congestion',
    congestion: 'nasal congestion',
    cough: 'tussis',
    inflammation: 'inflammation',
    // Common term variations for medications (already medical names, but lowercase)
    tylenol: 'acetaminophen',
    advil: 'ibuprofen',
    motrin: 'ibuprofen',
    // Additional medical terms that might appear in lowercase
    virus: 'virus',
    viral: 'viral',
    bacteria: 'bacteria',
    bacterial: 'bacterial',
    infection: 'infection',
    systemic: 'systemic',
    cytokines: 'cytokines',
    immune: 'immune response',
    'immune response': 'immune response',
  };

  // Function to process text and wrap medical terms
  const processText = (inputText: string, terms: MedicalTerm[]) => {
    if (!inputText || terms.length === 0) {
      return { processedText: inputText, termMatches: [] };
    }


    // First, try to replace common terms with medical terms if the AI provided them
    let processedText = inputText;
    const replacements: Array<{ from: string; to: string; index: number }> = [];

    // For each medical term the AI provided, check if we should replace a common term
    terms.forEach(medicalTerm => {
      const medicalTermLower = medicalTerm.term.toLowerCase();

      // Find if this medical term has a common equivalent
      Object.entries(commonToMedicalMap).forEach(
        ([commonTerm, medicalMapping]) => {
          if (medicalMapping.toLowerCase() === medicalTermLower) {
            // This medical term maps to a common term - try to replace it in text
            const regex = new RegExp(`\\b${commonTerm}\\b`, 'gi');
            let match;
            while ((match = regex.exec(processedText)) !== null) {
              replacements.push({
                from: match[0],
                to: medicalTerm.term,
                index: match.index,
              });
            }
          }
        }
      );
    });

    // Apply replacements in reverse order to maintain indices
    replacements.sort((a, b) => b.index - a.index);
    replacements.forEach(replacement => {
      processedText =
        processedText.substring(0, replacement.index) +
        replacement.to +
        processedText.substring(replacement.index + replacement.from.length);
    });


    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = terms.sort((a, b) => b.term.length - a.term.length);

    const termMatches: Array<{
      term: string;
      definition: string;
      index: number;
    }> = [];

    // Find all medical terms in the text
    sortedTerms.forEach(medicalTerm => {
      const term = medicalTerm.term;
      const regex = new RegExp(
        `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        'gi'
      );
      let match: RegExpExecArray | null;

      while ((match = regex.exec(processedText)) !== null) {
        // Check if this match is already processed (avoid duplicates)
        const isAlreadyProcessed = termMatches.some(
          existing =>
            existing.index <= match!.index &&
            existing.index + existing.term.length >=
              match!.index + match![0].length
        );

        if (!isAlreadyProcessed) {
          termMatches.push({
            term: match![0],
            definition: medicalTerm.definition,
            index: match!.index,
          });
        }
      }
    });

    // Sort matches by index (reverse order for replacement)
    termMatches.sort((a, b) => b.index - a.index);

    // Replace terms with placeholders
    termMatches.forEach(match => {
      const placeholder = `__MEDICAL_TERM_${match.term}_${match.index}__`;
      processedText =
        processedText.substring(0, match.index) +
        placeholder +
        processedText.substring(match.index + match.term.length);
    });

    return { processedText, termMatches };
  };

  const { processedText, termMatches } = processText(text, medicalTerms);

  // Split text and render with tooltips
  const renderProcessedText = () => {
    const parts = processedText.split(/(__MEDICAL_TERM_[^_]+_\d+__)/);

    return parts.map((part, index) => {
      const match = part.match(/^__MEDICAL_TERM_(.+)_(\d+)__$/);

      if (match) {
        const term = match[1];
        const termMatch = termMatches.find(tm => tm.term === term);

        if (termMatch) {
          return (
            <MedicalTooltip
              key={index}
              term={termMatch.term}
              definition={termMatch.definition}
            >
              {termMatch.term}
            </MedicalTooltip>
          );
        }
      }

      return part;
    });
  };

  return <span className={className}>{renderProcessedText()}</span>;
}
