## Booking Flow (Không duyệt)

```mermaid
flowchart TD
  A[Quản lý vào trang Đặt chỗ] --> B[Chọn khách hàng (mới hoặc đã lưu)]
  B --> C[Chọn ngày, giờ bắt đầu/kết thúc]
  C --> D[Chọn tòa nhà → tầng → không gian]
  D --> E{Kiểm tra lịch trùng}
  E -- Trùng lịch --> F[Lỗi: Không gian đã được đặt]
  E -- Không trùng --> G[Chọn dịch vụ sử dụng thêm]
  G --> H[Áp dụng ưu đãi/giảm giá]
  H --> I[Chọn phương thức thanh toán]
  I --> J[Thanh toán]
  J --> K{Thanh toán thành công?}
  K -- Không --> L[Hủy booking]
  K -- Có --> M[Hệ thống tạo booking, set chỗ cho khách]
  M --> N[Hoàn thành quy trình]
```

# EP-04 – Booking & Reservation (No Approval)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-04 |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mục tiêu & Phạm vi

Quản lý đặt chỗ (booking/reservation) cho các loại hình:
- Hot Desk
- Meeting Room
- Training Room
- Event Room

**Quy trình đơn giản, KHÔNG cần duyệt:**
- Bước 1: Tạo booking (nhập thông tin khách, chọn không gian, thời gian, dịch vụ, ưu đãi...)
- Bước 2: Thanh toán (chọn phương thức, xác nhận thanh toán)
- Sau khi thanh toán thành công, hệ thống tự động hóa đơn và hoàn thành hóa dơn, booking và set chỗ cho khách hàng (Card, Face ID...)

**Áp dụng:**
- Quản lý/staff thao tác trên admin dashboard
- Có thể mở rộng cho customer portal (tự đặt, tự thanh toán)

**Không làm:**
- Không có bước duyệt/approval
- Không có recurring booking (để Phase 2)

## Tổng quan quy trình

1. Quản lý vào trang Đặt chỗ
2. Chọn khách hàng (mới hoặc đã lưu)
3. Chọn ngày, giờ bắt đầu/kết thúc
4. Chọn tòa nhà → tầng → không gian
5. Hệ thống kiểm tra lịch trùng (conflict detection)
  - Nếu trùng: Báo lỗi, không cho đặt
  - Nếu không trùng: Tiếp tục
6. Chọn dịch vụ sử dụng thêm (nếu có)
7. Áp dụng ưu đãi/giảm giá (nếu có)
8. Chọn phương thức thanh toán và tiến hành thanh toán
9. Nếu thanh toán thành công: Hệ thống tự động hoàn thành booking và set chỗ cho khách
10. Nếu thanh toán thất bại: Hủy booking

## Features thuộc Epic này

### Phase 1 - Basic Features (No Approval)

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-24 | Tạo booking | Nhập thông tin khách, chọn không gian, thời gian, dịch vụ, ưu đãi | Draft |
| F-25 | Kiểm tra lịch trùng | Prevent double-booking, báo lỗi nếu trùng | Draft |
| F-26 | Thanh toán booking | Chọn phương thức, xác nhận thanh toán | Draft |
| F-27 | Quản lý bookings | Xem, sửa, hủy bookings | Draft |
| F-28 | Theo dõi trạng thái booking | pending/confirmed/completed/cancelled | Draft |
| F-29 | Calendar view | Xem lịch availability của spaces | Draft |

### Phase 2 - Advanced Features
- Recurring bookings (daily/weekly/monthly patterns)
- Drag-drop rescheduling trên calendar
- Booking notifications (email/SMS reminders)
- Walk-in quick booking
- Booking analytics & reports

## Data Models


### Booking (Data Model)
```typescript
interface Booking {
  id: string;
  bookingCode: string;          // Auto-gen: "BK-20260416-001"
  // Space Info
  buildingId: string;
  floorId: string;
  spaceId: string;
  spaceType: SpaceType;
  // Customer Info
  customerId: string;
  contactPerson?: string;
  contactPhone?: string;
  // Time
  startTime: Date;
  endTime: Date;
  duration: number;
  bookingType: 'hourly' | 'daily' | 'weekly' | 'monthly';
  // Pricing
  pricePerUnit: number;
  totalPrice: number;
  discountPercent?: number;
  finalPrice: number;
  // Status
  status: BookingStatus;
  paymentStatus: 'unpaid' | 'paid';
  // Source
  bookingSource: 'staff' | 'customer_portal';
  // Metadata
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

enum BookingStatus {
  PENDING = 'pending',          // Mới tạo, chờ thanh toán
  CONFIRMED = 'confirmed',      // Đã thanh toán, đã giữ chỗ
  IN_PROGRESS = 'in_progress',  // Đang sử dụng (checked-in)
  COMPLETED = 'completed',      // Đã hoàn thành
  CANCELLED = 'cancelled',      // Đã hủy
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

### US-24: Tạo booking mới (Không duyệt)
> Là **Quản lý/Staff**, tôi muốn **tạo booking cho khách** để **đặt chỗ nhanh chóng, không cần duyệt**

**Acceptance Criteria**:
- [ ] Chọn khách hàng (mới hoặc đã lưu)
- [ ] Chọn building → floor → space
- [ ] Chọn ngày + time slot (start time, end time)
- [ ] Hệ thống tự tính duration và price (dựa vào pricing rules EP-02)
- [ ] Check conflict: Nếu space đã booked trong time slot → show error
- [ ] Chọn dịch vụ sử dụng thêm (nếu có)
- [ ] Áp dụng ưu đãi/giảm giá (nếu có)
- [ ] Nhập notes (optional)
- [ ] Click "Tạo booking" → chuyển sang bước thanh toán

### US-25: Thanh toán booking
> Là **Quản lý/Staff**, tôi muốn **thanh toán cho booking** để **xác nhận đặt chỗ**

**Acceptance Criteria**:
- [ ] Chọn phương thức thanh toán (VNPay, MoMo, ZaloPay, tiền mặt...)
- [ ] Xác nhận thanh toán
- [ ] Nếu thanh toán thành công → booking chuyển trạng thái "confirmed", set chỗ cho khách
- [ ] Nếu thanh toán thất bại → booking bị hủy

### US-26: Kiểm tra lịch trùng
> Là **System**, tôi muốn **prevent double-booking** để **tránh conflicts**

**Acceptance Criteria**:
- [ ] Khi tạo/sửa booking, query existing bookings cho space đó
- [ ] Check overlap: `(requestedStart < existingEnd) AND (requestedEnd > existingStart)`
- [ ] Nếu overlap → show error "Không gian đã được đặt từ [time] đến [time]"
- [ ] Suggest alternative time slots (nếu có)

### US-27: Quản lý bookings
> Là **Quản lý/Staff**, tôi muốn **xem/sửa/hủy bookings** để **điều chỉnh khi cần**

**Acceptance Criteria**:
- [ ] List tất cả bookings với filter: date range, status, customer, space
- [ ] Search by booking code, customer name
- [ ] Edit booking: change time, extend duration (nếu không conflict)
- [ ] Cancel booking: nhập cancel reason, update status
- [ ] Export bookings to Excel (future)

### US-28: Theo dõi trạng thái booking
> Là **Quản lý/Staff**, tôi muốn **theo dõi trạng thái booking** để **biết bookings nào pending/confirmed/completed/cancelled**

**Acceptance Criteria**:
- [ ] Booking list hiển thị status với color badge
- [ ] Filter by status
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
- **Price calculation**: Lấy rule từ EP-02, tính theo duration, dịch vụ, ưu đãi
- **Status transitions**:
  - `pending` → `confirmed` (ngay khi thanh toán thành công)
  - `confirmed` → `in_progress` (auto on check-in từ EP-13)
  - `in_progress` → `completed` (auto khi endTime passed)
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
