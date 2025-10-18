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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Patient Data
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="space-y-4">
              <div className="text-4xl">📄</div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Drop CSV file here or click to upload
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CSV should include: name, age, diagnosis, email, phone, medications
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
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Sample CSV Format
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto text-gray-800 dark:text-gray-200">
              {sampleCsv}
            </pre>
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Preview ({preview.length} patients)
              </h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Age
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Diagnosis
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {preview.slice(0, 5).map((patient, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-gray-900 dark:text-white">
                            {patient.name}
                          </td>
                          <td className="px-4 py-2 text-gray-900 dark:text-white">
                            {patient.age}
                          </td>
                          <td className="px-4 py-2 text-gray-900 dark:text-white">
                            {patient.diagnosis}
                          </td>
                          <td className="px-4 py-2 text-gray-900 dark:text-white">
                            {patient.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={preview.length === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Import {preview.length > 0 && `(${preview.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
