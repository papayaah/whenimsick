// AI Setup Status Service - tracks whether AI (Chrome or Gemini) is set up and ready
class AISetupService {
  private static instance: AISetupService | null = null;
  private readonly SETUP_KEY = 'ai_setup_complete';
  private readonly PROVIDER_KEY = 'ai_provider';

  private constructor() {}

  static getInstance(): AISetupService {
    if (!AISetupService.instance) {
      AISetupService.instance = new AISetupService();
    }
    return AISetupService.instance;
  }

  /**
   * Check if AI is already set up and ready
   */
  isAISetup(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const setupStatus = localStorage.getItem(this.SETUP_KEY);
      return setupStatus === 'true';
    } catch (error) {
      console.error('Failed to check AI setup status:', error);
      return false;
    }
  }

  /**
   * Mark AI as set up and ready
   */
  markAISetup(provider: 'chrome' | 'gemini' = 'chrome'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.SETUP_KEY, 'true');
      localStorage.setItem(this.PROVIDER_KEY, provider);
      console.log(`${provider === 'chrome' ? 'Chrome AI' : 'Gemini AI'} marked as set up`);
    } catch (error) {
      console.error('Failed to mark AI as set up:', error);
    }
  }

  /**
   * Get the current AI provider
   */
  getProvider(): 'chrome' | 'gemini' | null {
    if (typeof window === 'undefined') return null;
    try {
      const provider = localStorage.getItem(this.PROVIDER_KEY);
      return provider as 'chrome' | 'gemini' | null;
    } catch (error) {
      console.error('Failed to get AI provider:', error);
      return null;
    }
  }

  /**
   * Reset AI setup status (for testing or if user wants to reconfigure)
   */
  resetAISetup(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.SETUP_KEY);
      localStorage.removeItem(this.PROVIDER_KEY);
      console.log('AI setup status reset');
    } catch (error) {
      console.error('Failed to reset AI setup status:', error);
    }
  }
}

export const aiSetupService = AISetupService.getInstance();

