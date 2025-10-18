import { supabase } from './supabase';
import { calculateLocalEligibility } from './eligibilityScoring';

export interface ListPatientsParams {
  sort?: { column: string; ascending: boolean };
}

const TABLE_NAME = 'CrobotMaster';

export const api = {
  async listPatients(params: ListPatientsParams = {}) {
    const BATCH_SIZE = 1000;
    let allData: any[] = [];
    let from = 0;
    let hasMore = true;

    // Paginate through all rows in batches to bypass 1000 row limit
    while (hasMore) {
      let query = supabase
        .from(TABLE_NAME)
        .select('*')
        .range(from, from + BATCH_SIZE - 1);

      // Apply sorting if specified
      if (params.sort) {
        query = query.order(params.sort.column, { ascending: params.sort.ascending });
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += BATCH_SIZE;
        // Continue if we got a full batch (might be more rows)
        hasMore = data.length === BATCH_SIZE;
      } else {
        hasMore = false;
      }
    }

    return { data: allData, count: allData.length };
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
      .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  async startCall(patient: any): Promise<{ success: boolean; room_name: string; job_id: string; message: string }> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Build participant context from patient data
    const participantContext = patient.qualified_disease
      ? `Researcher with expertise in ${patient.qualified_disease}. Found on ResearchGate.`
      : 'Researcher found on ResearchGate.';

    const response = await fetch(`${API_BASE_URL}/api/launch-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participant_name: patient.name || patient.full_name || 'Unknown',
        participant_context: participantContext,
        phone_number: patient.phone,
        trial_name: patient.qualified_disease || 'Clinical Trial',
        trial_description: 'A clinical trial testing a new diabetes treatment with monthly visits over 6 months.',
        compensation_info: '$500 per visit',
        contact_info: 'For questions, contact research@clinicaltrials.com'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to start call: ${error}`);
    }

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
