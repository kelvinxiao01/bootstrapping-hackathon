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
  label: 'Eligible' | 'Needs Info' | 'Ineligible';
  reasons: string[];
}

interface CategoryScore {
  category: TrialCategory;
  score: number;
  reasons: string[];
  missingRequired: boolean;
}

export function calculateLocalEligibility(patient: any): EligibilityResult {
  const categoryScores: CategoryScore[] = [];

  // 1. Diabetes Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.diabetes_dx === 'Y' || patient.diabetes_type) {
      score += 30;
      reasons.push('Diabetes diagnosis present');
    }

    if (patient.a1c_pct_recent !== null && patient.a1c_pct_recent !== undefined) {
      if (patient.a1c_pct_recent >= 7.0 && patient.a1c_pct_recent <= 10.0) {
        score += 20;
        reasons.push(`A1C ${patient.a1c_pct_recent}% within target range`);
      } else {
        score += 10;
        reasons.push(`A1C ${patient.a1c_pct_recent}% outside preferred range`);
      }
    } else if (patient.diabetes_dx === 'Y') {
      missingRequired = true;
      reasons.push('A1C data needed');
    }

    if (patient.egfr_ml_min_1_73m2_recent !== null && patient.egfr_ml_min_1_73m2_recent !== undefined) {
      if (patient.egfr_ml_min_1_73m2_recent >= 45) {
        score += 10;
        reasons.push('eGFR adequate');
      } else {
        score -= 10;
        reasons.push('eGFR below threshold');
      }
    }

    if (patient.pregnancy_status && patient.pregnancy_status.toLowerCase().includes('pregnant')) {
      score -= 15;
      reasons.push('Pregnancy exclusion');
    }

    if (patient.active_cancer === 'Y') {
      score -= 20;
      reasons.push('Active cancer exclusion');
    }

    categoryScores.push({
      category: 'Diabetes Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 2. Cardiovascular Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.mi_history === 'Y' || patient.stroke_tia_history === 'Y' || patient.pad_history === 'Y') {
      score += 25;
      const conditions = [];
      if (patient.mi_history === 'Y') conditions.push('MI');
      if (patient.stroke_tia_history === 'Y') conditions.push('stroke/TIA');
      if (patient.pad_history === 'Y') conditions.push('PAD');
      reasons.push(`Cardiovascular history: ${conditions.join(', ')}`);
    }

    if (patient.hf_history === 'Y') {
      score += 15;
      reasons.push('Heart failure history');
    }

    if (patient.lvef_pct !== null && patient.lvef_pct !== undefined) {
      score += 10;
      if (patient.lvef_pct >= 50) {
        score += 10;
        reasons.push('LVEF preserved');
      } else {
        reasons.push('LVEF reduced');
      }
    }

    if (patient.statin_current === 'Y') {
      score += 10;
      reasons.push('On statin therapy');
    }

    if (patient.active_cancer === 'Y') {
      score -= 15;
      reasons.push('Active cancer exclusion');
    }

    categoryScores.push({
      category: 'Cardiovascular Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 3. Chronic Kidney Disease Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.ckd_stage !== null && patient.ckd_stage !== undefined) {
      if ([2, 3].includes(Number(patient.ckd_stage))) {
        score += 25;
        reasons.push(`CKD Stage ${patient.ckd_stage}`);
      }
    }

    if (patient.egfr_ml_min_1_73m2_recent !== null && patient.egfr_ml_min_1_73m2_recent !== undefined) {
      if (patient.egfr_ml_min_1_73m2_recent >= 30 && patient.egfr_ml_min_1_73m2_recent <= 89) {
        score += 20;
        reasons.push(`eGFR ${patient.egfr_ml_min_1_73m2_recent} in CKD range`);
      } else {
        score += 10;
        reasons.push(`eGFR ${patient.egfr_ml_min_1_73m2_recent} present`);
      }
    } else if (patient.ckd_stage) {
      missingRequired = true;
      reasons.push('eGFR data needed');
    }

    if (patient.pregnancy_status && patient.pregnancy_status.toLowerCase().includes('pregnant')) {
      score -= 15;
      reasons.push('Pregnancy exclusion');
    }

    categoryScores.push({
      category: 'Chronic Kidney Disease Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 4. Eczema/Dermatology Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    const condition = patient.qualified_condition || patient.qualified_disease || '';
    if (condition.toLowerCase().includes('eczema') || condition.toLowerCase().includes('dermatology')) {
      score += 30;
      reasons.push('Dermatology condition present');
    }

    if (patient.eczema_history === 'Y') {
      score += 20;
      reasons.push('Eczema history documented');
    }

    if (!patient.pregnancy_status?.toLowerCase().includes('pregnant') && patient.active_cancer !== 'Y') {
      score += 10;
      reasons.push('No major exclusions');
    }

    categoryScores.push({
      category: 'Eczema/Dermatology Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 5. Oncology Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.active_cancer === 'Y') {
      score += 25;
      reasons.push('Active cancer diagnosis');
    }

    if (patient.cancer_primary_site && patient.cancer_stage) {
      score += 10;
      reasons.push(`${patient.cancer_primary_site} cancer, Stage ${patient.cancer_stage}`);
    }

    if (patient.treatment_status) {
      score += 10;
      reasons.push(`Treatment status: ${patient.treatment_status}`);
    }

    categoryScores.push({
      category: 'Oncology Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 6. Women's Health Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.pregnancy_status) {
      score += 20;
      reasons.push('Pregnancy status documented');
    }

    if (patient.sex === 'F' || patient.sex === 'Female') {
      score += 10;
      reasons.push('Female patient');
    }

    if (patient.hf_history === 'Y' && patient.nyha_class >= 3) {
      score -= 20;
      reasons.push('Severe heart failure exclusion');
    }

    categoryScores.push({
      category: "Women's Health Trials",
      score,
      reasons,
      missingRequired,
    });
  }

  // 7. Metabolic/Obesity Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.bmi !== null && patient.bmi !== undefined) {
      if (patient.bmi >= 30) {
        score += 25;
        reasons.push(`BMI ${patient.bmi} (obese)`);
      } else if (patient.bmi >= 27) {
        score += 10;
        reasons.push(`BMI ${patient.bmi} (overweight)`);
      }
    }

    if (patient.a1c_pct_recent || patient.statin_current === 'Y') {
      score += 10;
      reasons.push('Metabolic markers present');
    }

    categoryScores.push({
      category: 'Metabolic/Obesity Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 8. Neurology Trials
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.stroke_tia_history === 'Y') {
      score += 25;
      reasons.push('Stroke/TIA history');
    }

    if (patient.systolic_bp || patient.diastolic_bp) {
      score += 10;
      reasons.push('Vascular risk markers present');
    }

    categoryScores.push({
      category: 'Neurology Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // 9. Preventive Health Trials (fallback)
  {
    let score = 0;
    const reasons: string[] = [];
    let missingRequired = false;

    if (patient.systolic_bp || patient.diastolic_bp || patient.bmi) {
      score += 10;
      reasons.push('Basic vitals available');
    }

    if (patient.active_cancer !== 'Y' && !patient.pregnancy_status?.toLowerCase().includes('pregnant')) {
      score += 10;
      reasons.push('No major exclusions');
    }

    categoryScores.push({
      category: 'General Preventive Health Trials',
      score,
      reasons,
      missingRequired,
    });
  }

  // Determine winner with tiebreaker priority
  const priorityOrder: TrialCategory[] = [
    'Oncology Trials',
    'Diabetes Trials',
    'Chronic Kidney Disease Trials',
    'Cardiovascular Trials',
    'Eczema/Dermatology Trials',
    'Metabolic/Obesity Trials',
    'Neurology Trials',
    "Women's Health Trials",
    'General Preventive Health Trials',
  ];

  categoryScores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return priorityOrder.indexOf(a.category) - priorityOrder.indexOf(b.category);
  });

  const winner = categoryScores[0];
  let finalScore = Math.max(0, Math.min(100, winner.score));
  let label: 'Eligible' | 'Needs Info' | 'Ineligible';

  if (winner.missingRequired || (finalScore >= 50 && finalScore < 80)) {
    label = 'Needs Info';
  } else if (finalScore >= 80) {
    label = 'Eligible';
  } else {
    label = 'Ineligible';
  }

  return {
    topCategory: winner.category,
    score: finalScore,
    label,
    reasons: winner.reasons,
  };
}
