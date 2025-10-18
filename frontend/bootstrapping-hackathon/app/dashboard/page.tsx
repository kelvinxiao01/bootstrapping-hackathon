'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import PatientTable from '@/components/PatientTable';
import ImportCSV from '@/components/ImportCSV';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { calculateLocalEligibility } from '@/lib/eligibilityScoring';

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();

    const subscription = api.subscribeToPatients((payload) => {
      if (payload.new) {
        setPatients(prev => prev.map(p => 
          p.id === payload.new.id ? payload.new : p
        ));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPatients = async () => {
    try {
      const data = await api.listPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const qualifiedCondition = patient.qualified_condition || patient.qualified_disease || '';
    const topCategory = patient.top_category || '';
    const eligibilityLabel = patient.eligibility_label || '';
    const name = patient.name || patient.full_name || '';
    
    const matchesCondition = filterCondition === 'all' || qualifiedCondition.toLowerCase().includes(filterCondition.toLowerCase());
    const matchesStatus = filterStatus === 'all' || eligibilityLabel === filterStatus;
    const matchesSearch = searchQuery === '' || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qualifiedCondition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCondition && matchesStatus && matchesSearch;
  });

  const handlePatientUpdate = async (id: string, updates: Record<string, any>) => {
    try {
      const updated = await api.updatePatient(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const handleStartCall = async (patient: Patient) => {
    try {
      const result = await api.startCall(patient.id);
      alert(`Call started successfully! Call ID: ${result.call_id}`);
      
      await handlePatientUpdate(patient.id, {
        last_contacted: new Date().toISOString().split('T')[0],
        status: 'Contacted',
      });
    } catch (error) {
      const name = patient.name || patient.full_name || 'Patient';
      alert(`Mock: Initiating call to ${name}...`);
    }
  };

  const handleRescoreEligibility = async (patient: Patient) => {
    try {
      const eligibility = calculateLocalEligibility(patient);
      
      await handlePatientUpdate(patient.id, {
        top_category: eligibility.topCategory,
        eligibility_score: eligibility.score,
        eligibility_label: eligibility.label,
      });
      
      alert(`Eligibility recalculated: ${eligibility.score}/100 - ${eligibility.label}`);
    } catch (error) {
      console.error('Failed to rescore:', error);
      alert('Failed to recalculate eligibility');
    }
  };

  const handleImportPatients = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
    setShowImport(false);
  };

  const statusCounts = {
    eligible: patients.filter(p => p.eligibility_label === 'Eligible').length,
    needsInfo: patients.filter(p => p.eligibility_label === 'Needs Info').length,
    ineligible: patients.filter(p => p.eligibility_label === 'Ineligible').length,
    pending: patients.filter(p => p.status === 'Pending').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">{patients.length} patients</p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">ELIGIBLE</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.eligible}</p>
              </div>
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">NEEDS INFO</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{statusCounts.needsInfo}</p>
              </div>
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">INELIGIBLE</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.ineligible}</p>
              </div>
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">PENDING</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{statusCounts.pending}</p>
              </div>
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onStartCall={handleStartCall}
          onRescoreEligibility={handleRescoreEligibility}
          onUpdatePatient={(patient, updates) => handlePatientUpdate(patient.id, updates)}
        />
      </main>

      {showImport && (
        <ImportCSV
          onClose={() => setShowImport(false)}
          onImport={handleImportPatients}
        />
      )}
    </div>
  );
}
