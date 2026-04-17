import { api } from './api'
import type {
  Lead,
  LeadActivity,
  Campaign,
  CRMStats,
  CampaignStats,
  LeadFilters,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateActivityRequest,
  CreateCampaignRequest,
  PaginatedLeads,
} from '../types/crm'

export const leadService = {
  getAll: async (filters?: LeadFilters): Promise<PaginatedLeads> => {
    const response = await api.get<PaginatedLeads>('/crm/leads', { params: filters })
    return response.data
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await api.get<Lead>(`/crm/leads/${id}`)
    return response.data
  },

  getStats: async (): Promise<CRMStats> => {
    const response = await api.get<CRMStats>('/crm/stats')
    return response.data
  },

  create: async (data: CreateLeadRequest): Promise<Lead> => {
    const response = await api.post<Lead>('/crm/leads', data)
    return response.data
  },

  update: async (id: string, data: UpdateLeadRequest): Promise<Lead> => {
    const response = await api.patch<Lead>(`/crm/leads/${id}`, data)
    return response.data
  },
}

export const activityService = {
  getByLead: async (leadId: string): Promise<LeadActivity[]> => {
    const response = await api.get<LeadActivity[]>(`/crm/leads/${leadId}/activities`)
    return response.data
  },

  create: async (data: CreateActivityRequest): Promise<LeadActivity> => {
    const response = await api.post<LeadActivity>('/crm/activities', data)
    return response.data
  },
}

export const campaignService = {
  getAll: async (): Promise<Campaign[]> => {
    const response = await api.get<Campaign[]>('/crm/campaigns')
    return response.data
  },

  getStats: async (): Promise<CampaignStats> => {
    const response = await api.get<CampaignStats>('/crm/campaigns/stats')
    return response.data
  },

  create: async (data: CreateCampaignRequest): Promise<Campaign> => {
    const response = await api.post<Campaign>('/crm/campaigns', data)
    return response.data
  },
}
