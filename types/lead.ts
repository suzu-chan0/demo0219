export interface Lead {
  id: number;
  name: string;
  created_at: string;
}

export interface CreateLeadRequest {
  name: string;
}
