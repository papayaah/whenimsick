// Chrome AI utility library for symptom analysis
import { EpisodeProgressionAnalysis } from '@/types/episode';

interface ChromeAIStatus {
  available: boolean;
  status: string;
  instructions?: string;
  languageModelAvailable: boolean;
}

const SYMPTOM_ANALYSIS_PROMPT = `Analyze the symptoms and respond with only valid JSON in this format:
{"dailySummary":"Brief summary","analysis":"Educational info","informationNotes":["Note 1","Note 2"],"severity":"low","medicalConsultationSuggested":false,"reasonForConsultation":"","selfCareTips":["Tip 1","Tip 2"],"estimatedRecoveryWindow":"timeframe","followUpQuestion":"question","episodeTitle":"Personalized episode title based on user's symptoms and notes","medicalTerms":[{"term":"medical term","definition":"simple explanation"}]}

CRITICAL WRITING STYLE:
- Write your analysis using SIMPLE, EVERYDAY language that patients understand
- Use common words: "fever", "headache", "body aches", "acetaminophen", "ibuprofen"
- DO NOT add anything in parentheses like "acetaminophen (Acetaminophen)" or "fever (pyrexia)"
- DO NOT capitalize drug names unless at start of sentence
- Write naturally: "Take acetaminophen or ibuprofen for pain relief"
- Example GOOD: "Take acetaminophen for headache"
- Example BAD: "Take acetaminophen (Acetaminophen)" or "Take Acetaminophen"

MEDICAL TERMS ARRAY:
- Create a SEPARATE "medicalTerms" array with 6-10 relevant medical terms
- Include medical terminology for whatever symptoms, conditions, medications, and concepts you mention in your analysis
- For each term provide: {"term": "Medical Term", "definition": "Simple patient-friendly explanation"}
- Choose terms that help educate the patient about their specific condition
- The system will automatically create interactive tooltips for these terms`;

const EPISODE_PROGRESSION_PROMPT = `You are a medical education specialist analyzing a multi-day illness progression. Provide specific, personalized medical education.

CRITICAL INSTRUCTIONS:
- DO NOT use template phrases like "Educational analysis of this individual's illness progression"
- DO NOT repeat generic text
- Write SPECIFIC analysis about this person's actual symptom progression
- Reference their exact descriptions and compare across days
- Explain what this specific pattern typically means medically
- Use their own words when describing their symptoms
- Note if symptoms are improving, worsening, or staying stable

You MUST respond with valid JSON in this exact format:
{
  "dailySummary": "One sentence about today's symptoms in context (e.g., 'Day 2 shows your headache improving while new congestion appears')",
  "analysis": "Specific educational explanation of what this person's exact symptom progression typically indicates, referencing their timeline and descriptions",
  "informationNotes": ["Specific medical fact about this progression pattern", "Educational information about how these symptoms typically evolve"],
  "severity": "low|moderate|high",
  "medicalConsultationSuggested": true|false,
  "reasonForConsultation": "Specific reason based on this progression pattern",
  "trend": "improving|stable|worsening",
  "symptomChanges": {
    "new": ["New symptoms today"],
    "resolved": ["Symptoms that cleared up"],
    "ongoing": ["Continuing symptoms"],
    "severity_changes": []
  },
  "dayNumber": 2,
  "progressionSummary": "One sentence describing this person's illness arc using their own descriptions",
  "selfCareTips": ["First specific self-care tip", "Second actionable recommendation", "Third practical care tip"],
  "estimatedRecoveryWindow": "Realistic recovery timeline based on this specific progression pattern",
  "followUpQuestion": "Relevant monitoring question about symptom changes or progression",
  "medicalTerms": [{"term": "medical term", "definition": "simple explanation"}],
  "citations": [
    {"title": "Source Title", "url": "https://example.com", "description": "Brief description of what this source covers"},
    {"title": "Another Source", "url": "https://example2.com", "description": "Brief description of what this source covers"}
  ]
}

CRITICAL WRITING STYLE:
- Write your analysis using SIMPLE, EVERYDAY language that patients understand
- Use common words: "fever", "headache", "body aches", "acetaminophen", "ibuprofen"
- DO NOT add anything in parentheses like "acetaminophen (Acetaminophen)" or "fever (pyrexia)"
- DO NOT capitalize drug names unless at start of sentence
- Write naturally: "Take acetaminophen or ibuprofen for pain relief"
- Example GOOD: "Take acetaminophen for headache"
- Example BAD: "Take acetaminophen (Acetaminophen)" or "Take Acetaminophen"

MEDICAL TERMS ARRAY:
- Create a SEPARATE "medicalTerms" array with 6-10 relevant medical terms
- Include medical terminology for whatever symptoms, conditions, medications, and concepts you mention in your analysis
- For each term provide: {"term": "Medical Term", "definition": "Simple patient-friendly explanation"}
- Choose terms that help educate the patient about their specific condition
- The system will automatically create interactive tooltips for these terms

CITATIONS ARRAY:
- Provide 2-4 credible medical sources that support your analysis
- Include reputable sources like Mayo Clinic, WebMD, CDC, NIH, medical journals, or peer-reviewed articles
- For each citation provide: {"title": "Source Title", "url": "https://actual-url.com", "description": "Brief description of what this source covers"}
- Focus on sources that specifically relate to the symptoms and conditions you're discussing
- Ensure URLs are real and accessible

TREND ANALYSIS:
- "improving" = fewer/milder symptoms, user's descriptions indicate feeling better
- "stable" = similar symptoms and severity as yesterday
- "worsening" = new symptoms, increased severity, or user describes feeling worse

Write about THIS SPECIFIC PERSON'S progression. Use their exact words. Compare their day-to-day changes.`;

class SymptomAnalyzer {
  private languageModel: unknown = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (!('LanguageModel' in window)) {
        console.warn('LanguageModel not available');
        return false;
      }

      const LanguageModel = (window as Record<string, unknown>).LanguageModel as {
        availability: (config: unknown) => Promise<string>;
        create: (config: unknown) => Promise<{ prompt: (text: string) => Promise<string>; destroy: () => void }>;
      };
      
      // Check availability with proper language settings
      const availability = await LanguageModel.availability({
        expectedInputs: [
          { type: 'text', languages: ['en'] }
        ],
        expectedOutputs: [
          { type: 'text', languages: ['en'] }
        ]
      });

      if (availability !== 'available') {
        console.warn('LanguageModel not available:', availability);
        return false;
      }

      // Create session with full config including required expectedOutputs
      this.languageModel = await LanguageModel.create({
        temperature: 0.1,
        topK: 1,
        expectedInputs: [
          { type: 'text', languages: ['en'] }
        ],
        expectedOutputs: [
          { type: 'text', languages: ['en'] }
        ]
      });

      this.isInitialized = true;
      console.log('SymptomAnalyzer initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize SymptomAnalyzer:', error);
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
    trend?: 'improving' | 'stable' | 'worsening';
    dayNumber?: number;
    progressionSummary?: string;
    symptomChanges?: {
      new: string[];
      resolved: string[];
      ongoing: string[];
      severity_changes: string[];
    };
    citations?: Array<{ title: string; url: string; description: string }>;
  }> {
    console.log('Starting symptom analysis for:', symptoms);

    if (!this.isInitialized) {
      console.error('SymptomAnalyzer not initialized');
      throw new Error(
        'AI is not available. Please ensure Chrome AI is enabled.'
      );
    }

    try {
      const symptomText = symptoms.join(', ');
      let prompt = '';

      if (episodeContext) {
        prompt = `${EPISODE_PROGRESSION_PROMPT}\n\nCurrent symptoms: ${symptomText}${notes ? `\nNotes: ${notes}` : ''}\n\nEpisode context:\n- Day ${episodeContext.dayNumber} of illness\n- Trend: ${episodeContext.trend}\n- New symptoms: ${episodeContext.symptomChanges.new.join(', ') || 'none'}\n- Resolved symptoms: ${episodeContext.symptomChanges.resolved.join(', ') || 'none'}\n- Ongoing symptoms: ${episodeContext.symptomChanges.ongoing.join(', ') || 'none'}\n- Previous summary: ${episodeContext.progressionSummary}`;
      } else {
        prompt = `${SYMPTOM_ANALYSIS_PROMPT}\n\nSymptoms: ${symptomText}${notes ? `\nNotes: ${notes}` : ''}`;
      }

      console.log('Sending prompt to AI...');
      const response = await (this.languageModel as { prompt: (text: string) => Promise<string> }).prompt(prompt);
      console.log('Raw AI response:', response);

      // Try to extract and parse JSON - look for complete JSON objects
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed AI response');

          // For progression analysis, use the AI response as-is
          if (episodeContext) {
            // The AI response should already include progression fields
            // Just ensure we have the episode context data as fallback
            if (!parsed.trend) parsed.trend = episodeContext.trend;
            if (!parsed.dayNumber) parsed.dayNumber = episodeContext.dayNumber;
            if (!parsed.progressionSummary)
              parsed.progressionSummary = episodeContext.progressionSummary;
            if (!parsed.symptomChanges)
              parsed.symptomChanges = episodeContext.symptomChanges;
          }

          // If AI didn't provide medical terms, use empty array
          if (!parsed.medicalTerms || parsed.medicalTerms.length === 0) {
            console.warn(
              'AI did not provide medical terms - using empty array'
            );
            parsed.medicalTerms = [];
          } else {
            console.log('AI provided medical terms:', parsed.medicalTerms);
          }

          return parsed;
        } catch (e) {
          console.error('JSON parse failed:', e);
          throw new Error('AI response could not be parsed. Please try again.');
        }
      }

      // If no JSON found or parsing failed
      console.error('No valid JSON found in AI response');
      throw new Error('AI did not provide a valid response. Please try again.');
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  destroy() {
    if (this.languageModel) {
      try {
        (this.languageModel as { destroy: () => void }).destroy();
      } catch (error) {
        console.warn('Error destroying language model:', error);
      }
      this.languageModel = null;
    }
    this.isInitialized = false;
  }
}

// Cache Chrome AI availability status for 30 seconds to avoid repeated API calls
let aiAvailabilityCache: { status: ChromeAIStatus; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

// Global AI status for UI components
let globalAIStatus: ChromeAIStatus | null = null;

export async function checkChromeAIAvailability(): Promise<ChromeAIStatus> {
  if (typeof window === 'undefined') {
    return {
      available: false,
      status: 'Window object unavailable',
      instructions: 'Run inside a Chrome browser environment',
      languageModelAvailable: false,
    };
  }

  // Return cached result if still valid
  if (aiAvailabilityCache && (Date.now() - aiAvailabilityCache.timestamp) < CACHE_DURATION) {
    return aiAvailabilityCache.status;
  }

  const LanguageModel = (window as unknown as Record<string, unknown>).LanguageModel as {
    availability?: (config: unknown) => Promise<string>;
  } | undefined;

  if (!LanguageModel?.availability) {
    return {
      available: false,
      status: 'Chrome LanguageModel not detected',
      instructions:
        'Use Chrome Canary and enable chrome://flags/#prompt-api-for-gemini-nano, then restart the browser',
      languageModelAvailable: false,
    };
  }

  try {
    const availability = await LanguageModel.availability({
      expectedInputs: [
        { type: 'text', languages: ['en'] }
      ],
      expectedOutputs: [
        { type: 'text', languages: ['en'] }
      ]
    });

    let result: ChromeAIStatus;
    switch (availability) {
      case 'available':
        result = {
          available: true,
          status: 'Chrome AI is ready',
          languageModelAvailable: true,
        };
        break;
      case 'after-download':
        result = {
          available: false,
          status: 'Chrome AI model is downloading',
          instructions:
            'Keep Chrome open until the model download completes, then try again.',
          languageModelAvailable: false,
        };
        break;
      case 'no':
        result = {
          available: false,
          status: 'Chrome AI not supported on this device',
          instructions:
            'Chrome AI requires a supported device and Chrome Canary with flags enabled',
          languageModelAvailable: false,
        };
        break;
      default:
        result = {
          available: false,
          status: `Chrome AI status: ${availability}`,
          instructions:
            'Enable chrome://flags/#prompt-api-for-gemini-nano in Chrome Canary',
          languageModelAvailable: false,
        };
        break;
    }

    // Cache the result and update global status
    aiAvailabilityCache = { status: result, timestamp: Date.now() };
    globalAIStatus = result;
    return result;
  } catch (error) {
    console.error('Error checking Chrome AI availability:', error);
    const errorResult = {
      available: false,
      status: 'Error checking Chrome AI availability',
      instructions:
        'Ensure Chrome Canary is being used with the required flags enabled',
      languageModelAvailable: false,
    };
    
    // Cache error result for shorter duration (5 seconds)
    aiAvailabilityCache = { status: errorResult, timestamp: Date.now() - CACHE_DURATION + 5000 };
    globalAIStatus = errorResult;
    return errorResult;
  }
}

// Get the last known Chrome AI status (from cache)
export function getLastKnownAIStatus(): ChromeAIStatus | null {
  return globalAIStatus;
}

export const symptomAnalyzer = new SymptomAnalyzer();
