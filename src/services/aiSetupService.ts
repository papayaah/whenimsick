// AI Setup Status Service - tracks whether Chrome AI is set up and ready
class AISetupService {
  private static instance: AISetupService | null = null;
  private readonly SETUP_KEY = 'chromeai_setup_complete';

  private constructor() {}

  static getInstance(): AISetupService {
    if (!AISetupService.instance) {
      AISetupService.instance = new AISetupService();
    }
    return AISetupService.instance;
  }

  /**
   * Check if Chrome AI is already set up and ready
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
   * Mark Chrome AI as set up and ready
   */
  markAISetup(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.SETUP_KEY, 'true');
      console.log('Chrome AI marked as set up');
    } catch (error) {
      console.error('Failed to mark AI as set up:', error);
    }
  }

  /**
   * Reset AI setup status (for testing or if user wants to reconfigure)
   */
  resetAISetup(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.SETUP_KEY);
      console.log('AI setup status reset');
    } catch (error) {
      console.error('Failed to reset AI setup status:', error);
    }
  }
}

export const aiSetupService = AISetupService.getInstance();

