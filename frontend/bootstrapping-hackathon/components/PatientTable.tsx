'use client';

import { Patient } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient, updates: Record<string, any>) => void;
  onStartCall: (patient: Patient) => void;
}

const statusConfig = {
  Pending: { color: 'text-gray-700', bg: 'bg-gray-100' },
  Contacted: { color: 'text-blue-700', bg: 'bg-blue-50/80' },
  Interested: { color: 'text-green-700', bg: 'bg-green-50/80' },
  Onboard: { color: 'text-purple-700', bg: 'bg-purple-50/80' },
};

const getAllStudyTypeBadges = (disease: string): Array<{ label: string; color: string }> => {
  const lowerDisease = disease.toLowerCase();
  const badges: Array<{ label: string; color: string }> = [];
  
  if (lowerDisease.includes('diabetes')) {
    badges.push({ label: 'Diabetes', color: 'bg-blue-100 text-blue-800 border-blue-200' });
  }
  if (lowerDisease.includes('ckd') || lowerDisease.includes('kidney')) {
    badges.push({ label: 'CKD', color: 'bg-green-100 text-green-800 border-green-200' });
  }
  if (lowerDisease.includes('cardiovascular') || lowerDisease.includes('cvd') || lowerDisease.includes('heart')) {
    badges.push({ label: 'CVD', color: 'bg-red-100 text-red-800 border-red-200' });
  }
  if (lowerDisease.includes('oncology') || lowerDisease.includes('cancer')) {
    badges.push({ label: 'Oncology', color: 'bg-purple-100 text-purple-800 border-purple-200' });
  }
  if (lowerDisease.includes('dermatology') || lowerDisease.includes('eczema') || lowerDisease.includes('skin')) {
    badges.push({ label: 'Dermatology', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' });
  }
  if (lowerDisease.includes('metabolic') || lowerDisease.includes('obesity')) {
    badges.push({ label: 'Metabolic', color: 'bg-orange-100 text-orange-800 border-orange-200' });
  }
  if (lowerDisease.includes('neurology') || lowerDisease.includes('stroke')) {
    badges.push({ label: 'Neurology', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' });
  }
  
  if (badges.length === 0) {
    badges.push({ label: disease || 'None', color: 'bg-gray-100 text-gray-800 border-gray-200' });
  }
  
  return badges;
};

export default function PatientTable({ patients, onSelectPatient, onUpdatePatient, onStartCall }: PatientTableProps) {
  const handleStatusChange = (patient: Patient, newStatus: string) => {
    onUpdatePatient(patient, { status: newStatus });
  };

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium text-gray-900">No patients found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or import patient data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Qualified Study Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Patient
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
            {patients.map((patient) => {
              const patientId = patient.patient_id;
              const name = patient.name || 'Unknown';
              const email = patient.email || patient.phone || '';
              const qualifiedDisease = patient.qualified_disease || 'General';
              const badges = getAllStudyTypeBadges(qualifiedDisease);
              const status = patient.status || 'Pending';
              const lastContacted = patient.last_contacted || '—';
              const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

              return (
                <tr
                  key={patientId}
                  className="border-b border-[var(--border)] last:border-0 smooth-transition hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge, idx) => (
                        <span key={idx} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${badge.color}`}>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                        {initials}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--foreground)]">
                          {name}
                        </div>
                        <div className="text-sm text-[var(--muted)]">
                          {email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(patient, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${statusConfig[status as keyof typeof statusConfig]?.color || 'text-gray-700'} ${statusConfig[status as keyof typeof statusConfig]?.bg || 'bg-gray-100'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Onboard">Onboard</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[var(--muted)]">{lastContacted}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onStartCall(patient)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                        title="Start Call"
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
