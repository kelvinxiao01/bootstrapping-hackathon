'use client';

import { Patient, EligibilityStatus } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
}

const statusConfig: Record<EligibilityStatus, { color: string; bg: string; label: string }> = {
  eligible: { color: 'text-[var(--success)]', bg: 'bg-green-50', label: 'Eligible' },
  ineligible: { color: 'text-[var(--error)]', bg: 'bg-red-50', label: 'Ineligible' },
  needs_review: { color: 'text-[var(--warning)]', bg: 'bg-amber-50', label: 'Needs Review' },
  pending: { color: 'text-[var(--muted)]', bg: 'bg-gray-50', label: 'Pending' },
};

const scoreColor = (score: number): string => {
  if (score >= 80) return 'text-[var(--success)] font-semibold';
  if (score >= 60) return 'text-[var(--warning)] font-medium';
  return 'text-[var(--error)]';
};

export default function PatientTable({ patients, onSelectPatient, onUpdatePatient }: PatientTableProps) {
  const handleStatusChange = (patient: Patient, newStatus: EligibilityStatus) => {
    onUpdatePatient({ ...patient, status: newStatus });
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
                Age
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Medications
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className="border-b border-[var(--border)] last:border-0 smooth-transition hover:bg-gray-50/50 scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
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
                <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                  {patient.age}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[var(--foreground)]">{patient.diagnosis}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[var(--muted)]">
                    {patient.medications.slice(0, 2).join(', ')}
                    {patient.medications.length > 2 && (
                      <span className="text-[var(--accent)]"> +{patient.medications.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-mono ${scoreColor(patient.score)}`}>
                    {patient.score > 0 ? patient.score : '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={patient.status}
                    onChange={(e) => handleStatusChange(patient, e.target.value as EligibilityStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig[patient.status].color} ${statusConfig[patient.status].bg} border-0 cursor-pointer smooth-transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20`}
                  >
                    <option value="eligible">✓ Eligible</option>
                    <option value="needs_review">◐ Needs Review</option>
                    <option value="ineligible">✕ Ineligible</option>
                    <option value="pending">○ Pending</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectPatient(patient)}
                    className="text-sm font-medium text-[var(--accent)] hover:text-blue-700 smooth-transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div className="text-center py-16 text-[var(--muted)]">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-sm">No patients found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
