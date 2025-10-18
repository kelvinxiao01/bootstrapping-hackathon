'use client';

import { useState } from 'react';
import { Patient } from '@/types/patient';

interface ImportCSVProps {
  onImport: (patients: Patient[]) => void;
  onClose: () => void;
}

export default function ImportCSV({ onImport, onClose }: ImportCSVProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [preview, setPreview] = useState<Partial<Patient>[]>([]);

  const parseCsv = (text: string): Partial<Patient>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const patients: Partial<Patient>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const patient: Partial<Patient> = {
        id: `imported_${Date.now()}_${i}`,
        status: 'pending',
        score: 0,
        eligibilityCriteria: {
          ageRange: false,
          diagnosisMatch: false,
          noContraindications: false,
          labResultsNormal: false,
          informedConsent: false,
        },
        medications: [],
        testResults: {},
        createdAt: new Date().toISOString().split('T')[0],
      };

      headers.forEach((header, idx) => {
        const value = values[idx] || '';
        
        if (header.includes('name')) patient.name = value;
        else if (header.includes('age')) patient.age = parseInt(value) || 0;
        else if (header.includes('diagnosis') || header.includes('condition')) patient.diagnosis = value;
        else if (header.includes('email')) patient.email = value;
        else if (header.includes('phone')) patient.phone = value;
        else if (header.includes('medication')) {
          patient.medications = value ? value.split(';').map(m => m.trim()) : [];
        }
      });

      if (patient.name && patient.age) {
        patients.push(patient);
      }
    }

    return patients;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);
      const parsed = parseCsv(text);
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvData(text);
        const parsed = parseCsv(text);
        setPreview(parsed);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    
    const fullPatients: Patient[] = preview.map(p => ({
      id: p.id!,
      name: p.name!,
      age: p.age!,
      diagnosis: p.diagnosis || 'Unknown',
      medications: p.medications || [],
      testResults: p.testResults || {},
      status: p.status || 'pending',
      score: p.score || 0,
      email: p.email,
      phone: p.phone,
      eligibilityCriteria: p.eligibilityCriteria!,
      createdAt: p.createdAt!,
    }));

    onImport(fullPatients);
  };

  const sampleCsv = `name,age,diagnosis,email,phone,medications
John Doe,52,Hypertension,john@email.com,(555) 111-2222,Lisinopril;Metformin
Jane Smith,48,Type 2 Diabetes,jane@email.com,(555) 222-3333,Insulin;Metformin`;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-in">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-[var(--border)] px-8 py-6 z-10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Import Patients
              </h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Upload a CSV file to add patients to the database
              </p>
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

        <div className="px-8 py-6 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center smooth-transition ${
              isDragging
                ? 'border-[var(--accent)] bg-blue-50/50'
                : 'border-gray-200 hover:border-[var(--accent)]/50 hover:bg-gray-50/50'
            }`}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center smooth-transition hover:scale-105">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-[var(--foreground)] font-medium mb-2">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-[var(--muted)]">
                  or click to browse from your computer
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl cursor-pointer hover-lift smooth-transition font-medium"
              >
                Choose File
              </label>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gray-50">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">
              Sample CSV Format
            </p>
            <pre className="bg-white p-4 rounded-lg text-xs overflow-x-auto text-[var(--foreground)] font-mono border border-[var(--border)]">
              {sampleCsv}
            </pre>
          </div>

          {preview.length > 0 && (
            <div className="space-y-3 scale-in">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
                  Preview
                </p>
                <span className="px-3 py-1 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-xs font-semibold">
                  {preview.length} {preview.length === 1 ? 'patient' : 'patients'}
                </span>
              </div>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {preview.slice(0, 5).map((patient, idx) => (
                        <tr key={idx} className="border-b border-[var(--border)] last:border-0">
                          <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                            {patient.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                            {patient.age}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                            {patient.diagnosis}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">
                            {patient.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {preview.length > 5 && (
                <p className="text-xs text-[var(--muted)] text-center">
                  Showing 5 of {preview.length} patients
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-xl font-medium hover:bg-gray-50 smooth-transition"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={preview.length === 0}
              className="flex-1 px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium shadow-sm hover-lift smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {preview.length > 0 && `(${preview.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
