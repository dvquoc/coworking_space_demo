// Booking Management Types

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid'
export type BookingType = 'hourly' | 'daily' | 'weekly' | 'monthly'
export type BookingSource = 'staff' | 'customer_portal'
export type SpaceType = 'hot_desk' | 'meeting_room' | 'training_room' | 'event_room'
export type PaymentMethod = 'vnpay' | 'momo' | 'zalopay' | 'cash'

export interface BookingService {
  id: string
  name: string
  price: number
}

export interface Booking {
  id: string
  bookingCode: string           // Auto-gen: "BK-20260416-001"

  // Space Info
  buildingId: string
  buildingName: string
  floorId: string
  floorName: string
  spaceId: string
  spaceName: string
  spaceType: SpaceType

  // Customer Info
  customerId: string
  customerName: string
  contactPerson?: string
  contactPhone?: string

  // Time
  startTime: string             // ISO datetime
  endTime: string
  duration: number              // Minutes
  bookingType: BookingType

  // Pricing
  pricePerUnit: number
  totalPrice: number
  discountPercent?: number
  finalPrice: number

  // Extra services
  services: BookingService[]

  // Status
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod

  // Source
  bookingSource: BookingSource

  // Metadata
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  cancelledAt?: string
  cancelReason?: string
}

export interface BookingListItem {
  id: string
  bookingCode: string
  customerName: string
  spaceName: string
  spaceType: SpaceType
  startTime: string
  endTime: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  finalPrice: number
}

export interface BookingFilters {
  search?: string
  status?: BookingStatus
  spaceType?: SpaceType
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface CreateBookingRequest {
  customerId: string
  buildingId: string
  floorId: string
  spaceId: string
  startTime: string
  endTime: string
  bookingType: BookingType
  serviceIds?: string[]
  discountPercent?: number
  notes?: string
}

export interface BookingConflict {
  spaceId: string
  existingBookingId: string
  existingBookingCode: string
  conflictStart: string
  conflictEnd: string
}
