# F-08 – Quản lý Tầng (Floors Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-08 |
| Epic | EP-02 - Property Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Manager** quản lý các tầng trong từng tòa nhà. Mỗi floor có số tầng (floor number), tên tầng (optional), diện tích và trạng thái. Floors là layer trung gian giữa Building và Spaces.

**Business Rationale:**
- **Hierarchical structure**: Building → Floor → Space cho phép quản lý chi tiết theo từng tầng
- **Capacity planning**: Mỗi tầng có giới hạn diện tích và số lượng spaces
- **Maintenance tracking**: Có thể đóng/mở từng tầng độc lập
- **Scalability**: Dễ dàng thêm/bớt tầng khi mở rộng/thu hẹp

**Business Rules:**
- Mỗi floor phải thuộc về 1 building
- Floor number có thể âm (basement: -1, -2) hoặc dương (1, 2, 3...)
- Không được duplicate floor number trong cùng 1 building
- Không thể xóa floor nếu đã có spaces
- Tổng diện tích các floors <= Total area của building (soft validation, warning only)

**Out of Scope:**
- Floor plan visualization → F-12 (Phase 2)
- Auto-calculate available area → Phase 2
- Floor-specific amenities management → Future

## User Story

> Là **Manager**, tôi muốn **quản lý các tầng trong tòa nhà** để **cấu trúc tòa nhà chính xác và dễ dàng phân bổ spaces theo tầng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Floors List

- [ ] **AC1**: Route `/properties/floors` accessible cho Admin và Manager
- [ ] **AC2**: Dropdown/filter select Building → hiển thị floors của building đó
- [ ] **AC3**: Floors table với columns:
  - Floor Number (1, 2, 3... hoặc -1 cho basement)
  - Floor Name (optional: "Ground Floor", "Mezzanine")
  - Building Name (parent building)
  - Area (m²)
  - Spaces Count (số spaces trên tầng này)
  - Status badge (active/inactive)
  - Actions (Edit, Delete)
- [ ] **AC4**: Floors được sort theo floor number (ascending: -1, 1, 2, 3...)
- [ ] **AC5**: Breadcrumb navigation: Buildings > [Building Name] > Floors
- [ ] **AC6**: Empty state nếu building chưa có floor:
  - "No floors created for this building"
  - CTA "Add Floor"

### Filter & Search

- [ ] **AC7**: Filter theo Building (required):
  - Dropdown list tất cả buildings
  - Default: first building hoặc from query param
- [ ] **AC8**: Filter theo Status:
  - All Status
  - Active
  - Inactive
- [ ] **AC9**: Breadcrumb click Building name → navigate to Building details

### Create Floor

- [ ] **AC10**: Button "Add Floor" (trong context của selected building)
- [ ] **AC11**: Create Floor modal với fields:
  - **Building** (pre-selected, disabled nếu vào từ building context)
  - **Floor Number** (required, integer, có thể âm)
  - **Floor Name** (optional, max 50 chars) - VD: "Ground Floor", "Rooftop"
  - **Area** (required, number > 0, unit: m²)
  - **Status** (required, default: active)
- [ ] **AC12**: Validation:
  - Floor Number required và unique trong building
  - Area > 0 và <= remaining building area (warning if exceed)
  - Floor Name max 50 chars
- [ ] **AC13**: Warning nếu tổng area của floors > building total area:
  - "Warning: Total floor area exceeds building area"
  - Cho phép proceed (just warning, not blocking)
- [ ] **AC14**: Submit → POST `/api/properties/floors`
- [ ] **AC15**: Success:
  - Toast: "Floor created successfully"
  - Modal closes
  - Floors list refresh
  - Building totalFloors auto-increment (backend)

### Edit Floor

- [ ] **AC16**: Click Edit button → Edit Floor modal
- [ ] **AC17**: Pre-fill current floor data
- [ ] **AC18**: Có thể sửa:
  - Floor Number (nếu không duplicate)
  - Floor Name
  - Area
  - Status
- [ ] **AC19**: KHÔNG cho phép đổi Building (integrity)
- [ ] **AC20**: Validation giống Create
- [ ] **AC21**: Warning nếu giảm area và đã có spaces:
  - "Reducing floor area may affect existing spaces"
- [ ] **AC22**: Submit → PUT `/api/properties/floors/:id`
- [ ] **AC23**: Success:
  - Toast: "Floor updated"
  - Modal closes
  - Table refresh

### Delete Floor

- [ ] **AC24**: Delete button trên mỗi floor row
- [ ] **AC25**: Click Delete → Confirmation modal:
  - "Delete Floor [Number]?"
  - Warning: "This action cannot be undone"
- [ ] **AC26**: Pre-delete validation:
  - Check có spaces on this floor
  - Nếu có → Error: "Cannot delete floor with existing spaces. Delete spaces first."
- [ ] **AC27**: Nếu floor empty → DELETE `/api/properties/floors/:id`
- [ ] **AC28**: Success:
  - Toast: "Floor deleted"
  - Table refresh
  - Building totalFloors auto-decrement

### View Floor Details

- [ ] **AC29**: Click Floor Number → Floor details page/modal
- [ ] **AC30**: Details hiển thị:
  - Floor number + name
  - Building name (link)
  - Area
  - Status
  - Spaces count
  - Created/Updated dates
- [ ] **AC31**: List of spaces on this floor (mini table):
  - Space name
  - Type
  - Capacity
  - Status
  - Actions: View Space
- [ ] **AC32**: CTA "Add Space to this Floor" → navigate to Create Space với floor pre-selected

### Basement Floors

- [ ] **AC33**: Support negative floor numbers (basement):
  - -1, -2, -3 (B1, B2, B3)
- [ ] **AC34**: Display basement với prefix "B":
  - Floor Number: -1 → Display "B1"
  - Floor Number: -2 → Display "B2"
- [ ] **AC35**: Sort order: -2, -1, 1, 2, 3 (not -2, 1, -1, 2...)

### Permissions & Access

- [ ] **AC36**: Route permissions: ['admin', 'manager']
- [ ] **AC37**: Delete button chỉ hiển thị cho Admin
- [ ] **AC38**: Manager có thể Create/Edit, không thể Delete

### Loading & Error States

- [ ] **AC39**: Loading spinner khi fetch floors
- [ ] **AC40**: Error message nếu fetch failed
- [ ] **AC41**: Optimistic updates cho Create/Edit/Delete
- [ ] **AC42**: Rollback UI nếu server request fails

## Scenarios (Given / When / Then)

### Scenario 1: Create First Floor for Building
```gherkin
Given Manager on Building 1 details page
And Building 1 chưa có floors
When Click "Add Floor"
And Nhập:
  - Floor Number: 1
  - Floor Name: "Ground Floor"
  - Area: 500
  - Status: Active
And Click "Create"
Then POST /api/properties/floors
And Floor created với buildingId = Building 1
And Building totalFloors increment từ 0 → 1
And Toast: "Floor created successfully"
```

### Scenario 2: Create Basement Floor
```gherkin
Given Manager adding floor to Building 1
When Nhập Floor Number: -1
And Floor Name: "Basement Parking"
And Area: 300
And Click "Create"
Then Floor created successfully
And Displayed as "B1 - Basement Parking" in table
And Sorted before floor 1
```

### Scenario 3: Delete Floor with Spaces
```gherkin
Given Floor 2 có 3 spaces (Meeting Room, Hot Desk)
When Manager click "Delete Floor 2"
And Confirm deletion
Then Backend check dependencies
And Error: "Cannot delete floor with existing spaces"
And Floor không bị xóa
And Toast error message
```

### Scenario 4: Edit Floor Number - Duplicate
```gherkin
Given Building 1 có Floor 1 và Floor 2
When Manager edit Floor 2
And Change Floor Number từ 2 → 1
And Click "Save"
Then Validation error: "Floor number 1 already exists in this building"
And Save bị block
```

### Scenario 5: Filter Floors by Building
```gherkin
Given Floors page
When Select Building filter: "Cobi Building 1"
Then Chỉ hiển thị floors của Building 1
And Table shows 5 floors (sorted by number)
When Select Building 2
Then Table refresh và show floors của Building 2
```

### Scenario 6: Area Exceeds Building Total
```gherkin
Given Building 1 có total area 2500m²
And Đã có 4 floors với tổng 2400m²
When Create floor mới với area 200m²
Then Warning: "Total floor area (2600m²) exceeds building area (2500m²)"
And Vẫn cho phép Create (warning only)
And Floor created successfully
```

## API Contracts

### GET /api/properties/floors
**Query Params:**
- `buildingId` (optional): filter by building
- `status` (optional): active | inactive

**Response 200:**
```json
[
  {
    "id": "flr-1",
    "buildingId": "bld-1",
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "area": 500,
    "status": "active",
    "spacesCount": 3,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/properties/floors
**Request Body:**
```json
{
  "buildingId": "bld-1",
  "floorNumber": 2,
  "floorName": "First Floor",
  "area": 500,
  "status": "active"
}
```

**Response 201:** (created floor object)

**Validation Errors:**
- 400: `{ "error": "Floor number already exists in this building" }`
- 400: `{ "error": "Area must be greater than 0" }`

### PUT /api/properties/floors/:id
**Request Body:** (same fields as POST, except buildingId)
**Response 200:** (updated floor)

### DELETE /api/properties/floors/:id
**Response 204:** No content
**Response 400:** `{ "error": "Cannot delete floor with existing spaces" }`

## Dependencies

**Blocked by:**
- F-07 (Buildings Management) - cần building tồn tại trước

**Blocks:**
- F-09 (Workspaces Management) - spaces cần floor
- F-10 (Meeting Rooms) - rooms cần floor

## Technical Notes

### Frontend Implementation
- **Component:** Floors page/section (có thể tích hợp vào Building details)
- **Types:** `Floor` interface in `property.ts` ✅ Created
- **Hooks:** `useFloors()`, `useCreateFloor()`, etc. ✅ Created
- **Service:** `floorService` ✅ Created
- **Utils:** `formatFloorNumber()` - convert -1 → "B1"

### Backend Implementation
- **Model:** Floor (belongs to Building)
- **Validation:**
  - Unique constraint: (buildingId + floorNumber)
  - Check spaces count before delete
  - Area validation
- **Auto-increment:** Building.totalFloors on create
- **Auto-decrement:** Building.totalFloors on delete

### Database Schema
```prisma
model Floor {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  buildingId   String   @db.ObjectId
  floorNumber  Int
  floorName    String?
  area         Float
  status       FloorStatus
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  building     Building @relation(fields: [buildingId], references: [id])
  spaces       Space[]
  
  @@unique([buildingId, floorNumber])
  @@map("floors")
}

enum FloorStatus {
  active
  inactive
}
```

## Testing Checklist

### Unit Tests
- [ ] Floor number validation (unique, can be negative)
- [ ] Area validation
- [ ] Format floor number (B1, B2)
- [ ] Dependency check logic

### Integration Tests
- [ ] GET floors with building filter
- [ ] POST create floor (success)
- [ ] POST create duplicate floor number (error)
- [ ] DELETE floor with spaces (blocked)
- [ ] DELETE empty floor (success)

### E2E Tests
- [ ] Manager can create floor for building
- [ ] Floors sorted correctly (basement first)
- [ ] Cannot delete floor with spaces
- [ ] Filter by building works
- [ ] Edit floor number validation

## Done Definition

- [ ] All acceptance criteria passed
- [ ] Floor number formatting (B1, B2) works
- [ ] Dependency check prevents invalid deletes
- [ ] Unit test coverage >= 80%
- [ ] E2E test for create/edit/delete flows
- [ ] Code review approved
- [ ] No critical bugs
- [ ] Responsive design
