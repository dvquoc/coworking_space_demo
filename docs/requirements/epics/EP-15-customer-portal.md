# EP-15 – Customer Self-Service Portal

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-15 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | **Phase 1 (partial)** + Phase 3 |
| Độ ưu tiên | Nice to have |

## Mô tả

Portal cho customers: xem booking history, contracts, invoices, thanh toán online, book meeting rooms, update profile, request support. Giảm tải cho staff, tăng customer satisfaction.

**Phase 1 Cherry-pick** (moved from Phase 3): Customer login, self-booking, view my bookings — integratedvào EP-04 để support customer self-service booking flow.

**Phase 3 Full Portal**: Complete portal với invoices, payments, profile management, support tickets.

## Features thuộc Epic này

### Phase 1 Features (Moved to EP-04 integration)

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-121 | Customer login | Customers login to portal (separate auth) | **Moved to Phase 1** |
| F-125 | Book space online | Tự book space via customer portal | **Moved to Phase 1** |
| F-122A | My bookings (read-only) | Xem booking history, upcoming | **Moved to Phase 1** |

### Phase 3 Features (Full Portal)

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-122 | My bookings (full management) | View + cancel bookings | Draft |
| F-123 | My invoices | Xem invoices, payment history | Draft |
| F-124 | Online payment | Thanh toán VNPay/MoMo | Draft |
| F-126 | Support tickets | Gửi yêu cầu support | Draft |
| F-127 | Profile management | Update contact info, preferences | Draft |

## Data Models

### SupportTicket
```typescript
interface SupportTicket {
  id: string;
  ticketNumber: string;         // "TICKET-001"
  customerId: string;
  
  // Issue
  category: 'technical' | 'billing' | 'facility' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  
  // Status
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;          // Staff ID
  
  // Resolution
  resolvedAt?: Date;
  resolutionNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

## User Stories

### US-121: Customer login to portal
> Là **Customer**, tôi muốn **login to portal** để **manage my account**

**Acceptance Criteria**:
- [ ] Login with email/password (separate from staff login)
- [ ] After login → Dashboard: upcoming bookings, unpaid invoices

### US-122: View my bookings
> Là **Customer**, tôi muốn **xem bookings của tôi** để **track usage**

**Acceptance Criteria**:
- [ ] List: upcoming bookings, past bookings
- [ ] Details: space, date/time, status
- [ ] Cancel booking (if allowed)

### US-123: View & pay invoices
> Là **Customer**, tôi muốn **xem invoices và pay online** để **tiện lợi**

**Acceptance Criteria**:
- [ ] List invoices: pending, paid
- [ ] Invoice details: items, amount
- [ ] Click "Pay Now" → redirect to VNPay/MoMo
- [ ] After payment → Invoice.status → paid

### US-124: Book meeting room online
> Là **Customer**, tôi muốn **tự book meeting room** để **không cần gọi staff**

**Acceptance Criteria**:
- [ ] Calendar view: available meeting rooms
- [ ] Select date/time, room
- [ ] Submit booking → status pending hoặc auto-confirmed
- [ ] Confirmation email

### US-125: Submit support ticket
> Là **Customer**, tôi muốn **gửi support request** để **báo issues**

**Acceptance Criteria**:
- [ ] Form: category, subject, description
- [ ] Upload attachments (photos)
- [ ] Ticket created, email confirmation
- [ ] Track ticket status

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-04: Booking
- EP-06: Payment

## Ghi chú
- Phase 3 vì self-service là nice-to-have, Phase 1-2 staff handle manually
