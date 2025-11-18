// Unified AI service that supports both Chrome AI and Gemini API
import { symptomAnalyzer, checkChromeAIAvailability } from './chrome-ai';
import { geminiSymptomAnalyzer, checkGeminiAIAvailability } from './gemini-ai';
import { EpisodeProgressionAnalysis } from '@/types/episode';

export type AIProvider = 'chrome' | 'gemini';

interface AIServiceStatus {
  available: boolean;
  provider: AIProvider | null;
  status: string;
  instructions?: string;
}

class AIService {
  private static instance: AIService | null = null;
  private currentProvider: AIProvider | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Check which AI providers are available and initialize the best one
   */
  async initialize(): Promise<AIServiceStatus> {
    if (this.isInitialized && this.currentProvider) {
      return {
        available: true,
        provider: this.currentProvider,
        status: `${this.currentProvider === 'chrome' ? 'Chrome AI' : 'Gemini AI'} is ready`,
      };
    }

    // Check Gemini first (more reliable)
    const geminiStatus = await checkGeminiAIAvailability();
    if (geminiStatus.available) {
      const initialized = await geminiSymptomAnalyzer.initialize();
      if (initialized) {
        this.currentProvider = 'gemini';
        this.isInitialized = true;
        console.log('✅ AI Service initialized with Gemini');
        return {
          available: true,
          provider: 'gemini',
          status: 'Gemini AI is ready',
        };
      }
    }

    // Fallback to Chrome AI
    const chromeStatus = await checkChromeAIAvailability();
    if (chromeStatus.available) {
      const initialized = await symptomAnalyzer.initialize();
      if (initialized) {
        this.currentProvider = 'chrome';
        this.isInitialized = true;
        console.log('✅ AI Service initialized with Chrome AI');
        return {
          available: true,
          provider: 'chrome',
          status: 'Chrome AI is ready',
        };
      }
    }

    // Neither available
    console.warn('⚠️ No AI provider available');
    return {
      available: false,
      provider: null,
      status: 'No AI provider available',
      instructions: geminiStatus.instructions || chromeStatus.instructions,
    };
  }

  /**
   * Get current AI provider status
   */
  async getStatus(): Promise<AIServiceStatus> {
    if (!this.isInitialized || !this.currentProvider) {
      return await this.initialize();
    }

    return {
      available: true,
      provider: this.currentProvider,
      status: `${this.currentProvider === 'chrome' ? 'Chrome AI' : 'Gemini AI'} is ready`,
    };
  }

  /**
   * Analyze symptoms using the available AI provider
   */
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
    const status = await this.getStatus();

    if (!status.available || !this.currentProvider) {
      throw new Error('No AI provider available. Please configure Chrome AI or add a Gemini API key.');
    }

    console.log(`🤖 Analyzing symptoms with ${this.currentProvider === 'chrome' ? 'Chrome AI' : 'Gemini AI'}`);

    if (this.currentProvider === 'gemini') {
      return await geminiSymptomAnalyzer.analyzeSymptoms(symptoms, notes, episodeContext);
    } else {
      return await symptomAnalyzer.analyzeSymptoms(symptoms, notes, episodeContext);
    }
  }

  /**
   * Switch to a specific AI provider
   */
  async switchProvider(provider: AIProvider): Promise<boolean> {
    try {
      if (provider === 'gemini') {
        const status = await checkGeminiAIAvailability();
        if (!status.available) {
          console.warn('Gemini AI not available');
          return false;
        }
        const initialized = await geminiSymptomAnalyzer.initialize();
        if (initialized) {
          this.currentProvider = 'gemini';
          this.isInitialized = true;
          console.log('✅ Switched to Gemini AI');
          return true;
        }
      } else if (provider === 'chrome') {
        const status = await checkChromeAIAvailability();
        if (!status.available) {
          console.warn('Chrome AI not available');
          return false;
        }
        const initialized = await symptomAnalyzer.initialize();
        if (initialized) {
          this.currentProvider = 'chrome';
          this.isInitialized = true;
          console.log('✅ Switched to Chrome AI');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error switching AI provider:', error);
      return false;
    }
  }

  /**
   * Get the current provider
   */
  getCurrentProvider(): AIProvider | null {
    return this.currentProvider;
  }

  /**
   * Destroy the current AI service
   */
  destroy() {
    if (this.currentProvider === 'gemini') {
      geminiSymptomAnalyzer.destroy();
    } else if (this.currentProvider === 'chrome') {
      symptomAnalyzer.destroy();
    }
    this.currentProvider = null;
    this.isInitialized = false;
  }
}

export const aiService = AIService.getInstance();
