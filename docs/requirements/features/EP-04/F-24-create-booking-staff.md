# F-24 – Tạo Booking (Staff-Assisted)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-24 |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép Manager/Sale tạo booking trực tiếp trên hệ thống cho khách hàng qua giao diện admin. Đây là flow truyền thống khi khách hàng liên hệ qua điện thoại/email/walk-in và staff hỗ trợ đặt chỗ.

**Bối cảnh sử dụng:**
- Khách hàng gọi điện: "Tôi muốn đặt Meeting Room ngày mai 2-4 chiều"
- Walk-in customer: Khách đến trực tiếp văn phòng muốn thuê Hot Desk ngay
- Sale nhận lead và tạo booking cho customer mới
- Manager điều chỉnh booking cho khách quen

## User Story

> Là **Manager/Sale**, tôi muốn **tạo booking cho khách hàng** để **reserve không gian làm việc cho họ**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Form tạo booking có đầy đủ fields: Customer, Building, Floor, Space, Date & Time, Duration
- [ ] **AC2**: Dropdown select customer - search by name, email, phone (autocomplete)
- [ ] **AC3**: Nếu customer chưa có, có nút "Create New Customer" → quick create form
- [ ] **AC4**: Chọn building → load floors, chọn floor → load spaces (cascading dropdowns)
- [ ] **AC5**: Date picker cho start date, time picker cho start time & end time
- [ ] **AC6**: Hệ thống tự động tính duration (minutes) từ start/end time
- [ ] **AC7**: Hiển thị real-time pricing dựa trên space pricing rules (EP-02):
  - Base price per unit (hourly/daily/monthly)
  - Peak hour surcharge (+30% nếu 8am-6pm weekdays)
  - Weekend discount (-10%)
  - Loyal customer discount (-5% nếu >6 months)
- [ ] **AC8**: Conflict detection: Check space availability trước khi save
  - Query existing bookings: `(requestedStart < existingEnd) AND (requestedEnd > existingStart)`
  - Nếu conflict → show error "Space already booked [time]"
  - Suggest alternative time slots hoặc spaces
- [ ] **AC9**: Auto-generate booking code format: `BK-YYYYMMDD-XXX` (sequential per day)
- [ ] **AC10**: Booking status default = `CONFIRMED` (staff-assisted skip approval)
- [ ] **AC11**: bookingSource = `staff`
- [ ] **AC12**: Optional notes field cho special requests
- [ ] **AC13**: Click "Create Booking" → Save to database
- [ ] **AC14**: Success message: "Booking BK-20260416-001 created successfully"
- [ ] **AC15**: Redirect to booking detail page hoặc booking list
- [ ] **AC16**: Auto-generate invoice (EP-06) nếu cấu hình tự động billing

## Dữ liệu / Fields

### Form Fields

| Trường | Kiểu | Bắt buộc | Ràng buộc | Ghi chú |
|--------|------|----------|-----------|---------|
| Customer | Select (searchable) | Có | FK to customers table | Autocomplete by name/email/phone |
| Building | Select | Có | FK to buildings table | Load từ EP-02 |
| Floor | Select | Có | FK to floors table | Cascading từ building |
| Space | Select | Có | FK to spaces table | Cascading từ floor, filter by status=active |
| Start Date | Date | Có | >= today (except admin override) | Date picker |
| Start Time | Time | Có | Format: HH:mm | Time picker |
| End Time | Time | Có | > Start Time | Time picker |
| Booking Type | Radio | Có | hourly \| daily \| weekly \| monthly | Auto-detect from duration |
| Notes | Textarea | Không | Max 500 chars | Special requests, internal notes |

### Calculated Fields (Read-only)

| Trường | Kiểu | Logic |
|--------|------|-------|
| Duration | Number (minutes) | `(endTime - startTime)` |
| Price per Unit | Currency | Fetch từ Space pricing rules (EP-02) |
| Base Price | Currency | `pricePerUnit × units` |
| Discount Amount | Currency | Calculate from discount rules |
| Final Price | Currency | `basePrice - discountAmount + surcharges` |

### Database Record

```typescript
{
  id: "uuid",
  bookingCode: "BK-20260416-001",
  customerId: "customer-uuid",
  buildingId: "building-uuid",
  floorId: "floor-uuid",
  spaceId: "space-uuid",
  spaceType: "meeting_room", // Denormalized
  startTime: "2026-04-16T14:00:00Z",
  endTime: "2026-04-16T17:00:00Z",
  duration: 180, // minutes
  bookingType: "hourly",
  pricePerUnit: 200000,
  totalPrice: 600000,
  discountPercent: 0,
  finalPrice: 600000,
  status: "confirmed",
  paymentStatus: "unpaid",
  bookingSource: "staff",
  requiresApproval: false,
  depositRequired: false,
  termsAccepted: false, // N/A for staff bookings
  notes: "Customer requested projector",
  createdBy: "staff-uuid",
  createdAt: "2026-04-16T10:30:00Z",
  updatedAt: "2026-04-16T10:30:00Z"
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Book Hot Desk theo giờ (Happy Path)

```
Given Manager đăng nhập vào admin panel
When Navigate to Bookings → Click "New Booking"
And Form mở ra
And Search customer "Nguyễn Văn A" → Select
And Select Building "Tòa A" → Floor "Floor 3" → Space "Hot Desk Zone A"
And Select Date: "20/04/2026"
And Select Time: Start 14:00, End 17:00 (3 giờ)
And System hiển thị:
  • Duration: 3 hours (180 minutes)
  • Price: 50,000 VND/hour × 3 = 150,000 VND
  • No discount (weekday afternoon)
And Enter notes: "Customer needs quiet area"
And Click "Create Booking"
Then System checks availability: Hot Desk Zone A 14:00-17:00 available
And Booking created:
  • bookingCode: "BK-20260420-001"
  • status: "confirmed"
  • bookingSource: "staff"
And Success message: "Booking BK-20260420-001 created successfully"
And Redirect to booking detail page
And Space "Hot Desk Zone A" marked as booked 14:00-17:00 on calendar
```

### Scenario 2: Conflict Detection

```
Given Meeting Room 101 đã có booking 10:00-12:00 ngày 21/04
When Manager tạo booking mới
And Select Meeting Room 101, Date 21/04/2026
And Select Time: Start 11:00, End 13:00
And Click "Create Booking"
Then System check conflict:
  • Existing booking: 10:00-12:00
  • Requested: 11:00-13:00
  • Overlap detected: 11:00-12:00 (1 hour)
And Show error modal:
  • "❌ Conflict Detected"
  • "Meeting Room 101 is already booked 10:00-12:00"
  • "Available after 12:00 PM"
And Suggest alternatives:
  • "Meeting Room 102 available 11:00-13:00"
  • "Meeting Room 101 available 13:00-15:00"
And Booking KHÔNG được tạo
And Form vẫn giữ data để user adjust
```

### Scenario 3: Create customer on-the-fly

```
Given Manager nhận booking từ khách mới (chưa có trong hệ thống)
When Click "New Booking"
And Type customer name "Trần Thị B" trong search box → No results
And Click "Create New Customer" button
And Quick create dialog mở ra
And Fill fields:
  • Name: "Trần Thị B"
  • Email: "tranthib@example.com"
  • Phone: "0912345678"
  • Customer Type: Individual
And Click "Save & Select"
Then Customer record created in database
And Dialog closes
And Customer "Trần Thị B" được auto-selected trong booking form
And Continue creating booking normally
```

### Scenario 4: Peak hour surcharge

```
Given Manager tạo booking cho Meeting Room
When Select Date: 22/04/2026 (Weekday - Tuesday)
And Select Time: 09:00-11:00 (Peak hours: 8am-6pm)
And Meeting Room base price: 300,000 VND/hour
Then System calculate:
  • Base price: 300,000 × 2 hours = 600,000 VND
  • Peak hour surcharge: +30% = +180,000 VND
  • Total: 780,000 VND
And Display: "⚡ Peak hour surcharge applied (+30%)"
And Show breakdown:
  • Base: 600,000 VND
  • Surcharge: +180,000 VND
  • Final: 780,000 VND
```

### Scenario 5: Weekend discount

```
Given Manager tạo booking cho Private Office
When Select Date: 26/04/2026 (Saturday - Weekend)
And Select Time: Full day (09:00-18:00)
And Private Office daily price: 1,500,000 VND/day
Then System calculate:
  • Base price: 1,500,000 VND
  • Weekend discount: -10% = -150,000 VND
  • Total: 1,350,000 VND
And Display: "🎉 Weekend discount applied (-10%)"
And Show breakdown:
  • Base: 1,500,000 VND
  • Discount: -150,000 VND
  • Final: 1,350,000 VND
```

### Scenario 6: Booking trong quá khứ (Admin override)

```
Given Manager cần tạo booking cho ngày đã qua (data correction)
When Select Date: 10/04/2026 (in the past)
And Select time và space
And Click "Create Booking"
Then System show warning:
  • "⚠️ Start time is in the past"
  • "Only admins can create past bookings"
  • "Continue?" [Yes] [No]
When Admin has override permission → Click "Yes"
Then Booking created với note "Created retroactively by admin"
When Non-admin user → Show error "Cannot book in the past"
```

## Validation Rules

### Client-side (Real-time)

- Start time < End time
- Duration >= Space.minDuration (từ SpaceBookingConfig)
- Duration <= Space.maxDuration
- Date not more than 6 months in future
- Customer must be selected
- Space must be selected

### Server-side (Before save)

- Customer exists and not suspended
- Space exists and status = 'active'
- Conflict check: No overlapping bookings
- Price calculation matches business rules
- Booking code unique per day
- Staff has permission to create bookings

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01: Authentication - Staff must be logged in
- EP-02: Property Management - Spaces must exist
- EP-03: Customer Management - Customers must exist

**Được sử dụng bởi:**
- EP-06: Payment & Invoicing - Generate invoice từ booking
- EP-11: Dashboards - Show booking stats
- EP-13: Access Control - Link access cards to bookings

## Out of Scope

**Không thuộc F-24:**
- Customer self-booking (→ F-24B)
- Approval workflow (→ F-24C)
- Recurring bookings (→ Phase 2)
- Email notifications (→ Phase 2)
- Calendar drag-drop (→ Phase 2)

## UI/UX Notes

### Form Layout

```
┌─────────────────────────────────────┐
│  Create New Booking                 │
│  ───────────────────────────────── │
│                                     │
│  Customer *                         │
│  [Search customer...        ] [+]   │
│                                     │
│  Location *                         │
│  Building: [Select building  ▼]     │
│  Floor:    [Select floor     ▼]     │
│  Space:    [Select space     ▼]     │
│                                     │
│  Time *                             │
│  Date:  [📅 20/04/2026]             │
│  Start: [🕐 14:00]                  │
│  End:   [🕐 17:00]                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💰 Pricing Breakdown        │   │
│  │ Duration: 3 hours           │   │
│  │ Price: 50,000đ/h × 3 = 150k │   │
│  │ Discount: 0đ                │   │
│  │ Total: 150,000đ            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Notes                              │
│  [                          ]       │
│                                     │
│  [Cancel]      [Create Booking]     │
└─────────────────────────────────────┘
```

### Success State

```
┌─────────────────────────────────────┐
│  ✅ Booking Created Successfully     │
│                                     │
│  Booking Code: BK-20260420-001      │
│  Customer: Nguyễn Văn A             │
│  Space: Hot Desk Zone A             │
│  Time: 20/04/2026 14:00-17:00       │
│  Price: 150,000 VND                 │
│                                     │
│  [View Booking]  [Create Another]   │
└─────────────────────────────────────┘
```

## Technical Notes

### API Endpoint

```typescript
POST /api/bookings

Request Body:
{
  customerId: string;
  spaceId: string;
  startTime: string; // ISO 8601
  endTime: string;
  notes?: string;
}

Response:
{
  success: true,
  data: {
    id: string;
    bookingCode: string;
    // ... full booking object
  }
}

Error Response (Conflict):
{
  success: false,
  error: {
    code: "BOOKING_CONFLICT",
    message: "Space already booked",
    details: {
      conflictingBooking: {...},
      alternatives: [...]
    }
  }
}
```

### Database Query - Conflict Check

```sql
SELECT id, booking_code, start_time, end_time, customer_id
FROM bookings
WHERE space_id = ?
  AND status NOT IN ('cancelled', 'no_show')
  AND start_time < ? -- requested end time
  AND end_time > ?   -- requested start time
LIMIT 1;
```

### Performance Considerations

- Index: `(space_id, start_time, end_time, status)`
- Cache pricing rules for 1 hour
- Debounce customer search (300ms)
- Preload buildings/floors/spaces on page load

## Ghi chú

- **Staff authority**: Staff có quyền tạo booking ngay lập tức (status = confirmed) mà không cần approval hoặc deposit
- **Optimistic UI**: Show loading spinner khi creating, disable form để prevent double-submit
- **Error handling**: Show friendly error messages, không expose technical details
- **Audit trail**: Log `createdBy` staff ID cho tracking

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
