export interface Episode {
  id: string;
  deviceId: string;
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format, null if ongoing
  title?: string; // AI-generated episode title
  symptoms: string[]; // Array of symptom names from the first entry
  severity?: 'low' | 'moderate' | 'high';
  notes?: string;
  status: 'active' | 'resolved' | 'archived';
  entryCount: number; // Number of symptom entries in this episode
  aiSummary?: string; // AI-generated episode summary
  createdAt: string;
  updatedAt: string;
}

export interface MedicalTerm {
  term: string;
  definition: string;
}

export interface Citation {
  title: string;
  url: string;
  description: string;
}

export interface SymptomEntry {
  id: string;
  episodeId: string;
  date: string; // YYYY-MM-DD format
  symptoms: string[];
  notes?: string;
  severity?: 'low' | 'moderate' | 'high';
  aiAnalysis?: {
    dailySummary: string;
    analysis: string;
    informationNotes: string[];
    severity: 'low' | 'moderate' | 'high';
    trend?: 'improving' | 'stable' | 'worsening';
    medicalConsultationSuggested: boolean;
    reasonForConsultation: string;
    selfCareTips: string[];
    estimatedRecoveryWindow: string;
    followUpQuestion: string;
    medicalTerms?: MedicalTerm[];
    citations?: Citation[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpisodeParams {
  deviceId: string;
  startDate: string;
  symptoms: string[];
  severity?: 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface CreateSymptomEntryParams {
  episodeId: string;
  date: string;
  symptoms: string[];
  notes?: string;
  severity?: 'low' | 'moderate' | 'high';
  aiAnalysis?: SymptomEntry['aiAnalysis'];
}

export interface EpisodeDeterminationParams {
  deviceId: string;
  entryDate: string;
  symptoms: string[];
  dayThreshold?: number;
}

export interface EpisodeCreationResult {
  episode: Episode;
  isNewEpisode: boolean;
  message: string;
  needsReanalysis?: boolean;
}

export interface EpisodeProgressionAnalysis {
  trend: 'improving' | 'stable' | 'worsening';
  symptomChanges: {
    new: string[];
    resolved: string[];
    ongoing: string[];
    severityChanges: Array<{
      symptom: string;
      change: 'increased' | 'decreased' | 'stable';
      details?: string;
    }>;
  };
  dayNumber: number;
  progressionSummary: string;
  previousEntries: SymptomEntry[];
}
