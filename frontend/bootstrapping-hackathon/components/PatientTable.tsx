'use client';

import { Patient, EligibilityStatus } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
}

const statusColors: Record<EligibilityStatus, string> = {
  eligible: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ineligible: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  needs_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const scoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400 font-bold';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 font-semibold';
  return 'text-red-600 dark:text-red-400';
};

export default function PatientTable({ patients, onSelectPatient, onUpdatePatient }: PatientTableProps) {
  const handleStatusChange = (patient: Patient, newStatus: EligibilityStatus) => {
    onUpdatePatient({ ...patient, status: newStatus });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Medications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {patient.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {patient.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {patient.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{patient.diagnosis}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {patient.medications.slice(0, 2).join(', ')}
                    {patient.medications.length > 2 && ` +${patient.medications.length - 2}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${scoreColor(patient.score)}`}>
                    {patient.score > 0 ? patient.score : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={patient.status}
                    onChange={(e) => handleStatusChange(patient, e.target.value as EligibilityStatus)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]} border-0 cursor-pointer`}
                  >
                    <option value="eligible">Eligible</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="ineligible">Ineligible</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onSelectPatient(patient)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No patients found. Try adjusting your filters or import patient data.
        </div>
      )}
    </div>
  );
}
