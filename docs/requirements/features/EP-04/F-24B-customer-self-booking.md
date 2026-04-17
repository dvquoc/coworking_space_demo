# F-24B – Customer Self-Service Booking

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-24B |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations (Extended) |

## Mô tả nghiệp vụ

Cho phép khách hàng tự đặt không gian làm việc trực tuyến qua **Customer Portal** mà không cần gọi điện hoặc liên hệ staff. Khách hàng có thể:
- Xem spaces available real-time
- So sánh giá và tiện ích
- Tự chọn ngày giờ
- Thanh toán deposit online (nếu required)
- Nhận xác nhận booking ngay lập tức (instant mode) hoặc chờ duyệt (request mode)

**Business Value:**
- Tăng 30% booking từ khách hàng tự đặt
- Giảm 50% workload cho staff
- Available 24/7, khách đặt bất cứ lúc nào
- Cải thiện customer experience

## User Story

> Là **Customer**, tôi muốn **tự đặt space online** để **không cần gọi điện hay chờ staff**, tiết kiệm thời gian và tiện lợi hơn.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Authentication & Access
- [ ] **AC1**: Customer phải login vào portal trước khi booking
- [ ] **AC2**: Nếu chưa có account → Redirect to Sign Up page
- [ ] **AC3**: Sau khi login → Redirect về booking flow

### Browse & Search
- [ ] **AC4**: Trang "Browse Spaces" hiển thị tất cả spaces khả dụng
- [ ] **AC5**: Filters:
  - Space type (Hot Desk, Meeting Room, Private Office...)
  - Building và Floor
  - Price range
  - Availability date/time
- [ ] **AC6**: Sort by: Price (low→high), Capacity, Rating
- [ ] **AC7**: Space card hiển thị: Name, Photo, Price, Capacity, Amenities
- [ ] **AC8**: Click space → Mở detail page

### Booking Form
- [ ] **AC9**: Calendar picker cho date selection
- [ ] **AC10**: Time slots hiển thị availability theo màu:
  - Xanh lá: Available
  - Đỏ: Booked
  - Vàng: Pending approval
- [ ] **AC11**: Select time slot → Auto-fill start/end time
- [ ] **AC12**: Real-time price calculation hiển thị khi chọn duration
- [ ] **AC13**: Show deposit requirement (nếu có):
  - "Deposit required: 500,000đ (50% of total)"
- [ ] **AC14**: Show Terms & Conditions checkbox:
  - "☐ I agree to [Terms & Conditions](#)"
  - Click link → Mở T&C modal
  - Submit disabled nếu chưa tick
- [ ] **AC15**: "Book Now" button enabled khi tất cả fields valid

### Booking Submission
- [ ] **AC16**: Click "Book Now" → System process:
  - Create booking record
  - bookingSource = "customer_portal"
  - Check SpaceBookingConfig cho space đó
- [ ] **AC17**: Nếu **Instant mode + No deposit**:
  - status = "confirmed" ngay lập tức
  - Email confirmation gửi customer
  - Redirect to "Booking Confirmed" page
- [ ] **AC18**: Nếu **Instant mode + Deposit required**:
  - status = "pending_payment"
  - Redirect to payment page
  - Sau payment success → status = "confirmed"
- [ ] **AC19**: Nếu **Request mode**:
  - status = "awaiting_approval"
  - Notification gửi Manager
  - Customer thấy: "Your booking is pending approval"
  - Email notification: "We'll review and respond within 24h"

### Payment (if deposit required)
- [ ] **AC20**: Payment page hiển thị:
  - Booking summary (space, time, total price)
  - Deposit amount to pay
  - Payment methods: VNPay, MoMo, ZaloPay, Credit
- [ ] **AC21**: Select payment method → Redirect to gateway
- [ ] **AC22**: Gateway callback IPN → Verify signature
- [ ] **AC23**: Payment success:
  - depositPaid = true
  - Create DepositInvoice (EP-06)
  - Update booking status
  - Email receipt
- [ ] **AC24**: Payment failed:
  - Show error "Payment failed. Please try again."
  - Booking không confirmed, status vẫn "pending_payment"
  - Timeout sau 30 phút → Auto-cancel booking

### Confirmation & Access
- [ ] **AC25**: "Booking Confirmed" page hiển thị:
  - Booking code (BK-XXX)
  - Space details
  - Date & time
  - QR code (for check-in EP-13)
  - Download calendar (.ics file)
- [ ] **AC26**: Email confirmation chứa tất cả thông tin trên
- [ ] **AC27**: Booking xuất hiện trong "My Bookings" section của portal

## Dữ liệu / Fields

### Customer Portal - Browse Spaces

| Field | Type | Ghi chú |
|-------|------|---------|
| Space Type Filter | Multi-select | Hot Desk, Meeting Room, Private Office, etc. |
| Building Filter | Select | List tất cả buildings |
| Floor Filter | Select | Cascading từ building |
| Price Range | Range slider | Min-Max VND |
| Date | Date picker | Check availability for this date |
| Capacity | Number input | Số người |

### Booking Form

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Space | Select (pre-selected) | Yes | Must be available |
| Booking Date | Date | Yes | >= Today |
| Start Time | Time | Yes | >= Current time (if today) |
| End Time | Time | Yes | > Start Time |
| Terms Accepted | Checkbox | Yes | Must be checked |
| Notes | Textarea | No | Max 500 chars |

### Booking Record (Database)

```typescript
{
  id: "uuid",
  bookingCode: "BK-20260416-012",
  customerId: "customer-uuid",
  spaceId: "space-uuid",
  startTime: "2026-04-20T14:00:00Z",
  endTime: "2026-04-20T17:00:00Z",
  duration: 180,
  bookingType: "hourly",
  finalPrice: 450000,
  
  // Self-service specific
  bookingSource: "customer_portal",
  requiresApproval: true, // From SpaceBookingConfig
  status: "awaiting_approval", // or "pending_payment", "confirmed"
  
  // Deposit
  depositRequired: true,
  depositPercent: 50,
  depositAmount: 225000,
  depositPaid: false,
  depositInvoiceId: null, // Fill sau khi payment
  
  // Terms acceptance
  termsAccepted: true,
  termsVersion: "1.0",
  acceptanceLogId: "log-uuid",
  
  createdBy: "customer-uuid",
  createdAt: "2026-04-16T11:00:00Z"
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Instant Booking - Hot Desk (No Deposit)

```
Given Customer "john@example.com" login vào Customer Portal
When Navigate to "Book a Space"
And Apply filters:
  • Space type: Hot Desk
  • Date: 20/04/2026
And View available Hot Desks
And Click "Hot Desk Zone A" card
And Space detail page mở ra
And Select time slot: 14:00-17:00 (3 hours)
And System hiển thị:
  • Price: 50,000đ/hour × 3 = 150,000đ
  • Booking mode: Instant (từ SpaceBookingConfig)
  • Deposit: Not required
And Read Terms & Conditions
And Tick "☑️ I agree to Terms & Conditions"
And Click "Book Now"

Then System creates booking:
  • bookingCode: "BK-20260420-012"
  • bookingSource: "customer_portal"
  • status: "confirmed" (instant mode, no deposit)
  • termsAccepted: true
  • AcceptanceLog created (timestamp, IP, user agent)
And Redirect to "Booking Confirmed" page
And Email sent: "Your booking is confirmed! BK-20260420-012"
And Booking appears in "My Bookings"
And Space marked as booked 14:00-17:00 trên calendar
```

### Scenario 2: Instant Booking với Deposit - Private Office

```
Given Customer "sara@example.com" login
When Browse spaces → Select "Private Office 201"
And Space config:
  • bookingMode: "instant"
  • depositRequired: true
  • depositPercent: 50%
And Select date: 25/04/2026, time: 09:00-17:00 (full day)
And System calculate:
  • Total price: 2,000,000đ
  • Deposit required: 1,000,000đ (50%)
  • Balance due later: 1,000,000đ
And Accept Terms & Conditions
And Click "Book Now"

Then Booking created:
  • status: "pending_payment"
  • depositRequired: true, depositAmount: 1,000,000đ
And Redirect to Payment page
And Display: "Please pay deposit to confirm booking"

When Customer selects "VNPay"
And Clicks "Pay 1,000,000đ"
And Redirected to VNPay gateway
And Completes payment successfully
And VNPay callback IPN received

Then System verifies signature → Success
And Update booking:
  • status: "confirmed"
  • depositPaid: true
  • depositInvoiceId: "INV-001" (auto-generated)
And Email: "Payment received! Booking confirmed."
And Create balance invoice: 1,000,000đ (due after booking completed)
```

### Scenario 3: Request-to-Book với Approval - Meeting Room

```
Given Customer "tom@example.com" login
When Select "Meeting Room A"
And Space config:
  • bookingMode: "request" (requires approval)
  • depositRequired: true
  • depositPercent: 100%
And Select date: 26/04/2026, time: 14:00-16:00
And System calculate:
  • Total: 800,000đ
  • Deposit: 800,000đ (100% prepayment)
And Accept T&C
And Click "Request to Book"

Then Booking created:
  • status: "awaiting_approval"
  • requiresApproval: true
And Customer sees: "Your booking is pending approval"
And Email (Customer): "We're reviewing your request. You'll hear from us within 24h."
And Email (Manager): "New booking request from Tom - Meeting Room A"

# --- Manager approves ---

When Manager login → "Pending Approvals" queue
And Reviews booking details
And Checks availability & customer history
And Clicks "Approve"

Then Booking status → "approved"
And Deposit invoice (800k) generated
And Email (Customer): "Great news! Your booking is approved. Please pay deposit."
And Payment link included in email

When Customer clicks link → Pays 800k via MoMo
And Payment success

Then Booking status → "confirmed"
And Email: "Booking confirmed! Meeting Room A is yours."
And Access QR code generated
```

### Scenario 4: Terms & Conditions Not Accepted

```
Given Customer tạo booking
When Fill tất cả fields
But KHÔNG tick checkbox "I agree to T&C"
And Click "Book Now"

Then "Book Now" button disabled (greyed out)
And Show tooltip: "You must accept Terms & Conditions to proceed"
And Booking không được submit
And Customer phải tick checkbox trước khi tiếp tục
```

### Scenario 5: Payment Timeout

```
Given Customer booking Private Office với deposit required
When Redirect to payment page
But Customer không complete payment trong 30 phút

Then System cronjob check:
  • Booking status = "pending_payment"
  • createdAt > 30 minutes ago
And Auto-cancel booking:
  • status → "cancelled"
  • cancelReason: "Payment timeout"
And Email: "Your booking was cancelled due to payment timeout. Please try again."
And Space becomes available lại
```

### Scenario 6: Conflict During Customer Booking

```
Given Customer A selecting time slot 14:00-17:00 cho Meeting Room 101
And Customer B cũng đang select cùng time slot (concurrent request)
When Customer A clicks "Book Now" first → Processing
And 2 seconds later, Customer B clicks "Book Now" → Processing

Then System check conflicts với pessimistic locking:
  • Customer A booking saved first → Success
  • Customer B booking conflict detected → Error
And Customer B sees:
  • "❌ Sorry, this time slot was just booked by another customer"
  • "Please select another time or space"
And Suggest alternatives:
  • "Meeting Room 102 available 14:00-17:00"
  • "Meeting Room 101 available 18:00-20:00"
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication - Customer login
- EP-02: Property Management - Spaces available
- EP-03: Customer Management - Customer accounts
- EP-05: Contract Management - Terms & Conditions templates, AcceptanceLog
- EP-06: Payment & Invoicing - Deposit payment, invoice generation
- EP-15: Customer Portal - Frontend portal

**Liên kết với:**
- F-24C: Booking Approval Workflow
- F-24D: Instant vs Request modes (SpaceBookingConfig)
- F-24E: Deposit/Prepayment requirement
- F-26: Conflict detection

## Out of Scope

**Không thuộc F-24B:**
- Staff-assisted booking (→ F-24)
- Recurring bookings (→ Phase 2)
- Group bookings (multiple spaces at once) → Phase 2
- Booking modifications by customer → Phase 3 (EP-15 full)
- Cancellation by customer → Phase 3

## UI/UX Wireframes

### Browse Spaces Page

```
┌────────────────────────────────────────────────┐
│ Customer Portal - Book a Space                 │
├────────────────────────────────────────────────┤
│                                                │
│ Filters: [Space Type ▼] [Building ▼]          │
│          [📅 Date] [Price: 0đ - 5Mđ]          │
│                                                │
│ ┌─────┐ ┌─────┐ ┌─────┐                       │
│ │🖼️  │ │🖼️  │ │🖼️  │                       │
│ │Hot  │ │Meet │ │Priv │                       │
│ │Desk │ │Room │ │Off  │                       │
│ │50k/h│ │300k │ │2M/d │                       │
│ │✓ Avl│ │⏳Req │ │✓ Ins│                       │
│ └─────┘ └─────┘ └─────┘                       │
│   ...more spaces...                           │
└────────────────────────────────────────────────┘
```

### Booking Form

```
┌────────────────────────────────────────────────┐
│ Book: Private Office 201                       │
├────────────────────────────────────────────────┤
│ 🖼️ [Photo carousel]                            │
│                                                │
│ 📅 Date: [25/04/2026 ▼]                        │
│                                                │
│ ⏰ Time Slots (click to select):               │
│ ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                         │
│ │✓│✓│✓│✓│✓│✓│✓│✓│ │ │ 09-19h                 │
│ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                         │
│ Selected: 09:00 - 17:00 (8 hours)              │
│                                                │
│ 💰 Pricing:                                    │
│ ├─ Daily rate: 2,000,000đ                     │
│ ├─ Deposit (50%): 1,000,000đ [ⓘ]             │
│ └─ Balance: 1,000,000đ (due after)            │
│                                                │
│ 📝 Notes: [Optional special requests...]      │
│                                                │
│ ☐ I agree to Terms & Conditions [View]        │
│                                                │
│ [Cancel]           [Book Now →]                │
└────────────────────────────────────────────────┘
```

### Payment Page

```
┌────────────────────────────────────────────────┐
│ Complete Your Booking                          │
├────────────────────────────────────────────────┤
│ Booking Summary:                               │
│ • Space: Private Office 201                    │
│ • Date: 25/04/2026, 09:00-17:00                │
│ • Total: 2,000,000đ                            │
│                                                │
│ Pay Deposit Now: 1,000,000đ                    │
│                                                │
│ Select Payment Method:                         │
│ ○ VNPay                                        │
│ ○ MoMo                                         │
│ ○ ZaloPay                                      │
│ ○ Credit (if balance available)                │
│                                                │
│ [Back]        [Pay 1,000,000đ →]               │
└────────────────────────────────────────────────┘
```

### Confirmation Page

```
┌────────────────────────────────────────────────┐
│ ✅ Booking Confirmed!                           │
├────────────────────────────────────────────────┤
│                                                │
│ Booking Code: BK-20260425-012                  │
│                                                │
│ 📍 Private Office 201, Floor 2, Building A     │
│ 📅 Wednesday, Apr 25, 2026                     │
│ ⏰ 09:00 - 17:00                                │
│                                                │
│ ┌──────────┐                                   │
│ │ QR CODE  │ Use this to check-in              │
│ │  [QR]    │                                   │
│ └──────────┘                                   │
│                                                │
│ [📥 Download Calendar]  [📧 Email Receipt]     │
│                                                │
│ [← Back to My Bookings]  [Book Another Space]  │
└────────────────────────────────────────────────┘
```

## Technical Notes

### API Endpoints

```typescript
// Browse available spaces
GET /api/customer/spaces/available
Query params: {
  spaceType?: string;
  buildingId?: string;
  date: string; // ISO date
  startTime?: string;
  endTime?: string;
}

// Get space availability calendar
GET /api/customer/spaces/:spaceId/availability
Query: { date: string; duration?: number }

// Create booking (customer)
POST /api/customer/bookings
Body: {
  spaceId: string;
  startTime: string;
  endTime: string;
  termsAccepted: boolean;
  termsVersion: string;
  notes?: string;
}

Response: {
  success: true,
  data: {
    booking: {...},
    nextStep: "payment" | "confirmation" | "awaiting_approval"
  }
}
```

### Real-time Conflict Prevention

```typescript
// Use optimistic locking
BEGIN TRANSACTION;

SELECT * FROM bookings
WHERE space_id = ? AND status NOT IN ('cancelled')
  AND start_time < ? AND end_time > ?
FOR UPDATE; // Lock để prevent concurrent booking

IF no conflict:
  INSERT INTO bookings (...);
  COMMIT;
ELSE:
  ROLLBACK;
  RETURN conflict error;
```

### Performance

- Cache space availability cho 1 minute
- Use Redis để track concurrent booking attempts
- Lazy load space photos (placeholder → actual image)
- Debounce search filters (500ms)
- Pagination: 20 spaces per page

## Security

- Rate limiting: Max 10 booking attempts per customer per hour
- CSRF protection on all POST requests
- Validate customer owns the booking before showing details
- Sanitize notes field (XSS prevention)
- Payment signature verification (HMAC SHA256/512)

## Accessibility

- WCAG 2.1 Level A compliance
- Keyboard navigation support
- Screen reader friendly
- Color contrast >= 4.5:1
- Focus indicators visible

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
