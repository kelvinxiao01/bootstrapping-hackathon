import { supabase } from './supabase';
import { calculateLocalEligibility } from './eligibilityScoring';

export interface ListPatientsParams {
  filters?: Record<string, any>;
  sort?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

const TABLE_NAME = 'Crobot Patient Database';

export const api = {
  async listPatients(params: ListPatientsParams = {}) {
    let query = supabase.from(TABLE_NAME).select('*');

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    if (params.sort) {
      query = query.order(params.sort.column, { ascending: params.sort.ascending });
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 100) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getPatient(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .or(`id.eq.${id},patient_id.eq.${id}`)
      .single();

    if (error) throw error;
    return data;
  },

  async updatePatient(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .or(`id.eq.${id},patient_id.eq.${id}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rescorePatient(id: string) {
    const patient = await this.getPatient(id);
    const eligibility = calculateLocalEligibility(patient);

    const updates = {
      top_category: eligibility.topCategory,
      eligibility_score: eligibility.score,
      eligibility_label: eligibility.label,
    };

    return await this.updatePatient(id, updates);
  },

  async startCall(patientId: string): Promise<{ call_id: string; status: string }> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE_URL}/calls/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId }),
    });
    if (!response.ok) throw new Error('Failed to start call');
    return response.json();
  },

  subscribeToPatients(callback: (payload: any) => void) {
    return supabase
      .channel('patients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, callback)
      .subscribe();
  },

  async getTableColumns() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]);
  },
};
