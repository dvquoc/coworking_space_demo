// Property Management Types

export enum SpaceType {
  HOT_DESK = 'hot_desk',               // Chỗ ngồi tự do
  DEDICATED_DESK = 'dedicated_desk',   // Bàn cố định riêng
  PRIVATE_OFFICE = 'private_office',   // Phòng riêng cho team/công ty
  OPEN_SPACE = 'open_space',           // Khu làm việc chung lớn
  MEETING_ROOM = 'meeting_room',       // Meeting Room nhỏ
  CONFERENCE_ROOM = 'conference_room', // Phòng hội nghị lớn
  TRAINING_ROOM = 'training_room',     // Phòng đào tạo
  EVENT_SPACE = 'event_space'          // Không gian sự kiện
}

/**
 * Space types that require formal contracts (EP-05)
 * - Dedicated Desk / Private Office → Formal contracts
 * - Others → Terms & Conditions only (F-36), paid via credit system
 */
export const CONTRACT_REQUIRED_SPACE_TYPES: SpaceType[] = [
  SpaceType.DEDICATED_DESK,
  SpaceType.PRIVATE_OFFICE
]

/**
 * Check if a space type requires a formal contract
 * @param spaceType - The space type to check
 * @returns true if formal contract required, false if T&C only
 */
export function requiresContract(spaceType: SpaceType): boolean {
  return CONTRACT_REQUIRED_SPACE_TYPES.includes(spaceType)
}

export type BuildingStatus = 'active' | 'inactive' | 'maintenance'
export type FloorStatus = 'active' | 'inactive'
export type SpaceStatus = 'available' | 'occupied' | 'maintenance' | 'reserved'

export interface Building {
  id: string
  name: string                 // "Cobi Building 1", "Cobi Building 2"
  address: string              // "123 Nguyen Trai, Dist 1, HCMC"
  totalFloors: number
  totalArea: number            // m²
  status: BuildingStatus
  imageUrl?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Floor {
  id: string
  buildingId: string           // FK to Building
  floorNumber: number          // 1, 2, 3, ..., or -1 (basement)
  floorName?: string           // "Ground Floor", "Mezzanine"
  area: number                 // m²
  status: FloorStatus
  spacesCount?: number         // Số lượng spaces trên tầng (computed)
  createdAt: string
  updatedAt: string
}

export interface Space {
  id: string
  buildingId: string
  floorId: string
  name: string                 // "Hot Desk Zone A", "Meeting Room 101"
  type: SpaceType
  capacity: number             // số người
  area: number                 // m²
  amenities: string[]          // ["WiFi", "Projector", "Whiteboard"]
  status: SpaceStatus
  contractRequired: boolean    // true = Formal Contract (EP-05), false = T&C only (F-36)
  imageUrls: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export interface LongTermDiscount {
  months: number
  discountPercent: number
}

export interface PricingRule {
  id: string
  spaceId?: string             // FK to Space (hoặc null nếu apply cho all spaces của 1 type)
  spaceType?: SpaceType        // Nếu apply chung cho loại space
  buildingId?: string          // Nếu giá khác nhau giữa 2 tòa nhà
  
  pricePerHour?: number        // Giá theo giờ (VND)
  pricePerDay?: number         // Giá theo ngày
  pricePerWeek?: number        // Giá theo tuần
  pricePerMonth?: number       // Giá theo tháng
  
  // Discounts
  weekendDiscount?: number     // % discount cuối tuần
  longTermDiscount?: LongTermDiscount[]
  
  effectiveFrom: string
  effectiveTo?: string         // null = áp dụng mãi mãi
  createdAt: string
  updatedAt: string
}

// Request/Response types for API
export interface CreateBuildingRequest {
  name: string
  address: string
  totalFloors: number
  totalArea: number
  status: BuildingStatus
  imageUrl?: string
  description?: string
}

export interface UpdateBuildingRequest extends Partial<CreateBuildingRequest> {
  id: string
}

export interface CreateFloorRequest {
  buildingId: string
  floorNumber: number
  floorName?: string
  area: number
  status: FloorStatus
}

export interface UpdateFloorRequest extends Partial<CreateFloorRequest> {
  id: string
}

export interface CreateSpaceRequest {
  buildingId: string
  floorId: string
  name: string
  type: SpaceType
  capacity: number
  area: number
  amenities: string[]
  status: SpaceStatus
  contractRequired: boolean    // true = Formal Contract (EP-05), false = T&C only (F-36)
  imageUrls: string[]
  description?: string
}

export interface UpdateSpaceRequest extends Partial<CreateSpaceRequest> {
  id: string
}

export interface CreatePricingRuleRequest {
  spaceId?: string
  spaceType?: SpaceType
  buildingId?: string
  pricePerHour?: number
  pricePerDay?: number
  pricePerWeek?: number
  pricePerMonth?: number
  weekendDiscount?: number
  longTermDiscount?: LongTermDiscount[]
  effectiveFrom: string
  effectiveTo?: string
}

export interface UpdatePricingRuleRequest extends Partial<CreatePricingRuleRequest> {
  id: string
}

// List response with pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Filter types
export interface BuildingFilters {
  status?: BuildingStatus
  search?: string
}

export interface FloorFilters {
  buildingId?: string
  status?: FloorStatus
}

export interface SpaceFilters {
  buildingId?: string
  floorId?: string
  type?: SpaceType
  status?: SpaceStatus
  search?: string
}

export interface PricingRuleFilters {
  spaceId?: string
  spaceType?: SpaceType
  buildingId?: string
  isActive?: boolean  // effective now
}
