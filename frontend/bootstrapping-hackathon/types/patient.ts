export type TrialCategory = 
  | 'Diabetes Trials'
  | 'Cardiovascular Trials'
  | 'Chronic Kidney Disease Trials'
  | 'Eczema/Dermatology Trials'
  | 'Oncology Trials'
  | "Women's Health Trials"
  | 'Metabolic/Obesity Trials'
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
  
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  
  dob?: string;
  age?: number;
  sex?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  
  systolic_bp?: number;
  diastolic_bp?: number;
  
  smoking_status?: string;
  pack_years?: number;
  
  diabetes_dx?: string;
  diabetes_type?: string;
  a1c_pct_recent?: number;
  
  ckd_stage?: number | string;
  egfr_ml_min_1_73m2_recent?: number;
  
  alt?: number;
  ast?: number;
  bilirubin?: number;
  
  mi_history?: string;
  stroke_tia_history?: string;
  pad_history?: string;
  hf_history?: string;
  lvef_pct?: number;
  nyha_class?: number | string;
  
  statin_current?: string;
  anticoagulant_current?: string;
  sglt2_current?: string;
  glp1_current?: string;
  insulin_current?: string;
  medication_list?: string;
  
  ntprobnp_pg_ml?: number;
  troponin?: number;
  ldl_mg_dl?: number;
  hdl_mg_dl?: number;
  triglycerides_mg_dl?: number;
  
  eczema_history?: string;
  iga_score?: number;
  
  active_cancer?: string;
  cancer_primary_site?: string;
  cancer_stage?: string;
  treatment_status?: string;
  
  pregnancy_status?: string;
  
  qualified_condition?: string;
  qualified_disease?: string;
  top_category?: string;
  eligibility_score?: number;
  eligibility_label?: string;
  
  status?: string;
  last_contacted?: string;
  notes?: string;
  created_at?: string;

  [key: string]: any;
}
