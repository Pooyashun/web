/** Shared types for the quiz, the result engine and the lead form. */

export type AnswerId = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  id: AnswerId;
  label: string;
  /** Weights contributed to the shared trait space used by the result engine. */
  weights: Partial<Record<TraitKey, number>>;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

/** Map of questionId -> selected optionId. */
export type QuizAnswers = Record<number, AnswerId>;

/**
 * The single shared trait space. Questions feed traits, and every result
 * dimension (category, environment, purpose, ...) is a weighted profile over
 * these traits. Adding a question or tweaking a category means editing data
 * only — no logic changes.
 */
export type TraitKey =
  | 'calm'
  | 'permanent'
  | 'leisure'
  | 'investment'
  | 'build'
  | 'nature'
  | 'cityAccess'
  | 'village'
  | 'sea'
  | 'budget'
  | 'growth'
  | 'access'
  | 'advisory'
  | 'specificArea'
  | 'opportunity'
  | 'undecided';

export type TraitScores = Record<TraitKey, number>;

export type CategoryKey =
  | 'peace'
  | 'gardenHouse'
  | 'leisureVilla'
  | 'buildLand'
  | 'investment'
  | 'valueBuy';

export type EnvironmentKey = 'greenRural' | 'cityEdge' | 'seaTourism' | 'calmAccess';

export type PurposeKey = 'living' | 'leisure' | 'investment' | 'development';
export type PropertyTypeKey = 'gardenHouse' | 'land' | 'villa' | 'investLand';
export type PriorityKey = 'peace' | 'budget' | 'growth' | 'access';
export type StyleKey = 'advisory' | 'specificArea' | 'opportunity' | 'undecided';

export interface QuizResult {
  category: CategoryKey;
  categoryLabel: string;
  environment: EnvironmentKey;
  environmentLabel: string;
  headline: string;
  summary: string;
  purposeLabel: string;
  propertyTypeLabel: string;
  priorityLabel: string;
  styleLabel: string;
  recommendedTypes: string[];
  checklist: string[];
  locationHint: string;
  /** Key into the curated image set, chosen from the preferred environment. */
  imageKey: string;
}

export interface QuizAnswerDetail {
  questionId: number;
  question: string;
  answerId: AnswerId;
  answerLabel: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface LeadFormValues {
  fullName: string;
  phone: string;
  budget: string;
  budgetCustomMin: string;
  budgetCustomMax: string;
  city: string;
  propertyType: string;
  purpose: string;
  documentStatus: string;
  timeframe: string;
  notes: string;
}

export interface LeadPayload {
  submissionId: string;
  submittedAt: string;
  contact: { fullName: string; phone: string };
  form: Record<string, string>;
  quiz: {
    answers: QuizAnswerDetail[];
    result: {
      category: CategoryKey;
      categoryLabel: string;
      environment: EnvironmentKey;
      environmentLabel: string;
      headline: string;
      summary: string;
    };
  };
}
