// EP-08 – Inventory & Asset Management Types

export type AssetCategory =
  | 'furniture'        // Bàn, ghế, sofa
  | 'it_equipment'     // Máy tính, monitor, keyboard
  | 'appliance'        // Điều hòa, tủ lạnh, microwave
  | 'office_equipment' // Máy in, máy chiếu, whiteboard
  | 'pantry'           // Máy pha cà phê, bình đun nước
  | 'other'

export type AssetStatus =
  | 'active'       // Đang sử dụng (assigned to space)
  | 'available'    // Chưa assign, sẵn sàng
  | 'maintenance'  // Đang bảo trì
  | 'broken'       // Hỏng, cần sửa/thay thế
  | 'retired'      // Đã thanh lý

export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken'

export type MaintenanceType = 'routine' | 'repair' | 'inspection'

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface Asset {
  id: string
  assetCode: string          // "AST-001" – auto-generated
  name: string               // "Dell Monitor 24-inch"
  category: AssetCategory

  // Tracking
  serialNumber?: string      // Serial từ nhà sản xuất
  manufacturer?: string      // "Dell", "Daikin"
  model?: string             // "U2422H"

  // Location
  buildingId: string
  buildingName?: string      // Computed/denormalized for display
  spaceId?: string
  spaceName?: string         // Computed/denormalized for display

  // Financial
  purchaseDate?: string      // ISO string
  purchaseCost: number       // VND
  warrantyExpiryDate?: string

  // Status
  status: AssetStatus
  condition: AssetCondition

  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceLog {
  id: string
  assetId: string
  assetCode?: string         // Denormalized for display
  assetName?: string         // Denormalized for display

  // Maintenance Details
  type: MaintenanceType
  description: string
  scheduledDate?: string
  completedDate?: string

  // Cost & Vendor
  cost: number               // VND
  vendor?: string

  // Result
  status: MaintenanceStatus
  resultNotes?: string

  // Metadata
  performedBy: string        // Staff ID or name
  createdAt: string
}

export interface AssetMovement {
  id: string
  assetId: string
  fromSpaceId?: string
  fromSpaceName?: string
  toSpaceId?: string
  toSpaceName?: string
  assignedDate: string
  assignedBy: string
  notes?: string
}

// ─── Request types ────────────────────────────────────────────

export interface CreateAssetRequest {
  name: string
  category: AssetCategory
  serialNumber?: string
  manufacturer?: string
  model?: string
  buildingId: string
  spaceId?: string
  purchaseDate?: string
  purchaseCost: number
  warrantyExpiryDate?: string
  condition: AssetCondition
  notes?: string
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  id: string
  status?: AssetStatus
}

export interface CreateMaintenanceLogRequest {
  assetId: string
  type: MaintenanceType
  description: string
  scheduledDate?: string
  completedDate?: string
  cost: number
  vendor?: string
  status?: MaintenanceStatus
  resultNotes?: string
  performedBy: string
}

export interface CompleteMaintenanceRequest {
  id: string
  completedDate: string
  resultNotes?: string
  newCondition?: AssetCondition
}

export interface AssetFilters {
  search?: string
  category?: AssetCategory
  status?: AssetStatus
  buildingId?: string
}

export interface MaintenanceFilters {
  assetId?: string
  type?: MaintenanceType
  status?: MaintenanceStatus
}
