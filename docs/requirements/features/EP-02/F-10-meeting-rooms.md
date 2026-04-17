# F-10 – Quản lý Phòng họp (Meeting Rooms Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-10 |
| Epic | EP-02 - Property Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Manager** quản lý các phòng họp: **Meeting Room** (phòng họp nhỏ 4-8 người), **Conference Room** (phòng hội nghị lớn 10-20 người), **Training Room** (phòng đào tạo 15-30 người), và **Event Space** (không gian sự kiện 30-100 người). Mỗi phòng có equipment list chi tiết và được booking theo giờ.

**Business Rationale:**
- **High-value product**: Meeting rooms có giá cao và booking rate cao
- **Hourly booking**: Khác với workspace (monthly), meeting rooms book theo giờ/ngày
- **Equipment critical**: Projector, TV, whiteboard... ảnh hưởng lớn đến pricing và customer choice
- **Peak hours**: Cần track usage patterns để optimize pricing

**Room Types:**
1. **Meeting Room**: 4-8 người, cơ bản (TV + Whiteboard)
2. **Conference Room**: 10-20 người, professional setup (Projector + Video conf)
3. **Training Room**: 15-30 người, classroom style (Multiple screens)
4. **Event Space**: 30-100+ người, flexible layout (Stage + Sound system)

**Contract Requirements:**

| Room Type | Contract Required | Payment Method | Note |
|-----------|-------------------|----------------|------|
| Meeting Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Conference Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Training Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Event Space | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |

**Không cần hợp đồng chính thức (EP-05)** cho meeting rooms vì là booking ngắn hạn theo giờ.

**Business Rules:**
- Meeting rooms luôn là SpaceType (share chung Space model với workspaces)
- Equipment list là required (ít nhất TV hoặc Whiteboard)
- Capacity phải realistic theo room type (Meeting: 4-8, Conference: 10-20...)
- Status available/occupied real-time theo bookings
- Minimum booking: 1 hour, maximum: 8 hours/day

**Out of Scope:**
- Real-time room availability calendar → F-16 Booking
- Equipment reservation detail → Phase 2
- Room layout configurations → Phase 2
- Video conference integration → Phase 3

## User Story

> Là **Manager**, tôi muốn **quản lý các phòng họp với equipment list** để **khách hàng có thể book phòng phù hợp với nhu cầu**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Meeting Rooms List

- [ ] **AC1**: Meeting rooms hiển thị trong `/properties/spaces` (cùng page với workspaces)
- [ ] **AC2**: Filter by Type bao gồm:
  - Meeting Room
  - Conference Room
  - Training Room
  - Event Space
- [ ] **AC3**: Meeting rooms table columns:
  - Room Name + Image
  - Type badge (Meeting/Conference/Training/Event)
  - Building & Floor
  - Capacity (người)
  - Equipment (icons: Projector, TV, Whiteboard...)
  - Status (Available/Occupied/Maintenance)
  - Hourly Rate (from pricing)
  - Actions
- [ ] **AC4**: Equipment hiển thị dạng icons:
  - 📺 TV Screen
  - 📽️ Projector
  - 🎤 Microphone
  - 🔊 Sound System
  - ⬜ Whiteboard
  - 💻 Monitor
  - 📹 Video Conference
  - ☕ Coffee Service
- [ ] **AC5**: Quick filter cho meeting rooms:
  - "Rooms Available Now"
  - "With Projector"
  - "Capacity > 10"

### Create Meeting Room

- [ ] **AC6**: Create form (same modal as workspaces, với additional fields):
  - **Room Number** (required, unique per floor) - VD: "301", "A-201"
  - **Name** (required) - VD: "Meeting Room 301", "Sky Conference Hall"
  - **Type** (required dropdown):
    - Meeting Room
    - Conference Room
    - Training Room
    - Event Space
  - **Building & Floor** (cascading)
  - **Capacity** (required, validated by type):
    - Meeting: 4-8
    - Conference: 10-20
    - Training: 15-30
    - Event: 30-100
  - **Area** (auto-calculated: capacity × 2m²)
  - **Equipment** (required, multi-select):
    - TV Screen (32", 50", 65")
    - Projector + Screen
    - Whiteboard (Small/Large)
    - Microphone (Wired/Wireless)
    - Sound System
    - Video Conference (Zoom Rooms, Teams)
    - Monitor (count)
    - Coffee Service (Y/N)
  - **Layout** (optional):
    - Boardroom style
    - Classroom style
    - U-shape
    - Theater style
  - **Status** (default: available)
  - **Images** (multiple upload, max 5)
  - **Description** (equipment details, usage rules)
- [ ] **AC7**: Capacity validation by type:
  - Meeting Room: min 4, max 8
  - Conference Room: min 10, max 20
  - Training Room: min 15, max 30
  - Event Space: min 30, max 100
- [ ] **AC8**: Equipment validation:
  - At least 1 display device (TV hoặc Projector) required
  - Meeting Room: TV hoặc Projector
  - Conference Room: Projector + Video Conf recommended
  - Training Room: Multiple displays required
  - Event Space: Sound System required
- [ ] **AC9**: POST `/api/properties/spaces` (type = 'meeting_room' etc.)
- [ ] **AC10**: Success với additional validation cho meeting rooms

### Edit Meeting Room

- [ ] **AC11**: Edit modal pre-fill room data
- [ ] **AC12**: Có thể edit equipment list
- [ ] **AC13**: Warning nếu remove equipment đang trong booking description
- [ ] **AC14**: Không cho giảm capacity < số người trong active bookings
- [ ] **AC15**: Equipment change → notify customers có upcoming bookings
- [ ] **AC16**: PUT `/api/properties/spaces/:id`

### Delete Meeting Room

- [ ] **AC17**: Check upcoming bookings:
  - Has bookings today → Cannot delete
  - Has future bookings → Warning + require confirmation
  - No bookings → Safe delete
- [ ] **AC18**: Delete với option:
  - "Delete and cancel all future bookings"
  - "Delete and reassign bookings" (to similar room)
- [ ] **AC19**: DELETE `/api/properties/spaces/:id` với cascade handling

### View Room Details & Availability

- [ ] **AC20**: Room details page hiển thị:
  - Room photos gallery
  - Capacity + Area
  - Full equipment list với descriptions
  - Layout diagram (if any)
  - Pricing by hour/day
  - **Today's schedule** (timeline view):
    - 08:00-09:00: Available
    - 09:00-11:00: Occupied (Meeting with ABC Corp)
    - 11:00-12:00: Available
    - ...
  - **This week bookings** (calendar mini)
  - **Booking statistics**:
    - Utilization rate (% booked time)
    - Peak hours
    - Average booking duration
- [ ] **AC21**: CTA "Book this room" → navigate to booking page
- [ ] **AC22**: Admin actions:
  - Edit room
  - Manage equipment
  - View booking history
  - Set pricing

### Equipment Management

- [ ] **AC23**: Equipment details sub-page:
  - List all equipment với:
    - Equipment name
    - Type/Model
    - Condition (Working/Maintenance)
    - Last maintenance date
    - Next maintenance due
- [ ] **AC24**: Add equipment to room:
  - Select from equipment catalog
  - Or create new equipment entry
- [ ] **AC25**: Remove equipment:
  - Warning nếu equipment mentioned trong bookings
  - Require reason for removal
- [ ] **AC26**: Equipment maintenance mode:
  - Mark equipment as "Under Maintenance"
  - Room still bookable with reduced capacity/features
  - Auto-notify customers với bookings

### Room Status Management

- [ ] **AC27**: Auto status updates:
  - Available → Occupied (when booking starts)
  - Occupied → Available (when booking ends)
  - Manual override available (Admin)
- [ ] **AC28**: Maintenance mode:
  - Set start & end date
  - Auto-cancel conflicting bookings
  - Display "Under Maintenance" badge
  - Optional: Suggest alternative rooms to affected customers
- [ ] **AC29**: Status: Reserved
  - Pre-booked chưa confirmed
  - Timeout after 30 mins if not confirmed
  - Auto-release back to Available

### Quick Booking (Nice to have)

- [ ] **AC30**: Quick book từ room list:
  - Select room → Click "Quick Book"
  - Choose time slot (today only)
  - Auto-create booking (for Admin demo/internal use)
- [ ] **AC31**: Check-in/Check-out:
  - Quick buttons cho current bookings
  - Early check-in (if available)
  - Late checkout (charge extra)

### Meeting Rooms Statistics

- [ ] **AC32**: Stats dashboard tab:
  - Most booked rooms (top 5)
  - Revenue by room type
  - Peak hours heat map
  - Average booking duration
  - Cancellation rate
- [ ] **AC33**: Export room utilization report (CSV/PDF)

## Scenarios (Given / When / Then)

### Scenario 1: Create Conference Room
```gherkin
Given Manager on Spaces page
When Click "Add Meeting Room"
And Select Type: Conference Room
And Input:
  - Room Number: "301"
  - Name: "Sky Conference Hall"
  - Building: Cobi Building 1
  - Floor: 3
  - Capacity: 15
  - Equipment: Projector, Video Conference, Whiteboard, Coffee Service
  - Layout: Boardroom
And Upload 3 images
And Click "Create"
Then Room created với type = conference_room
And Equipment list saved
And Toast: "Conference Room created"
And Room appears in table với equipment icons
```

### Scenario 2: Book Room Conflict Check
```gherkin
Given Conference Room 301 đã booked 14:00-16:00
When Customer try to book 15:00-17:00
Then System check availability
And Error: "Room occupied 15:00-16:00"
And Suggest alternative:
  - "Conference Room 302 available 15:00-17:00"
  - "Conference Room 301 available 16:00-18:00"
```

### Scenario 3: Equipment Maintenance
```gherkin
Given Meeting Room 201 có Projector
When Admin mark Projector "Under Maintenance"
And Set dates: 18/04 - 20/04
Then Projector status = maintenance
And Room 201 still bookable
And Customers với bookings receive notification:
  "Meeting Room 201: Projector unavailable 18-20/04. TV screen available."
And Customers can choose to cancel or proceed
```

### Scenario 4: Delete Room with Bookings
```gherkin
Given Training Room A có 5 upcoming bookings
When Admin click Delete
Then Warning: "This room has 5 upcoming bookings"
And Options:
  - "Cancel all bookings and delete" → Customers refunded
  - "Reassign bookings to Training Room B" → Ask customers to confirm
  - "Cancel" → Abort delete
When Select "Cancel bookings and delete"
And Confirm với password
Then All bookings cancelled
And Customers notified
And Room deleted
And Refunds processed
```

### Scenario 5: Auto Status Update
```gherkin
Given Meeting Room 101 available
And Booking: 10:00-12:00
When Time = 10:00
Then Cron job updates status = occupied
When Time = 12:00
Then Auto-update status = available
And Room ready for next booking
```

### Scenario 6: Quick Book for Demo
```gherkin
Given Admin wants to demo room 301
When Click "Quick Book" on room 301 row
And Select time: Now - 1 hour later
And Click "Book"
Then Booking created immediately
And Room status = occupied
And Admin receives booking confirmation
```

## API Contracts

### GET /api/properties/spaces?type=meeting_room
**Response:** (same as F-09 spaces, filtered by meeting room types)

### GET /api/properties/spaces/:id/availability
**Query Params:**
- `date`: YYYY-MM-DD (default: today)

**Response 200:**
```json
{
  "spaceId": "spc-301",
  "date": "2024-04-17",
  "slots": [
    {
      "startTime": "08:00",
      "endTime": "09:00",
      "status": "available"
    },
    {
      "startTime": "09:00",
      "endTime": "11:00",
      "status": "occupied",
      "bookingId": "bkg-123"
    }
  ]
}
```

### GET /api/properties/spaces/:id/equipment
**Response 200:**
```json
[
  {
    "id": "eq-1",
    "name": "Epson Projector EB-2250U",
    "type": "projector",
    "condition": "working",
    "lastMaintenance": "2024-03-15",
    "nextMaintenance": "2024-06-15"
  }
]
```

### POST /api/properties/spaces/:id/quick-book
**Request Body:**
```json
{
  "startTime": "2024-04-17T14:00:00Z",
  "endTime": "2024-04-17T16:00:00Z",
  "purpose": "Internal demo"
}
```

**Response 201:** (booking object)

## Dependencies

**Blocked by:**
- F-07 (Buildings)
- F-08 (Floors)

**Blocks:**
- F-11 (Pricing) - meeting rooms có pricing khác workspaces
- F-16 (Booking) - booking logic cần room availability
- F-22 (Calendar Integration) - sync room bookings

**Related:**
- F-09 (Workspaces) - share chung Space model

## Technical Notes

### Frontend
- **Component:** MeetingRoomCard, EquipmentSelector, TimelineView
- **Types:** SpaceType includes meeting_room, conference_room, training_room, event_space
- **Real-time:** WebSocket for status updates (Optional Phase 2)

### Backend
- **Shared Model:** Space (với type differentiation)
- **Equipment:** Separate Equipment model với belongsTo Space
- **Availability Logic:**
  - Query bookings for date range
  - Calculate free slots
  - Cache frequently accessed rooms
- **Auto Status Update:** Cron job mỗi phút check bookings

### Performance
- Cache room availability (Redis, TTL 1 minute)
- Index on (buildingId, floorId, type, status)
- Pagination for rooms list (20 per page)

## Testing Checklist

### Unit Tests
- [ ] Capacity validation by room type
- [ ] Equipment requirements logic
- [ ] Availability calculation algorithm
- [ ] Status auto-update logic

### Integration Tests
- [ ] Create room with equipment
- [ ] Check availability API
- [ ] Delete room with bookings (blocked)
- [ ] Equipment maintenance mode

### E2E Tests
- [ ] Manager creates conference room
- [ ] View room availability timeline
- [ ] Quick book room
- [ ] Equipment list management
- [ ] Cannot delete room with today bookings

## Done Definition

- [ ] All 4 meeting room types working
- [ ] Equipment management complete
- [ ] Availability timeline view
- [ ] Auto status updates working
- [ ] Cannot delete with active bookings
- [ ] Quick book functional
- [ ] Unit tests >= 80%
- [ ] E2E tests pass
- [ ] Performance: Availability check < 500ms
