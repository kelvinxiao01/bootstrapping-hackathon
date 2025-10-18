export type EligibilityStatus = 'eligible' | 'ineligible' | 'needs_review' | 'pending';

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  medications: string[];
  testResults: {
    bloodPressure?: string;
    cholesterol?: string;
    glucose?: string;
    other?: Record<string, string>;
  };
  status: EligibilityStatus;
  score: number;
  email?: string;
  phone?: string;
  eligibilityCriteria: {
    ageRange: boolean;
    diagnosisMatch: boolean;
    noContraindications: boolean;
    labResultsNormal: boolean;
    informedConsent: boolean;
  };
  notes?: string;
  lastContact?: string;
  createdAt: string;
}

export interface PatientFilters {
  status?: EligibilityStatus;
  minScore?: number;
  searchQuery?: string;
}
