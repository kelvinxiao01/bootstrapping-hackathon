import { supabase } from './supabase';
import { calculateLocalEligibility } from './eligibilityScoring';

export interface ListPatientsParams {
  filters?: Record<string, any>;
  studyTypes?: string[];
  searchQuery?: string;
  sort?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

const TABLE_NAME = 'Crobot Patient Database';

export const api = {
  async listPatients(params: ListPatientsParams = {}) {
    let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });

    if (params.studyTypes && params.studyTypes.length > 0) {
      params.studyTypes.forEach(type => {
        if (type === 'CVD') {
          query = query.or(`qualified_disease.ilike.%CVD%,qualified_disease.ilike.%Cardiovascular%`);
        } else {
          query = query.ilike('qualified_disease', `%${type}%`);
        }
      });
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const search = params.searchQuery.trim();
      query = query.or(
        `full_name.ilike.%${search}%,qualified_disease.ilike.%${search}%`
      );
    }

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

    if (params.limit && params.offset !== undefined) {
      query = query.range(params.offset, params.offset + params.limit - 1);
    } else if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async getPatient(id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('patient_id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updatePatient(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('patient_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
