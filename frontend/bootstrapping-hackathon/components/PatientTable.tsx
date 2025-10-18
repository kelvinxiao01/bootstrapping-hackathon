'use client';

import { Patient } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onStartCall: (patient: Patient) => void;
  onRescoreEligibility: (patient: Patient) => void;
}

const statusConfig: Record<Patient['currentStatus'], { color: string; bg: string }> = {
  Pending: { color: 'text-gray-700', bg: 'bg-gray-100' },
  Contacted: { color: 'text-blue-700', bg: 'bg-blue-50/80' },
  Interested: { color: 'text-green-700', bg: 'bg-green-50/80' },
  Onboard: { color: 'text-purple-700', bg: 'bg-purple-50/80' },
};

const scoreColor = (score: number): string => {
  if (score >= 80) return 'text-[var(--success)] font-semibold';
  if (score >= 60) return 'text-[var(--warning)] font-medium';
  return 'text-[var(--error)]';
};

const labelColor = (label: string): string => {
  if (label === 'Eligible') return 'text-[var(--success)] bg-green-50/80';
  if (label === 'Ineligible') return 'text-[var(--error)] bg-red-50/80';
  return 'text-[var(--warning)] bg-amber-50/80';
};

export default function PatientTable({ patients, onSelectPatient, onUpdatePatient, onStartCall, onRescoreEligibility }: PatientTableProps) {
  const handleStatusChange = (patient: Patient, newStatus: Patient['currentStatus']) => {
    onUpdatePatient({ ...patient, currentStatus: newStatus });
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Qualified Condition
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Top Matched Trial
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Eligibility
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Current Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Last Contacted
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-[var(--border)] last:border-0 smooth-transition hover:bg-gray-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">
                        {patient.name}
                      </div>
                      <div className="text-sm text-[var(--muted)]">
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[var(--foreground)]">{patient.qualifiedCondition}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[var(--foreground)] font-medium">{patient.eligibility.topCategory}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium ${labelColor(patient.eligibility.label)}`}>
                      {patient.eligibility.label}
                    </span>
                    <div className={`text-sm font-mono ${scoreColor(patient.eligibility.score)}`}>
                      Score: {patient.eligibility.score}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={patient.currentStatus}
                    onChange={(e) => handleStatusChange(patient, e.target.value as Patient['currentStatus'])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig[patient.currentStatus].color} ${statusConfig[patient.currentStatus].bg} border-0 cursor-pointer smooth-transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Onboard">Onboard</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[var(--muted)]">
                    {patient.lastContactedDate ? new Date(patient.lastContactedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="p-2 text-[var(--accent)] hover:bg-blue-50 rounded-lg smooth-transition"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onStartCall(patient)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg smooth-transition"
                      title="Start Call"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRescoreEligibility(patient)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg smooth-transition"
                      title="Re-score Eligibility"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div className="text-center py-16 text-[var(--muted)]">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No patients found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
