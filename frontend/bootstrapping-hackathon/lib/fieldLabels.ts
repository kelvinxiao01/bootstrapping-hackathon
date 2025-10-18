export function formatFieldLabel(fieldName: string): string {
  const overrides: Record<string, string> = {
    'egfr_ml_min_1_73m2_recent': 'Recent eGFR (mL/min/1.73m²)',
    'ntprobnp_pg_ml': 'NT-proBNP (pg/mL)',
    'anc_10e9_l': 'ANC (×10⁹/L)',
    'platelets_10e9_l': 'Platelets (×10⁹/L)',
    'qtc_ms_recent': 'Recent QTc (ms)',
    'a1c_pct_recent': 'Recent A1C (%)',
    'lvef_pct': 'LVEF (%)',
    'bmi': 'BMI',
    'dob': 'Date of Birth',
    'mi_history': 'MI History',
    'pad_history': 'PAD History',
    'hf_history': 'HF History',
    'ckd_stage': 'CKD Stage',
    'iga_score': 'IGA Score',
    'nyha_class': 'NYHA Class',
    'ldl_mg_dl': 'LDL (mg/dL)',
    'hdl_mg_dl': 'HDL (mg/dL)',
    'triglycerides_mg_dl': 'Triglycerides (mg/dL)',
    'systolic_bp': 'Systolic BP',
    'diastolic_bp': 'Diastolic BP',
  };

  if (overrides[fieldName.toLowerCase()]) {
    return overrides[fieldName.toLowerCase()];
  }

  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
