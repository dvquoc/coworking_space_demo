import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadService, activityService, campaignService } from '../services/crmService'
import * as crmMocks from '../mocks/crmMocks'
import type {
  LeadFilters,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateActivityRequest,
  CreateCampaignRequest,
} from '../types/crm'

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ========== LEAD HOOKS ==========

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ['crm-leads', filters],
    queryFn: () =>
      MOCK_API ? crmMocks.getLeads(filters) : leadService.getAll(filters),
  })
}

export function useLeadById(id: string) {
  return useQuery({
    queryKey: ['crm-leads', id],
    queryFn: () =>
      MOCK_API ? crmMocks.getLeadById(id) : leadService.getById(id),
    enabled: !!id,
  })
}

export function useCRMStats() {
  return useQuery({
    queryKey: ['crm-stats'],
    queryFn: () =>
      MOCK_API ? crmMocks.getCRMStats() : leadService.getStats(),
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLeadRequest) =>
      MOCK_API ? Promise.resolve(crmMocks.createLead(data)) : leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      queryClient.invalidateQueries({ queryKey: ['crm-stats'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadRequest }) =>
      MOCK_API ? Promise.resolve(crmMocks.updateLead(id, data)) : leadService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      queryClient.invalidateQueries({ queryKey: ['crm-stats'] })
    },
  })
}

// ========== ACTIVITY HOOKS ==========

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ['crm-activities', leadId],
    queryFn: () =>
      MOCK_API
        ? Promise.resolve(crmMocks.getActivitiesForLead(leadId))
        : activityService.getByLead(leadId),
    enabled: !!leadId,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateActivityRequest) =>
      MOCK_API ? Promise.resolve(crmMocks.createActivity(data)) : activityService.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities', variables.leadId] })
    },
  })
}

// ========== CAMPAIGN HOOKS ==========

export function useCampaigns() {
  return useQuery({
    queryKey: ['crm-campaigns'],
    queryFn: () =>
      MOCK_API ? Promise.resolve(crmMocks.getCampaigns()) : campaignService.getAll(),
  })
}

export function useCampaignStats() {
  return useQuery({
    queryKey: ['crm-campaign-stats'],
    queryFn: () =>
      MOCK_API ? Promise.resolve(crmMocks.getCampaignStats()) : campaignService.getStats(),
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) =>
      MOCK_API ? Promise.resolve(crmMocks.createCampaign(data)) : campaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['crm-campaign-stats'] })
    },
  })
}
