import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockPricingAPI, mockPricingCatalogAPI } from '../mocks/pricingMocks'
import type {
  PromotionStatus,
  PromotionType,
  CreatePromotionRequest,
  CreateVoucherRequest,
  PromotionProgram,
  SpacePricingRule,
  AddOnServicePricing,
} from '../types/pricing'

export interface PromotionFilters {
  status?: PromotionStatus
  type?: PromotionType
  search?: string
}

export interface VoucherFilters {
  promotionId?: string
  isActive?: boolean
  search?: string
}

// ========== PROMOTIONS ==========

export function usePromotions(filters?: PromotionFilters) {
  return useQuery({
    queryKey: ['promotions', filters],
    queryFn: () => mockPricingAPI.getPromotions(filters),
  })
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotions', id],
    queryFn: () => mockPricingAPI.getPromotion(id),
    enabled: !!id,
  })
}

export function useCreatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePromotionRequest) => mockPricingAPI.createPromotion(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  })
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionProgram> }) =>
      mockPricingAPI.updatePromotion(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  })
}

export function useApprovePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockPricingAPI.approvePromotion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  })
}

export function usePauseResumePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockPricingAPI.pauseResumePromotion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  })
}

// ========== VOUCHERS ==========

export function useVouchers(filters?: VoucherFilters) {
  return useQuery({
    queryKey: ['vouchers', filters],
    queryFn: () => mockPricingAPI.getVouchers(filters),
  })
}

export function useCreateVouchers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVoucherRequest) => mockPricingAPI.createVouchers(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}

export function useRevokeVoucher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockPricingAPI.revokeVoucher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}

export function useValidateVoucher() {
  return useMutation({
    mutationFn: (code: string) => mockPricingAPI.validateVoucher(code),
  })
}

// ========== SPACE PRICING (F-81, F-83) ==========

export function useSpacePricingRules() {
  return useQuery({
    queryKey: ['space-pricing'],
    queryFn: () => mockPricingCatalogAPI.getSpacePricing(),
  })
}

export function useCreateSpacePricingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<SpacePricingRule, 'id' | 'createdAt' | 'updatedAt'>) =>
      mockPricingCatalogAPI.createSpacePricingRule(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['space-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

export function useUpdateSpacePricingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpacePricingRule> }) =>
      mockPricingCatalogAPI.updateSpacePricingRule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['space-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

export function useToggleSpacePricingActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockPricingCatalogAPI.toggleSpacePricingActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['space-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

// ========== ADD-ON PRICING (F-82) ==========

export function useAddOnPricingRules() {
  return useQuery({
    queryKey: ['addon-pricing'],
    queryFn: () => mockPricingCatalogAPI.getAddOnPricing(),
  })
}

export function useCreateAddOnPricingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<AddOnServicePricing, 'id' | 'createdAt' | 'updatedAt'>) =>
      mockPricingCatalogAPI.createAddOnPricingRule(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addon-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

export function useUpdateAddOnPricingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddOnServicePricing> }) =>
      mockPricingCatalogAPI.updateAddOnPricingRule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addon-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

export function useToggleAddOnActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockPricingCatalogAPI.toggleAddOnActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addon-pricing'] })
      qc.invalidateQueries({ queryKey: ['pricing-history'] })
    },
  })
}

// ========== PRICING HISTORY (F-84) ==========

export function usePricingHistory(entityType?: 'space_pricing' | 'addon_pricing') {
  return useQuery({
    queryKey: ['pricing-history', entityType],
    queryFn: () => mockPricingCatalogAPI.getPricingHistory(entityType),
  })
}
