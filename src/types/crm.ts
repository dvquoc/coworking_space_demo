// CRM – Lead Management & Marketing Types

// ========== ENUMS & BASIC TYPES ==========

export type LeadSource = 'website' | 'referral' | 'facebook_ad' | 'google_ad' | 'walk_in' | 'other'

export type LeadStage =
  | 'inquiry'
  | 'contacted'
  | 'tour_scheduled'
  | 'tour_completed'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type LeadStatus = 'active' | 'converted' | 'lost' | 'invalid'

export type ActivityType = 'call' | 'email' | 'meeting' | 'note'

export type CampaignType = 'email' | 'sms' | 'facebook_ad'

export type CampaignStatus = 'draft' | 'active' | 'completed'

export type CampaignAudience = 'all_leads' | 'hot_leads' | 'cold_leads'

export type CRMSpaceType =
  | 'hot_desk'
  | 'dedicated_desk'
  | 'private_office'
  | 'meeting_room'
  | 'event_space'

// ========== LEAD ENTITY ==========

export interface Lead {
  id: string
  leadCode: string            // "LEAD-001"

  // Contact Info
  fullName: string
  email: string
  phone: string
  company?: string

  // Lead Details
  source: LeadSource
  interestedIn: CRMSpaceType[]
  budget?: number
  expectedMoveInDate?: string

  // Pipeline
  stage: LeadStage
  assignedTo?: string
  assignedToName?: string

  // Status
  status: LeadStatus
  lostReason?: string
  convertedToCustomerId?: string

  // Notes
  notes?: string

  // Metadata
  createdAt: string
  updatedAt: string
}

// ========== LEAD ACTIVITY ==========

export interface LeadActivity {
  id: string
  leadId: string
  type: ActivityType
  subject: string
  description: string
  performedBy: string
  performedByName: string
  activityDate: string
  createdAt: string
}

// ========== CAMPAIGN ENTITY ==========

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  targetAudience: CampaignAudience
  promoCode?: string
  discount?: number
  startDate: string
  endDate: string
  status: CampaignStatus
  sentCount: number
  openCount: number
  createdAt: string
}

// ========== STATS ==========

export interface CRMStats {
  totalLeads: number
  activeLeads: number
  convertedLeads: number
  newThisMonth: number
  conversionRate: number
}

export interface CampaignStats {
  total: number
  active: number
  draft: number
  completed: number
}

// ========== REQUEST TYPES ==========

export interface LeadFilters {
  search?: string
  stage?: LeadStage | ''
  source?: LeadSource | ''
  status?: LeadStatus | ''
  page?: number
  pageSize?: number
}

export interface CreateLeadRequest {
  fullName: string
  email: string
  phone: string
  company?: string
  source: LeadSource
  interestedIn: CRMSpaceType[]
  budget?: number
  expectedMoveInDate?: string
  notes?: string
}

export interface UpdateLeadRequest {
  stage?: LeadStage
  assignedTo?: string
  status?: LeadStatus
  lostReason?: string
  notes?: string
}

export interface CreateActivityRequest {
  leadId: string
  type: ActivityType
  subject: string
  description: string
  activityDate: string
}

export interface CreateCampaignRequest {
  name: string
  type: CampaignType
  targetAudience: CampaignAudience
  promoCode?: string
  discount?: number
  startDate: string
  endDate: string
}

// ========== PAGINATED RESPONSES ==========

export interface PaginatedLeads {
  data: Lead[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
