'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import PatientTable from '@/components/PatientTable';
import ImportCSV from '@/components/ImportCSV';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudyTypes, setSelectedStudyTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('last_contacted_desc');
  const ITEMS_PER_PAGE = 10;

  const availableStudyTypes = [
    { value: 'Diabetes', label: 'Diabetes', color: 'bg-blue-100 text-blue-800' },
    { value: 'CKD', label: 'Chronic Kidney Disease', color: 'bg-green-100 text-green-800' },
    { value: 'Cardiovascular', label: 'Cardiovascular', color: 'bg-red-100 text-red-800' },
    { value: 'Oncology', label: 'Oncology', color: 'bg-purple-100 text-purple-800' },
    { value: 'Dermatology', label: 'Dermatology', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Metabolic', label: 'Metabolic/Obesity', color: 'bg-orange-100 text-orange-800' },
    { value: 'Neurology', label: 'Neurology', color: 'bg-indigo-100 text-indigo-800' },
    { value: "Women's Health", label: "Women's Health", color: 'bg-pink-100 text-pink-800' },
  ];

  useEffect(() => {
    loadPatients();

    const subscription = api.subscribeToPatients((payload) => {
      console.log('Realtime event:', payload.eventType, payload.new);
      
      if (payload.eventType === 'INSERT' && payload.new) {
        setPatients(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        setPatients(prev => prev.map(p => 
          p.patient_id === payload.new.patient_id ? payload.new : p
        ));
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setPatients(prev => prev.filter(p => p.patient_id !== payload.old.patient_id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadPatients();
  }, [currentPage, sortBy, selectedStudyTypes, searchQuery]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      
      const lastUnderscoreIndex = sortBy.lastIndexOf('_');
      const sortColumn = sortBy.substring(0, lastUnderscoreIndex);
      const sortDirection = sortBy.substring(lastUnderscoreIndex + 1);
      const ascending = sortDirection !== 'desc';
      
      const result = await api.listPatients({
        sort: { column: sortColumn, ascending },
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      });
      
      let filteredData = result.data;
      
      if (selectedStudyTypes.length > 0) {
        filteredData = filteredData.filter(p => {
          const disease = p.qualified_disease || '';
          return selectedStudyTypes.some(type => disease.toLowerCase().includes(type.toLowerCase()));
        });
      }
      
      if (searchQuery) {
        filteredData = filteredData.filter(p => {
          const name = p.name || '';
          const disease = p.qualified_disease || '';
          return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 disease.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }
      
      setPatients(filteredData);
      setTotalCount(result.count);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientUpdate = async (id: string, updates: Record<string, any>) => {
    try {
      const updated = await api.updatePatient(id, updates);
      setPatients(prev => prev.map(p => p.patient_id === id ? updated : p));
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    router.push(`/patients/${patient.patient_id}`);
  };

  const handleStartCall = async (patient: Patient) => {
    try {
      const result = await api.startCall(patient.patient_id);
      alert(`Call started successfully! Call ID: ${result.call_id}`);
      
      await handlePatientUpdate(patient.patient_id, {
        last_contacted: new Date().toISOString().split('T')[0],
        status: 'Contacted',
      });
    } catch (error) {
      const name = patient.name || 'Patient';
      alert(`Mock: Initiating call to ${name}...`);
    }
  };

  const handleImportPatients = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
    setShowImport(false);
  };

  const toggleStudyType = (studyType: string) => {
    setSelectedStudyTypes(prev => {
      if (prev.includes(studyType)) {
        return prev.filter(t => t !== studyType);
      } else {
        return [...prev, studyType];
      }
    });
    setCurrentPage(1);
  };

  const studyTypeCounts = availableStudyTypes.reduce((acc, type) => {
    acc[type.value] = patients.filter(p => 
      (p.qualified_disease || '').toLowerCase().includes(type.value.toLowerCase())
    ).length;
    return acc;
  }, {} as Record<string, number>);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
              <p className="mt-4 text-[var(--muted)]">Loading patients...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Patients</h1>
            <p className="text-[var(--muted)] mt-1">{totalCount} total patients</p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-blue-700 smooth-transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableStudyTypes.slice(0, 4).map(type => (
            <div key={type.value} className="bg-white rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${type.color.split(' ')[1]}`}>
                    {type.label}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-[var(--foreground)]">
                    {studyTypeCounts[type.value] || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search patients by name or condition..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last_contacted_desc">Last Contacted (Latest)</option>
              <option value="last_contacted_asc">Last Contacted (Oldest)</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="age_years_desc">Age (Oldest First)</option>
              <option value="age_years_asc">Age (Youngest First)</option>
              <option value="status_asc">Status (A-Z)</option>
              <option value="status_desc">Status (Z-A)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">Filter by Study Type:</label>
            <div className="flex flex-wrap gap-2">
              {availableStudyTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => toggleStudyType(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStudyTypes.includes(type.value)
                      ? type.color + ' ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                  {selectedStudyTypes.includes(type.value) && ' ✓'}
                </button>
              ))}
              {selectedStudyTypes.length > 0 && (
                <button
                  onClick={() => setSelectedStudyTypes([])}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <PatientTable
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onStartCall={handleStartCall}
          onUpdatePatient={(patient, updates) => handlePatientUpdate(patient.patient_id, updates)}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="text-sm text-[var(--muted)]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} patients
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
