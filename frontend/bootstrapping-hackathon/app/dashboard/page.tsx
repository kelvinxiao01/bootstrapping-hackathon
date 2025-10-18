'use client';

import { useState } from 'react';
import { Patient, EligibilityStatus } from '@/types/patient';
import { mockPatients } from '@/lib/mockData';
import PatientTable from '@/components/PatientTable';
import PatientDetail from '@/components/PatientDetail';
import ImportCSV from '@/components/ImportCSV';
import Header from '@/components/Header';

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EligibilityStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient => {
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
    setSelectedPatient(updatedPatient);
  };

  const handleImportPatients = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
    setShowImport(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Patient Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredPatients.length} patients {filterStatus !== 'all' && `(${filterStatus})`}
            </p>
          </div>

          <button
            onClick={() => setShowImport(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Import CSV
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search patients by name or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as EligibilityStatus | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="eligible">Eligible</option>
            <option value="needs_review">Needs Review</option>
            <option value="ineligible">Ineligible</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <PatientTable
          patients={filteredPatients}
          onSelectPatient={setSelectedPatient}
          onUpdatePatient={handlePatientUpdate}
        />
      </main>

      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdate={handlePatientUpdate}
        />
      )}

      {showImport && (
        <ImportCSV
          onImport={handleImportPatients}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
