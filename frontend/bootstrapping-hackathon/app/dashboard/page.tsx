'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import { mockPatients } from '@/lib/mockData';
import PatientTable from '@/components/PatientTable';
import ImportCSV from '@/components/ImportCSV';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [showImport, setShowImport] = useState(false);
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient => {
    const matchesCondition = filterCondition === 'all' || patient.qualifiedCondition.toLowerCase().includes(filterCondition.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.eligibility.label === filterStatus;
    const matchesSearch = searchQuery === '' || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.qualifiedCondition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCondition && matchesStatus && matchesSearch;
  });

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };

  const handleSelectPatient = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const handleStartCall = async (patient: Patient) => {
    try {
      const result = await api.startCall(patient.id);
      alert(`Call started successfully! Call ID: ${result.call_id}`);
    } catch (error) {
      alert(`Mock: Initiating call to ${patient.name}...`);
    }
  };

  const handleRescoreEligibility = async (patient: Patient) => {
    try {
      const eligibility = await api.calculateEligibility(patient.id);
      handlePatientUpdate({ ...patient, eligibility });
      alert(`Eligibility recalculated: ${eligibility.score}/100`);
    } catch (error) {
      alert('Mock: Eligibility rescored using AI');
    }
  };

  const handleImportPatients = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
    setShowImport(false);
  };

  const statusCounts = {
    eligible: patients.filter(p => p.eligibility.label === 'Eligible').length,
    needsInfo: patients.filter(p => p.eligibility.label === 'Needs Info').length,
    ineligible: patients.filter(p => p.eligibility.label === 'Ineligible').length,
    pending: patients.filter(p => p.currentStatus === 'Pending').length,
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
              Patients
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl font-medium shadow-sm hover-lift smooth-transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Import</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Eligible</p>
                <p className="text-2xl font-semibold text-[var(--success)]">{statusCounts.eligible}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50/80 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Needs Info</p>
                <p className="text-2xl font-semibold text-[var(--warning)]">{statusCounts.needsInfo}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50/80 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Ineligible</p>
                <p className="text-2xl font-semibold text-[var(--error)]">{statusCounts.ineligible}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50/80 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[var(--border)] smooth-transition hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-semibold text-[var(--muted)]">{statusCounts.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 smooth-transition"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-[var(--border)] rounded-xl bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 smooth-transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Eligible">Eligible</option>
            <option value="Needs Info">Needs Info</option>
            <option value="Ineligible">Ineligible</option>
          </select>
        </div>

        <PatientTable
          patients={filteredPatients}
          onSelectPatient={handleSelectPatient}
          onUpdatePatient={handlePatientUpdate}
          onStartCall={handleStartCall}
          onRescoreEligibility={handleRescoreEligibility}
        />
      </main>

      {showImport && (
        <ImportCSV
          onImport={handleImportPatients}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
