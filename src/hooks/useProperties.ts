import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { buildingService, floorService, spaceService, pricingService } from '../services/propertyService'
import { mockPropertyAPI } from '../mocks/propertyMocks'
import type {
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

// Mock mode flag
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ========== BUILDINGS HOOKS ==========

export function useBuildings(filters?: BuildingFilters) {
  return useQuery({
    queryKey: ['buildings', filters],
    queryFn: () => MOCK_API ? mockPropertyAPI.getBuildings(filters) : buildingService.getAll(filters),
  })
}

export function useBuilding(id: string) {
  return useQuery({
    queryKey: ['buildings', id],
    queryFn: () => MOCK_API ? mockPropertyAPI.getBuilding(id) : buildingService.getById(id),
    enabled: !!id,
  })
}

export function useCreateBuilding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateBuildingRequest) => 
      MOCK_API ? mockPropertyAPI.createBuilding(data) : buildingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
    },
  })
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateBuildingRequest) => 
      MOCK_API ? mockPropertyAPI.updateBuilding(data) : buildingService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      queryClient.invalidateQueries({ queryKey: ['buildings', variables.id] })
    },
  })
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => 
      MOCK_API ? mockPropertyAPI.deleteBuilding(id) : buildingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
    },
  })
}

// ========== FLOORS HOOKS ==========

export function useFloors(filters?: FloorFilters) {
  return useQuery({
    queryKey: ['floors', filters],
    queryFn: () => MOCK_API ? mockPropertyAPI.getFloors(filters) : floorService.getAll(filters),
  })
}

export function useFloor(id: string) {
  return useQuery({
    queryKey: ['floors', id],
    queryFn: () => MOCK_API ? mockPropertyAPI.getFloor(id) : floorService.getById(id),
    enabled: !!id,
  })
}

export function useCreateFloor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateFloorRequest) => 
      MOCK_API ? mockPropertyAPI.createFloor(data) : floorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] })
    },
  })
}

export function useUpdateFloor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateFloorRequest) => 
      MOCK_API ? mockPropertyAPI.updateFloor(data) : floorService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] })
      queryClient.invalidateQueries({ queryKey: ['floors', variables.id] })
    },
  })
}

export function useDeleteFloor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => 
      MOCK_API ? mockPropertyAPI.deleteFloor(id) : floorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] })
    },
  })
}

// ========== SPACES HOOKS ==========

export function useSpaces(filters?: SpaceFilters) {
  return useQuery({
    queryKey: ['spaces', filters],
    queryFn: () => MOCK_API ? mockPropertyAPI.getSpaces(filters) : spaceService.getAll(filters),
  })
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: ['spaces', id],
    queryFn: () => MOCK_API ? mockPropertyAPI.getSpace(id) : spaceService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSpace() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateSpaceRequest) => 
      MOCK_API ? mockPropertyAPI.createSpace(data) : spaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      queryClient.invalidateQueries({ queryKey: ['floors'] }) // Update floor space count
    },
  })
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateSpaceRequest) => 
      MOCK_API ? mockPropertyAPI.updateSpace(data) : spaceService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      queryClient.invalidateQueries({ queryKey: ['spaces', variables.id] })
    },
  })
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => 
      MOCK_API ? mockPropertyAPI.deleteSpace(id) : spaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      queryClient.invalidateQueries({ queryKey: ['floors'] })
    },
  })
}

// ========== PRICING RULES HOOKS ==========

export function usePricingRules(filters?: PricingRuleFilters) {
  return useQuery({
    queryKey: ['pricing-rules', filters],
    queryFn: () => MOCK_API ? mockPropertyAPI.getPricingRules(filters) : pricingService.getAll(filters),
  })
}

export function usePricingRule(id: string) {
  return useQuery({
    queryKey: ['pricing-rules', id],
    queryFn: () => MOCK_API ? mockPropertyAPI.getPricingRule(id) : pricingService.getById(id),
    enabled: !!id,
  })
}

export function useActivePrice(spaceId: string) {
  return useQuery({
    queryKey: ['spaces', spaceId, 'pricing'],
    queryFn: () => pricingService.getActivePrice(spaceId),
    enabled: !!spaceId && !MOCK_API,
  })
}

export function useCreatePricingRule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePricingRuleRequest) => 
      MOCK_API ? mockPropertyAPI.createPricingRule(data) : pricingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] })
    },
  })
}

export function useUpdatePricingRule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdatePricingRuleRequest) => 
      MOCK_API ? mockPropertyAPI.updatePricingRule(data) : pricingService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] })
      queryClient.invalidateQueries({ queryKey: ['pricing-rules', variables.id] })
    },
  })
}

export function useDeletePricingRule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => 
      MOCK_API ? mockPropertyAPI.deletePricingRule(id) : pricingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] })
    },
  })
}
