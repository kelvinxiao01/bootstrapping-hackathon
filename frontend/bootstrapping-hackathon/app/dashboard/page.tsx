'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import PatientTable from '@/components/PatientTable';
import ImportCSV from '@/components/ImportCSV';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [allPatients, setAllPatients] = useState<Patient[]>([]); // Full dataset
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudyTypes, setSelectedStudyTypes] = useState<string[]>([]);
  const [contactStatus, setContactStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('last_contacted_desc');
  const [callNotification, setCallNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const ITEMS_PER_PAGE = 10;

  const availableStudyTypes = [
    { value: 'Diabetes', label: 'Diabetes', color: 'bg-blue-100 text-blue-800' },
    { value: 'CKD', label: 'Chronic Kidney Disease', color: 'bg-green-100 text-green-800' },
    { value: 'CVD', label: 'Cardiovascular Disease', color: 'bg-red-100 text-red-800' },
    { value: 'Oncology', label: 'Oncology', color: 'bg-purple-100 text-purple-800' },
    { value: 'Dermatology', label: 'Dermatology', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Metabolic', label: 'Metabolic/Obesity', color: 'bg-orange-100 text-orange-800' },
    { value: 'Neurology', label: 'Neurology', color: 'bg-indigo-100 text-indigo-800' },
  ];

  const contactStatuses = [
    'All',
    'Pending',
    'Contacted',
    'Interested',
    'Onboard',
    'Needs Info',
    'Ineligible',
    'Unreachable',
    'Do Not Contact'
  ];

  // Load all patients once on mount
  useEffect(() => {
    loadPatients();

    const subscription = api.subscribeToPatients((payload) => {
      console.log('Realtime event:', payload.eventType, payload.new);

      if (payload.eventType === 'INSERT' && payload.new) {
        setAllPatients(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        setAllPatients(prev => prev.map(p =>
          p.patient_id === payload.new.patient_id ? payload.new : p
        ));
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setAllPatients(prev => prev.filter(p => p.patient_id !== payload.old.patient_id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStudyTypes, searchQuery, sortBy, contactStatus]);

  const loadPatients = async () => {
    try {
      setLoading(true);

      // Fetch all patients from Supabase (no filtering, no pagination)
      const result = await api.listPatients();

      setAllPatients(result.data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Check if patient matches study type
  const matchesStudyType = (qualifiedDisease: string, studyType: string): boolean => {
    const lowerDisease = (qualifiedDisease || '').toLowerCase();

    switch (studyType) {
      case 'Diabetes':
        return lowerDisease.includes('diabetes');
      case 'CKD':
        return lowerDisease.includes('ckd') || lowerDisease.includes('kidney');
      case 'CVD':
        return lowerDisease.includes('cardiovascular') || lowerDisease.includes('cvd') || lowerDisease.includes('heart');
      case 'Oncology':
        return lowerDisease.includes('oncology') || lowerDisease.includes('cancer');
      case 'Dermatology':
        return lowerDisease.includes('dermatology') || lowerDisease.includes('eczema') || lowerDisease.includes('skin');
      case 'Metabolic':
        return lowerDisease.includes('metabolic') || lowerDisease.includes('obesity');
      case 'Neurology':
        return lowerDisease.includes('neurology') || lowerDisease.includes('stroke');
      default:
        return lowerDisease.includes(studyType.toLowerCase());
    }
  };

  // Client-side filtering, sorting, and pagination
  const { patients, totalCount } = (() => {
    // Remove any null/undefined entries from the array
    let filtered = allPatients.filter(p => p != null);

    // 1. Filter by search query (name, phone, email)
    if (searchQuery.trim()) {
      const search = searchQuery.trim().toLowerCase();
      const normalizedSearch = search.replace(/[\s\-]/g, '');

      filtered = filtered.filter(patient => {
        const name = (patient.name || patient.full_name || '').toLowerCase();
        const email = (patient.email || '').toLowerCase();
        const phone = (patient.phone || '').replace(/[\s\-]/g, '');

        return name.includes(search) || email.includes(search) || phone.includes(normalizedSearch);
      });
    }

    // 2. Filter by contact status
    if (contactStatus !== 'All') {
      filtered = filtered.filter(patient => patient.status === contactStatus);
    }

    // 3. Filter by study types (must match ALL selected types)
    if (selectedStudyTypes.length > 0) {
      filtered = filtered.filter(patient => {
        const qualifiedDisease = patient.qualified_disease || patient.qualified_condition || '';
        return selectedStudyTypes.every(studyType => matchesStudyType(qualifiedDisease, studyType));
      });
    }

    // 4. Sort
    const lastUnderscoreIndex = sortBy.lastIndexOf('_');
    const sortColumn = sortBy.substring(0, lastUnderscoreIndex);
    const sortDirection = sortBy.substring(lastUnderscoreIndex + 1);

    filtered.sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      // Handle null/undefined values - push them to the end
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    // 5. Paginate
    const totalCount = filtered.length;
    const paginatedPatients = filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    return { patients: paginatedPatients, totalCount };
  })();

  const handlePatientUpdate = async (id: string, updates: Record<string, any>) => {
    try {
      const updated = await api.updatePatient(id, updates);
      // Only update local state if we got a valid response
      if (updated) {
        setAllPatients(prev => prev.map(p => p.patient_id === id ? updated : p));
      }
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    router.push(`/patients/${patient.patient_id}`);
  };

  const handleStartCall = async (patient: Patient) => {
    setCallNotification(null); // Clear previous notification

    try {
      const result = await api.startCall(patient); // Pass entire patient object
      setCallNotification({
        type: 'success',
        message: `Call launched successfully! Job ID: ${result.job_id}`
      });

      await handlePatientUpdate(patient.patient_id, {
        last_contacted: new Date().toISOString(), // Full ISO timestamp for timestamptz
        status: 'Contacted',
      });

      // Auto-hide success notification after 5 seconds
      setTimeout(() => setCallNotification(null), 5000);
    } catch (error) {
      const name = patient.name || 'Patient';
      console.error('Call failed:', error);
      setCallNotification({
        type: 'error',
        message: `Failed to start call to ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleImportPatients = (newPatients: Patient[]) => {
    setAllPatients(prev => [...prev, ...newPatients]);
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
  };

  const studyTypeCounts = availableStudyTypes.reduce((acc, type) => {
    acc[type.value] = allPatients.filter(p => {
      const disease = (p.qualified_disease || '').toLowerCase();
      return matchesStudyType(disease, type.value);
    }).length;
    return acc;
  }, {} as Record<string, number>);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasActiveFilters = selectedStudyTypes.length > 0 || searchQuery.trim() || contactStatus !== 'All';

  if (loading && allPatients.length === 0) {
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
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
            <label className="text-sm font-semibold text-[var(--foreground)]">Contact Status:</label>
            <div className="flex flex-wrap gap-2">
              {contactStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setContactStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    contactStatus === status
                      ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">Study Type:</label>
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
              {(selectedStudyTypes.length > 0 || contactStatus !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedStudyTypes([]);
                    setContactStatus('All');
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {patients.length === 0 && !loading ? (
          <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              {hasActiveFilters ? 'No results match your search/filters' : 'No patients found'}
            </h3>
            <p className="text-[var(--muted)] mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Get started by importing patient data.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStudyTypes([]);
                  setContactStatus('All');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <PatientTable
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onStartCall={handleStartCall}
            onUpdatePatient={(patient, updates) => handlePatientUpdate(patient.patient_id, updates)}
          />
        )}

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

      {callNotification && (
        <div className="fixed bottom-8 right-8 max-w-md z-50 animate-in slide-in-from-bottom-5">
          <div className={`p-4 rounded-xl border-2 shadow-lg ${
            callNotification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {callNotification.type === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {callNotification.type === 'success' ? 'Call Launched' : 'Call Failed'}
                </p>
                <p className="text-sm mt-1">{callNotification.message}</p>
              </div>
              <button
                onClick={() => setCallNotification(null)}
                className="text-current opacity-70 hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
