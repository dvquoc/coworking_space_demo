import type {
  Lead,
  LeadActivity,
  Campaign,
  CRMStats,
  CampaignStats,
  LeadFilters,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateActivityRequest,
  CreateCampaignRequest,
  PaginatedLeads,
} from '../types/crm'

// ========== MOCK LEADS ==========

let mockLeads: Lead[] = [
  {
    id: 'lead-001',
    leadCode: 'LEAD-001',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    company: undefined,
    source: 'website',
    interestedIn: ['hot_desk', 'dedicated_desk'],
    budget: 3000000,
    expectedMoveInDate: '2026-05-01',
    stage: 'inquiry',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'active',
    notes: 'Khách hàng cần chỗ ngồi cố định gần quận 1',
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'lead-002',
    leadCode: 'LEAD-002',
    fullName: 'Phạm Thị Bình',
    email: 'phambinh@techcorp.vn',
    phone: '0912345678',
    company: 'TechCorp Vietnam',
    source: 'referral',
    interestedIn: ['private_office'],
    budget: 15000000,
    expectedMoveInDate: '2026-05-15',
    stage: 'contacted',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'active',
    notes: 'Cần văn phòng riêng cho 8 người',
    createdAt: '2026-04-08T09:30:00Z',
    updatedAt: '2026-04-12T14:00:00Z',
  },
  {
    id: 'lead-003',
    leadCode: 'LEAD-003',
    fullName: 'Lê Minh Cường',
    email: 'leminhcuong@startup.io',
    phone: '0923456789',
    company: 'Startup.io',
    source: 'facebook_ad',
    interestedIn: ['dedicated_desk', 'meeting_room'],
    budget: 8000000,
    expectedMoveInDate: '2026-06-01',
    stage: 'tour_scheduled',
    assignedTo: 'user-sale-2',
    assignedToName: 'Nguyễn Văn Manager',
    status: 'active',
    createdAt: '2026-04-05T11:00:00Z',
    updatedAt: '2026-04-14T10:00:00Z',
  },
  {
    id: 'lead-004',
    leadCode: 'LEAD-004',
    fullName: 'Hoàng Thị Dung',
    email: 'hoangdung@freelance.com',
    phone: '0934567890',
    source: 'google_ad',
    interestedIn: ['hot_desk'],
    budget: 2000000,
    stage: 'tour_completed',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'active',
    createdAt: '2026-04-03T13:00:00Z',
    updatedAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'lead-005',
    leadCode: 'LEAD-005',
    fullName: 'Vũ Quang Đức',
    email: 'vuquangduc@company.com',
    phone: '0945678901',
    company: 'Đức & Partners',
    source: 'walk_in',
    interestedIn: ['private_office', 'meeting_room'],
    budget: 25000000,
    expectedMoveInDate: '2026-05-01',
    stage: 'proposal_sent',
    assignedTo: 'user-sale-2',
    assignedToName: 'Nguyễn Văn Manager',
    status: 'active',
    notes: 'Khách VIP, cần chăm sóc đặc biệt',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-04-16T11:00:00Z',
  },
  {
    id: 'lead-006',
    leadCode: 'LEAD-006',
    fullName: 'Trịnh Thu Hà',
    email: 'trinhha@enterprise.com',
    phone: '0956789012',
    company: 'Enterprise Corp',
    source: 'referral',
    interestedIn: ['private_office'],
    budget: 30000000,
    stage: 'negotiation',
    assignedTo: 'user-sale-2',
    assignedToName: 'Nguyễn Văn Manager',
    status: 'active',
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-04-16T16:00:00Z',
  },
  {
    id: 'lead-007',
    leadCode: 'LEAD-007',
    fullName: 'Đinh Văn Giang',
    email: 'dinhgiang@success.vn',
    phone: '0967890123',
    company: 'Success Ltd',
    source: 'website',
    interestedIn: ['dedicated_desk'],
    budget: 5000000,
    stage: 'closed_won',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'converted',
    convertedToCustomerId: 'cus-210',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'lead-008',
    leadCode: 'LEAD-008',
    fullName: 'Bùi Thị Hoa',
    email: 'buihoa@outlook.com',
    phone: '0978901234',
    source: 'google_ad',
    interestedIn: ['hot_desk'],
    budget: 1500000,
    stage: 'closed_lost',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'lost',
    lostReason: 'Giá cao hơn đối thủ cạnh tranh',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-04-05T14:00:00Z',
  },
  {
    id: 'lead-009',
    leadCode: 'LEAD-009',
    fullName: 'Cao Minh Hùng',
    email: 'caohung@digital.com',
    phone: '0989012345',
    company: 'Digital Agency',
    source: 'facebook_ad',
    interestedIn: ['hot_desk', 'meeting_room'],
    budget: 4000000,
    stage: 'inquiry',
    assignedTo: undefined,
    assignedToName: undefined,
    status: 'active',
    createdAt: '2026-04-17T07:00:00Z',
    updatedAt: '2026-04-17T07:00:00Z',
  },
  {
    id: 'lead-010',
    leadCode: 'LEAD-010',
    fullName: 'Lý Thị Lan',
    email: 'lylan@creative.vn',
    phone: '0990123456',
    source: 'walk_in',
    interestedIn: ['dedicated_desk'],
    budget: 6000000,
    stage: 'contacted',
    assignedTo: 'user-sale-1',
    assignedToName: 'Trần Thị Sale',
    status: 'active',
    createdAt: '2026-04-16T10:00:00Z',
    updatedAt: '2026-04-16T15:00:00Z',
  },
]

// ========== MOCK ACTIVITIES ==========

let mockActivities: LeadActivity[] = [
  {
    id: 'act-001',
    leadId: 'lead-002',
    type: 'call',
    subject: 'Gọi điện lần đầu',
    description: 'Đã liên hệ khách hàng qua điện thoại. Khách quan tâm đến private office 8 người. Hẹn tham quan vào tuần tới.',
    performedBy: 'user-sale-1',
    performedByName: 'Trần Thị Sale',
    activityDate: '2026-04-12T10:00:00Z',
    createdAt: '2026-04-12T10:15:00Z',
  },
  {
    id: 'act-002',
    leadId: 'lead-002',
    type: 'email',
    subject: 'Gửi brochure & bảng giá',
    description: 'Đã gửi email kèm brochure và bảng giá private office. Offer giảm 10% cho hợp đồng 12 tháng.',
    performedBy: 'user-sale-1',
    performedByName: 'Trần Thị Sale',
    activityDate: '2026-04-12T14:00:00Z',
    createdAt: '2026-04-12T14:05:00Z',
  },
  {
    id: 'act-003',
    leadId: 'lead-003',
    type: 'call',
    subject: 'Xác nhận lịch tham quan',
    description: 'Đã xác nhận lịch tham quan vào 20/04/2026 lúc 10:00.',
    performedBy: 'user-sale-2',
    performedByName: 'Nguyễn Văn Manager',
    activityDate: '2026-04-14T09:30:00Z',
    createdAt: '2026-04-14T09:45:00Z',
  },
  {
    id: 'act-004',
    leadId: 'lead-005',
    type: 'meeting',
    subject: 'Gặp mặt trực tiếp tại văn phòng',
    description: 'Khách đến tham quan. Rất hài lòng với private office tầng 5. Yêu cầu gửi proposal chi tiết.',
    performedBy: 'user-sale-2',
    performedByName: 'Nguyễn Văn Manager',
    activityDate: '2026-04-13T14:00:00Z',
    createdAt: '2026-04-13T16:00:00Z',
  },
  {
    id: 'act-005',
    leadId: 'lead-005',
    type: 'email',
    subject: 'Gửi proposal',
    description: 'Đã gửi proposal cho private office P501. Bao gồm: giá thuê 22tr/tháng, deposit 2 tháng, hợp đồng 12 tháng.',
    performedBy: 'user-sale-2',
    performedByName: 'Nguyễn Văn Manager',
    activityDate: '2026-04-16T09:00:00Z',
    createdAt: '2026-04-16T09:30:00Z',
  },
  {
    id: 'act-006',
    leadId: 'lead-006',
    type: 'note',
    subject: 'Ghi chú đàm phán',
    description: 'Khách muốn giảm giá thêm 5% và hợp đồng 6 tháng thay vì 12 tháng. Cần xin ý kiến manager.',
    performedBy: 'user-sale-2',
    performedByName: 'Nguyễn Văn Manager',
    activityDate: '2026-04-16T16:00:00Z',
    createdAt: '2026-04-16T16:10:00Z',
  },
]

// ========== MOCK CAMPAIGNS ==========

const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Summer Promo 2026 – Hot Desk',
    type: 'email',
    targetAudience: 'all_leads',
    promoCode: 'SUMMER2026',
    discount: 20,
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    status: 'draft',
    sentCount: 0,
    openCount: 0,
    createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'camp-002',
    name: 'Q2 Private Office Push',
    type: 'email',
    targetAudience: 'hot_leads',
    promoCode: 'OFFICE2026',
    discount: 15,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'active',
    sentCount: 48,
    openCount: 31,
    createdAt: '2026-03-28T09:00:00Z',
  },
  {
    id: 'camp-003',
    name: 'New Year Campaign 2026',
    type: 'email',
    targetAudience: 'cold_leads',
    promoCode: 'NY2026',
    discount: 10,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    status: 'completed',
    sentCount: 120,
    openCount: 67,
    createdAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'camp-004',
    name: 'Facebook Ads – Dedicated Desk',
    type: 'facebook_ad',
    targetAudience: 'all_leads',
    startDate: '2026-04-10',
    endDate: '2026-04-25',
    status: 'active',
    sentCount: 0,
    openCount: 0,
    createdAt: '2026-04-09T08:00:00Z',
  },
]

// ========== HELPER ==========

function filterAndPaginate(leads: Lead[], filters?: LeadFilters): PaginatedLeads {
  let filtered = [...leads]

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.leadCode.toLowerCase().includes(q) ||
        (l.company?.toLowerCase().includes(q) ?? false)
    )
  }
  if (filters?.stage) filtered = filtered.filter((l) => l.stage === filters.stage)
  if (filters?.source) filtered = filtered.filter((l) => l.source === filters.source)
  if (filters?.status) filtered = filtered.filter((l) => l.status === filters.status)

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)

  return { data, pagination: { total, page, pageSize, totalPages } }
}

// ========== EXPORT FUNCTIONS ==========

export function getLeads(filters?: LeadFilters): PaginatedLeads {
  return filterAndPaginate(mockLeads, filters)
}

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((l) => l.id === id)
}

export function getActivitiesForLead(leadId: string): LeadActivity[] {
  return mockActivities
    .filter((a) => a.leadId === leadId)
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
}

export function getCRMStats(): CRMStats {
  const total = mockLeads.length
  const active = mockLeads.filter((l) => l.status === 'active').length
  const converted = mockLeads.filter((l) => l.status === 'converted').length
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const newThisMonth = mockLeads.filter((l) => l.createdAt >= startOfMonth).length
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0
  return { totalLeads: total, activeLeads: active, convertedLeads: converted, newThisMonth, conversionRate }
}

export function createLead(data: CreateLeadRequest): Lead {
  const id = `lead-${String(mockLeads.length + 1).padStart(3, '0')}`
  const leadCode = `LEAD-${String(mockLeads.length + 1).padStart(3, '0')}`
  const now = new Date().toISOString()
  const lead: Lead = {
    id,
    leadCode,
    ...data,
    stage: 'inquiry',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
  mockLeads = [lead, ...mockLeads]
  return lead
}

export function updateLead(id: string, data: UpdateLeadRequest): Lead {
  mockLeads = mockLeads.map((l) =>
    l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
  )
  return mockLeads.find((l) => l.id === id)!
}

export function createActivity(data: CreateActivityRequest): LeadActivity {
  const activity: LeadActivity = {
    id: `act-${Date.now()}`,
    ...data,
    performedBy: 'current-user',
    performedByName: 'Trần Thị Sale',
    createdAt: new Date().toISOString(),
  }
  mockActivities = [activity, ...mockActivities]
  return activity
}

export function getCampaigns(): Campaign[] {
  return [...mockCampaigns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getCampaignStats(): CampaignStats {
  const total = mockCampaigns.length
  const active = mockCampaigns.filter((c) => c.status === 'active').length
  const draft = mockCampaigns.filter((c) => c.status === 'draft').length
  const completed = mockCampaigns.filter((c) => c.status === 'completed').length
  return { total, active, draft, completed }
}

export function createCampaign(data: CreateCampaignRequest): Campaign {
  const campaign: Campaign = {
    id: `camp-${Date.now()}`,
    ...data,
    status: 'draft',
    sentCount: 0,
    openCount: 0,
    createdAt: new Date().toISOString(),
  }
  mockCampaigns.push(campaign)
  return campaign
}
