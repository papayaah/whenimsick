// Gemini AI utility library for symptom analysis
import { EpisodeProgressionAnalysis } from '@/types/episode';

interface GeminiAIStatus {
  available: boolean;
  status: string;
  instructions?: string;
}

interface SymptomAnalysisRequest {
  symptoms: Array<{
    symptom: { id: string; name: string; category: string };
    optionalValues: { [key: string]: string | number };
  }>;
  notes?: string;
  timestamp?: string;
}

interface IllnessProgressionRequest extends SymptomAnalysisRequest {
  illnessHistory?: Array<{
    date: string;
    entries: Array<{
      time: string;
      symptoms: Array<{
        symptom: { id: string; name: string; category: string };
        optionalValues: { [key: string]: string | number };
      }>;
      notes?: string;
    }>;
    dayNumber: number;
  }>;
  dayNumber: number;
}

class GeminiSymptomAnalyzer {
  // Hardcoded Supabase configuration - same as main app
  private readonly supabaseUrl = 'https://dkmrgxmlsmcmnvsntspm.supabase.co';
  private readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbXJneG1sc21jbW52c250c3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjY3NjUsImV4cCI6MjA2NDEwMjc2NX0.AkKIZmtflfpvvYOgSByIiiVCjC2Gv8ky1KHVcQ0ae-A';
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Always available since hardcoded
      this.isInitialized = true;
      console.log('GeminiSymptomAnalyzer initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize GeminiSymptomAnalyzer:', error);
      return false;
    }
  }

  async analyzeSymptoms(
    symptoms: string[],
    notes?: string,
    episodeContext?: EpisodeProgressionAnalysis
  ): Promise<{
    dailySummary: string;
    analysis: string;
    informationNotes: string[];
    severity: 'low' | 'moderate' | 'high';
    medicalConsultationSuggested: boolean;
    reasonForConsultation: string;
    selfCareTips: string[];
    estimatedRecoveryWindow: string;
    followUpQuestion: string;
    episodeTitle?: string;
    medicalTerms: Array<{ term: string; definition: string }>;
    analysisCitations?: Array<{ source: string; title: string; url: string; year: string }>;
    educationalCitations?: Array<Array<{ source: string; title: string; url: string; year: string }>>;
    selfCareCitations?: Array<Array<{ source: string; title: string; url: string; year: string }>>;
    trend?: 'improving' | 'stable' | 'worsening';
    dayNumber?: number;
    progressionSummary?: string;
    symptomChanges?: {
      new: string[];
      resolved: string[];
      ongoing: string[];
      severity_changes: string[];
    };
  }> {
    console.log('Starting Gemini symptom analysis for:', symptoms);

    if (!this.isInitialized) {
      throw new Error('Gemini analyzer not initialized.');
    }

    try {
      // Build request based on whether we have episode context
      let request: SymptomAnalysisRequest | IllnessProgressionRequest;

      if (episodeContext) {
        // Build illness progression request
        const illnessHistory = episodeContext.previousEntries?.map((entry, index) => ({
          date: new Date(entry.date).toISOString().split('T')[0],
          entries: [{
            time: entry.date,
            symptoms: entry.symptoms.map(s => ({
              symptom: { id: s, name: s, category: 'preset' },
              optionalValues: {}
            })),
            notes: entry.notes
          }],
          dayNumber: index + 1
        })) || [];

        request = {
          symptoms: symptoms.map(s => ({
            symptom: { id: s, name: s, category: 'preset' },
            optionalValues: {}
          })),
          notes,
          timestamp: new Date().toISOString(),
          illnessHistory,
          dayNumber: episodeContext.dayNumber
        };
      } else {
        // Build simple symptom analysis request
        request = {
          symptoms: symptoms.map(s => ({
            symptom: { id: s, name: s, category: 'preset' },
            optionalValues: {}
          })),
          notes,
          timestamp: new Date().toISOString()
        };
      }

      // Call Supabase Edge Function directly
      const response = await fetch(`${this.supabaseUrl}/functions/v1/symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Supabase function error: ${error}`);
      }

      const result = await response.json();
      console.log('Successfully received Gemini analysis from Supabase');

      // Supabase function returns { success: true, data: {...}, usage: {...} }
      if (result.success && result.data) {
        return result.data;
      }

      throw new Error('Invalid response from Supabase function');
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      throw error;
    }
  }

  destroy() {
    this.isInitialized = false;
  }
}

export async function checkGeminiAIAvailability(): Promise<GeminiAIStatus> {
  // Always available since Supabase URL is hardcoded
  return {
    available: true,
    status: 'Gemini AI is ready (via Supabase)',
  };
}

export const geminiSymptomAnalyzer = new GeminiSymptomAnalyzer();
