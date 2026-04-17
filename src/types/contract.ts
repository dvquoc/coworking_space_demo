// Contract Management Types

// ========== ENUMS & BASIC TYPES ==========

export type ContractStatus = 'draft' | 'active' | 'expiring_soon' | 'expired' | 'renewed' | 'terminated'
export type TerminationReason = 'customer_request' | 'contract_violation' | 'payment_default' | 'mutual_agreement' | 'other'
export type RenewalPricing = 'same' | 'current_rate' | 'custom'
export type AcceptedVia = 'online' | 'in_person'
export type SpaceType = 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room' | 'event_space'

// ========== CONTRACT TEMPLATE ENTITY ==========

export interface ContractTemplate {
  id: string
  templateCode: string              // "TPL-DEDICATED-DESK-001", "TPL-PRIVATE-OFFICE-001"
  name: string
  version: string                   // "1.0", "1.1", "2.0"
  description?: string

  // Template Sections (HTML with placeholders)
  headerTemplate: string            // Title, contract code, date
  partyLessorTemplate: string       // Cobi company info
  partyLesseeTemplate: string       // Customer info
  serviceTemplate: string           // Service description
  pricingTemplate: string           // Fees, deposit
  usageRulesTemplate: string        // Rules
  liabilityTemplate: string         // Responsibilities
  terminationTemplate: string       // Termination clauses
  signatureTemplate: string         // Signature block

  // Status
  isActive: boolean
  isDefault: boolean                // Default template

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

// ========== CONTRACT ENTITY ==========

export interface Contract {
  id: string
  contractCode: string              // "CTR-YYYYMMDD-XXX"
  status: ContractStatus

  // Parties
  customerId: string
  customerName: string
  customerType: 'individual' | 'company'

  // Space Info (bắt buộc - thuê Dedicated Desk / Private Office cụ thể)
  buildingId: string
  buildingName: string
  spaceId: string                   // FK to Space - chỗ ngồi/phòng cụ thể
  spaceName: string                 // "Private Office 201", "Dedicated Desk B-05"
  floorLabel?: string

  // Duration
  startDate: string
  endDate: string
  durationMonths: number
  signedDate?: string

  // Pricing
  monthlyFee: number
  setupFee?: number
  depositAmount: number
  totalValue: number

  // Template & Content
  templateId: string
  templateVersion: string
  generatedContent?: ContractContent
  customNotes?: string

  // Auto-renewal Settings
  autoRenewalSettings?: AutoRenewalSettings

  // Linked contracts (for renewals)
  renewedFromId?: string
  renewedToId?: string

  // Termination (if applicable)
  termination?: ContractTermination

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
  activatedAt?: string
  activatedBy?: string
}

// ========== CONTRACT CONTENT (Generated) ==========

export interface ContractContent {
  templateId: string
  templateVersion: string
  generatedAt: string
  sections: {
    header: string
    partyLessor: string
    partyLessee: string
    service: string
    pricing: string
    usageRules: string
    liability: string
    termination: string
    signature: string
  }
  fullContent: string
  missingPlaceholders: string[]
}

// ========== AUTO-RENEWAL SETTINGS ==========

export interface AutoRenewalSettings {
  enabled: boolean
  renewalDuration: number           // months
  renewalPricing: RenewalPricing
  customMonthlyFee?: number
  notifyDaysBefore: number          // default: 30
  optedOutAt?: string
  optedOutBy?: string               // 'customer' | userId
  optedOutReason?: string
}

// ========== CONTRACT TERMINATION ==========

export interface ContractTermination {
  terminationDate: string
  reason: TerminationReason
  reasonNotes?: string
  terminatedBy: string
  earlyTerminationFee?: number
  depositStatus: 'returned' | 'withheld' | 'partial'
  depositReturnAmount?: number
  finalSettlement?: {
    outstandingFees: number
    depositReturn: number
    earlyTerminationFee: number
    totalDue: number
  }
}

// ========== CONTRACT STATUS HISTORY ==========

export interface ContractStatusHistory {
  id: string
  contractId: string
  fromStatus: ContractStatus | null
  toStatus: ContractStatus
  changedAt: string
  changedBy: string | 'system'
  reason?: string
  notes?: string
}

// ========== TERMS AND CONDITIONS ==========

export interface TermsAndConditions {
  id: string
  termsCode: string                 // "TC-HOT-DESK-001"
  title: string                     // "Điều khoản sử dụng Hot Desk v2.1"
  version: string

  // Content Sections
  usageRulesContent: string
  liabilityContent: string
  privacyContent: string
  cancellationContent: string
  fullContent: string               // Combined

  // Applicability
  applicableSpaceTypes: SpaceType[]

  // Status
  isActive: boolean
  effectiveFrom: string

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ========== ACCEPTANCE LOG ==========

export interface AcceptanceLog {
  id: string
  customerId: string
  customerName: string
  termsId: string
  termsVersion: string
  termsTitle: string
  termsContent: string              // Snapshot at acceptance time
  acceptedAt: string
  ipAddress: string
  userAgent: string
  acceptedVia: AcceptedVia
  acceptedBy?: string               // Admin ID if in_person
  bookingId?: string
  metadata?: {
    browserName?: string
    browserVersion?: string
    osName?: string
    osVersion?: string
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  }
}

// ========== PLACEHOLDER DATA ==========

export interface PlaceholderData {
  // Contract
  contractCode: string
  signedDate: string
  startDate: string
  endDate: string
  duration: number
  packageName?: string

  // Lessor (Cobi)
  companyName: string
  companyTaxCode: string
  companyAddress: string
  companyRepName: string
  companyRepTitle: string
  companyPhone: string
  companyEmail: string

  // Lessee (Customer)
  customerType: string
  customerName: string
  customerId: string
  customerAddress: string
  customerPhone: string
  customerEmail: string
  contactPerson?: string
  contactTitle?: string

  // Space & Building
  buildingName: string
  buildingAddress: string
  spaceType: string
  spaceName?: string
  floorLabel?: string
  operatingHours: string

  // Pricing
  monthlyFee: string
  setupFee: string
  deposit: string
  totalValue: string
  monthlyFeeText: string
  totalValueText: string
}

// ========== LIST ITEMS ==========

export interface ContractTemplateListItem {
  id: string
  templateCode: string
  name: string
  version: string
  isActive: boolean
  isDefault: boolean
  updatedAt: string
}

export interface ContractListItem {
  id: string
  contractCode: string
  status: ContractStatus
  customerName: string
  customerType: 'individual' | 'company'
  buildingName: string
  spaceName: string
  startDate: string
  endDate: string
  monthlyFee: number
  daysRemaining: number
  autoRenewEnabled: boolean
}

export interface TermsListItem {
  id: string
  termsCode: string
  title: string
  version: string
  applicableSpaceTypes: SpaceType[]
  isActive: boolean
  effectiveFrom: string
  updatedAt: string
}

export interface AcceptanceLogListItem {
  id: string
  termsTitle: string
  termsVersion: string
  acceptedAt: string
  ipAddress: string
  acceptedVia: AcceptedVia
  bookingCode?: string
}

// ========== DETAILS ==========

export interface ContractDetails extends Contract {
  customer?: {
    id: string
    customerCode: string
    fullName: string
    email: string
    phone: string
  }
  building?: {
    id: string
    name: string
    address: string
  }
  space?: {
    id: string
    name: string
    floorLabel: string
  }
  template?: ContractTemplateListItem
  statusHistory: ContractStatusHistory[]
  createdByInfo?: {
    id: string
    name: string
  }
}

// ========== FILTERS ==========

export interface ContractFilters {
  page?: number
  limit?: number
  search?: string
  status?: ContractStatus | 'all'
  customerId?: string
  buildingId?: string
  startDateFrom?: string
  startDateTo?: string
  endDateFrom?: string
  endDateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TemplateFilters {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TermsFilters {
  page?: number
  limit?: number
  search?: string
  spaceType?: SpaceType | 'all'
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ========== PAGINATED RESULTS ==========

export interface PaginatedContracts {
  data: ContractListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedTemplates {
  data: ContractTemplateListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedTerms {
  data: TermsListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ========== REQUEST TYPES ==========

export interface CreateContractTemplateRequest {
  name: string
  description?: string
  headerTemplate: string
  partyLessorTemplate: string
  partyLesseeTemplate: string
  serviceTemplate: string
  pricingTemplate: string
  usageRulesTemplate: string
  liabilityTemplate: string
  terminationTemplate: string
  signatureTemplate: string
  isDefault?: boolean
}

export interface UpdateContractTemplateRequest extends Partial<CreateContractTemplateRequest> {
  id: string
}

export interface CreateContractRequest {
  customerId: string
  buildingId: string
  spaceId: string
  templateId: string
  startDate: string
  durationMonths: number
  monthlyFee: number
  setupFee?: number
  depositAmount: number
  customNotes?: string
  autoRenewalSettings?: {
    enabled: boolean
    renewalDuration?: number
    renewalPricing?: RenewalPricing
    customMonthlyFee?: number
  }
}

export interface UpdateContractRequest extends Partial<CreateContractRequest> {
  id: string
}

export interface ActivateContractRequest {
  id: string
  signedDate?: string
}

export interface TerminateContractRequest {
  id: string
  terminationDate: string
  reason: TerminationReason
  reasonNotes?: string
  earlyTerminationFee?: number
}

export interface ExtendContractRequest {
  id: string
  extensionType: 'extend' | 'renew'
  additionalMonths: number
  newMonthlyFee?: number
}

export interface CreateTermsRequest {
  title: string
  usageRulesContent: string
  liabilityContent: string
  privacyContent: string
  cancellationContent: string
  applicableSpaceTypes: SpaceType[]
  effectiveFrom: string
}

export interface UpdateTermsRequest extends Partial<CreateTermsRequest> {
  id: string
}

export interface AcceptTermsRequest {
  termsId: string
  bookingId?: string
  acceptedVia: AcceptedVia
  note?: string
}

// ========== RESPONSE TYPES ==========

export interface GenerateContentResponse {
  content: ContractContent
  missingPlaceholders: string[]
  warnings: string[]
}

export interface ActivateContractResponse {
  contract: Contract
  message: string
}

export interface TerminateContractResponse {
  contract: Contract
  settlement: ContractTermination['finalSettlement']
  message: string
}

export interface ExtendContractResponse {
  originalContract: Contract
  newContract?: Contract
  message: string
}

export interface AcceptTermsResponse {
  acceptanceLogId: string
  acceptedAt: string
  message: string
}

// ========== DASHBOARD DATA ==========

export interface ContractDashboardStats {
  total: number
  active: number
  expiringSoon: number
  expired: number
  draft: number
  terminated: number
  totalMonthlyRevenue: number
  renewalRate: number
}

export interface ExpiringContract {
  id: string
  contractCode: string
  customerName: string
  endDate: string
  daysRemaining: number
  monthlyFee: number
  autoRenewEnabled: boolean
}

export interface RenewalQueueItem {
  id: string
  contractCode: string
  customerName: string
  expiryDate: string
  status: 'pending' | 'opted_out' | 'blocked' | 'completed'
  newFee: number
  blockReason?: string
}

// ========== SYSTEM CONFIG ==========

export interface LessorConfig {
  companyName: string
  companyTaxCode: string
  companyAddress: string
  companyRepName: string
  companyRepTitle: string
  companyPhone: string
  companyEmail: string
}

// Default lessor config (Cobi)
export const DEFAULT_LESSOR_CONFIG: LessorConfig = {
  companyName: 'Công ty TNHH Cobi Workspace',
  companyTaxCode: '0316789012',
  companyAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  companyRepName: 'Trần Văn Minh',
  companyRepTitle: 'Giám đốc',
  companyPhone: '1900-6868',
  companyEmail: 'contact@cobi.vn',
}

// ========== STATUS HELPERS ==========

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Nháp',
  active: 'Đang hiệu lực',
  expiring_soon: 'Sắp hết hạn',
  expired: 'Đã hết hạn',
  renewed: 'Đã gia hạn',
  terminated: 'Đã chấm dứt',
}

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  draft: 'gray',
  active: 'green',
  expiring_soon: 'orange',
  expired: 'red',
  renewed: 'blue',
  terminated: 'red',
}

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  meeting_room: 'Phòng họp',
  event_space: 'Event Space',
}

export const TERMINATION_REASON_LABELS: Record<TerminationReason, string> = {
  customer_request: 'Khách hàng yêu cầu chấm dứt',
  contract_violation: 'Vi phạm điều khoản hợp đồng',
  payment_default: 'Không thanh toán đúng hạn',
  mutual_agreement: 'Thỏa thuận hai bên',
  other: 'Lý do khác',
}
