# F-09 – Quản lý Không gian Làm việc (Workspaces Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-09 |
| Epic | EP-02 - Property Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Manager** quản lý các không gian làm việc: **Hot Desk** (chỗ ngồi tự do), **Dedicated Desk** (bàn cố định riêng), **Private Office** (phòng riêng), và **Open Space** (khu làm việc chung lớn). Mỗi workspace có capacity, amenities và status để tracking availability.

**Business Rationale:**
- **Core product**: Workspaces là sản phẩm chính của Coworking Space
- **Flexible pricing**: Mỗi loại space có pricing model khác nhau (giờ/ngày/tháng)
- **Capacity management**: Track số người/bàn available vs occupied
- **Booking foundation**: Spaces là unit cho booking và contract

**Workspace Types:**
1. **Hot Desk**: Chỗ ngồi tự do, first-come-first-served, giá rẻ nhất
2. **Dedicated Desk**: Bàn cố định có tên, long-term rental
3. **Private Office**: Phòng riêng cho team (2-10 người), có cửa đóng
4. **Open Space**: Khu vực lớn cho events/workshops (20-100 người)

**Contract Requirements by Space Type:**

| Space Type | Contract Required | Payment Method | Note |
|------------|-------------------|----------------|------|
| **Dedicated Desk** | ✅ Formal Contract (EP-05) | Invoice theo hợp đồng | Thuê dài hạn, cần HĐ chính thức |
| **Private Office** | ✅ Formal Contract (EP-05) | Invoice theo hợp đồng | Thuê dài hạn, cần HĐ chính thức |
| Hot Desk | ❌ T&C only (F-36) | Credit system | Chấp nhận T&C khi book |
| Open Space | ❌ T&C only (F-36) | Credit system | Chấp nhận T&C khi book |

**Helper function:** `requiresContract(spaceType): boolean`

**Business Rules:**
- Mỗi workspace phải belong to 1 building + 1 floor
- Capacity phải > 0 và realistic (max 100 cho Open Space)
- Area của tất cả spaces trên 1 floor <= floor total area
- Status: available/occupied/reserved/maintenance
- Amenities là multi-select (WiFi, Desk, Chair, Locker, etc.)

**Out of Scope:**
- Real-time availability tracking → F-16 Booking System
- Desk/seat numbering system → Phase 2
- Space photos gallery → Phase 2 (hiện tại chỉ 1 image)

## User Story

> Là **Manager**, tôi muốn **quản lý các workspace zones (Hot desk, Dedicated desk, Private offices)** để **sẵn sàng cho booking và contract**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Workspaces List

- [ ] **AC1**: Route `/properties/spaces` với permission ['admin', 'manager']
- [ ] **AC2**: Spaces table hiển thị:
  - Space Name + Image thumbnail
  - Type badge (Hot Desk/Dedicated Desk/Private Office/Open Space)
  - Building & Floor location
  - Capacity (người)
  - Area (m²)
  - Amenities (max 3 hiển thị, +N more)
  - Status badge
  - Actions (View, Edit, Delete)
- [ ] **AC3**: Stats cards:
  - Total Spaces count
  - Available count (status = available)
  - Occupied count
  - Total Capacity (sum all)
- [ ] **AC4**: Empty state:
  - "No workspaces created"
  - CTA "Add Workspace"

### Filter & Search

- [ ] **AC5**: Filter by Building (multi-select):
  - "All Buildings" (default)
  - Cobi Building 1
  - Cobi Building 2
- [ ] **AC6**: Filter by Floor (depends on selected building)
- [ ] **AC7**: Filter by Type:
  - All Types
  - Hot Desk
  - Dedicated Desk
  - Private Office
  - Open Space
- [ ] **AC8**: Filter by Status:
  - All Status
  - Available
  - Occupied
  - Reserved
  - Maintenance
- [ ] **AC9**: Search box:
  - Search by space name
  - Real-time filtering
- [ ] **AC10**: Filters combine (AND logic)

### Create Workspace

- [ ] **AC11**: Button "Add Workspace" → modal
- [ ] **AC12**: Form fields:
  - **Name** (required, max 100 chars) - VD: "Hot Desk Zone A", "Office 301"
  - **Type** (required, dropdown):
    - Hot Desk
    - Dedicated Desk
    - Private Office
    - Open Space
  - **Building** (required, dropdown)
  - **Floor** (required, depends on selected building)
  - **Capacity** (required, number, min 1, max 100)
  - **Area** (required, number > 0, unit: m²)
  - **Amenities** (multi-select checkboxes):
    - WiFi
    - Power Outlets
    - Desk
    - Chair
    - Locker
    - Whiteboard
    - Monitor
    - Phone Booth
    - Coffee
    - Printer
  - **Status** (required, default: available)
  - **Image URL** (optional, single URL)
  - **Description** (optional, textarea, max 500 chars)
- [ ] **AC13**: Validation:
  - Name required, unique trong floor
  - Type required
  - Building + Floor required
  - Capacity: 1-100
  - Area > 0
  - At least 1 amenity recommended (warning if empty)
- [ ] **AC14**: Dynamic capacity suggestion by type:
  - Hot Desk: suggest 10-30
  - Dedicated Desk: suggest 5-15
  - Private Office: suggest 2-10
  - Open Space: suggest 20-100
- [ ] **AC15**: Submit → POST `/api/properties/spaces`
- [ ] **AC16**: Success:
  - Toast: "Workspace created successfully"
  - Modal closes
  - Table refresh
  - Floor spacesCount increment

### Edit Workspace

- [ ] **AC17**: Click Edit → modal pre-filled
- [ ] **AC18**: Có thể edit tất cả fields
- [ ] **AC19**: Không cho đổi type nếu đã có bookings (warning)
- [ ] **AC20**: Warning nếu giảm capacity < current bookings
- [ ] **AC21**: Validation giống Create
- [ ] **AC22**: Submit → PUT `/api/properties/spaces/:id`
- [ ] **AC23**: Success:
  - Toast: "Workspace updated"
  - Modal closes
  - Table refresh

### Delete Workspace

- [ ] **AC24**: Delete button (Admin only)
- [ ] **AC25**: Confirmation modal:
  - "Delete [Space Name]?"
  - Warning: "Cannot undo"
- [ ] **AC26**: Pre-delete check:
  - Has active bookings → Error: "Cannot delete space with active bookings"
  - Has future bookings → Warning: "Has future bookings, proceed?"
- [ ] **AC27**: DELETE `/api/properties/spaces/:id`
- [ ] **AC28**: Success:
  - Toast: "Workspace deleted"
  - Table refresh
  - Floor spacesCount decrement

### View Workspace Details

- [ ] **AC29**: Click space name/View → Details page/modal
- [ ] **AC30**: Details sections:
  - **Basic Info**: Name, Type, Capacity, Area
  - **Location**: Building > Floor
  - **Amenities**: Full list with icons
  - **Images**: Gallery (Phase 1: single image)
  - **Status**: Current status với last updated time
  - **Pricing**: Link to pricing rule for this space type
  - **Description**: Full text
- [ ] **AC31**: Related data:
  - Active bookings count
  - Current occupancy rate
  - Last booking date
- [ ] **AC32**: Actions:
  - Edit button
  - Change Status dropdown
  - View Pricing button
  - Delete button (Admin)

### Change Status

- [ ] **AC33**: Quick status change từ table/details:
  - Available → Occupied (when booked)
  - Available → Maintenance
  - Occupied → Available (when checkout)
  - Maintenance → Available
- [ ] **AC34**: Status change confirmation:
  - "Change status to [new status]?"
  - Explain impact if has bookings
- [ ] **AC35**: PATCH `/api/properties/spaces/:id/status`
- [ ] **AC36**: Toast notification
- [ ] **AC37**: If set to Maintenance → auto-cancel future bookings (with notification)

### Workspace Categories View

- [ ] **AC38**: Toggle view: Table / Grid Cards
- [ ] **AC39**: Grid view:
  - Card với image, name, type badge
  - Capacity, amenities icons
  - Status indicator
  - Quick actions
- [ ] **AC40**: Group by type (collapsible sections):
  - Hot Desks (15 spaces)
  - Dedicated Desks (10 spaces)
  - Private Offices (8 spaces)
  - Open Spaces (2 spaces)

### Bulk Operations (Nice to have)

- [ ] **AC41**: Select multiple spaces (checkboxes)
- [ ] **AC42**: Bulk actions:
  - Change status (all selected → Maintenance)
  - Assign pricing rule
  - Export selected

### Permissions

- [ ] **AC43**: Admin & Manager: Full CRUD
- [ ] **AC44**: Accountant: View only + Edit pricing
- [ ] **AC45**: Other roles: No access (Forbidden)

## Scenarios (Given / When / Then)

### Scenario 1: Create Hot Desk Zone
```gherkin
Given Manager on Spaces page
When Click "Add Workspace"
And Select:
  - Name: "Hot Desk Zone A"
  - Type: Hot Desk
  - Building: Cobi Building 1
  - Floor: Floor 2
  - Capacity: 20
  - Area: 150
  - Amenities: WiFi, Power Outlets, Coffee
  - Status: Available
And Click "Create"
Then POST /api/properties/spaces
And Space created successfully
And Toast: "Workspace created"
And Space appears in table with Type badge "Hot Desk"
```

### Scenario 2: Edit Private Office
```gherkin
Given Private Office "Office 301" exists với capacity 4
And Office có 1 active booking (2 người)
When Manager click Edit
And Change capacity from 4 → 3
Then Warning: "Capacity less than current bookings (2)"
And Allow proceed
When Save
Then Capacity updated to 3
And Booking still active (not affected)
```

### Scenario 3: Delete Space with Bookings
```gherkin
Given Hot Desk Zone B có 5 active bookings
When Admin click Delete
And Confirm
Then Backend check bookings
And Error: "Cannot delete space with active bookings"
And Space không bị xóa
```

### Scenario 4: Filter by Type and Status
```gherkin
Given 30 total spaces
When Select filter Type: "Private Office"
And Select filter Status: "Available"
Then Table shows 5 private offices với status available
And Stats update: Total 5, Available 5
```

### Scenario 5: Change Status to Maintenance
```gherkin
Given Open Space "Event Hall" có 2 upcoming bookings
When Manager change status → Maintenance
Then Confirmation: "This will cancel 2 upcoming bookings"
When Confirm
Then PATCH /api/properties/spaces/:id/status
And Status changed to Maintenance
And 2 bookings auto-cancelled
And Customers receive cancellation notification
```

### Scenario 6: Bulk Status Change
```gherkin
Given Manager select 5 hot desks
When Bulk action: Change status → Maintenance
And Confirm
Then All 5 spaces status = Maintenance
And Toast: "5 spaces updated"
And Table refresh
```

## API Contracts

### GET /api/properties/spaces
**Query Params:**
- `buildingId`: filter by building
- `floorId`: filter by floor
- `type`: hot_desk | dedicated_desk | private_office | open_space
- `status`: available | occupied | reserved | maintenance
- `search`: search by name

**Response 200:**
```json
[
  {
    "id": "spc-1",
    "buildingId": "bld-1",
    "floorId": "flr-2",
    "name": "Hot Desk Zone A",
    "type": "hot_desk",
    "capacity": 20,
    "area": 150,
    "amenities": ["WiFi", "Power Outlets", "Coffee"],
    "status": "available",
    "imageUrls": ["https://..."],
    "description": "Zone rộng rãi view đẹp",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/properties/spaces
**Request Body:**
```json
{
  "buildingId": "bld-1",
  "floorId": "flr-2",
  "name": "Hot Desk Zone A",
  "type": "hot_desk",
  "capacity": 20,
  "area": 150,
  "amenities": ["WiFi", "Power Outlets"],
  "status": "available",
  "imageUrls": ["https://..."],
  "description": "Optional"
}
```

**Response 201:** (created space)

### PUT /api/properties/spaces/:id
**Request Body:** Same as POST
**Response 200:** (updated space)

### PATCH /api/properties/spaces/:id/status
**Request Body:**
```json
{
  "status": "maintenance",
  "reason": "Air-con maintenance"
}
```

**Response 200:** (updated space)
**Side effects:** May cancel future bookings

### DELETE /api/properties/spaces/:id
**Response 204:** No content
**Response 400:** `{ "error": "Cannot delete space with active bookings" }`

## Dependencies

**Blocked by:**
- F-07 (Buildings)
- F-08 (Floors)

**Blocks:**
- F-11 (Pricing) - pricing rules need space types
- F-16 (Booking) - bookings need spaces
- F-17 (Contracts) - contracts reference spaces

## Technical Notes

### Frontend Implementation
- **Page:** `SpacesPage.tsx` ✅ Created
- **Types:** `Space`, `SpaceType` enum ✅ Created
- **Hooks:** `useSpaces()`, `useCreateSpace()`, etc. ✅ Created
- **Components:**
  - SpaceCard (grid view)
  - SpaceFilters
  - SpaceForm (create/edit)
  - AmenitiesSelector

### Backend Implementation
- **Model:** Space
- **Validation:**
  - Unique name per floor
  - Capacity range by type
  - Area validation
  - Booking conflicts check before delete/status change
- **Business logic:**
  - Auto-cancel bookings on Maintenance status
  - Capacity vs booking validation

### Database Schema
```prisma
model Space {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  buildingId   String      @db.ObjectId
  floorId      String      @db.ObjectId
  name         String
  type         SpaceType
  capacity     Int
  area         Float
  amenities    String[]
  status       SpaceStatus
  imageUrls    String[]
  description  String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  building     Building    @relation(fields: [buildingId], references: [id])
  floor        Floor       @relation(fields: [floorId], references: [id])
  bookings     Booking[]
  pricingRules PricingRule[]
  
  @@unique([floorId, name])
  @@map("spaces")
}

enum SpaceType {
  hot_desk
  dedicated_desk
  private_office
  open_space
}

enum SpaceStatus {
  available
  occupied
  reserved
  maintenance
}
```

## Testing Checklist

### Unit Tests
- [ ] Space validation by type
- [ ] Amenities multi-select logic
- [ ] Status change rules
- [ ] Capacity calculations

### Integration Tests
- [ ] CRUD operations for all space types
- [ ] Filter combinations
- [ ] Status change with booking check
- [ ] Delete with dependency validation

### E2E Tests
- [ ] Create hot desk zone
- [ ] Edit private office
- [ ] Change status to maintenance
- [ ] Filter by building + type
- [ ] Delete blocked by bookings

## Done Definition

- [ ] All 4 space types functional
- [ ] Filters work correctly
- [ ] Status management complete
- [ ] Cannot delete with active bookings
- [ ] Grid/Table views implemented
- [ ] Unit tests >= 80%
- [ ] E2E tests pass
- [ ] Responsive design
- [ ] Accessibility compliant
