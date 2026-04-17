# F-24C – Booking Approval Workflow

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-24C |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations (Extended) |

## Mô tả nghiệp vụ

Cho phép Manager **review và duyệt/từ chối** các booking requests từ customers trước khi chúng được confirmed. Workflow này áp dụng cho:
- Meeting Rooms (thường cần kiểm tra mục đích sử dụng)
- Conference Rooms (high-value spaces)
- Private Offices (long-term contracts, cần verify customer)
- Dedicated Desks ≥1 tháng (commitment checking)

**Business Rationale:**
- **Quality control**: Đảm bảo space được dùng đúng mục đích
- **Customer screening**: Avoid problematic customers
- **Revenue protection**: Spaces giá cao cần approval
- **Flexible policy**: Admin có thể bật/tắt approval per space

**Không cần approval:**
- Hot Desks (instant booking)
- Staff-assisted bookings (staff authority)
- Trusted customers (có thể whitelist - Phase 2)

## User Story

> Là **Manager**, tôi muốn **review và approve/reject booking requests** để **kiểm soát việc sử dụng spaces quan trọng** và đảm bảo chất lượng dịch vụ.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Approval Queue
- [ ] **AC1**: Manager có dashboard "Pending Approvals" 
- [ ] **AC2**: Hiển thị tất cả bookings với status = `awaiting_approval`
- [ ] **AC3**: Sort by: Date (oldest first), Priority, Space type
- [ ] **AC4**: Filters: Building, Floor, Space, Date range, Customer type
- [ ] **AC5**: Badge notification: "🔔 5 pending approvals"
- [ ] **AC6**: Real-time updates (WebSocket hoặc polling every 30s)

### Booking Details for Review
- [ ] **AC7**: Click booking → Show detail modal/page với:
  - Customer info: Name, email, phone, customer type, registration date
  - Booking info: Space, date/time, duration, price
  - Customer history: Previous bookings count, cancellation rate, payment history
  - Special requests/notes từ customer
- [ ] **AC8**: Link to customer profile: "View full profile →"
- [ ] **AC9**: If company customer: Show company info (tax code, industry, employees)

### Approve Action
- [ ] **AC10**: "Approve" button available
- [ ] **AC11**: Click Approve → Confirmation dialog:
  - "Approve booking BK-XXX for Meeting Room A?"
  - Option: Add internal notes
- [ ] **AC12**: After approve:
  - Booking status → `approved` (nếu deposit required)
  - Booking status → `confirmed` (nếu no deposit)
  - Nếu deposit required: Auto-generate deposit invoice
  - approvedBy = Manager ID, approvedAt = timestamp
- [ ] **AC13**: Email notification to customer:
  - "✅ Your booking has been approved!"
  - If deposit: Include payment link
  - If no deposit: "Your booking is confirmed"
- [ ] **AC14**: Booking disappears from pending queue

### Reject Action
- [ ] **AC15**: "Reject" button available
- [ ] **AC16**: Click Reject → Rejection form:
  - **Required**: Rejection reason (dropdown + textarea)
  - Reasons: "Space not available", "Invalid purpose", "Customer verification required", "Policy violation", "Other"
  - Textarea: Detailed explanation for customer
- [ ] **AC17**: After reject:
  - Booking status → `rejected`
  - rejectedBy = Manager ID, rejectedAt = timestamp
  - rejectionReason saved
- [ ] **AC18**: Email notification to customer:
  - "❌ Your booking request was declined"
  - Reason: [Manager's explanation]
  - "Feel free to contact us or try another time/space"
- [ ] **AC19**: If deposit was paid: Auto-refund process initiated
- [ ] **AC20**: Space becomes available again for other bookings

### SLA & Notifications
- [ ] **AC21**: Auto-notification to Manager:
  - Immediately when new request arrives
  - Reminder after 12h if not actioned
  - Escalation after 24h (notify senior manager)
- [ ] **AC22**: Customer notification timeline:
  - Immediate: "We're reviewing your request"
  - Update: After manager acts (approve/reject)
  - Timeout: Auto-cancel if no action after 48h
- [ ] **AC23**: Display SLA status:
  - Green: < 12h waiting
  - Yellow: 12-24h waiting
  - Red: > 24h waiting

### Bulk Actions
- [ ] **AC24**: Select multiple bookings (checkboxes)
- [ ] **AC25**: Bulk approve: "Approve selected (5 bookings)"
- [ ] **AC26**: Bulk reject: Require reason for all
- [ ] **AC27**: Confirmation dialog for bulk actions

## Dữ liệu / Fields

### Approval Queue View

| Field | Type | Description |
|-------|------|-------------|
| Booking Code | Link | BK-20260416-001 |
| Customer | Text | Nguyễn Văn A (Individual) |
| Space | Text | Meeting Room A - Floor 3 |  
| Date & Time | DateTime | 20/04/2026 14:00-16:00 |
| Price | Currency | 600,000 VND |
| Requested At | Relative Time | "2 hours ago" |
| SLA Status | Badge | 🟢 On time / 🟡 Due soon / 🔴 Overdue |
| Actions | Buttons | [View] [Approve] [Reject] |

### Booking Detail for Review

```typescript
interface BookingApprovalDetail {
  // Booking info
  booking: {
    id: string;
    bookingCode: string;
    space: SpaceInfo;
    startTime: Date;
    endTime: Date;
    duration: number;
    finalPrice: number;
    depositRequired: boolean;
    depositAmount?: number;
    notes?: string;
    requestedAt: Date;
  };
  
  // Customer info
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    customerType: 'individual' | 'company';
    registeredAt: Date;
    
    // Company specific
    company?: {
      name: string;
      taxCode: string;
      industry: string;
      employeeCount: number;
    };
  };
  
  // Customer history
  history: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    cancellationRate: number; // %
    totalSpent: number;
    averageRating?: number;
    lastBookingDate?: Date;
    hasOverdueInvoices: boolean;
    overdueAmount?: number;
  };
  
  // Risk indicators
  risks: Array<{
    level: 'low' | 'medium' | 'high';
    message: string;
  }>;
}
```

### Approval/Rejection Record

```typescript
interface BookingApproval {
  bookingId: string;
  action: 'approved' | 'rejected';
  actionBy: string; // Manager ID
  actionAt: Date;
  reason?: string; // For rejection
  internalNotes?: string; // For staff only
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Approve Booking (No Deposit)

```
Given Booking "BK-001" exists:
  • Customer: "Tom Nguyen"
  • Space: "Meeting Room A"
  • Time: 20/04/2026 14:00-16:00
  • Price: 600,000 VND
  • Status: "awaiting_approval"
  • Deposit: Not required

When Manager login → "Pending Approvals" (1 item)
And Click "BK-001" → Detail modal opens
And Review customer history:
  • 5 previous bookings, all completed
  • No cancellations
  • Good payment history
And Click "Approve"
And Confirm: "Yes, approve"

Then System updates:
  • Booking status → "confirmed"
  • approvedBy: Manager ID
  • approvedAt: Current timestamp
And Email sent to customer:
  • Subject: "✅ Booking Approved - BK-001"
  • Body: "Your Meeting Room A booking is confirmed!"
  • Includes: QR code, booking details, cancellation policy
And Manager dashboard: Pending count 1 → 0
And Booking appears in customer "My Bookings" as confirmed
```

### Scenario 2: Approve Booking (With Deposit)

```
Given Booking "BK-002":
  • Customer: "Sara Lee"
  • Space: "Private Office 201"
  • Time: 25/04/2026 full day
  • Price: 2,000,000 VND
  • Deposit: Required 50% = 1,000,000 VND
  • Status: "awaiting_approval"

When Manager approves booking

Then System updates:
  • Booking status → "approved" (NOT confirmed yet)
  • Generate deposit invoice:
    - invoiceCode: "INV-001"
    - invoiceType: "deposit"
    - amount: 1,000,000 VND
    - dueDate: 3 days from now
    - status: "unpaid"
And Email sent to customer:
  • "✅ Booking Approved! Please pay deposit"
  • Payment link included
  • "Your booking will be confirmed after payment"
And Booking waits for payment

# --- After customer pays ---

When Customer completes payment via VNPay

Then Booking status → "confirmed"
And depositPaid = true
And Email: "Booking confirmed! Payment received."
```

### Scenario 3: Reject Booking (Policy Violation)

```
Given Booking "BK-003":
  • Customer: "John Wu" (new customer, 0 previous bookings)
  • Space: "Conference Room - Full Floor"
  • Time: Tomorrow 10:00-22:00 (12 hours)
  • Price: 10,000,000 VND
  • Status: "awaiting_approval"

When Manager reviews
And Notices: High-value booking, new customer, suspicious
And Click "Reject"
And Select reason: "Customer verification required"
And Enter explanation:
  "Dear John, for bookings over 5M VND, we require identity 
   verification for first-time customers. Please contact our 
   office with your ID/passport. We'll be happy to assist!"
And Click "Confirm Rejection"

Then System updates:
  • Booking status → "rejected"
  • rejectedBy: Manager ID
  • rejectedAt: Timestamp
  • rejectionReason: Saved
And Email sent to customer:
  • Subject: "ℹ️ Booking Request - Additional Information Needed"
  • Body: Manager's explanation
  • CTA: "Contact Us" button
And Space becomes available again
```

### Scenario 4: Auto-Escalation (Overdue Approval)

```
Given Booking "BK-004" created 25 hours ago
And Status still "awaiting_approval"
And No manager has reviewed

Then System cronjob detects:
  • requestedAt > 24 hours ago
  • SLA violated
And Send escalation email to Senior Manager:
  • "⚠️ Booking approval overdue - BK-004"
  • "Customer waiting for 25 hours"
  • Link to approve/reject
And Update SLA status: 🔴 Overdue
And Log in audit trail: "SLA violated, escalated"
```

### Scenario 5: Bulk Approve (5 Hot Desk Requests)

```
Given 5 bookings awaiting approval:
  • All Hot Desks
  • All different customers
  • Different time slots
  • All low risk (returning customers)

When Manager select all 5 bookings (checkboxes)
And Click "Bulk Approve" button
And Confirmation: "Approve 5 bookings? [Yes] [No]"
And Click "Yes"

Then System processes each booking:
  • Loop through 5 bookings
  • For each: status → "confirmed", approvedBy, approvedAt
  • Send 5 separate emails to customers
And Show success: "✅ 5 bookings approved successfully"
And Pending queue: 5 → 0
```

### Scenario 6: Reject with Refund

```
Given Booking "BK-005":
  • Customer paid deposit: 500,000 VND
  • Status: "awaiting_approval"
  • Manager rejects booking

When Manager rejects
And Enter reason: "Space unavailable due to maintenance"

Then System:
  • Booking status → "rejected"
  • Initiate refund process:
    - Create PaymentTransaction (type: refund)
    - amount: 500,000 VND
    - Refund via original payment method (VNPay)
  • Email customer:
    - "Your booking was declined (maintenance issue)"
    - "Deposit will be refunded within 3-5 business days"
    - "Sorry for inconvenience"
And Track refund status in invoices
```

### Scenario 7: Customer History Review

```
Given Manager reviewing booking "BK-006"
And Customer "Alice Tran"

When Manager views customer history tab

Then Display:
  • Total bookings: 15
  • Completed: 13 (87%)
  • Cancelled: 2 (13% - within acceptable range)
  • Total spent: 12,500,000 VND
  • Average booking value: 833,333 VND
  • Last booking: 2 weeks ago
  • Payment history: 100% on-time
  • Average rating: 4.8/5
  • Risk indicators: 
    - 🟢 Low risk: "Reliable customer"
    - 🟢 "No payment issues"
And Manager decision: Easy approval ✅
```

### Scenario 8: Auto-Cancel After Timeout

```
Given Booking "BK-007" created 48 hours ago
And Status still "awaiting_approval"
And No manager action taken
And Customer not responded to follow-up

Then System auto-cancel:
  • Booking status → "cancelled"
  • cancelReason: "No approval within 48h (auto-cancelled)"
And Email customer:
  • "Your booking request has expired"
  • "Please submit a new request if still interested"
And Space becomes available
And Log: "Auto-cancelled due to approval timeout"
```

## Business Rules

### Approval Requirements (by Space Config)

| Space Type | Default Mode | Approval Threshold |
|------------|--------------|-------------------|
| Hot Desk | Instant | Never (unless flagged) |
| Dedicated Desk | Instant | If ≥1 month |
| Meeting Room | Request | Always |
| Conference Room | Request | Always |
| Private Office | Request | Always |
| Event Space | Request | Always |

### Risk Indicators

**High Risk** (careful review):
- New customer + high-value booking (>3M VND)
- Customer with >20% cancellation rate
- Overdue invoices outstanding
- Booking during off-hours (midnight-6am)
- Unusual duration (>8 hours single session)

**Medium Risk** (standard review):
- First-time booking for space type
- Weekend booking (verify purpose)
- Last-minute booking (<2h advance)

**Low Risk** (quick approve):
- Returning customer (>3 bookings)
- Payment history 100% on-time
- Zero cancellations last 6 months
- Standard business hours booking

### SLA Timelines

- **Target**: Respond within 12 hours (business hours)
- **Warning**: 12-24 hours (yellow badge)
- **Critical**: >24 hours (red badge, escalate)
- **Auto-cancel**: 48 hours no action

## UI/UX Design

### Pending Approvals Dashboard

```
┌────────────────────────────────────────────────────┐
│  🔔 Pending Approvals (5)        [Filters ▼]       │
├────────────────────────────────────────────────────┤
│ ☐ BK-001  Nguyễn Văn A    Meeting Room A          │
│   20/04/2026 14:00-16:00   600k  🟢 2h ago         │
│   [View] [Approve] [Reject]                        │
├────────────────────────────────────────────────────┤
│ ☐ BK-002  Sara Lee         Private Office 201      │
│   25/04/2026 Full Day      2M   🟡 15h ago         │
│   💰 Deposit: 1M  [View] [Approve] [Reject]        │
├────────────────────────────────────────────────────┤
│ ☐ BK-003  John Wu          Conference Room         │
│   Tomorrow 10:00-22:00     10M  🔴 26h ago  ⚠️     │
│   🚩 High-value, New customer                      │
│   [View] [Approve] [Reject]                        │
├────────────────────────────────────────────────────┤
│  Actions: [Bulk Approve] [Bulk Reject]             │
└────────────────────────────────────────────────────┘
```

### Booking Detail Modal

```
┌─────────────────────────────────────────────────┐
│  Booking BK-001 - Approval Required             │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Meeting Room A, Floor 3, Building 1         │
│  📅 20/04/2026 (Wednesday)                      │
│  ⏰ 14:00 - 16:00 (2 hours)                     │
│  💰 600,000 VND (No deposit required)           │
│                                                 │
│  👤 Customer: Nguyễn Văn A                      │
│     📧 nguyenvana@example.com                   │
│     📱 0912345678                                │
│     Type: Individual                            │
│     Registered: 6 months ago                    │
│                                                 │
│  📊 Customer History:                           │
│     ✓ 5 bookings completed                      │
│     ✓ 0 cancellations (0%)                      │
│     ✓ Total spent: 2,500,000đ                   │
│     ✓ Always pays on time                       │
│                                                 │
│  📝 Special Requests:                           │
│     "Need projector and whiteboard"             │
│                                                 │
│  🎯 Risk Assessment: 🟢 Low Risk                │
│     "Reliable returning customer"               │
│                                                 │
│  [View Full Customer Profile]                   │
│                                                 │
│  Internal Notes (optional):                     │
│  [                                          ]   │
│                                                 │
│  [❌ Reject]              [✅ Approve Booking]   │
└─────────────────────────────────────────────────┘
```

### Rejection Form

```
┌─────────────────────────────────────────────────┐
│  Reject Booking BK-003                          │
├─────────────────────────────────────────────────┤
│  Reason (required): *                           │
│  [Customer verification required    ▼]          │
│                                                 │
│  Options:                                       │
│  • Space not available                          │
│  • Invalid purpose                              │
│  • Customer verification required               │
│  • Policy violation                             │
│  • Other                                        │
│                                                 │
│  Detailed Explanation: *                        │
│  ┌───────────────────────────────────────┐    │
│  │ Dear John,                             │    │
│  │                                        │    │
│  │ For bookings over 5M VND, we require  │    │
│  │ identity verification for first-time  │    │
│  │ customers. Please contact...          │    │
│  └───────────────────────────────────────┘    │
│  (This will be sent to customer)               │
│                                                 │
│  [Cancel]              [Confirm Rejection]      │
└─────────────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Get pending approvals list
GET /api/manager/bookings/pending-approvals
Query: { page, limit, building, floor, spaceType }
Response: {
  bookings: BookingApprovalDetail[];
  total: number;
  overdueSLA: number;
}

// Get booking detail for approval
GET /api/manager/bookings/:bookingId/approval-detail
Response: BookingApprovalDetail

// Approve booking
POST /api/manager/bookings/:bookingId/approve
Body: { internalNotes?: string }
Response: { success: true, booking: {...} }

// Reject booking
POST /api/manager/bookings/:bookingId/reject
Body: { 
  reason: string; // Predefined reason
  explanation: string; // Detailed text
}
Response: { success: true, refundInitiated: boolean }

// Bulk approve
POST /api/manager/bookings/bulk-approve
Body: { bookingIds: string[], internalNotes?: string }
Response: { 
  success: true, 
  approved: number,
  failed: Array<{id, error}> 
}
```

## Technical Notes

### Notifications (Email Templates)

**Approval Email (No Deposit):**
```
Subject: ✅ Booking Approved - BK-001

Hi [Customer Name],

Great news! Your booking has been approved.

Space: Meeting Room A
Date: 20/04/2026, 14:00-16:00
Price: 600,000 VND

Your booking is now CONFIRMED.

[Download QR Code]
[Add to Calendar]
[View Booking Details]

See you soon!
Cobi Team
```

**Approval Email (With Deposit):**
```
Subject: ✅ Booking Approved - Payment Required

Hi [Customer Name],

Your booking request has been approved!

To confirm your reservation, please pay the deposit:
Deposit: 1,000,000 VND (50% of total)

[Pay Now via VNPay/MoMo/ZaloPay]

Payment due: 22/04/2026

Your booking will be confirmed once payment is received.

Thank you!
```

### Performance

- Approval list query: < 200ms
- Approval action (update + email): < 500ms
- Real-time notification: WebSocket or Server-Sent Events
- Bulk approve: Process async, notify when done

### Audit Trail

Log all approval/rejection actions:
```typescript
{
  bookingId: string;
  action: 'approved' | 'rejected';
  performedBy: string;
  timestamp: Date;
  reason?: string; // For rejection
  customerNotified: boolean;
  refundInitiated?: boolean;
}
```

## Dependencies

**Phụ thuộc vào:**
- F-24B: Customer self-booking (generates requests)
- F-24D: Space booking config (determines if approval needed)
- EP-06: Payment system (deposit invoices, refunds)

**Được sử dụng bởi:**
- EP-11: Dashboards (approval metrics)
- EP-16: Feedback (track approved vs rejected ratio)

## Out of Scope

**Phase 1 không làm:**
- Auto-approve based on customer tier → Phase 2
- Approval delegation/routing → Phase 2
- Approval templates/macros → Phase 2
- Customer appeal process → Phase 3

## Success Metrics

- Average approval time: < 6 hours
- SLA compliance: >90% within 12h
- Approval rate: 85-95% (too high = not enough screening, too low = bad UX)
- Customer satisfaction with approval process: >4/5

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
