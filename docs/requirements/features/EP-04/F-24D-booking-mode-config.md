# F-24D – Instant vs Request-to-Book Configuration

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-24D |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép Admin **cấu hình linh hoạt booking mode** cho từng loại space hoặc từng space cụ thể:
- **Instant Booking**: Tự động confirm ngay lập tức (không cần approval)
- **Request-to-Book**: Cần Manager approval trước khi confirm

**Business Rationale:**
- **Hot Desks**: Instant (low risk, high volume) → UX tốt, không cần review
- **Meeting Rooms**: Request (cần verify mục đích) → Quality control
- **Private Offices**: Request (high-value, long-term) → Customer screening
- **Flexibility**: Admin có thể thay đổi policy theo thời gian

**Additional Controls:**
- Deposit requirement (có/không)
- Minimum advance booking time (e.g., "phải đặt trước ít nhất 2h")
- Maximum advance booking time (e.g., "chỉ đặt được tối đa 30 ngày trước")
- Auto-approval conditions (Phase 2: based on customer tier)

## User Story

> Là **Admin**, tôi muốn **cấu hình booking mode cho mỗi space** để **kiểm soát quy trình approval** phù hợp với từng loại dịch vụ.

> Là **Customer**, khi đặt space, tôi muốn **biết rõ booking của mình instant hay cần chờ duyệt** để quản lý thời gian hợp lý.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Configuration UI (Admin)

- [ ] **AC1**: Admin menu: "Settings" → "Booking Configuration"
- [ ] **AC2**: List all spaces with current booking mode
- [ ] **AC3**: Columns: Space name, Type, Booking mode, Deposit required, Advance time rules
- [ ] **AC4**: Filter by: Building, Floor, Space type
- [ ] **AC5**: Search by space name

### Edit Space Booking Config

- [ ] **AC6**: Click space → Edit modal opens
- [ ] **AC7**: **Booking Mode** field:
  - Radio buttons: ○ Instant Booking | ○ Request-to-Book
  - Help text: "Instant = auto-confirm, Request = needs approval"
- [ ] **AC8**: **Deposit Requirement**:
  - Checkbox: ☑ Require deposit
  - If checked: Input deposit percentage (10-100%)
  - Default: Meeting Room 20%, Private Office 50%
- [ ] **AC9**: **Minimum Advance Time**:
  - Input: Number + Unit (hours/days)
  - Examples: "2 hours", "1 day", "7 days"
  - Validation: Must be ≥ 0
- [ ] **AC10**: **Maximum Advance Time**:
  - Input: Number + Unit
  - Default: 30 days for all spaces
  - Validation: Must be > minimum advance time
- [ ] **AC11**: **Allow Same-Day Booking**:
  - Checkbox: ☑ Allow same-day booking
  - If unchecked: Minimum advance = 1 day
- [ ] **AC12**: Save button: "Save Configuration"
- [ ] **AC13**: Cancel button: Discard changes

### Instant Booking Behavior

- [ ] **AC14**: When customer books instant-booking space:
  - Status immediately → `confirmed` (if no deposit)
  - Status → `pending_payment` → `confirmed` (if deposit required)
  - NO manager review needed
- [ ] **AC15**: Email notification instant:
  - "✅ Booking Confirmed! BK-XXX"
  - QR code included
  - Add to calendar link

### Request-to-Book Behavior

- [ ] **AC16**: When customer books request-to-book space:
  - Status → `awaiting_approval`
  - Notification to Manager
  - Customer sees: "Request submitted, we'll review within 12h"
- [ ] **AC17**: UI shows clearly:
  - Badge: "⏳ Approval Required"
  - Timeline: "Manager will review within 12 hours"
- [ ] **AC18**: Triggers F-24C approval workflow

### Advance Time Validation

- [ ] **AC19**: Enforce minimum advance time:
  - If space requires "2 hours advance"
  - Customer cannot book slot starting in <2h
  - Error: "This space requires 2 hours advance booking"
- [ ] **AC20**: Enforce maximum advance time:
  - If max is 30 days
  - Customer cannot select dates >30 days from now
  - Date picker disabled beyond 30 days
- [ ] **AC21**: Display advance requirements on booking form:
  - Info box: "ℹ️ Minimum 2 hours advance notice required"

### Customer Portal Display

- [ ] **AC22**: Space listing shows booking mode:
  - Badge: "⚡ Instant Booking" (green)
  - Badge: "⏳ Request-to-Book" (yellow)
- [ ] **AC23**: Space detail page shows:
  - Booking rules section
  - "Booking Mode: Instant / Request"
  - "Advance Notice: Minimum 2 hours"
  - "Deposit: 20% required"
- [ ] **AC24**: During booking flow:
  - If instant: "Your booking will be confirmed immediately"
  - If request: "Your request will be reviewed within 12 hours"

### Bulk Configuration (Convenience Feature)

- [ ] **AC25**: Admin can set configs for multiple spaces:
  - Select multiple spaces (checkboxes)
  - "Bulk Edit" button
  - Apply same config to all selected
- [ ] **AC26**: Templates:
  - Predefined configs: "Hot Desk Template", "Meeting Room Template", "Private Office Template"
  - Click to apply template

## Dữ liệu / Fields

### Table: `space_booking_configs`

```typescript
interface SpaceBookingConfig {
  id: string;
  spaceId: string; // FK to spaces table
  
  // Booking Mode
  bookingMode: 'instant' | 'request'; // Default based on space type
  
  // Deposit Settings
  depositRequired: boolean; // Default false for Hot Desk, true for others
  depositPercentage?: number; // 10-100, default 50
  
  // Advance Time Rules
  minAdvanceHours: number; // Minimum hours before start (default 0)
  maxAdvanceDays: number; // Maximum days can book ahead (default 30)
  allowSameDayBooking: boolean; // Default true for Hot/Meeting, false for Private
  
  // Auto-Approval Conditions (Phase 2)
  autoApproveConditions?: {
    customerTiers?: string[]; // ['gold', 'platinum']
    maxBookingValue?: number; // Auto-approve if < this amount
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string; // Admin ID
}
```

### Default Configurations by Space Type

| Space Type | Booking Mode | Deposit | Min Advance | Max Advance | Same-Day |
|------------|--------------|---------|-------------|-------------|----------|
| Hot Desk | Instant | No | 0h | 7 days | Yes |
| Dedicated Desk | Instant | No | 0h | 30 days | Yes |
| Meeting Room | Request | 20% | 2h | 30 days | Yes |
| Conference Room | Request | 30% | 1 day | 60 days | No |
| Private Office | Request | 50% | 7 days | 90 days | No |
| Event Space | Request | 50% | 14 days | 180 days | No |

## Scenarios (Given / When / Then)

### Scenario 1: Configure Instant Booking for Hot Desk

```
Given Admin logged in
And Navigate to "Settings" → "Booking Configuration"
And List shows "Hot Desk A" with current mode "Request"

When Admin clicks "Hot Desk A"
And Edit modal opens
And Select booking mode: ○ Instant Booking (selected)
And Uncheck deposit requirement
And Set min advance: 0 hours
And Click "Save Configuration"

Then System updates space_booking_configs:
  • spaceId: "hot-desk-a"
  • bookingMode: "instant"
  • depositRequired: false
  • minAdvanceHours: 0
And Success message: "✅ Configuration saved for Hot Desk A"
And Table updated with new values
```

### Scenario 2: Customer Books Instant Space

```
Given Customer "Alice" browses spaces
And Sees "Hot Desk A" with badge "⚡ Instant Booking"
And Space config:
  • bookingMode: "instant"
  • depositRequired: false
  • minAdvanceHours: 0

When Customer selects:
  • Date: Today
  • Time: 14:00-17:00 (3h)
And Clicks "Book Now"
And Confirms booking

Then System creates booking:
  • status: "confirmed" (immediately)
  • NO approval needed
And Email sent instantly:
  • "✅ Booking Confirmed! BK-001"
  • QR code attached
And Customer sees: "Your booking is ready! Show QR at check-in."
```

### Scenario 3: Customer Books Request-to-Book Space

```
Given Customer "Bob" books "Meeting Room A"
And Space config:
  • bookingMode: "request"
  • depositRequired: true
  • depositPercentage: 20

When Customer submits booking for 2M VND

Then System creates booking:
  • status: "awaiting_approval"
  • depositAmount: 400,000 VND (20%)
And Notification to Manager
And Customer sees:
  • "⏳ Request Submitted"
  • "We'll review within 12 hours"
  • "You'll receive email notification"
And NO QR code yet (wait for approval)
```

### Scenario 4: Enforce Minimum Advance Time

```
Given Meeting Room B config:
  • minAdvanceHours: 2
  • Current time: 14:00

When Customer tries to book:
  • Start time: 15:30 (1.5h from now)

Then System validation error:
  • "❌ This space requires 2 hours advance booking"
  • "Earliest available time: 16:00"
And Time picker disabled for slots before 16:00
And Suggested times shown: 16:00, 16:30, 17:00...
```

### Scenario 5: Enforce Maximum Advance Time

```
Given Private Office 201 config:
  • maxAdvanceDays: 90
  • Today: 16/04/2026

When Customer opens date picker

Then Calendar shows:
  • Dates up to 15/07/2026 (90 days) → Enabled
  • Dates after 15/07/2026 → Disabled (grayed out)
And Tooltip: "Maximum 90 days advance booking"
```

### Scenario 6: Bulk Configuration for All Meeting Rooms

```
Given Admin wants to apply same config to 5 meeting rooms

When Admin selects all 5 meeting rooms (checkboxes)
And Clicks "Bulk Edit"
And Sets:
  • Booking mode: Request-to-Book
  • Deposit: 20%
  • Min advance: 2 hours
  • Max advance: 30 days
And Clicks "Apply to All Selected"

Then System updates all 5 configs
And Shows summary:
  • "✅ Updated 5 spaces successfully"
  • List each space name
```

### Scenario 7: Template Application

```
Given Admin creating config for new Meeting Room C

When Admin clicks "Apply Template"
And Selects "Meeting Room Template"

Then Form auto-fills:
  • Booking mode: Request-to-Book
  • Deposit: 20%
  • Min advance: 2 hours
  • Max advance: 30 days
  • Allow same-day: Yes
And Admin can adjust before saving
```

### Scenario 8: Same-Day Booking Disabled

```
Given Conference Room config:
  • allowSameDayBooking: false
  • Today: 16/04/2026

When Customer opens booking form

Then Date picker:
  • Today (16/04) → Disabled
  • Tomorrow (17/04) onwards → Enabled
And Info text: "⚠️ Same-day booking not allowed for this space"
```

## Business Rules

### Default Mode Selection Logic

When new space is created:
```typescript
function getDefaultBookingMode(spaceType: SpaceType): SpaceBookingConfig {
  switch(spaceType) {
    case 'hot_desk':
    case 'dedicated_desk':
      return {
        bookingMode: 'instant',
        depositRequired: false,
        minAdvanceHours: 0,
        maxAdvanceDays: 30,
        allowSameDayBooking: true
      };
      
    case 'meeting_room':
      return {
        bookingMode: 'request',
        depositRequired: true,
        depositPercentage: 20,
        minAdvanceHours: 2,
        maxAdvanceDays: 30,
        allowSameDayBooking: true
      };
      
    case 'private_office':
    case 'conference_room':
      return {
        bookingMode: 'request',
        depositRequired: true,
        depositPercentage: 50,
        minAdvanceHours: 24 * 7, // 7 days
        maxAdvanceDays: 90,
        allowSameDayBooking: false
      };
  }
}
```

### Validation Rules

- `depositPercentage`: Must be 10-100
- `minAdvanceHours`: Must be ≥ 0
- `maxAdvanceDays`: Must be > 0 and ≥ minAdvanceHours converted to days
- If `allowSameDayBooking = false`: `minAdvanceHours` must be ≥ 24

## UI/UX Design

### Booking Configuration List

```
┌─────────────────────────────────────────────────────────────────┐
│  Booking Configuration              [+ Add Rule] [Templates ▼] │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [All Buildings ▼] [All Floors ▼] [All Types ▼]       │
│  Search: [                                            ] 🔍      │
├─────────────────────────────────────────────────────────────────┤
│ Space              │ Type      │ Mode    │ Deposit │ Advance    │
├────────────────────┼───────────┼─────────┼─────────┼────────────┤
│ Hot Desk A         │ Hot Desk  │ ⚡ Instant│ No     │ 0h - 7d   │
│ [Edit]                                                          │
├────────────────────┼───────────┼─────────┼─────────┼────────────┤
│ Meeting Room A     │ Meeting   │ ⏳ Request│ 20%    │ 2h - 30d  │
│ [Edit]                                                          │
├────────────────────┼───────────┼─────────┼─────────┼────────────┤
│ Private Office 201 │ Private   │ ⏳ Request│ 50%    │ 7d - 90d  │
│ [Edit]                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Edit Configuration Modal

```
┌──────────────────────────────────────────────────────────┐
│  Configure Booking Rules - Meeting Room A                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Booking Mode: *                                         │
│  ○ Instant Booking                                       │
│  ● Request-to-Book (Requires manager approval)           │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Deposit Requirements:                                   │
│  ☑ Require deposit payment                               │
│                                                          │
│  Deposit Percentage: [20   ]%  (10-100%)                │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Advance Booking Time:                                   │
│                                                          │
│  Minimum: [2     ]  [Hours  ▼]                          │
│  ℹ️ Customers must book at least this much in advance    │
│                                                          │
│  Maximum: [30    ]  [Days   ▼]                          │
│  ℹ️ Customers can book up to this far ahead              │
│                                                          │
│  ☑ Allow same-day booking                                │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  [Apply Template ▼]  [Cancel]       [Save Configuration]│
└──────────────────────────────────────────────────────────┘
```

### Customer View (Space Detail)

```
┌──────────────────────────────────────────────────┐
│  Meeting Room A                                  │
│  Floor 3, Building 1                             │
├──────────────────────────────────────────────────┤
│  [Images carousel]                               │
│                                                  │
│  💰 300,000 VND/hour                             │
│  👥 Capacity: 8 people                           │
│  📐 Size: 25 m²                                  │
│                                                  │
│  📋 Booking Information:                         │
│  ⏳ Request-to-Book (Approval required)          │
│  💳 Deposit: 20% required                        │
│  ⏰ Advance Notice: Minimum 2 hours              │
│  📅 Book up to: 30 days ahead                    │
│                                                  │
│  ✨ Amenities: Projector, Whiteboard, WiFi       │
│                                                  │
│  [Book This Space]                               │
└──────────────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Get all booking configs (Admin)
GET /api/admin/booking-configs
Query: { building?, floor?, spaceType? }
Response: {
  configs: Array<{
    space: SpaceInfo;
    config: SpaceBookingConfig;
  }>;
}

// Get config for specific space
GET /api/spaces/:spaceId/booking-config
Response: SpaceBookingConfig | null

// Update booking config (Admin)
PUT /api/admin/spaces/:spaceId/booking-config
Body: {
  bookingMode: 'instant' | 'request';
  depositRequired: boolean;
  depositPercentage?: number;
  minAdvanceHours: number;
  maxAdvanceDays: number;
  allowSameDayBooking: boolean;
}
Response: { success: true, config: SpaceBookingConfig }

// Bulk update (Admin)
POST /api/admin/booking-configs/bulk-update
Body: {
  spaceIds: string[];
  config: Partial<SpaceBookingConfig>;
}
Response: { 
  success: true, 
  updated: number,
  failed: Array<{spaceId, error}>
}

// Get booking templates
GET /api/admin/booking-config-templates
Response: {
  templates: Array<{
    name: string;
    description: string;
    config: SpaceBookingConfig;
  }>;
}
```

## Technical Notes

### Database Migration

```sql
CREATE TABLE space_booking_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  
  booking_mode VARCHAR(20) NOT NULL CHECK (booking_mode IN ('instant', 'request')),
  
  deposit_required BOOLEAN DEFAULT false,
  deposit_percentage INTEGER CHECK (deposit_percentage >= 10 AND deposit_percentage <= 100),
  
  min_advance_hours INTEGER DEFAULT 0 CHECK (min_advance_hours >= 0),
  max_advance_days INTEGER DEFAULT 30 CHECK (max_advance_days > 0),
  allow_same_day_booking BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  
  UNIQUE(space_id)
);

-- Index for lookups
CREATE INDEX idx_space_booking_configs_space_id ON space_booking_configs(space_id);
```

### Validation Service

```typescript
class BookingValidationService {
  async validateAdvanceTime(
    spaceId: string, 
    startTime: Date
  ): Promise<ValidationResult> {
    const config = await getSpaceBookingConfig(spaceId);
    if (!config) return { valid: true };
    
    const now = new Date();
    const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Check minimum advance
    if (hoursUntilStart < config.minAdvanceHours) {
      return {
        valid: false,
        error: `This space requires ${config.minAdvanceHours} hours advance booking`,
        earliestTime: addHours(now, config.minAdvanceHours)
      };
    }
    
    // Check maximum advance
    const daysUntilStart = hoursUntilStart / 24;
    if (daysUntilStart > config.maxAdvanceDays) {
      return {
        valid: false,
        error: `Bookings can only be made up to ${config.maxAdvanceDays} days in advance`
      };
    }
    
    // Check same-day
    if (!config.allowSameDayBooking && isSameDay(now, startTime)) {
      return {
        valid: false,
        error: 'Same-day booking is not allowed for this space'
      };
    }
    
    return { valid: true };
  }
}
```

### Configuration Templates

```typescript
const BOOKING_CONFIG_TEMPLATES = {
  'hot-desk': {
    name: 'Hot Desk Template',
    description: 'Instant booking, no deposit, flexible',
    config: {
      bookingMode: 'instant',
      depositRequired: false,
      minAdvanceHours: 0,
      maxAdvanceDays: 7,
      allowSameDayBooking: true
    }
  },
  
  'meeting-room': {
    name: 'Meeting Room Template',
    description: 'Request-to-book, 20% deposit, 2h advance',
    config: {
      bookingMode: 'request',
      depositRequired: true,
      depositPercentage: 20,
      minAdvanceHours: 2,
      maxAdvanceDays: 30,
      allowSameDayBooking: true
    }
  },
  
  'private-office': {
    name: 'Private Office Template',
    description: 'Request-to-book, 50% deposit, 7 days advance',
    config: {
      bookingMode: 'request',
      depositRequired: true,
      depositPercentage: 50,
      minAdvanceHours: 24 * 7, // 7 days
      maxAdvanceDays: 90,
      allowSameDayBooking: false
    }
  }
};
```

## Dependencies

**Phụ thuộc vào:**
- EP-02: Spaces (spaceId reference)
- EP-01: Auth (admin permissions)

**Được sử dụng bởi:**
- F-24: Staff booking (check config)
- F-24B: Customer booking (enforce rules)
- F-24C: Approval workflow (triggered by request mode)
- F-24E: Deposit calculation

## Out of Scope

**Phase 1 không làm:**
- Auto-approval based on customer tier → Phase 2
- Dynamic pricing based on demand → Phase 2
- Blackout dates configuration → Phase 2
- Custom approval workflows (multi-level) → Phase 3

## Testing Checklist

- [ ] Instant booking creates confirmed status
- [ ] Request booking creates awaiting_approval status
- [ ] Minimum advance time validation works
- [ ] Maximum advance time validation works
- [ ] Same-day booking blocked when configured
- [ ] Deposit percentage calculation correct
- [ ] Bulk update applies to all selected spaces
- [ ] Template application pre-fills form correctly
- [ ] Customer sees correct booking mode badge
- [ ] Date picker respects max advance days

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
