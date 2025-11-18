export interface SymptomData {
  id: string;
  name: string;
  icon?: string;
  optionalFields?: {
    type: 'temperature' | 'severity' | 'frequency' | 'duration' | 'fever';
    label: string;
    description: string;
    options?: string[];
    unit?: string;
    min?: number;
    max?: number;
  }[];
}

export interface MedicalTerm {
  term: string;
  definition: string;
}

export interface Citation {
  source: string;
  title: string;
  url: string;
  year: string;
}

export interface SymptomAnalysisResult {
  dailySummary: string;
  analysis: string;
  informationNotes: string[];
  severity: 'low' | 'moderate' | 'high';
  medicalConsultationSuggested: boolean;
  reasonForConsultation: string;
  selfCareTips: string[];
  estimatedRecoveryWindow: string;
  followUpQuestion: string;
  // Medical terms that need tooltips
  medicalTerms?: MedicalTerm[];
  // Citations for analysis, educational information, and self-care tips
  analysisCitations?: Citation[];
  educationalCitations?: Citation[][];
  selfCareCitations?: Citation[][];
  // Episode-specific fields
  trend?: 'improving' | 'stable' | 'worsening';
  dayNumber?: number;
  progressionSummary?: string;
  episodeTitle?: string; // AI-generated episode title
  symptomChanges?: {
    new: string[];
    resolved: string[];
    ongoing: string[];
    severityChanges?: Array<{
      symptom: string;
      change: 'increased' | 'decreased' | 'stable';
      details?: string;
    }>;
  };
  episodeInfo?: {
    isNewEpisode: boolean;
    message: string;
    episodeId: string;
  };
}

// Common symptoms (alphabetized) - displayed in 2 rows
export const COMMON_SYMPTOMS: SymptomData[] = [
  {
    id: 'body-aches',
    name: 'Body Aches',
    icon: 'MdFitnessCenter',
    optionalFields: [
      {
        type: 'severity',
        label: 'Ache Intensity',
        description: 'How intense are your body aches?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'cough',
    name: 'Cough',
    icon: 'MdAir',
    optionalFields: [
      {
        type: 'frequency',
        label: 'Cough Type',
        description: 'What kind of cough are you experiencing?',
        options: ['Dry', 'Wet', 'Persistent'],
      },
    ],
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    icon: 'MdBed',
    optionalFields: [
      {
        type: 'severity',
        label: 'Energy Level',
        description: 'How tired do you feel?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'fever',
    name: 'Fever',
    icon: 'MdThermostat',
    optionalFields: [
      {
        type: 'fever',
        label: 'Fever Details',
        description: 'How would you like to describe your fever?',
      },
    ],
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: 'MdHeadset',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Level',
        description: 'How would you rate the intensity?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'nausea',
    name: 'Nausea',
    icon: 'MdSick',
    optionalFields: [
      {
        type: 'severity',
        label: 'Nausea Intensity',
        description: 'How nauseous do you feel?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'runny-nose',
    name: 'Runny Nose',
    icon: 'MdWaterDrop',
    optionalFields: [
      {
        type: 'severity',
        label: 'Congestion Level',
        description: 'How congested do you feel?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'sore-throat',
    name: 'Sore Throat',
    icon: 'MdLocalHospital',
    optionalFields: [
      {
        type: 'severity',
        label: 'Throat Pain',
        description: 'How painful is your throat?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
];

// Uncommon symptoms (alphabetized)
export const UNCOMMON_SYMPTOMS: SymptomData[] = [
  {
    id: 'abdominal-cramps',
    name: 'Abdominal Cramps',
    icon: 'MdHealing',
    optionalFields: [
      {
        type: 'severity',
        label: 'Cramping Intensity',
        description: 'How severe are the cramps?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'back-pain',
    name: 'Back Pain',
    icon: 'MdAccessibilityNew',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Intensity',
        description: 'How intense is your back pain?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'chest-pain',
    name: 'Chest Pain',
    icon: 'MdFavoriteBorder',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Intensity',
        description: 'How intense is the chest pain?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'chills',
    name: 'Chills',
    icon: 'MdAcUnit',
    optionalFields: [
      {
        type: 'severity',
        label: 'Chill Intensity',
        description: 'How intense are your chills?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'confusion',
    name: 'Confusion',
    icon: 'MdPsychology',
    optionalFields: [
      {
        type: 'severity',
        label: 'Mental Clarity',
        description: 'How is your mental clarity?',
        options: ['Slight', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'constipation',
    name: 'Constipation',
    icon: 'MdWc',
    optionalFields: [
      {
        type: 'duration',
        label: 'Duration',
        description: 'How long has this been an issue?',
        options: ['1 day', '2-3 days', '4+ days'],
      },
    ],
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    icon: 'MdWarning',
    optionalFields: [
      {
        type: 'frequency',
        label: 'Frequency',
        description: 'How often are you experiencing this?',
        options: ['Occasional', 'Frequent', 'Very frequent'],
      },
    ],
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    icon: 'MdRotateRight',
    optionalFields: [
      {
        type: 'severity',
        label: 'Dizziness Level',
        description: 'How dizzy do you feel?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'earache',
    name: 'Earache',
    icon: 'MdHearing',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Level',
        description: 'How painful is your ear?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'joint-pain',
    name: 'Joint Pain',
    icon: 'MdSelfImprovement',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Intensity',
        description: 'How intense is the joint pain?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'loss-of-appetite',
    name: 'Loss of Appetite',
    icon: 'MdRestaurant',
    optionalFields: [
      {
        type: 'severity',
        label: 'Appetite Level',
        description: 'How is your appetite?',
        options: ['Slightly reduced', 'Moderately reduced', 'No appetite'],
      },
    ],
  },
  {
    id: 'loss-of-smell',
    name: 'Loss of Smell',
    icon: 'MdAirlineSeatIndividualSuite',
    optionalFields: [
      {
        type: 'severity',
        label: 'Smell Loss',
        description: 'How much smell have you lost?',
        options: ['Partial', 'Significant', 'Complete'],
      },
    ],
  },
  {
    id: 'loss-of-taste',
    name: 'Loss of Taste',
    icon: 'MdOutlineEmojiFoodBeverage',
    optionalFields: [
      {
        type: 'severity',
        label: 'Taste Loss',
        description: 'How much taste have you lost?',
        options: ['Partial', 'Significant', 'Complete'],
      },
    ],
  },
  {
    id: 'muscle-weakness',
    name: 'Muscle Weakness',
    icon: 'MdDirectionsRun',
    optionalFields: [
      {
        type: 'severity',
        label: 'Weakness Level',
        description: 'How weak do you feel?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'rash',
    name: 'Rash',
    icon: 'MdError',
    optionalFields: [
      {
        type: 'severity',
        label: 'Rash Appearance',
        description: 'How would you describe the rash?',
        options: ['Minor spots', 'Widespread', 'Severe/painful'],
      },
    ],
  },
  {
    id: 'shortness-of-breath',
    name: 'Shortness of Breath',
    icon: 'MdLungs',
    optionalFields: [
      {
        type: 'severity',
        label: 'Breathing Difficulty',
        description: 'How difficult is it to breathe?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'stomach-pain',
    name: 'Stomach Pain',
    icon: 'MdMonitorHeart',
    optionalFields: [
      {
        type: 'severity',
        label: 'Pain Intensity',
        description: 'How intense is the stomach pain?',
        options: ['Mild', 'Moderate', 'Severe'],
      },
    ],
  },
  {
    id: 'sweating',
    name: 'Excessive Sweating',
    icon: 'MdOpacity',
    optionalFields: [
      {
        type: 'severity',
        label: 'Sweating Level',
        description: 'How much are you sweating?',
        options: ['Light', 'Moderate', 'Heavy'],
      },
    ],
  },
  {
    id: 'swollen-lymph-nodes',
    name: 'Swollen Lymph Nodes',
    icon: 'MdCircle',
    optionalFields: [
      {
        type: 'severity',
        label: 'Swelling Level',
        description: 'How swollen are your lymph nodes?',
        options: ['Slightly swollen', 'Moderately swollen', 'Very swollen'],
      },
    ],
  },
  {
    id: 'vomiting',
    name: 'Vomiting',
    icon: 'MdSentimentVeryDissatisfied',
    optionalFields: [
      {
        type: 'frequency',
        label: 'Frequency',
        description: 'How often are you vomiting?',
        options: ['Once', 'A few times', 'Frequently'],
      },
    ],
  },
];
