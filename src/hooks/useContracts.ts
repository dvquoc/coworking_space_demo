import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  contractTemplateService,
  contractService,
  termsService,
  acceptanceLogService,
} from '../services/contractService'
import * as contractMocks from '../mocks/contractMocks'
import type {
  TemplateFilters,
  ContractFilters,
  TermsFilters,
  CreateContractTemplateRequest,
  UpdateContractTemplateRequest,
  CreateContractRequest,
  UpdateContractRequest,
  ActivateContractRequest,
  TerminateContractRequest,
  ExtendContractRequest,
  CreateTermsRequest,
  UpdateTermsRequest,
  AcceptTermsRequest,
} from '../types/contract'

// Mock mode flag
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ========== CONTRACT TEMPLATE HOOKS ==========

export function useContractTemplates(filters?: TemplateFilters) {
  return useQuery({
    queryKey: ['contract-templates', filters],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getTemplates(filters)
        : contractTemplateService.getAll(filters),
  })
}

export function useContractTemplate(id: string) {
  return useQuery({
    queryKey: ['contract-templates', id],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getTemplateById(id)
        : contractTemplateService.getById(id),
    enabled: !!id,
  })
}

export function useContractTemplatesDropdown() {
  return useQuery({
    queryKey: ['contract-templates', 'dropdown'],
    queryFn: () =>
      MOCK_API
        ? contractMocks
            .getTemplates({ isActive: true })
            .data
        : contractTemplateService.getForDropdown(),
  })
}

export function useCreateContractTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContractTemplateRequest) =>
      MOCK_API
        ? Promise.resolve(contractMocks.createTemplate(data))
        : contractTemplateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] })
    },
  })
}

export function useUpdateContractTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateContractTemplateRequest) =>
      MOCK_API
        ? Promise.resolve(contractMocks.updateTemplate(data))
        : contractTemplateService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] })
      queryClient.invalidateQueries({
        queryKey: ['contract-templates', variables.id],
      })
    },
  })
}

export function useDeleteContractTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      MOCK_API
        ? Promise.resolve(contractMocks.deleteTemplate(id))
        : contractTemplateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] })
    },
  })
}

export function useSetTemplateActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      MOCK_API
        ? Promise.resolve(contractMocks.getTemplateById(id)!)
        : contractTemplateService.setActive(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] })
      queryClient.invalidateQueries({
        queryKey: ['contract-templates', variables.id],
      })
    },
  })
}

// ========== CONTRACT HOOKS ==========

export function useContracts(filters?: ContractFilters) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getContracts(filters)
        : contractService.getAll(filters),
  })
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getContractById(id)
        : contractService.getById(id),
    enabled: !!id,
  })
}

export function useCreateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContractRequest) =>
      MOCK_API
        ? Promise.resolve(contractMocks.createContract(data))
        : contractService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useUpdateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateContractRequest) =>
      MOCK_API
        ? Promise.resolve(contractMocks.getContractById(data.id)!)
        : contractService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useDeleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      MOCK_API ? Promise.resolve() : contractService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useActivateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ActivateContractRequest) =>
      MOCK_API
        ? Promise.resolve({
            contract: contractMocks.activateContract(data.id),
            message: 'Contract activated successfully',
          })
        : contractService.activate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useTerminateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TerminateContractRequest) =>
      MOCK_API
        ? Promise.resolve({
            contract: contractMocks.terminateContract(data.id, data.reason),
            settlement: undefined,
            message: 'Contract terminated successfully',
          })
        : contractService.terminate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useExtendContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExtendContractRequest) =>
      MOCK_API
        ? Promise.resolve({
            originalContract: contractMocks.getContractById(data.id)!,
            message: 'Contract extended successfully',
          })
        : contractService.extend(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useSetAutoRenewal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      MOCK_API
        ? Promise.resolve(contractMocks.getContractById(id)!)
        : contractService.setAutoRenewal(id, enabled),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

// Dashboard hooks
export function useContractDashboardStats() {
  return useQuery({
    queryKey: ['contracts', 'dashboard', 'stats'],
    queryFn: () =>
      MOCK_API
        ? contractMocks.mockContractDashboardStats
        : contractService.getDashboardStats(),
  })
}

export function useExpiringContracts(days?: number) {
  return useQuery({
    queryKey: ['contracts', 'expiring', days],
    queryFn: () =>
      MOCK_API
        ? contractMocks.mockExpiringContracts
        : contractService.getExpiring(days),
  })
}

export function useRenewalQueue() {
  return useQuery({
    queryKey: ['contracts', 'renewal-queue'],
    queryFn: () =>
      MOCK_API
        ? contractMocks.mockRenewalQueue
        : contractService.getRenewalQueue(),
  })
}

// ========== TERMS AND CONDITIONS HOOKS ==========

export function useTerms(filters?: TermsFilters) {
  return useQuery({
    queryKey: ['terms', filters],
    queryFn: () =>
      MOCK_API ? contractMocks.getTerms(filters) : termsService.getAll(filters),
  })
}

export function useTermsById(id: string) {
  return useQuery({
    queryKey: ['terms', id],
    queryFn: () =>
      MOCK_API ? contractMocks.getTermsById(id) : termsService.getById(id),
    enabled: !!id,
  })
}

export function useActiveTermsForSpaceType(spaceType: string) {
  return useQuery({
    queryKey: ['terms', 'active', spaceType],
    queryFn: () =>
      MOCK_API
        ? contractMocks.mockTermsAndConditions.find(
            (t) => t.applicableSpaceTypes.includes(spaceType as any) && t.isActive
          )
        : termsService.getActiveForSpaceType(spaceType),
    enabled: !!spaceType,
  })
}

export function useCreateTerms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTermsRequest) =>
      MOCK_API ? Promise.resolve(contractMocks.createTerms(data)) : termsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] })
    },
  })
}

export function useUpdateTerms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTermsRequest) =>
      MOCK_API
        ? Promise.resolve(contractMocks.getTermsById(data.id)!)
        : termsService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['terms'] })
      queryClient.invalidateQueries({ queryKey: ['terms', variables.id] })
    },
  })
}

export function useDeleteTerms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      MOCK_API ? Promise.resolve() : termsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] })
    },
  })
}

// ========== ACCEPTANCE LOG HOOKS ==========

export function useAcceptanceLogs(customerId: string) {
  return useQuery({
    queryKey: ['acceptance-logs', customerId],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getAcceptanceLogs(customerId)
        : acceptanceLogService.getByCustomer(customerId),
    enabled: !!customerId,
  })
}

export function useAcceptanceLog(id: string) {
  return useQuery({
    queryKey: ['acceptance-logs', 'detail', id],
    queryFn: () =>
      MOCK_API
        ? contractMocks.getAcceptanceLogById(id)
        : acceptanceLogService.getById(id),
    enabled: !!id,
  })
}

export function useAcceptTerms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AcceptTermsRequest) =>
      MOCK_API
        ? Promise.resolve({
            acceptanceLogId: 'al-new',
            acceptedAt: new Date().toISOString(),
            message: 'Terms accepted successfully',
          })
        : acceptanceLogService.acceptTerms(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acceptance-logs'] })
    },
  })
}

export function useCheckTermsAcceptance(customerId: string, spaceType: string) {
  return useQuery({
    queryKey: ['terms', 'check-acceptance', customerId, spaceType],
    queryFn: () =>
      MOCK_API
        ? Promise.resolve({
            needsAcceptance: true,
            currentTerms: {
              id: 'tc-001',
              version: '2.1',
              title: 'Điều khoản sử dụng Hot Desk',
            },
          })
        : acceptanceLogService.checkAcceptance(customerId, spaceType),
    enabled: !!customerId && !!spaceType,
  })
}
