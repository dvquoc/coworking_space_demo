import { api } from './api'
import type {
  Building,
  Floor,
  Space,
  PricingRule,
  CreateBuildingRequest,
  UpdateBuildingRequest,
  CreateFloorRequest,
  UpdateFloorRequest,
  CreateSpaceRequest,
  UpdateSpaceRequest,
  CreatePricingRuleRequest,
  UpdatePricingRuleRequest,
  BuildingFilters,
  FloorFilters,
  SpaceFilters,
  PricingRuleFilters,
} from '../types/property'

// ========== BUILDINGS ==========

export const buildingService = {
  // Get all buildings
  getAll: async (filters?: BuildingFilters) => {
    const response = await api.get<Building[]>('/properties/buildings', { params: filters })
    return response.data
  },

  // Get building by ID
  getById: async (id: string) => {
    const response = await api.get<Building>(`/properties/buildings/${id}`)
    return response.data
  },

  // Create building
  create: async (data: CreateBuildingRequest) => {
    const response = await api.post<Building>('/properties/buildings', data)
    return response.data
  },

  // Update building
  update: async ({ id, ...data }: UpdateBuildingRequest) => {
    const response = await api.put<Building>(`/properties/buildings/${id}`, data)
    return response.data
  },

  // Delete building
  delete: async (id: string) => {
    await api.delete(`/properties/buildings/${id}`)
  },
}

// ========== FLOORS ==========

export const floorService = {
  // Get all floors (optionally filtered by building)
  getAll: async (filters?: FloorFilters) => {
    const response = await api.get<Floor[]>('/properties/floors', { params: filters })
    return response.data
  },

  // Get floor by ID
  getById: async (id: string) => {
    const response = await api.get<Floor>(`/properties/floors/${id}`)
    return response.data
  },

  // Create floor
  create: async (data: CreateFloorRequest) => {
    const response = await api.post<Floor>('/properties/floors', data)
    return response.data
  },

  // Update floor
  update: async ({ id, ...data }: UpdateFloorRequest) => {
    const response = await api.put<Floor>(`/properties/floors/${id}`, data)
    return response.data
  },

  // Delete floor
  delete: async (id: string) => {
    await api.delete(`/properties/floors/${id}`)
  },
}

// ========== SPACES ==========

export const spaceService = {
  // Get all spaces (with filters)
  getAll: async (filters?: SpaceFilters) => {
    const response = await api.get<Space[]>('/properties/spaces', { params: filters })
    return response.data
  },

  // Get space by ID
  getById: async (id: string) => {
    const response = await api.get<Space>(`/properties/spaces/${id}`)
    return response.data
  },

  // Create space
  create: async (data: CreateSpaceRequest) => {
    const response = await api.post<Space>('/properties/spaces', data)
    return response.data
  },

  // Update space
  update: async ({ id, ...data }: UpdateSpaceRequest) => {
    const response = await api.put<Space>(`/properties/spaces/${id}`, data)
    return response.data
  },

  // Delete space
  delete: async (id: string) => {
    await api.delete(`/properties/spaces/${id}`)
  },
}

// ========== PRICING RULES ==========

export const pricingService = {
  // Get all pricing rules (with filters)
  getAll: async (filters?: PricingRuleFilters) => {
    const response = await api.get<PricingRule[]>('/properties/pricing-rules', { params: filters })
    return response.data
  },

  // Get pricing rule by ID
  getById: async (id: string) => {
    const response = await api.get<PricingRule>(`/properties/pricing-rules/${id}`)
    return response.data
  },

  // Get active pricing for a space
  getActivePrice: async (spaceId: string) => {
    const response = await api.get<PricingRule>(`/properties/spaces/${spaceId}/pricing`)
    return response.data
  },

  // Create pricing rule
  create: async (data: CreatePricingRuleRequest) => {
    const response = await api.post<PricingRule>('/properties/pricing-rules', data)
    return response.data
  },

  // Update pricing rule
  update: async ({ id, ...data }: UpdatePricingRuleRequest) => {
    const response = await api.put<PricingRule>(`/properties/pricing-rules/${id}`, data)
    return response.data
  },

  // Delete pricing rule
  delete: async (id: string) => {
    await api.delete(`/properties/pricing-rules/${id}`)
  },
}
