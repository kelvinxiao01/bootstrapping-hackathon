import { supabase } from './supabase';
import { calculateLocalEligibility } from './eligibilityScoring';

export interface ListPatientsParams {
  filters?: Record<string, any>;
  studyTypes?: string[];
  searchQuery?: string;
  contactStatus?: string;
  sort?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

const TABLE_NAME = 'CrobotMaster';

function matchesStudyType(qualifiedDisease: string, studyType: string): boolean {
  const lowerDisease = (qualifiedDisease || '').toLowerCase();
  
  switch (studyType) {
    case 'Diabetes':
      return lowerDisease.includes('diabetes');
    case 'Chronic Kidney Disease':
      return lowerDisease.includes('ckd') || lowerDisease.includes('kidney');
    case 'Cardiovascular Disease':
    case 'CVD':
      return lowerDisease.includes('cardiovascular') || lowerDisease.includes('cvd') || lowerDisease.includes('heart');
    case 'Oncology':
      return lowerDisease.includes('oncology') || lowerDisease.includes('cancer');
    case 'Dermatology':
      return lowerDisease.includes('dermatology') || lowerDisease.includes('eczema') || lowerDisease.includes('skin');
    case 'Metabolic/Obesity':
      return lowerDisease.includes('metabolic') || lowerDisease.includes('obesity');
    case 'Neurology':
      return lowerDisease.includes('neurology') || lowerDisease.includes('stroke');
    default:
      return lowerDisease.includes(studyType.toLowerCase());
  }
}

export const api = {
  async listPatients(params: ListPatientsParams = {}) {
    let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });

    const hasSearch = params.searchQuery && params.searchQuery.trim();
    const hasStudyTypes = params.studyTypes && params.studyTypes.length > 0;

    if (hasSearch) {
      const search = params.searchQuery!.trim();
      const normalizedSearch = search.replace(/[\s\-]/g, '');
      
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${normalizedSearch}%,email.ilike.%${search}%`
      );
    }

    if (params.contactStatus && params.contactStatus !== 'All') {
      query = query.eq('status', params.contactStatus);
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

    if (!hasStudyTypes) {
      if (params.limit && params.offset !== undefined) {
        query = query.range(params.offset, params.offset + params.limit - 1);
      } else if (params.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error, count } = await query;
      if (error) throw error;
      return { data: data || [], count: count || 0 };
    }

    const { data, error } = await query;
    if (error) throw error;

    const filteredData = (data || []).filter(patient => {
      const qualifiedDisease = patient.qualified_disease || patient.qualified_condition || '';
      return params.studyTypes!.every(studyType => matchesStudyType(qualifiedDisease, studyType));
    });

    const totalCount = filteredData.length;
    
    const paginatedData = params.limit && params.offset !== undefined
      ? filteredData.slice(params.offset, params.offset + params.limit)
      : params.limit
      ? filteredData.slice(0, params.limit)
      : filteredData;

    return { data: paginatedData, count: totalCount };
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
      headers: { 'Content-Type': 'application/json'},
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
