import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    
    dateOfBirth: '1978-03-15',
    age: 46,
    sexAtBirth: 'Female',
    heightCm: 165,
    weightKg: 72,
    bmi: 26.4,
    
    systolicBP: 128,
    diastolicBP: 82,
    
    smokingStatus: 'Never',
    packYears: 0,
    
    diabetesDiagnosis: true,
    diabetesType: 'Type 2',
    recentA1C: 7.8,
    a1cDate: '2024-10-01',
    
    ckdStage: 'Stage 2',
    recentEGFR: 75,
    egfrDate: '2024-10-01',
    
    alt: 28,
    ast: 24,
    bilirubin: 0.8,
    
    miHistory: false,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    lvef: 60,
    lvefDate: '2024-09-15',
    
    onStatin: true,
    onAnticoagulant: false,
    onSGLT2: false,
    onGLP1: false,
    onInsulin: false,
    medications: ['Metformin', 'Lisinopril', 'Atorvastatin'],
    
    ldlCholesterol: 105,
    hdlCholesterol: 52,
    triglycerides: 148,
    
    eczemaHistory: false,
    
    activeCancer: false,
    
    pregnancyStatus: 'Not Pregnant',
    
    qualifiedCondition: 'Type 2 Diabetes',
    eligibility: {
      topCategory: 'Diabetes Trials',
      score: 92,
      label: 'Eligible',
      reasons: ['A1C 7.8% within target range', 'eGFR >60 mL/min', 'No cardiovascular complications']
    },
    
    currentStatus: 'Contacted',
    lastContactedDate: '2024-10-15',
    notes: 'Highly motivated patient, expressed strong interest in trial participation.',
    createdAt: '2024-10-01',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '(555) 234-5678',
    
    dateOfBirth: '1958-07-22',
    age: 66,
    sexAtBirth: 'Male',
    heightCm: 178,
    weightKg: 88,
    bmi: 27.8,
    
    systolicBP: 138,
    diastolicBP: 86,
    
    smokingStatus: 'Former',
    packYears: 15,
    
    diabetesDiagnosis: false,
    
    ckdStage: 'None',
    recentEGFR: 88,
    egfrDate: '2024-09-25',
    
    alt: 32,
    ast: 28,
    bilirubin: 0.9,
    
    miHistory: true,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    lvef: 55,
    lvefDate: '2024-09-20',
    nyhaClass: 'I',
    
    onStatin: true,
    onAnticoagulant: true,
    onSGLT2: false,
    onGLP1: false,
    onInsulin: false,
    medications: ['Amlodipine', 'Atorvastatin', 'Aspirin', 'Metoprolol'],
    
    ntProBNP: 185,
    troponin: 0.02,
    ldlCholesterol: 92,
    hdlCholesterol: 48,
    triglycerides: 165,
    
    eczemaHistory: false,
    
    activeCancer: false,
    
    pregnancyStatus: 'Not Applicable',
    
    qualifiedCondition: 'Cardiovascular Disease',
    eligibility: {
      topCategory: 'Cardiovascular Trials',
      score: 85,
      label: 'Eligible',
      reasons: ['History of MI', 'Stable EF and controlled BP', 'On optimal medical therapy']
    },
    
    currentStatus: 'Interested',
    lastContactedDate: '2024-10-16',
    notes: 'BP slightly elevated, scheduled for follow-up assessment.',
    createdAt: '2024-10-03',
  },
  {
    id: '3',
    name: 'Patricia Williams',
    email: 'p.williams@email.com',
    phone: '(555) 345-6789',
    
    dateOfBirth: '1954-11-08',
    age: 69,
    sexAtBirth: 'Female',
    heightCm: 162,
    weightKg: 68,
    bmi: 25.9,
    
    systolicBP: 142,
    diastolicBP: 88,
    
    smokingStatus: 'Never',
    packYears: 0,
    
    diabetesDiagnosis: true,
    diabetesType: 'Type 2',
    recentA1C: 7.2,
    a1cDate: '2024-09-28',
    
    ckdStage: 'Stage 3a',
    recentEGFR: 52,
    egfrDate: '2024-09-28',
    
    alt: 24,
    ast: 22,
    bilirubin: 0.7,
    
    miHistory: false,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    
    onStatin: true,
    onAnticoagulant: false,
    onSGLT2: true,
    onGLP1: false,
    onInsulin: false,
    medications: ['Metformin', 'Empagliflozin', 'Lisinopril', 'Simvastatin'],
    
    ldlCholesterol: 98,
    hdlCholesterol: 58,
    triglycerides: 132,
    
    eczemaHistory: false,
    
    activeCancer: false,
    
    pregnancyStatus: 'Not Pregnant',
    
    qualifiedCondition: 'Chronic Kidney Disease',
    eligibility: {
      topCategory: 'Chronic Kidney Disease Trials',
      score: 88,
      label: 'Eligible',
      reasons: ['CKD Stage 3a confirmed', 'eGFR 52 mL/min stable', 'On SGLT2 inhibitor']
    },
    
    currentStatus: 'Pending',
    lastContactedDate: undefined,
    notes: 'Initial screening complete, awaiting coordinator review.',
    createdAt: '2024-10-05',
  },
  {
    id: '4',
    name: 'James Martinez',
    email: 'j.martinez@email.com',
    phone: '(555) 456-7890',
    
    dateOfBirth: '1989-05-19',
    age: 35,
    sexAtBirth: 'Male',
    heightCm: 183,
    weightKg: 79,
    bmi: 23.6,
    
    systolicBP: 118,
    diastolicBP: 76,
    
    smokingStatus: 'Never',
    packYears: 0,
    
    diabetesDiagnosis: false,
    
    ckdStage: 'None',
    
    alt: 26,
    ast: 24,
    bilirubin: 0.6,
    
    miHistory: false,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    
    onStatin: false,
    onAnticoagulant: false,
    onSGLT2: false,
    onGLP1: false,
    onInsulin: false,
    medications: ['Dupilumab', 'Triamcinolone cream'],
    
    ldlCholesterol: 112,
    hdlCholesterol: 62,
    triglycerides: 88,
    
    eczemaHistory: true,
    eczemaIgaScore: 3,
    
    activeCancer: false,
    
    pregnancyStatus: 'Not Applicable',
    
    qualifiedCondition: 'Moderate Atopic Dermatitis',
    eligibility: {
      topCategory: 'Eczema / Dermatology Trials',
      score: 90,
      label: 'Eligible',
      reasons: ['IGA score 3 (moderate)', 'On current biologic therapy', 'No contraindications']
    },
    
    currentStatus: 'Contacted',
    lastContactedDate: '2024-10-17',
    notes: 'Excellent candidate for dermatology trial, currently on Dupilumab.',
    createdAt: '2024-10-08',
  },
  {
    id: '5',
    name: 'Linda Thompson',
    email: 'l.thompson@email.com',
    phone: '(555) 567-8901',
    
    dateOfBirth: '1967-12-03',
    age: 56,
    sexAtBirth: 'Female',
    heightCm: 168,
    weightKg: 62,
    bmi: 22.0,
    
    systolicBP: 125,
    diastolicBP: 78,
    
    smokingStatus: 'Former',
    packYears: 8,
    
    diabetesDiagnosis: false,
    
    ckdStage: 'None',
    recentEGFR: 92,
    egfrDate: '2024-10-10',
    
    alt: 28,
    ast: 26,
    bilirubin: 0.8,
    
    miHistory: false,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    
    onStatin: false,
    onAnticoagulant: false,
    onSGLT2: false,
    onGLP1: false,
    onInsulin: false,
    medications: ['Tamoxifen', 'Ondansetron'],
    
    ldlCholesterol: 118,
    hdlCholesterol: 68,
    triglycerides: 95,
    
    eczemaHistory: false,
    
    activeCancer: true,
    primaryCancerSite: 'Breast',
    cancerStage: 'Stage IIA',
    cancerTreatmentStatus: 'Active',
    
    pregnancyStatus: 'Not Pregnant',
    
    qualifiedCondition: 'Breast Cancer',
    eligibility: {
      topCategory: 'Oncology Trials',
      score: 78,
      label: 'Needs Info',
      reasons: ['Stage IIA breast cancer confirmed', 'Currently on hormonal therapy', 'Need recent imaging results']
    },
    
    currentStatus: 'Interested',
    lastContactedDate: '2024-10-18',
    notes: 'Active treatment, awaiting oncologist clearance for trial participation.',
    createdAt: '2024-10-10',
  },
  {
    id: '6',
    name: 'Robert Davis',
    email: 'r.davis@email.com',
    phone: '(555) 678-9012',
    
    dateOfBirth: '1971-09-14',
    age: 53,
    sexAtBirth: 'Male',
    heightCm: 175,
    weightKg: 102,
    bmi: 33.3,
    
    systolicBP: 135,
    diastolicBP: 88,
    
    smokingStatus: 'Current',
    packYears: 25,
    
    diabetesDiagnosis: true,
    diabetesType: 'Type 2',
    recentA1C: 8.2,
    a1cDate: '2024-10-08',
    
    ckdStage: 'Stage 1',
    recentEGFR: 94,
    egfrDate: '2024-10-08',
    
    alt: 42,
    ast: 38,
    bilirubin: 1.1,
    
    miHistory: false,
    strokeTiaHistory: false,
    padHistory: false,
    heartFailureHistory: false,
    
    onStatin: true,
    onAnticoagulant: false,
    onSGLT2: false,
    onGLP1: true,
    onInsulin: false,
    medications: ['Metformin', 'Semaglutide', 'Atorvastatin', 'Lisinopril'],
    
    ldlCholesterol: 128,
    hdlCholesterol: 38,
    triglycerides: 245,
    
    eczemaHistory: false,
    
    activeCancer: false,
    
    pregnancyStatus: 'Not Applicable',
    
    qualifiedCondition: 'Obesity with Type 2 Diabetes',
    eligibility: {
      topCategory: 'Metabolic / Obesity Trials',
      score: 82,
      label: 'Eligible',
      reasons: ['BMI 33.3 qualifies for metabolic trial', 'Type 2 diabetes with elevated A1C', 'On GLP-1 therapy']
    },
    
    currentStatus: 'Contacted',
    lastContactedDate: '2024-10-16',
    notes: 'Good candidate for metabolic/obesity trial. Encourage smoking cessation.',
    createdAt: '2024-10-07',
  },
];

export function generateRandomScore(): number {
  return Math.floor(Math.random() * 50) + 50;
}
