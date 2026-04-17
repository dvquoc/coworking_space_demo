# EP-04 – Booking & Reservation

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-04 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý đặt chỗ (booking/reservation) cho không gian làm việc (Hot desk, Dedicated desk, Private office) và phòng họp (Meeting rooms, Conference rooms). Hỗ trợ đặt theo giờ/ngày/tuần/tháng với conflict detection. 

**Phase 1 Extended**: Bổ sung **customer self-service booking** (khách tự đặt online), **approval workflow** (Manager duyệt booking), **deposit/prepayment** requirement, và **instant vs request** modes. Hỗ trợ **hybrid model**: cả staff-assisted và customer self-booking.

Phase 1 làm **basic booking**, recurring bookings để Phase 2.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-24 | Tạo booking (Create Booking) - Staff | Staff book space cho customer theo time slot | Draft |
| F-24B | Customer self-service booking | Customer tự đặt space qua portal | Draft |
| F-24C | Booking approval workflow | Manager approve/reject bookings | Draft |
| F-24D | Instant vs Request-to-book modes | Config per space: auto-confirm hoặc cần duyệt | Draft |
| F-24E | Deposit/Prepayment requirement | Require deposit (30%, 50%, 100%) khi book | Draft |
| F-25 | Calendar view | Xem availability của spaces theo ngày/tuần/tháng | Draft |
| F-26 | Conflict detection | Prevent double-booking | Draft |
| F-27 | Booking management | View, edit, cancel bookings | Draft |
| F-28 | Booking status tracking | Pending/Approved/Confirmed/Completed/Cancelled | Draft |

### Phase 2 - Advanced Features
- F-29: Recurring bookings (daily/weekly/monthly patterns)
- F-30: Drag-drop rescheduling trên calendar
- F-31: Booking notifications (email/SMS reminders)
- F-32: Walk-in quick booking
- F-33: Booking analytics & reports

## Data Models

### Booking
```typescript
interface Booking {
  id: string;
  bookingCode: string;          // Auto-gen: "BK-20260416-001"
  
// Space Info
  buildingId: string;
  floorId: string;
  spaceId: string;              // FK to Space (from EP-02)
  spaceType: SpaceType;         // Denormalized for query performance
  
  // Customer Info
  customerId: string;           // FK to Customer (from EP-03)
  contactPerson?: string;       // Nếu khác với customer name
  contactPhone?: string;
  
  // Time
  startTime: Date;              // ISO datetime
  endTime: Date;
  duration: number;             // Minutes
  bookingType: 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  // Pricing
  pricePerUnit: number;         // Giá theo booking type
  totalPrice: number;           // Calculated
  discountPercent?: number;     // Nếu có discount
  finalPrice: number;           // After discount
  
  // Status
  status: BookingStatus;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  
  // NEW: Self-service & Approval (F-24B, F-24C)
  bookingSource: 'staff' | 'customer_portal' | 'api';  // Tracking origin
  requiresApproval: boolean;    // Does this booking need manager approval?
  approvedBy?: string;          // Staff ID who approved
  approvedAt?: Date;
  rejectedBy?: string;          // Staff ID who rejected
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // NEW: Deposit (F-24E)
  depositRequired: boolean;
  depositPercent: number;       // 30, 50, 100
  depositAmount: number;        // Calculated
  depositPaid: boolean;
  depositInvoiceId?: string;    // Link to deposit invoice (EP-06)
  
  // NEW: Terms & Conditions Acceptance (for short-term bookings without formal contract)
  termsAccepted: boolean;       // Customer tick "I agree to T&C"
  termsVersion?: string;        // Version of T&C accepted (e.g., "1.0")
  acceptanceLogId?: string;     // FK to AcceptanceLog (EP-05)
  
  // Metadata
  notes?: string;               // Special requests
  createdBy: string;            // Staff ID or customer ID
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  
  // Future: Recurring (Phase 2)
  isRecurring?: boolean;
  recurrenceRule?: string;      // iCal RRULE format
  parentBookingId?: string;     // FK nếu là child của recurring booking
}

enum BookingStatus {
  PENDING = 'pending',              // Mới tạo, chưa confirm
  PENDING_PAYMENT = 'pending_payment',  // NEW: Chờ thanh toán deposit
  AWAITING_APPROVAL = 'awaiting_approval',  // NEW: Chờ Manager duyệt
  APPROVED = 'approved',            // NEW: Đã duyệt, chờ payment
  REJECTED = 'rejected',            // NEW: Bị reject
  CONFIRMED = 'confirmed',          // Đã confirm (paid + approved if needed)
  IN_PROGRESS = 'in_progress',      // Đang sử dụng (checked-in)
  COMPLETED = 'completed',          // Đã hoàn thành
  CANCELLED = 'cancelled',          // Đã hủy
  NO_SHOW = 'no_show'               // Không đến (future)
}
```

### BookingConflict (Helper)
```typescript
interface BookingConflict {
  spaceId: string;
  existingBookingId: string;
  requestedStart: Date;
  requestedEnd: Date;
  conflictStart: Date;
  conflictEnd: Date;
}
```

### SpaceBookingConfig (NEW - F-24D, F-24E)
```typescript
interface SpaceBookingConfig {
  id: string;
  spaceId: string;              // FK to Space (EP-02)
  
  // Booking Mode (F-24D)
  bookingMode: 'instant' | 'request';  // instant = auto-confirm, request = needs approval
  allowCustomerBooking: boolean;       // Cho phép customer tự book?
  
  // Deposit Settings (F-24E)
  depositRequired: boolean;
  depositPercent: number;              // 30, 50, 100
  
  // Constraints
  minAdvanceBooking: number;           // Minutes (e.g., 120 = phải book trước 2h)
  minDuration: number;                 // Minutes (e.g., 60 = tối thiểu 1h)
  maxDuration: number;                 // Minutes (e.g., 480 = max 8h)
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}
```

## User Stories

### US-24: Tạo booking mới
> Là **Manager/Sale**, tôi muốn **book space cho customer** để **reserve chỗ cho họ**

**Acceptance Criteria**:
- [ ] Chọn building → floor → space
- [ ] Chọn customer (search by name/email)
- [ ] Chọn ngày + time slot (start time, end time)
- [ ] Hệ thống tự tính duration và price (dựa vào pricing rules EP-02)
- [ ] Check conflict: Nếu space đã booked trong time slot → show error
- [ ] Nhập notes (optional)
- [ ] Click "Create Booking" → booking saved với status "pending"
- [ ] Auto-generate booking code

### US-25: Xem calendar availability
> Là **Manager**, tôi muốn **xem calendar của tất cả spaces** để **biết spaces nào available**

**Acceptance Criteria**:
- [ ] Calendar view theo ngày/tuần/tháng
- [ ] Filter by building, floor, space type
- [ ] Color-coded: Green (available), Red (booked), Yellow (maintenance)
- [ ] Click vào time slot → quick create booking
- [ ] Hover space → tooltip hiển thị booking details

### US-26: Conflict detection
> Là **System**, tôi muốn **prevent double-booking** để **tránh conflicts**

**Acceptance Criteria**:
- [ ] Khi create/edit booking, query existing bookings cho space đó
- [ ] Check overlap: `(requestedStart < existingEnd) AND (requestedEnd > existingStart)`
- [ ] Nếu overlap → show error "This space is already booked from [time] to [time]"
- [ ] Suggest alternative time slots (nếu có)

### US-27: Quản lý bookings
> Là **Manager**, tôi muốn **xem/sửa/hủy bookings** để **điều chỉnh khi cần**

**Acceptance Criteria**:
- [ ] List tất cả bookings với filter: date range, status, customer, space
- [ ] Search by booking code, customer name
- [ ] Edit booking: change time, extend duration (nếu không conflict)
- [ ] Cancel booking: nhập cancel reason, update status
- [ ] Export bookings to Excel (future)

### US-28: Track booking status
> Là **Manager**, tôi muốn **theo dõi trạng thái booking** để **biết bookings nào pending/confirmed/completed**

**Acceptance Criteria**:
- [ ] Booking list hiển thị status với color badge
- [ ] Filter by status
- [ ] Pending → Confirmed: Manager manually confirm
- [ ] Confirmed → In Progress: Auto-change khi check-in (EP-13)
- [ ] In Progress → Completed: Auto-change khi endTime passed
- [ ] Cancelled bookings không xóa khỏi database (soft delete)

### US-24B: Customer self-service booking (NEW)
> Là **Customer**, tôi muốn **tự book space online** để **không cần gọi staff**

**Acceptance Criteria**:
- [ ] Customer login vào portal (/customer/login)
- [ ] Browse available spaces với calendar view
- [ ] Chọn space, date/time, duration
- [ ] Xem real-time price calculation
- [ ] Submit booking → status tùy theo space config:
  - Instant mode + no deposit → CONFIRMED ngay
  - Instant mode + deposit → PENDING_PAYMENT
  - Request mode → AWAITING_APPROVAL
- [ ] Email confirmation gửi đến customer
- [ ] Booking xuất hiện trong "My Bookings"

### US-24C: Manager approves booking (NEW)
> Là **Manager**, tôi muốn **duyệt/reject bookings** để **kiểm soát space usage**

**Acceptance Criteria**:
- [ ] Xem danh sách "Pending Approvals" (bookings với status AWAITING_APPROVAL)
- [ ] Filter by building, space, date
- [ ] View booking details: customer, space, time, price
- [ ] Approve booking:
  - Nếu deposit required → status = APPROVED, generate deposit invoice
  - Nếu no deposit → status = CONFIRMED
  - Email thông báo customer
- [ ] Reject booking:
  - Nhập rejection reason
  - Status = REJECTED
  - Email thông báo customer với reason
  - Refund deposit (nếu đã thanh toán)

### US-24D: Configure space booking mode (NEW)
> Là **Admin**, tôi muốn **config booking mode per space** để **kiểm soát approval flow**

**Acceptance Criteria**:
- [ ] Space settings page → "Booking Configuration" tab
- [ ] Set booking mode:
  - Instant: Auto-confirm bookings (for Hot Desks)
  - Request: Require approval (for Meeting Rooms)
- [ ] Set deposit requirement: Yes/No, percent (30%, 50%, 100%)
- [ ] Set constraints: min advance booking, min/max duration
- [ ] Allow customer booking: Yes/No
- [ ] Save config → apply to all future bookings

### US-24E: Pay deposit when booking (NEW)
> Là **Customer**, tôi muốn **thanh toán deposit** để **confirm booking**

**Acceptance Criteria**:
- [ ] Sau khi submit booking (requires deposit), redirect to payment page
- [ ] Hiển thị deposit amount: "Deposit: 500,000 VND (50% of 1,000,000 VND)"
- [ ] Chọn payment method: VNPay, MoMo, ZaloPay
- [ ] Click "Pay Now" → redirect to gateway
- [ ] Complete payment → callback to system
- [ ] Verify signature → update:
  - depositPaid = true
  - Booking status = CONFIRMED (if instant mode) or APPROVED (if request mode approved)
- [ ] Generate balance invoice (remaining 50%) sau khi booking completed
- [ ] Email receipt gửi customer

### US-24F: Accept Terms & Conditions when booking (NEW)
> Là **Customer**, tôi muốn **đọc và đồng ý điều khoản** để **hoàn tất booking hợp lệ**

**Acceptance Criteria**:
- [ ] Khi customer tạo booking (short-term: Hot Desk, Meeting Room), hiển thị T&C checkbox
- [ ] Checkbox: "☐ Tôi đã đọc và đồng ý với [Điều khoản sử dụng Cobi Coworking Space](#)"
- [ ] Click link → mở modal/new tab với full T&C content (from EP-05 TermsAndConditions)
- [ ] Submit button disabled nếu checkbox chưa tick
- [ ] Khi submit booking → system log acceptance:
  - Create AcceptanceLog record (EP-05)
  - Save: customerId, termsId, termsVersion, acceptedAt (timestamp), acceptedByIp, userAgent
  - Link AcceptanceLog to Booking (acceptanceLogId)
- [ ] Booking.termsAccepted = true, termsVersion = current active T&C version
- [ ] **Note**: Long-term bookings (≥1 month) → skip T&C, require formal Contract instead (EP-05)

## Scenarios (Given / When / Then)

### Scenario 1: Book Hot Desk theo giờ
```
Given Manager đăng nhập
When Vào Bookings → "New Booking"
And Chọn Space "Hot Desk Zone A" (Floor 3, Building 1)
And Chọn Customer "CUS-0001"
And Chọn date "20/04/2026", time 14:00 - 17:00 (3 giờ)
And System tính giá: 50k/giờ × 3 = 150,000 VND
And Click "Create"
Then Booking created với code "BK-20260420-001", status "pending"
And Space "Hot Desk Zone A" marked booked 14:00-17:00
```

### Scenario 2: Double-booking conflict
```
Given Meeting Room 101 đã booked 10:00-12:00 ngày 21/04
When Manager cố book Meeting Room 101 từ 11:00-13:00 ngày 21/04
Then System show error "Conflict: Room already booked 10:00-12:00"
And Suggest alternative: "Available after 12:00" or "Meeting Room 102 available"
And Booking không được tạo
```

### Scenario 3: Extend booking
```
Given Booking "BK-001" từ 14:00-17:00
When Manager edit booking, change end time to 19:00 (extend 2 giờ)
And System check: 17:00-19:00 available → OK
And Recalculate price: +100k (2 giờ × 50k)
And Click "Save"
Then Booking updated, new end time 19:00, new price 250k
```

### Scenario 4: Cancel booking
```
Given Booking "BK-002" status "confirmed"
When Manager click "Cancel Booking"
And Nhập reason "Customer requested cancellation"
And Click "Confirm Cancel"
Then Status → "cancelled"
And Space becomes available lại cho booking khác
And Cancelled booking vẫn trong database (soft delete)
```

### Scenario 5: Auto-complete booking
```
Given Booking "BK-003" có endTime = "2026-04-16 18:00"
When System cronjob chạy vào 18:15
And Booking status = "in_progress"
Then Auto-update status → "completed"
```

### Scenario 6: Customer self-booking (Instant + Deposit) - NEW
```
Given Customer "john@example.com" login vào portal
When Browse spaces → select "Private Office 201"
And Space config: bookingMode = instant, depositRequired = true, depositPercent = 50%
And Select date "25/04/2026", time 09:00-17:00 (8 giờ)
And System calculate: price = 2,000,000 VND, deposit = 1,000,000 VND
And Click "Book Now"
Then Booking created:
  - bookingCode: "BK-20260425-012"
  - bookingSource: "customer_portal"
  - status: "pending_payment"
  - depositRequired: true, depositAmount: 1,000,000 VND
And Redirect to payment page
When Customer pays 1,000,000 VND via VNPay → success
Then Booking status → "confirmed"
And depositPaid = true
And Email confirmation sent
And Balance invoice (1,000,000 VND) generated sau khi booking completed
```

### Scenario 7: Customer booking (Request + Approval) - NEW
```
Given Customer "sara@example.com" login vào portal
When Select "Meeting Room A"
And Space config: bookingMode = request, depositRequired = true, depositPercent = 100%
And Select date "26/04/2026", time 14:00-16:00
And System calculate: price = 800,000 VND, deposit = 800,000 VND (100%)
And Click "Request to Book"
Then Booking created:
  - status: "awaiting_approval"
  - requiresApproval: true
And Email sent to Manager: "New booking request from Sara"
And Customer sees message: "Your booking is pending approval"

When Manager opens "Pending Approvals" queue
And Reviews booking details
And Click "Approve"
Then Booking status → "approved"
And Deposit invoice (800k) generated
And Email sent to customer: "Booking approved. Please pay deposit."

When Customer clicks payment link → pays 800k via MoMo → success
Then Booking status → "confirmed"
And depositPaid = true
And Email: "Booking confirmed. Meeting Room A is reserved for you."
```

### Scenario 8: Manager rejects booking - NEW
```
Given Booking "BK-005" status "awaiting_approval"
When Manager reviews booking
And Finds issue: "Space needed for internal meeting"
And Click "Reject"
And Enter reason: "Space reserved for company event. Please choose another time."
And Click "Confirm Reject"
Then Booking status → "rejected"
And rejectionReason saved
And Email sent to customer với reason
And Space becomes available again
```

### Scenario 9: Staff-assisted booking (existing flow) - NEW
```
Given Manager wants to book for customer (traditional flow)
When Manager creates booking via admin panel
And Select customer, space, time
And Click "Create & Confirm"
Then Booking created:
  - bookingSource: "staff"
  - status: "confirmed" (skip approval/deposit if Manager chooses)
And No deposit required (Manager authority)
And Booking confirmed immediately
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào**:
- EP-01: Authentication
- EP-02: Property Management (cần spaces để book)
- EP-03: Customer Management (cần customers để link booking)

**Được sử dụng bởi**:
- EP-05: Contract Management (contracts có thể bao gồm recurring bookings)
- EP-06: Payment & Invoicing (bookings generate invoices)
- EP-11: Dashboards (show occupancy rate từ bookings)
- EP-13: Access Control (check-in link to bookings)
- EP-15: Customer Portal (customers self-book)
- EP-16: Feedback (feedback link to bookings)

## Out of Scope (Phase 1)

**Không làm Phase 1**:
- Recurring bookings (daily/weekly/monthly patterns) → Phase 2
- Drag-drop calendar rescheduling → Phase 2
- Email/SMS notifications & reminders → Phase 2
- Waitlist (khi space fully booked) → Phase 2
- Capacity planning & optimization → Phase 3
- Mobile app check-in → Phase 3

## Technical Notes

### Database Indexes
```sql
CREATE INDEX idx_bookings_space_time ON bookings(space_id, start_time, end_time);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status, start_time);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
```

### Conflict Detection Query
```sql
SELECT * FROM bookings
WHERE space_id = ?
  AND status NOT IN ('cancelled', 'no_show')
  AND start_time < ?  -- requested end time
  AND end_time > ?    -- requested start time
```

### Validation Rules
- Start time must be < end time
- Duration must be > 0
- Cannot book in the past (start_time >= now, except for manual admin bookings)
- Cannot book space with status "maintenance" hoặc "inactive"
- Cannot book for suspended customers

### Business Rules
- **Booking code format**: `BK-YYYYMMDD-XXX` (XXX = sequential number per day)
- **Price calculation**: Fetch pricing rule từ EP-02, calculate based on duration
- **Status transitions**:
  - `pending` → `confirmed` (manual by manager)
  - `confirmed` → `in_progress` (auto on check-in from EP-13)
  - `in_progress` → `completed` (auto when endTime passed)
  - Any → `cancelled` (manual cancel)
- **Soft delete**: Cancelled bookings không xóa khỏi DB (set status + cancel reason)

### Cronjobs
- **Auto-complete**: Chạy mỗi 15 phút, check bookings với `endTime < now` và status `in_progress` → update to `completed`
- **No-show detection** (Phase 2): Nếu booking `confirmed` nhưng không check-in sau 30 phút start time → mark `no_show`

## Ghi chú

- **Phase 1 = Simple booking**: 1 booking = 1 time slot. Không support recurring.
- **Recurring bookings (Phase 2)**: Dùng iCal RRULE format (e.g., "Every Monday 9-5 for 3 months")
- **Optimistic locking** (NFR-03): Use `version` field để prevent concurrent booking conflicts
- **Calendar UI**: Recommendation dùng **FullCalendar** library (React ready)
