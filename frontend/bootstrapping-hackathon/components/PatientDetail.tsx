'use client';

import { useState } from 'react';
import { Patient, EligibilityStatus } from '@/types/patient';
import { generateRandomScore } from '@/lib/mockData';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (patient: Patient) => void;
}

const statusConfig: Record<EligibilityStatus, { color: string; bg: string }> = {
  eligible: { color: 'text-[var(--success)]', bg: 'bg-green-50/80' },
  ineligible: { color: 'text-[var(--error)]', bg: 'bg-red-50/80' },
  needs_review: { color: 'text-[var(--warning)]', bg: 'bg-amber-50/80' },
  pending: { color: 'text-[var(--muted)]', bg: 'bg-gray-100' },
};

export default function PatientDetail({ patient, onClose, onUpdate }: PatientDetailProps) {
  const [editedPatient, setEditedPatient] = useState(patient);
  const [isScoring, setIsScoring] = useState(false);
  const [isStartingCall, setIsStartingCall] = useState(false);

  const handleRecalculateEligibility = async () => {
    setIsScoring(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    alert(`Call initiated for ${patient.name}\n\nPhone: ${patient.phone}\n\nThe AI calling system will contact this patient shortly.`);
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-end z-50 fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto slide-in-right">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-[var(--border)] px-8 py-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center text-white font-semibold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  {patient.name}
                </h2>
                <p className="text-sm text-[var(--muted)]">{patient.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center smooth-transition text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          <div className="flex items-center space-x-4">
            <div className={`flex-1 px-4 py-3 rounded-xl ${statusConfig[editedPatient.status].bg}`}>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Status</p>
              <p className={`text-sm font-semibold ${statusConfig[editedPatient.status].color} capitalize`}>
                {editedPatient.status.replace('_', ' ')}
              </p>
            </div>
            <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Score</p>
              <p className="text-sm font-semibold font-mono text-[var(--foreground)]">
                {editedPatient.score > 0 ? `${editedPatient.score}/100` : 'Not scored'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Age</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{patient.age} years</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Phone</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{patient.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Diagnosis</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{patient.diagnosis}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Medications</p>
            <div className="flex flex-wrap gap-2">
              {patient.medications.map((med, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-blue-50/80 text-sm text-blue-900 font-medium"
                >
                  {med}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Test Results</p>
            <div className="p-4 rounded-xl bg-gray-50 space-y-2">
              {patient.testResults.bloodPressure && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Blood Pressure</span>
                  <span className="font-medium text-[var(--foreground)]">{patient.testResults.bloodPressure}</span>
                </div>
              )}
              {patient.testResults.cholesterol && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Cholesterol</span>
                  <span className="font-medium text-[var(--foreground)]">{patient.testResults.cholesterol}</span>
                </div>
              )}
              {patient.testResults.glucose && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Glucose</span>
                  <span className="font-medium text-[var(--foreground)]">{patient.testResults.glucose}</span>
                </div>
              )}
              {patient.testResults.other && Object.entries(patient.testResults.other).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{key}</span>
                  <span className="font-medium text-[var(--foreground)]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">
              Eligibility Criteria
            </p>
            <div className="space-y-2">
              {Object.entries(editedPatient.eligibilityCriteria).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 smooth-transition cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center smooth-transition ${
                    value
                      ? 'bg-[var(--success)] border-[var(--success)]'
                      : 'border-gray-300 group-hover:border-[var(--accent)]'
                  }`}>
                    {value && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleCriteriaChange(key as keyof typeof patient.eligibilityCriteria)}
                    className="sr-only"
                  />
                  <span className="text-sm text-[var(--foreground)] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Clinical Notes</p>
            <textarea
              value={editedPatient.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleSaveNotes}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-white text-[var(--foreground)] placeholder-[var(--muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 smooth-transition"
              rows={4}
              placeholder="Add notes about this patient..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleRecalculateEligibility}
              disabled={isScoring}
              className="flex-1 px-6 py-3 bg-[var(--foreground)] text-white rounded-xl font-medium shadow-sm hover-lift smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isScoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scoring...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Recalculate</span>
                </>
              )}
            </button>
            <button
              onClick={handleStartCall}
              disabled={isStartingCall}
              className="flex-1 px-6 py-3 bg-[var(--success)] text-white rounded-xl font-medium shadow-sm hover-lift smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isStartingCall ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Start Call</span>
                </>
              )}
            </button>
          </div>

          {patient.lastContact && (
            <p className="text-xs text-[var(--muted)] text-center pt-4">
              Last contact: {new Date(patient.lastContact).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
