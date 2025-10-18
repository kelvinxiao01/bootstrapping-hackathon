import { Patient, EligibilityResult } from '@/types/patient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  async getPatient(id: string): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  },

  async calculateEligibility(id: string): Promise<EligibilityResult> {
    const response = await fetch(`${API_BASE_URL}/eligibility/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to calculate eligibility');
    return response.json();
  },

  async startCall(patientId: string): Promise<{ call_id: string; status: string }> {
    const response = await fetch(`${API_BASE_URL}/calls/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId }),
    });
    if (!response.ok) throw new Error('Failed to start call');
    return response.json();
  },

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update patient');
    return response.json();
  },

  async importPatients(patients: Partial<Patient>[]): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patients }),
    });
    if (!response.ok) throw new Error('Failed to import patients');
    return response.json();
  },
};
