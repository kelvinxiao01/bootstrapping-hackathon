'use client';

import { useState } from 'react';
import { Patient, EligibilityStatus } from '@/types/patient';
import { generateRandomScore } from '@/lib/mockData';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (patient: Patient) => void;
}

const statusColors: Record<EligibilityStatus, string> = {
  eligible: 'bg-green-500',
  ineligible: 'bg-red-500',
  needs_review: 'bg-yellow-500',
  pending: 'bg-gray-500',
};

export default function PatientDetail({ patient, onClose, onUpdate }: PatientDetailProps) {
  const [editedPatient, setEditedPatient] = useState(patient);
  const [isScoring, setIsScoring] = useState(false);
  const [isStartingCall, setIsStartingCall] = useState(false);

  const handleRecalculateEligibility = async () => {
    setIsScoring(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newScore = generateRandomScore();
    let newStatus: EligibilityStatus = 'needs_review';
    
    if (newScore >= 80) newStatus = 'eligible';
    else if (newScore < 60) newStatus = 'ineligible';
    
    const updated = { ...editedPatient, score: newScore, status: newStatus };
    setEditedPatient(updated);
    onUpdate(updated);
    setIsScoring(false);
  };

  const handleStartCall = async () => {
    setIsStartingCall(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Call initiated for ${patient.name}\nPhone: ${patient.phone}\n\nThis will connect to the backend AI calling system.`);
    setIsStartingCall(false);
  };

  const handleCriteriaChange = (key: keyof typeof patient.eligibilityCriteria) => {
    const updated = {
      ...editedPatient,
      eligibilityCriteria: {
        ...editedPatient.eligibilityCriteria,
        [key]: !editedPatient.eligibilityCriteria[key],
      },
    };
    setEditedPatient(updated);
    onUpdate(updated);
  };

  const handleNotesChange = (notes: string) => {
    const updated = { ...editedPatient, notes };
    setEditedPatient(updated);
  };

  const handleSaveNotes = () => {
    onUpdate(editedPatient);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white dark:bg-gray-800 h-full w-full max-w-2xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Patient Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {patient.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{patient.email}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${statusColors[editedPatient.status]}`} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Age:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">
                  {patient.age}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">
                  {patient.phone}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium capitalize">
                  {editedPatient.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Score:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">
                  {editedPatient.score > 0 ? editedPatient.score : 'Not scored'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Diagnosis</h4>
            <p className="text-gray-700 dark:text-gray-300">{patient.diagnosis}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Medications</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {patient.medications.map((med, idx) => (
                <li key={idx}>{med}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Results</h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 space-y-1 text-sm">
              {patient.testResults.bloodPressure && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Blood Pressure:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {patient.testResults.bloodPressure}
                  </span>
                </div>
              )}
              {patient.testResults.cholesterol && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Cholesterol:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {patient.testResults.cholesterol}
                  </span>
                </div>
              )}
              {patient.testResults.glucose && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Glucose:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {patient.testResults.glucose}
                  </span>
                </div>
              )}
              {patient.testResults.other && Object.entries(patient.testResults.other).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Eligibility Criteria
            </h4>
            <div className="space-y-2">
              {Object.entries(editedPatient.eligibilityCriteria).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleCriteriaChange(key as keyof typeof patient.eligibilityCriteria)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <textarea
              value={editedPatient.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleSaveNotes}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
              placeholder="Add notes about this patient..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRecalculateEligibility}
              disabled={isScoring}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isScoring ? 'Scoring...' : 'Recalculate Eligibility'}
            </button>
            <button
              onClick={handleStartCall}
              disabled={isStartingCall}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isStartingCall ? 'Connecting...' : '📞 Start Call'}
            </button>
          </div>

          {patient.lastContact && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Last contact: {new Date(patient.lastContact).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
