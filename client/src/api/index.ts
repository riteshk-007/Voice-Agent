import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Job API
export const jobsApi = {
  getAll: () => api.get("/jobs"),
  getById: (id: number) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post("/jobs", data),
  update: (id: number, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: number) => api.delete(`/jobs/${id}`),
};

// Candidate API
export const candidatesApi = {
  getAll: () => api.get("/candidates"),
  getById: (id: number) => api.get(`/candidates/${id}`),
  create: (data: any) => api.post("/candidates", data),
  update: (id: number, data: any) => api.put(`/candidates/${id}`, data),
  delete: (id: number) => api.delete(`/candidates/${id}`),
};

// Appointment API
export const appointmentsApi = {
  getAll: () => api.get("/appointments"),
  getById: (id: number) => api.get(`/appointments/${id}`),
  create: (data: any) => api.post("/appointments", data),
  update: (id: number, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};

// Conversation API
export const conversationsApi = {
  getAll: () => api.get("/conversations"),
  getById: (id: number) => api.get(`/conversations/${id}`),
  getByCandidate: (candidateId: number) =>
    api.get(`/conversations/candidate/${candidateId}`),
  create: (data: any) => api.post("/conversations", data),
  update: (id: number, data: any) => api.put(`/conversations/${id}`, data),
  delete: (id: number) => api.delete(`/conversations/${id}`),
};

// Voice Agent API
export const voiceAgentApi = {
  startConversation: (data: { candidate_id: number; job_id: number }) =>
    api.post("/voice-agent/start", data),

  processResponse: (data: {
    conversation_id: number;
    response: string;
    current_step: string;
  }) => api.post("/voice-agent/process", data),

  simulateCall: (data: {
    candidate_id: number;
    job_id: number;
    responses: string[];
  }) => api.post("/voice-agent/simulate", data),
};
