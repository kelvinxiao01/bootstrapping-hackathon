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
  patient_id: string;
  name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  age_years?: number;
  sex_at_birth?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  sbp?: number;
  dbp?: number;
  smoking_status?: string;
  pack_years?: number;
  diabetes_dx?: string;
  diabetes_type?: string;
  a1c_pct_recent?: number;
  a1c_date?: string;
  ckd_stage?: string;
  egfr_ml_min_1_73m2_recent?: number;
  egfr_date?: string;
  alt_u_l?: number;
  ast_u_l?: number;
  bilirubin_mg_dl?: number;
  mi_history?: string;
  stroke_tia_history?: string;
  pad_history?: string;
  hf_history?: string;
  lvef_pct?: number;
  lvef_date?: string;
  nyha_class?: string;
  statin_current?: string;
  anticoagulant_current?: string;
  sglt2_current?: string;
  glp1_current?: string;
  insulin_current?: string;
  ntprobnp_pg_ml?: number;
  troponin_ng_l?: number;
  active_cancer?: string;
  cancer_primary_site?: string;
  cancer_stage?: string;
  treatment_status?: string;
  last_treatment_type?: string;
  last_treatment_date?: string;
  ecog_status?: number;
  has_measurable_disease_recist?: string;
  anc_10e9_l?: number;
  hemoglobin_g_dl?: number;
  platelets_10e9_l?: number;
  qtc_ms_recent?: number;
  pregnancy_status?: string;
  qualified_disease?: string;
  last_contacted?: string;
  status?: string;

  [key: string]: any;
}
