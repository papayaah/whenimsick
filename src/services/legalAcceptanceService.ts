const LEGAL_ACCEPTANCE_KEY = 'legal_terms_accepted';

class LegalAcceptanceService {
  private static instance: LegalAcceptanceService | null = null;
  private inMemoryAccepted: boolean | null = null;
  private subscribers: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): LegalAcceptanceService {
    if (!LegalAcceptanceService.instance) {
      LegalAcceptanceService.instance = new LegalAcceptanceService();
    }
    return LegalAcceptanceService.instance;
  }

  /**
   * Check if user has accepted legal terms
   */
  async hasAcceptedTerms(): Promise<boolean> {
    try {
      // Serve immediately from memory if available
      if (this.inMemoryAccepted !== null) {
        return this.inMemoryAccepted;
      }

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return false;
      }

      const accepted = localStorage.getItem(LEGAL_ACCEPTANCE_KEY);
      const isAccepted = accepted === 'true';
      this.inMemoryAccepted = isAccepted;
      return isAccepted;
    } catch (error) {
      console.error('Error checking legal acceptance:', error);
      return false;
    }
  }

  /**
   * Mark that user has accepted legal terms
   */
  async acceptTerms(): Promise<void> {
    try {
      // Update memory first so the app can react instantly
      this.inMemoryAccepted = true;
      
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem(LEGAL_ACCEPTANCE_KEY, 'true');
      }
      
      console.log('✅ Legal terms accepted');
      this.notify();
    } catch (error) {
      console.error('Error accepting legal terms:', error);
      throw error;
    }
  }

  /**
   * Reset legal acceptance (for testing or if user wants to review again)
   */
  async resetAcceptance(): Promise<void> {
    try {
      this.inMemoryAccepted = false;
      
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LEGAL_ACCEPTANCE_KEY);
      }
      
      console.log('✅ Legal acceptance reset');
      this.notify();
    } catch (error) {
      console.error('Error resetting legal acceptance:', error);
      throw error;
    }
  }

  /** Subscribe to acceptance changes */
  subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notify() {
    this.subscribers.forEach(fn => fn());
  }
}

export const legalAcceptanceService = LegalAcceptanceService.getInstance();
