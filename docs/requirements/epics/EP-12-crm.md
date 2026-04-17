# EP-12 – Lead Management & Marketing (CRM)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-12 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |
| Độ ưu tiên | Should have |

## Mô tả

CRM system cho Sales team: Lead capture, lead nurturing pipeline (Inquiry → Tour → Proposal → Closed), task assignments, email campaigns, lead source tracking, conversion analytics.

## Features thuộc Epic này

### Phase 2 Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-91 | Lead capture | Form capture leads từ website | Draft |
| F-92 | Lead pipeline | Kanban board: stages từ inquiry → closed | Draft |
| F-93 | Lead assignment | Assign leads cho sales reps | Draft |
| F-94 | Activity tracking | Ghi nhận calls, emails, meetings | Draft |
| F-95 | Campaign management | Email campaigns, promo codes | Draft |

## Data Models

### Lead
```typescript
interface Lead {
  id: string;
  leadCode: string;             // "LEAD-001"
  
  // Contact Info
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  
  // Lead Details
  source: 'website' | 'referral' | 'facebook_ad' | 'google_ad' | 'walk_in' | 'other';
  interestedIn: SpaceType[];    // ['hot_desk', 'private_office']
  budget?: number;
  expectedMoveInDate?: Date;
  
  // Pipeline
  stage: LeadStage;
  assignedTo?: string;          // Sales rep ID
  
  // Status
  status: 'active' | 'converted' | 'lost' | 'invalid';
  lostReason?: string;          // "Price too high", "Competitor"
  convertedToCustomerId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

enum LeadStage {
  INQUIRY = 'inquiry',          // Vừa nhận lead
  CONTACTED = 'contacted',      // Đã gọi/email lần đầu
  TOUR_SCHEDULED = 'tour_scheduled', // Hẹn tham quan
  TOUR_COMPLETED = 'tour_completed',
  PROPOSAL_SENT = 'proposal_sent',   // Gửi proposal/quote
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',    // Convert → customer
  CLOSED_LOST = 'closed_lost'
}
```

### LeadActivity
```typescript
interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  description: string;
  performedBy: string;          // Sales rep
  activityDate: Date;
  createdAt: Date;
}
```

### Campaign
```typescript
interface Campaign {
  id: string;
  name: string;                 // "Summer Promo 2026"
  type: 'email' | 'sms' | 'facebook_ad';
  targetAudience: 'all_leads' | 'hot_leads' | 'cold_leads';
  promoCode?: string;
  discount?: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed';
}
```

## User Stories

### US-91: Capture lead from website
> Là **visitor**, tôi muốn **submit inquiry form** để **được tư vấn**

**Acceptance Criteria**:
- [ ] Form: name, email, phone, interested space types, message
- [ ] Submit → Lead created, status inquiry
- [ ] Auto-assign to sales rep (round-robin hoặc by building)
- [ ] Send auto-reply email: "Thank you, we'll contact you soon"

### US-92: Sales manages pipeline
> Là **Sale**, tôi muốn **xem pipeline dạng Kanban** để **track progress**

**Acceptance Criteria**:
- [ ] Kanban columns: Inquiry | Contacted | Tour | Proposal | Closed
- [ ] Drag-drop lead between stages
- [ ] Click lead → open details sidebar
- [ ] Filter: my leads, all leads, by source

### US-93: Log activity with lead
> Là **Sale**, tôi muốn **ghi nhận call/meeting** để **track interactions**

**Acceptance Criteria**:
- [ ] Lead details page → "Add Activity" button
- [ ] Form: type (call/email/meeting), subject, notes, date
- [ ] Activity saved, visible in timeline
- [ ] Next action reminder (optional)

### US-94: Convert lead to customer
> Là **Sale**, tôi muốn **convert lead thành customer** để **create contract**

**Acceptance Criteria**:
- [ ] Lead stage = proposal/negotiation
- [ ] Click "Convert to Customer"
- [ ] Customer created with lead's contact info
- [ ] Lead.status → converted, linkedCustomerId
- [ ] Redirect to customer page

### US-95: Run email campaign
> Là **Manager**, tôi muốn **gửi email campaign** để **promote new space**

**Acceptance Criteria**:
- [ ] Create campaign: name, email template, target audience
- [ ] Select leads (all, hot leads, specific tags)
- [ ] Schedule send date
- [ ] Track: sent, opened, clicked (Phase 3)

## Scenarios

### Scenario 1: Website visitor submits inquiry
```
Given Visitor fills form on website:
  - Name: "Nguyen Van A"
  - Email: "a@example.com"
  - Phone: "0901234567"
  - Interested: Private Office
  - Message: "Need office for 5 people"
When Submit form
Then Lead created:
  - leadCode: "LEAD-042"
  - source: website
  - stage: inquiry
  - assignedTo: sales rep (auto-assigned)
And Auto-reply email sent to a@example.com
And Notification to assigned sales rep
```

### Scenario 2: Sales schedules tour
```
Given Lead "LEAD-042" stage inquiry
When Sales rep calls, customer agrees to tour
And Sales updates:
  - stage → tour_scheduled
  - Add activity: "Call - Scheduled tour on 2026-04-25 10:00"
Then Lead moved to "Tour Scheduled" column in Kanban
And Calendar event created for sales rep
```

### Scenario 3: Convert lead to customer
```
Given Lead "LEAD-042" stage proposal, ready to sign
When Sales clicks "Convert to Customer"
Then Customer created:
  - name: "Nguyen Van A"
  - email: "a@example.com"
  - source: "website_lead"
And Lead:
  - status → converted
  - convertedToCustomerId → "CUS-105"
And Sales can now create contract for CUS-105
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer (lead conversion)
- EP-11: Sales Dashboard (funnel chart)

## Out of Scope Phase 2
- Email tracking (opens, clicks) → Phase 3
- SMS campaigns → Phase 3
- Lead scoring (AI-powered) → Future

## Technical Notes

### Lead Assignment Strategy
- **Round-robin**: Leads assigned equally to active sales reps
- **By building**: Leads interested in Building 1 → sales rep for Building 1

### Integrations
- Website form → POST `/api/leads` (public endpoint with reCAPTCHA)
- Email campaigns: Use SendGrid/Mailgun API

### Indexes
- `leads.email` (unique)
- `leads.assignedTo, leads.stage`
- `leads.source, leads.createdAt`

## Ghi chú
- Phase 2 vì Phase 1 focus on operations, Phase 2 focus on growth
- CRM giúp Sales team organized, increase conversion rate
