import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockInventoryAPI } from '../mocks/inventoryMocks'
import { assetService, maintenanceLogService, movementService } from '../services/inventoryService'
import type {
  Asset,
  MaintenanceLog,
  AssetMovement,
  AssetFilters,
  MaintenanceFilters,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateMaintenanceLogRequest,
  CompleteMaintenanceRequest,
} from '../types/inventory'

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ─── Assets ──────────────────────────────────────────────────

export function useAssets(filters?: AssetFilters) {
  return useQuery<Asset[]>({
    queryKey: ['assets', filters],
    queryFn: () =>
      MOCK_API ? mockInventoryAPI.getAssets(filters) : assetService.getAll(filters),
  })
}

export function useAsset(id: string) {
  return useQuery<Asset>({
    queryKey: ['assets', id],
    queryFn: () =>
      MOCK_API ? mockInventoryAPI.getAsset(id) : assetService.getById(id),
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAssetRequest) =>
      MOCK_API ? mockInventoryAPI.createAsset(data) : assetService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useUpdateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAssetRequest) =>
      MOCK_API ? mockInventoryAPI.updateAsset(data) : assetService.update(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['assets'] })
      qc.invalidateQueries({ queryKey: ['assets', vars.id] })
    },
  })
}

export function useDeleteAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      MOCK_API ? mockInventoryAPI.deleteAsset(id) : assetService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

// ─── Maintenance Logs ─────────────────────────────────────────

export function useMaintenanceLogs(filters?: MaintenanceFilters) {
  return useQuery<MaintenanceLog[]>({
    queryKey: ['maintenance-logs', filters],
    queryFn: () =>
      MOCK_API ? mockInventoryAPI.getMaintenanceLogs(filters) : maintenanceLogService.getAll(filters),
  })
}

export function useCreateMaintenanceLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaintenanceLogRequest) =>
      MOCK_API ? mockInventoryAPI.createMaintenanceLog(data) : maintenanceLogService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['maintenance-logs'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useCompleteMaintenanceLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CompleteMaintenanceRequest) =>
      MOCK_API ? mockInventoryAPI.completeMaintenanceLog(data) : maintenanceLogService.complete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['maintenance-logs'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useCancelMaintenanceLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      MOCK_API ? mockInventoryAPI.cancelMaintenanceLog(id) : maintenanceLogService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['maintenance-logs'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

// ─── Movements ────────────────────────────────────────────────

export function useAssetMovements(assetId: string) {
  return useQuery<AssetMovement[]>({
    queryKey: ['movements', assetId],
    queryFn: () =>
      MOCK_API ? mockInventoryAPI.getMovements(assetId) : movementService.getByAsset(assetId),
    enabled: !!assetId,
  })
}
