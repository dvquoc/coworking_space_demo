// Customer Management Types

// ========== ENUMS & BASIC TYPES ==========

export type CustomerType = 'individual' | 'company'
export type CustomerStatus = 'active' | 'inactive' | 'suspended'
export type CompanySize = 'startup' | 'sme' | 'enterprise'
export type EmployeeType = 'representative' | 'admin' | 'regular'

// Credit types
export type CreditTransactionType = 'topup' | 'reward' | 'spend' | 'refund' | 'expire'
export type CreditType = 'credit' | 'reward'
export type CreditRewardSource = 'promotion' | 'referral' | 'birthday' | 'loyalty' | 'compensation'
export type CreditRewardStatus = 'active' | 'used' | 'expired'

// ========== CUSTOMER ENTITY ==========

export interface Customer {
  id: string
  customerCode: string               // Auto-generated: "CUS-0001"
  customerType: CustomerType
  
  // Personal Info (for individual)
  firstName?: string
  lastName?: string
  fullName: string                   // Display name
  dateOfBirth?: string
  nationalId?: string                // CCCD/CMND
  
  // Company reference (for company customer)
  companyId?: string
  contactPersonName?: string         // Primary contact
  contactPersonTitle?: string        // e.g., "CEO", "Office Manager"
  
  // Contact Info (common)
  email: string
  phone: string
  alternativePhone?: string
  address?: string
  
  // Segmentation
  tags: string[]
  
  // Credit Wallet (F-19B) - Đơn vị: Cobi (1 Cobi = 1.000 VND)
  creditBalance: number         // Credit đã nạp (không hết hạn) - Cobi
  rewardBalance: number         // Credit thưởng (có hạn sử dụng) - Cobi
  
  // Status
  status: CustomerStatus
  
  // Relationships
  referredBy?: string                // Customer ID
  accountManager?: string            // Staff ID
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ========== COMPANY ENTITY ==========

export interface Company {
  id: string
  companyCode: string                // "COM-0001"
  companyName: string
  legalName?: string
  taxCode: string                    // MST - unique
  
  // Business Info
  industry?: string
  companySize: CompanySize
  foundedYear?: number
  
  // Address
  registeredAddress: string
  officeAddress?: string
  
  // Contact
  companyEmail?: string
  companyPhone?: string
  website?: string
  
  // Status
  status: 'active' | 'inactive'
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ========== COMPANY EMPLOYEE ENTITY ==========

export interface CompanyEmployee {
  id: string
  employeeCode: string               // "EMP-COM-0001-001"
  companyId: string
  customerId: string                 // FK to company customer
  
  // Personal Info
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  employeeId?: string                // Company's internal ID
  title?: string
  department?: string
  
  // Permissions
  canBookSpaces: boolean
  canViewInvoices: boolean
  canManageEmployees: boolean
  hasAccessCard: boolean
  accessCardNumber?: string
  accessCardIssuedAt?: string
  
  // Status
  status: 'active' | 'inactive'
  startDate?: string
  endDate?: string
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  deactivatedAt?: string
  deactivatedBy?: string
}

// ========== CREDIT ENTITIES (F-19B) ==========

export interface CreditTransaction {
  id: string
  customerId: string
  
  // Transaction Info
  type: CreditTransactionType
  creditType: CreditType              // 'credit' = không hết hạn, 'reward' = có hạn
  amount: number                      // + = nạp/thưởng, - = tiêu/hết hạn
  balanceAfter: number                // Số dư sau giao dịch
  
  // For reward credits
  expiresAt?: string                  // Ngày hết hạn (chỉ cho reward)
  
  // Reference
  referenceType?: 'booking' | 'contract' | 'topup' | 'promotion' | 'referral'
  referenceId?: string                // ID của booking/contract/topup...
  
  // Metadata
  description: string                 // "Nạp credit", "Thanh toán booking #BK-0001"
  createdAt: string
  createdBy: string                   // Staff ID hoặc "system"
}

export interface CreditReward {
  id: string
  customerId: string
  
  // Reward Info
  amount: number                      // Số credit thưởng
  remainingAmount: number             // Số còn lại (sau khi tiêu dần)
  
  // Validity
  issuedAt: string                    // Ngày phát hành
  expiresAt: string                   // Ngày hết hạn
  
  // Source
  source: CreditRewardSource
  sourceId?: string                   // ID của promotion/referral...
  description: string                 // "Thưởng giới thiệu khách hàng mới"
  
  // Status
  status: CreditRewardStatus
  
  createdAt: string
  createdBy: string
}

export interface CreditSummary {
  creditBalance: number               // Credit đã nạp (không hết hạn)
  rewardBalance: number               // Credit thưởng còn lại
  totalBalance: number                // creditBalance + rewardBalance
  expiringWithin7Days: number         // Số reward sắp hết hạn trong 7 ngày
  activeRewardsCount: number          // Số reward đang active
}

// ========== TAG ENTITY ==========

export interface Tag {
  id: string
  name: string                       // slug: vip, long-term
  displayName: string                // display: VIP, Long-term
  color: string                      // hex: #22c55e
  description?: string
  type: 'system' | 'custom'
  autoAssign: boolean
  customerCount: number
  createdAt: string
  createdBy?: string
}

// ========== CUSTOMER LIST ITEM (For table display) ==========

export interface CustomerListItem {
  id: string
  customerCode: string
  customerType: CustomerType
  fullName: string
  email: string
  phone: string
  status: CustomerStatus
  tags: string[]
  companyName?: string               // For company customers
  // Credit (F-19B)
  creditBalance: number
  rewardBalance: number
  createdAt: string
}

// ========== CUSTOMER DETAILS (Full view) ==========

export interface CustomerDetails extends Customer {
  // Company info (if company customer)
  company?: Company
  
  // Referred by info
  referredByCustomer?: {
    id: string
    customerCode: string
    fullName: string
  }
  
  // Account manager info
  accountManagerInfo?: {
    id: string
    name: string
  }
  
  // Created by info
  createdByInfo?: {
    id: string
    name: string
  }
  
  // Stats
  stats: {
    totalBookings: number
    activeContracts: number
    totalSpent: number
    outstandingBalance: number
  }
  
  // Credit details (F-19B)
  creditSummary: CreditSummary
  activeRewards: CreditReward[]
}

// ========== TAB DATA FOR CUSTOMER DETAILS ==========

export interface CustomerBooking {
  id: string
  bookingCode: string
  spaceName: string
  buildingName: string
  floorLabel: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled'
  totalAmount: number
}

export interface CustomerContract {
  id: string
  contractCode: string
  spaceName: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'terminated'
  monthlyValue: number
  daysRemaining: number
}

export interface CustomerInvoice {
  id: string
  invoiceCode: string
  description: string
  issueDate: string
  dueDate: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paidAmount: number
}

// ========== REQUEST TYPES ==========

export interface CreateCustomerRequest {
  customerType: CustomerType
  
  // Individual fields
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  nationalId?: string
  
  // Company fields
  companyName?: string
  legalName?: string
  taxCode?: string
  industry?: string
  companySize?: CompanySize
  foundedYear?: number
  registeredAddress?: string
  officeAddress?: string
  companyEmail?: string
  companyPhone?: string
  website?: string
  contactPersonName?: string
  contactPersonTitle?: string
  
  // Common fields
  email: string
  phone: string
  alternativePhone?: string
  address?: string
  tags?: string[]
  notes?: string
  accountManager?: string
  referredBy?: string
}

export interface UpdateCustomerRequest extends Partial<Omit<CreateCustomerRequest, 'customerType'>> {
  id: string
}

export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  employeeId?: string
  title?: string
  department?: string
  canBookSpaces?: boolean
  canViewInvoices?: boolean
  canManageEmployees?: boolean
  hasAccessCard?: boolean
  accessCardNumber?: string
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string
  status?: 'active' | 'inactive'
}

// ========== FILTER TYPES ==========

export interface CustomerFilters {
  search?: string
  status?: CustomerStatus | ''
  type?: CustomerType | ''
  tags?: string[]
  page?: number
  pageSize?: number
  sortBy?: 'createdAt' | 'fullName' | 'customerCode'
  sortOrder?: 'asc' | 'desc'
}

export interface EmployeeFilters {
  search?: string
  status?: 'active' | 'inactive' | ''
  type?: EmployeeType | ''
}

// ========== PAGINATED RESPONSE ==========

export interface PaginatedCustomers {
  items: CustomerListItem[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface EmployeesResponse {
  items: CompanyEmployee[]
  summary: {
    total: number
    active: number
    inactive: number
    withAccessCard: number
  }
}

// ========== SYSTEM TAGS ==========

export const SYSTEM_TAGS: Tag[] = [
  {
    id: 'tag-vip',
    name: 'vip',
    displayName: 'VIP',
    color: '#eab308',
    description: 'Khách hàng VIP, cần ưu tiên chăm sóc đặc biệt',
    type: 'system',
    autoAssign: false,
    customerCount: 0,
    createdAt: '',
  },
  {
    id: 'tag-long-term',
    name: 'long-term',
    displayName: 'Long-term',
    color: '#22c55e',
    description: 'Khách hàng có hợp đồng dài hạn (> 6 tháng)',
    type: 'system',
    autoAssign: true,
    customerCount: 0,
    createdAt: '',
  },
  {
    id: 'tag-referral',
    name: 'referral',
    displayName: 'Referral',
    color: '#3b82f6',
    description: 'Khách hàng đã giới thiệu khách mới',
    type: 'system',
    autoAssign: true,
    customerCount: 0,
    createdAt: '',
  },
  {
    id: 'tag-new',
    name: 'new',
    displayName: 'New',
    color: '#06b6d4',
    description: 'Khách hàng mới (< 30 ngày)',
    type: 'system',
    autoAssign: true,
    customerCount: 0,
    createdAt: '',
  },
  {
    id: 'tag-premium',
    name: 'premium',
    displayName: 'Premium',
    color: '#8b5cf6',
    description: 'Khách hàng chi tiêu cao (> 100M)',
    type: 'system',
    autoAssign: true,
    customerCount: 0,
    createdAt: '',
  },
  {
    id: 'tag-at-risk',
    name: 'at-risk',
    displayName: 'At-risk',
    color: '#ef4444',
    description: 'Khách hàng không hoạt động > 90 ngày',
    type: 'system',
    autoAssign: true,
    customerCount: 0,
    createdAt: '',
  },
]
