export type EligibilityStatus = 'eligible' | 'ineligible' | 'needs_review' | 'pending';

export type TrialCategory = 
  | 'Diabetes Trials'
  | 'Cardiovascular Trials'
  | 'Chronic Kidney Disease Trials'
  | 'Eczema / Dermatology Trials'
  | 'Oncology Trials'
  | "Women's Health Trials"
  | 'Metabolic / Obesity Trials'
  | 'Neurology Trials'
  | 'General Preventive Health Trials';

export interface EligibilityResult {
  topCategory: TrialCategory;
  score: number;
  label: 'Eligible' | 'Ineligible' | 'Needs Info';
  reasons: string[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  
  // Demographics
  dateOfBirth: string;
  age: number;
  sexAtBirth: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  bmi: number;
  
  // Vitals
  systolicBP: number;
  diastolicBP: number;
  
  // Lifestyle
  smokingStatus: 'Never' | 'Former' | 'Current';
  packYears?: number;
  
  // Diabetes
  diabetesDiagnosis: boolean;
  diabetesType?: 'Type 1' | 'Type 2' | 'Prediabetes';
  recentA1C?: number;
  a1cDate?: string;
  
  // Kidney
  ckdStage?: 'Stage 1' | 'Stage 2' | 'Stage 3a' | 'Stage 3b' | 'Stage 4' | 'Stage 5' | 'None';
  recentEGFR?: number;
  egfrDate?: string;
  
  // Liver
  alt?: number;
  ast?: number;
  bilirubin?: number;
  
  // Cardiovascular
  miHistory: boolean;
  strokeTiaHistory: boolean;
  padHistory: boolean;
  heartFailureHistory: boolean;
  lvef?: number;
  lvefDate?: string;
  nyhaClass?: 'I' | 'II' | 'III' | 'IV';
  
  // Medications
  onStatin: boolean;
  onAnticoagulant: boolean;
  onSGLT2: boolean;
  onGLP1: boolean;
  onInsulin: boolean;
  medications: string[];
  
  // Biomarkers
  ntProBNP?: number;
  troponin?: number;
  ldlCholesterol?: number;
  hdlCholesterol?: number;
  triglycerides?: number;
  
  // Dermatology
  eczemaHistory: boolean;
  eczemaIgaScore?: number;
  
  // Oncology
  activeCancer: boolean;
  primaryCancerSite?: string;
  cancerStage?: string;
  cancerTreatmentStatus?: 'Active' | 'Complete' | 'Not Treated';
  
  // Women's Health
  pregnancyStatus?: 'Pregnant' | 'Not Pregnant' | 'Not Applicable';
  
  // Trial matching
  qualifiedCondition: string;
  eligibility: EligibilityResult;
  
  // Status tracking
  currentStatus: 'Pending' | 'Contacted' | 'Interested' | 'Onboard';
  lastContactedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface PatientFilters {
  status?: EligibilityStatus;
  currentStatus?: Patient['currentStatus'];
  condition?: string;
  minScore?: number;
  searchQuery?: string;
}
