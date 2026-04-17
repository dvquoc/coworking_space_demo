import { api } from './api'
import type {
  Asset,
  MaintenanceLog,
  AssetMovement,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateMaintenanceLogRequest,
  CompleteMaintenanceRequest,
  AssetFilters,
  MaintenanceFilters,
} from '../types/inventory'

export const assetService = {
  getAll: async (filters?: AssetFilters): Promise<Asset[]> => {
    const res = await api.get<Asset[]>('/assets', { params: filters })
    return res.data
  },

  getById: async (id: string): Promise<Asset> => {
    const res = await api.get<Asset>(`/assets/${id}`)
    return res.data
  },

  create: async (data: CreateAssetRequest): Promise<Asset> => {
    const res = await api.post<Asset>('/assets', data)
    return res.data
  },

  update: async (data: UpdateAssetRequest): Promise<Asset> => {
    const res = await api.put<Asset>(`/assets/${data.id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/assets/${id}`)
  },
}

export const maintenanceLogService = {
  getAll: async (filters?: MaintenanceFilters): Promise<MaintenanceLog[]> => {
    const res = await api.get<MaintenanceLog[]>('/maintenance-logs', { params: filters })
    return res.data
  },

  create: async (data: CreateMaintenanceLogRequest): Promise<MaintenanceLog> => {
    const res = await api.post<MaintenanceLog>('/maintenance-logs', data)
    return res.data
  },

  complete: async (data: CompleteMaintenanceRequest): Promise<MaintenanceLog> => {
    const res = await api.patch<MaintenanceLog>(`/maintenance-logs/${data.id}/complete`, data)
    return res.data
  },

  cancel: async (id: string): Promise<void> => {
    await api.patch(`/maintenance-logs/${id}/cancel`)
  },
}

export const movementService = {
  getByAsset: async (assetId: string): Promise<AssetMovement[]> => {
    const res = await api.get<AssetMovement[]>(`/assets/${assetId}/movements`)
    return res.data
  },
}
