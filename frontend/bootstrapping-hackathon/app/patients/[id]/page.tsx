'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Patient } from '@/types/patient';
import { api } from '@/lib/api';
import { calculateLocalEligibility } from '@/lib/eligibilityScoring';
import { formatFieldLabel } from '@/lib/fieldLabels';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await api.getPatient(id);
      setPatient(data);
    } catch (error) {
      console.error('Failed to load patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = async () => {
    if (!patient) return;
    try {
      const result = await api.startCall(patient.id);
      alert(`Call started successfully! Call ID: ${result.call_id}`);
      await api.updatePatient(patient.id, {
        last_contacted: new Date().toISOString().split('T')[0],
        status: 'Contacted',
      });
      loadPatient();
    } catch (error) {
      const name = patient.name || patient.full_name || 'Patient';
      alert(`Mock: Initiating call to ${name}...`);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!patient) return;
    try {
      await api.updatePatient(patient.id, { status: newStatus });
      loadPatient();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRequestFollowup = () => {
    alert('Follow-up request sent');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading patient...</div>
      </div>
    );
  }

  if (!patient) {
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

  const name = patient.name || patient.full_name || 'Unknown';
  const email = patient.email || '';
  const phone = patient.phone || patient.phone_number || '';
  const qualifiedCondition = patient.qualified_condition || patient.qualified_disease || 'N/A';
  const topCategory = patient.top_category || 'Not Scored';
  const eligibilityScore = patient.eligibility_score ?? 0;
  const eligibilityLabel = patient.eligibility_label || 'Pending';
  const age = patient.age || 'N/A';
  const sex = patient.sex || 'N/A';
  const bmi = patient.bmi || 'N/A';
  const status = patient.status || 'Pending';
  const lastContacted = patient.last_contacted || 'Never';
  const createdAt = patient.created_at || 'Unknown';

  const eligibilityData = calculateLocalEligibility(patient);

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

  const excludeFields = ['id', 'created_at', 'updated_at', 'name', 'full_name', 'email', 'phone', 'phone_number'];
  const clinicalFields = Object.entries(patient)
    .filter(([key]) => !excludeFields.includes(key) && patient[key] !== null && patient[key] !== undefined && patient[key] !== '')
    .sort(([a], [b]) => a.localeCompare(b));

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
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{name}</h1>
          <p className="text-[var(--muted)]">{email} • {phone}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Qualified Condition</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{qualifiedCondition}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Top Matched Trial</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{topCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">Age / Sex</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{age} years / {sex}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">BMI</p>
                  <p className="text-base font-medium text-[var(--foreground)]">{bmi}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Eligibility Summary</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-[var(--muted)] mb-1">Qualified Study Type</p>
                    <p className="text-lg font-semibold text-[var(--foreground)]">{qualifiedCondition}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)] mb-3 font-semibold">Key Criteria</p>
                  <div className="space-y-3">
                    {eligibilityData.reasons.length > 0 ? (
                      eligibilityData.reasons.map((reason, index) => {
                        const isNegative = reason.toLowerCase().includes('exclusion') || 
                                          reason.toLowerCase().includes('below') || 
                                          reason.toLowerCase().includes('outside');
                        return (
                          <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${isNegative ? 'bg-red-50' : 'bg-green-50'}`}>
                            <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isNegative ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {isNegative ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              )}
                            </svg>
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${isNegative ? 'text-red-800' : 'text-green-800'}`}>{reason}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-[var(--muted)] italic">No criteria data available</p>
                    )}
                  </div>
                </div>
                {patient.age && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-[var(--muted)] mb-2">Patient Demographics</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-[var(--muted)]">Age</p>
                        <p className="text-base font-semibold text-[var(--foreground)]">{age} years</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-[var(--muted)]">Sex</p>
                        <p className="text-base font-semibold text-[var(--foreground)]">{sex}</p>
                      </div>
                      {bmi !== 'N/A' && (
                        <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                          <p className="text-xs text-[var(--muted)]">BMI</p>
                          <p className="text-base font-semibold text-[var(--foreground)]">{bmi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Clinical Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-100">
                    {clinicalFields.map(([key, value]) => (
                      <tr key={key} className="hover:bg-gray-50/50">
                        <td className="py-3 pr-4 text-sm font-medium text-[var(--muted)] w-1/2">
                          {formatFieldLabel(key)}
                        </td>
                        <td className="py-3 text-sm text-[var(--foreground)]">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={handleStartCall}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Start Call
                </button>

                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-2">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Onboard">Onboard</option>
                  </select>
                </div>

                <button
                  onClick={handleRequestFollowup}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-[var(--foreground)] rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Request Follow-up
                </button>

                <div className="pt-4 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Last Contacted</span>
                    <span className="text-[var(--foreground)] font-medium">{lastContacted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Created</span>
                    <span className="text-[var(--foreground)] font-medium">{createdAt}</span>
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
