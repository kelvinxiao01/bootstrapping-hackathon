'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockPatients } from '@/lib/mockData';
import { Patient } from '@/types/patient';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const patient = mockPatients.find(p => p.id === id);
  const [localPatient, setLocalPatient] = useState<Patient | undefined>(patient);

  if (!localPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Patient Not Found</h2>
          <p className="text-[var(--muted)] mb-4">The patient you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover-lift smooth-transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStartCall = () => {
    alert(`Initiating call to ${localPatient.name}...`);
  };

  const handleUpdateStatus = (newStatus: Patient['currentStatus']) => {
    setLocalPatient({ ...localPatient, currentStatus: newStatus });
  };

  const handleRequestFollowup = () => {
    alert('Follow-up request sent');
  };

  const scoreColor = (score: number): string => {
    if (score >= 80) return 'text-[var(--success)]';
    if (score >= 60) return 'text-[var(--warning)]';
    return 'text-[var(--error)]';
  };

  const labelColor = (label: string): string => {
    if (label === 'Eligible') return 'text-[var(--success)] bg-green-50/80';
    if (label === 'Ineligible') return 'text-[var(--error)] bg-red-50/80';
    return 'text-[var(--warning)] bg-amber-50/80';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#EEF1F6]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-[var(--muted)] hover:text-[var(--foreground)] smooth-transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{localPatient.name}</h1>
          <p className="text-[var(--muted)]">{localPatient.email} • {localPatient.phone}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Qualified Condition</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{localPatient.qualifiedCondition}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Top Matched Trial</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{localPatient.eligibility.topCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Age / Sex</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{localPatient.age} years / {localPatient.sexAtBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">BMI</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{localPatient.bmi}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Eligibility Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)] mb-1">Category</p>
                    <p className="text-lg font-semibold text-[var(--foreground)]">{localPatient.eligibility.topCategory}</p>
                  </div>
                  <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-medium ${labelColor(localPatient.eligibility.label)}`}>
                    {localPatient.eligibility.label}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Eligibility Score</p>
                  <p className={`text-3xl font-bold ${scoreColor(localPatient.eligibility.score)}`}>
                    {localPatient.eligibility.score}/100
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-2">Key Criteria</p>
                  <ul className="space-y-2">
                    {localPatient.eligibility.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-[var(--success)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-[var(--foreground)]">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Clinical Data</h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <DataRow label="Date of Birth" value={new Date(localPatient.dateOfBirth).toLocaleDateString()} />
                <DataRow label="Age" value={`${localPatient.age} years`} />
                <DataRow label="Sex at Birth" value={localPatient.sexAtBirth} />
                <DataRow label="Height (cm)" value={localPatient.heightCm} />
                <DataRow label="Weight (kg)" value={localPatient.weightKg} />
                <DataRow label="BMI" value={localPatient.bmi} />
                <DataRow label="Systolic BP" value={`${localPatient.systolicBP} mmHg`} />
                <DataRow label="Diastolic BP" value={`${localPatient.diastolicBP} mmHg`} />
                <DataRow label="Smoking Status" value={localPatient.smokingStatus} />
                {localPatient.packYears && <DataRow label="Pack Years" value={localPatient.packYears} />}
                <DataRow label="Diabetes Diagnosis" value={localPatient.diabetesDiagnosis ? 'Yes' : 'No'} />
                {localPatient.diabetesType && <DataRow label="Diabetes Type" value={localPatient.diabetesType} />}
                {localPatient.recentA1C && <DataRow label="Recent A1C (%)" value={localPatient.recentA1C} />}
                {localPatient.a1cDate && <DataRow label="A1C Date" value={new Date(localPatient.a1cDate).toLocaleDateString()} />}
                {localPatient.ckdStage && <DataRow label="CKD Stage" value={localPatient.ckdStage} />}
                {localPatient.recentEGFR && <DataRow label="Recent eGFR (mL/min/1.73m²)" value={localPatient.recentEGFR} />}
                {localPatient.egfrDate && <DataRow label="eGFR Date" value={new Date(localPatient.egfrDate).toLocaleDateString()} />}
                {localPatient.alt && <DataRow label="ALT (U/L)" value={localPatient.alt} />}
                {localPatient.ast && <DataRow label="AST (U/L)" value={localPatient.ast} />}
                {localPatient.bilirubin && <DataRow label="Bilirubin (mg/dL)" value={localPatient.bilirubin} />}
                <DataRow label="MI History" value={localPatient.miHistory ? 'Yes' : 'No'} />
                <DataRow label="Stroke/TIA History" value={localPatient.strokeTiaHistory ? 'Yes' : 'No'} />
                <DataRow label="PAD History" value={localPatient.padHistory ? 'Yes' : 'No'} />
                <DataRow label="Heart Failure History" value={localPatient.heartFailureHistory ? 'Yes' : 'No'} />
                {localPatient.lvef && <DataRow label="LVEF (%)" value={localPatient.lvef} />}
                {localPatient.lvefDate && <DataRow label="LVEF Date" value={new Date(localPatient.lvefDate).toLocaleDateString()} />}
                {localPatient.nyhaClass && <DataRow label="NYHA Class" value={localPatient.nyhaClass} />}
                <DataRow label="On Statin" value={localPatient.onStatin ? 'Yes' : 'No'} />
                <DataRow label="On Anticoagulant" value={localPatient.onAnticoagulant ? 'Yes' : 'No'} />
                <DataRow label="On SGLT2" value={localPatient.onSGLT2 ? 'Yes' : 'No'} />
                <DataRow label="On GLP-1" value={localPatient.onGLP1 ? 'Yes' : 'No'} />
                <DataRow label="On Insulin" value={localPatient.onInsulin ? 'Yes' : 'No'} />
                {localPatient.ntProBNP && <DataRow label="NT-proBNP (pg/mL)" value={localPatient.ntProBNP} />}
                {localPatient.troponin && <DataRow label="Troponin" value={localPatient.troponin} />}
                {localPatient.ldlCholesterol && <DataRow label="LDL Cholesterol (mg/dL)" value={localPatient.ldlCholesterol} />}
                {localPatient.hdlCholesterol && <DataRow label="HDL Cholesterol (mg/dL)" value={localPatient.hdlCholesterol} />}
                {localPatient.triglycerides && <DataRow label="Triglycerides (mg/dL)" value={localPatient.triglycerides} />}
                <DataRow label="Eczema History" value={localPatient.eczemaHistory ? 'Yes' : 'No'} />
                {localPatient.eczemaIgaScore && <DataRow label="Eczema IGA Score" value={localPatient.eczemaIgaScore} />}
                <DataRow label="Active Cancer" value={localPatient.activeCancer ? 'Yes' : 'No'} />
                {localPatient.primaryCancerSite && <DataRow label="Primary Cancer Site" value={localPatient.primaryCancerSite} />}
                {localPatient.cancerStage && <DataRow label="Cancer Stage" value={localPatient.cancerStage} />}
                {localPatient.cancerTreatmentStatus && <DataRow label="Cancer Treatment Status" value={localPatient.cancerTreatmentStatus} />}
                {localPatient.pregnancyStatus && <DataRow label="Pregnancy Status" value={localPatient.pregnancyStatus} />}
              </div>
              
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--muted)] mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                  {localPatient.medications.map((med, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {localPatient.notes && (
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Clinical Notes</h2>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{localPatient.notes}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleStartCall}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover-lift smooth-transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Start Call</span>
                </button>

                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-2">Update Status</label>
                  <select
                    value={localPatient.currentStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value as Patient['currentStatus'])}
                    className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 smooth-transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Onboard">Onboard</option>
                  </select>
                </div>

                <button
                  onClick={handleRequestFollowup}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-xl font-medium hover:bg-gray-50 smooth-transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Request Follow-up</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Last Contacted</span>
                    <span className="font-medium text-[var(--foreground)]">
                      {localPatient.lastContactedDate ? new Date(localPatient.lastContactedDate).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Created</span>
                    <span className="font-medium text-[var(--foreground)]">
                      {new Date(localPatient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-0.5">{label}</p>
      <p className="text-sm font-medium text-[var(--foreground)]">{value}</p>
    </div>
  );
}
