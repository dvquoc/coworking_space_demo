import { api } from './api'
import type {
  // Templates
  ContractTemplate,
  ContractTemplateListItem,
  PaginatedTemplates,
  TemplateFilters,
  CreateContractTemplateRequest,
  UpdateContractTemplateRequest,
  // Contracts
  Contract,
  ContractDetails,
  ContractListItem,
  PaginatedContracts,
  ContractFilters,
  CreateContractRequest,
  UpdateContractRequest,
  ActivateContractRequest,
  TerminateContractRequest,
  ExtendContractRequest,
  ActivateContractResponse,
  TerminateContractResponse,
  ExtendContractResponse,
  GenerateContentResponse,
  // Terms
  TermsAndConditions,
  PaginatedTerms,
  TermsFilters,
  CreateTermsRequest,
  UpdateTermsRequest,
  // Acceptance
  AcceptanceLog,
  AcceptanceLogListItem,
  AcceptTermsRequest,
  AcceptTermsResponse,
  // Dashboard
  ContractDashboardStats,
  ExpiringContract,
  RenewalQueueItem,
} from '../types/contract'

// ========== CONTRACT TEMPLATE SERVICE ==========

export const contractTemplateService = {
  // Get paginated templates
  getAll: async (filters?: TemplateFilters): Promise<PaginatedTemplates> => {
    const response = await api.get<PaginatedTemplates>('/contract-templates', { params: filters })
    return response.data
  },

  // Get template by ID
  getById: async (id: string): Promise<ContractTemplate> => {
    const response = await api.get<ContractTemplate>(`/contract-templates/${id}`)
    return response.data
  },

  // Get templates for dropdown (active only)
  getForDropdown: async (): Promise<ContractTemplateListItem[]> => {
    const response = await api.get<ContractTemplateListItem[]>('/contract-templates/dropdown')
    return response.data
  },

  // Create template
  create: async (data: CreateContractTemplateRequest): Promise<ContractTemplate> => {
    const response = await api.post<ContractTemplate>('/contract-templates', data)
    return response.data
  },

  // Update template
  update: async ({ id, ...data }: UpdateContractTemplateRequest): Promise<ContractTemplate> => {
    const response = await api.put<ContractTemplate>(`/contract-templates/${id}`, data)
    return response.data
  },

  // Delete template
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contract-templates/${id}`)
  },

  // Activate/deactivate template
  setActive: async (id: string, isActive: boolean): Promise<ContractTemplate> => {
    const response = await api.patch<ContractTemplate>(`/contract-templates/${id}/active`, { isActive })
    return response.data
  },

  // Set as default template
  setDefault: async (id: string): Promise<ContractTemplate> => {
    const response = await api.patch<ContractTemplate>(`/contract-templates/${id}/default`)
    return response.data
  },

  // Clone template to create new version
  clone: async (id: string): Promise<ContractTemplate> => {
    const response = await api.post<ContractTemplate>(`/contract-templates/${id}/clone`)
    return response.data
  },
}

// ========== CONTRACT SERVICE ==========

export const contractService = {
  // Get paginated contracts
  getAll: async (filters?: ContractFilters): Promise<PaginatedContracts> => {
    const response = await api.get<PaginatedContracts>('/contracts', { params: filters })
    return response.data
  },

  // Get contract by ID
  getById: async (id: string): Promise<ContractDetails> => {
    const response = await api.get<ContractDetails>(`/contracts/${id}`)
    return response.data
  },

  // Create contract (draft)
  create: async (data: CreateContractRequest): Promise<Contract> => {
    const response = await api.post<Contract>('/contracts', data)
    return response.data
  },

  // Update contract (draft only)
  update: async ({ id, ...data }: UpdateContractRequest): Promise<Contract> => {
    const response = await api.put<Contract>(`/contracts/${id}`, data)
    return response.data
  },

  // Delete contract (draft only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contracts/${id}`)
  },

  // Generate/preview content
  generateContent: async (id: string): Promise<GenerateContentResponse> => {
    const response = await api.post<GenerateContentResponse>(`/contracts/${id}/generate-content`)
    return response.data
  },

  // Re-generate content (draft only)
  regenerateContent: async (id: string): Promise<GenerateContentResponse> => {
    const response = await api.post<GenerateContentResponse>(`/contracts/${id}/regenerate-content`)
    return response.data
  },

  // Activate contract
  activate: async ({ id, signedDate }: ActivateContractRequest): Promise<ActivateContractResponse> => {
    const response = await api.patch<ActivateContractResponse>(`/contracts/${id}/activate`, { signedDate })
    return response.data
  },

  // Terminate contract
  terminate: async ({
    id,
    terminationDate,
    reason,
    reasonNotes,
    earlyTerminationFee,
  }: TerminateContractRequest): Promise<TerminateContractResponse> => {
    const response = await api.patch<TerminateContractResponse>(`/contracts/${id}/terminate`, {
      terminationDate,
      reason,
      reasonNotes,
      earlyTerminationFee,
    })
    return response.data
  },

  // Extend/renew contract
  extend: async ({
    id,
    extensionType,
    additionalMonths,
    newMonthlyFee,
  }: ExtendContractRequest): Promise<ExtendContractResponse> => {
    const response = await api.post<ExtendContractResponse>(`/contracts/${id}/extend`, {
      extensionType,
      additionalMonths,
      newMonthlyFee,
    })
    return response.data
  },

  // Toggle auto-renewal
  setAutoRenewal: async (id: string, enabled: boolean): Promise<Contract> => {
    const response = await api.patch<Contract>(`/contracts/${id}/auto-renewal`, { enabled })
    return response.data
  },

  // Opt-out of auto-renewal (customer action)
  optOutRenewal: async (id: string, token: string, reason?: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/contracts/${id}/opt-out-renewal`, {
      token,
      reason,
    })
    return response.data
  },

  // Get customer contracts
  getByCustomer: async (customerId: string): Promise<ContractListItem[]> => {
    const response = await api.get<ContractListItem[]>(`/customers/${customerId}/contracts`)
    return response.data
  },

  // Export contract as PDF
  exportPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/contracts/${id}/export-pdf`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<ContractDashboardStats> => {
    const response = await api.get<ContractDashboardStats>('/contracts/dashboard/stats')
    return response.data
  },

  // Get expiring contracts (for dashboard widget)
  getExpiring: async (days?: number): Promise<ExpiringContract[]> => {
    const response = await api.get<ExpiringContract[]>('/contracts/expiring', {
      params: { days: days || 30 },
    })
    return response.data
  },

  // Get renewal queue
  getRenewalQueue: async (): Promise<RenewalQueueItem[]> => {
    const response = await api.get<RenewalQueueItem[]>('/contracts/renewal-queue')
    return response.data
  },
}

// ========== TERMS AND CONDITIONS SERVICE ==========

export const termsService = {
  // Get paginated terms
  getAll: async (filters?: TermsFilters): Promise<PaginatedTerms> => {
    const response = await api.get<PaginatedTerms>('/terms', { params: filters })
    return response.data
  },

  // Get terms by ID
  getById: async (id: string): Promise<TermsAndConditions> => {
    const response = await api.get<TermsAndConditions>(`/terms/${id}`)
    return response.data
  },

  // Get active terms for space type
  getActiveForSpaceType: async (spaceType: string): Promise<TermsAndConditions | undefined> => {
    const response = await api.get<TermsAndConditions>('/terms/active', {
      params: { spaceType },
    })
    return response.data
  },

  // Create terms
  create: async (data: CreateTermsRequest): Promise<TermsAndConditions> => {
    const response = await api.post<TermsAndConditions>('/terms', data)
    return response.data
  },

  // Update terms (creates new version)
  update: async ({ id, ...data }: UpdateTermsRequest): Promise<TermsAndConditions> => {
    const response = await api.put<TermsAndConditions>(`/terms/${id}`, data)
    return response.data
  },

  // Delete terms
  delete: async (id: string): Promise<void> => {
    await api.delete(`/terms/${id}`)
  },

  // Activate/deactivate terms
  setActive: async (id: string, isActive: boolean): Promise<TermsAndConditions> => {
    const response = await api.patch<TermsAndConditions>(`/terms/${id}/active`, { isActive })
    return response.data
  },

  // Clone terms for editing
  clone: async (id: string): Promise<TermsAndConditions> => {
    const response = await api.post<TermsAndConditions>(`/terms/${id}/clone`)
    return response.data
  },
}

// ========== ACCEPTANCE LOG SERVICE ==========

export const acceptanceLogService = {
  // Get acceptance logs for a customer
  getByCustomer: async (customerId: string): Promise<AcceptanceLogListItem[]> => {
    const response = await api.get<AcceptanceLogListItem[]>(`/customers/${customerId}/acceptance-logs`)
    return response.data
  },

  // Get acceptance log detail
  getById: async (id: string): Promise<AcceptanceLog> => {
    const response = await api.get<AcceptanceLog>(`/acceptance-logs/${id}`)
    return response.data
  },

  // Accept terms
  acceptTerms: async (data: AcceptTermsRequest): Promise<AcceptTermsResponse> => {
    const response = await api.post<AcceptTermsResponse>('/terms/accept', data)
    return response.data
  },

  // Check if customer needs to re-accept terms
  checkAcceptance: async (
    customerId: string,
    spaceType: string
  ): Promise<{
    needsAcceptance: boolean
    currentTerms?: { id: string; version: string; title: string }
    lastAccepted?: { version: string; acceptedAt: string }
  }> => {
    const response = await api.get('/terms/check-acceptance', {
      params: { customerId, spaceType },
    })
    return response.data
  },

  // Export acceptance log as PDF
  exportPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/acceptance-logs/${id}/export-pdf`, {
      responseType: 'blob',
    })
    return response.data
  },
}
