# F-07 – Quản lý Tòa nhà (Buildings Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-07 |
| Epic | EP-02 - Property Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Manager** quản lý thông tin các tòa nhà Coworking Space (hiện tại: 2 tòa Cobi, có thể mở rộng thêm). Bao gồm thông tin địa chỉ, tổng số tầng, diện tích, trạng thái hoạt động và hình ảnh.

**Business Rationale:**
- **Foundation data**: Building là nền tảng cho toàn bộ property hierarchy (Building → Floor → Space)
- **Scalability**: Hỗ trợ mở rộng nhiều tòa nhà trong tương lai
- **Status tracking**: Quản lý trạng thái (active, inactive, maintenance) để kiểm soát availability
- **Audit trail**: Lưu lịch sử thay đổi thông tin building

**Business Rules:**
- Mỗi building phải có ít nhất 1 floor
- Không thể xóa building nếu đã có floors/spaces
- Tổng số tầng (totalFloors) phải khớp với số floors thực tế được tạo
- Diện tích (totalArea) phải lớn hơn 0

**Out of Scope:**
- Floor plan upload → F-12 (Phase 2)
- Building analytics/reports → F-14 (Phase 2)
- Multi-tenant building management → Future phase

## User Story

> Là **Manager**, tôi muốn **xem và quản lý danh sách tòa nhà** để **biết tổng quan tài sản đang quản lý và cập nhật thông tin khi cần**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Buildings List

- [ ] **AC1**: Route `/properties/buildings` chỉ accessible cho Admin và Manager
- [ ] **AC2**: Hiển thị danh sách buildings trong table format với columns:
  - Building name (tên + hình ảnh)
  - Address (địa chỉ đầy đủ)
  - Total Floors (số tầng)
  - Total Area (diện tích m²)
  - Status badge (active/inactive/maintenance)
  - Actions (View Details button)
- [ ] **AC3**: Stats cards hiển thị ở đầu page:
  - Total Buildings (tổng số tòa nhà)
  - Active Buildings (đang hoạt động)
  - Total Area (tổng diện tích tất cả buildings)
- [ ] **AC4**: Empty state khi chưa có building:
  - Icon + message "No buildings found"
  - CTA button "Add Building"

### Search & Filter

- [ ] **AC5**: Search box filter theo:
  - Building name (case-insensitive)
  - Address (partial match)
- [ ] **AC6**: Filter dropdown theo status:
  - All Status (default)
  - Active
  - Inactive
  - Maintenance
- [ ] **AC7**: Search + filter hoạt động real-time
- [ ] **AC8**: Hiển thị số kết quả tìm được

### View Building Details

- [ ] **AC9**: Click "View Details" → hiển thị building details modal/page
- [ ] **AC10**: Building details bao gồm:
  - Building name
  - Full address
  - Total floors
  - Total area (m²)
  - Status
  - Image (nếu có)
  - Description (nếu có)
  - Created date
  - Last updated date
- [ ] **AC11**: Hiển thị danh sách floors thuộc building (summary)
- [ ] **AC12**: Link to Floors page với building filter applied

### Create Building (Admin/Manager only)

- [ ] **AC13**: Button "Add Building" → mở Create Building modal
- [ ] **AC14**: Create form có các fields:
  - **Name** (required, max 100 chars)
  - **Address** (required, max 255 chars)
  - **Total Floors** (required, number, min 1)
  - **Total Area** (required, number, min 1, unit: m²)
  - **Status** (required, dropdown: active/inactive/maintenance)
  - **Image URL** (optional, valid URL)
  - **Description** (optional, textarea, max 500 chars)
- [ ] **AC15**: Validation:
  - All required fields must be filled
  - Total Floors >= 1
  - Total Area > 0
  - Image URL format valid (if provided)
- [ ] **AC16**: Submit → POST `/api/properties/buildings`
- [ ] **AC17**: Success:
  - Toast notification: "Building created successfully"
  - Modal closes
  - Table refreshes and shows new building
- [ ] **AC18**: Error handling:
  - Duplicate name: "Building name already exists"
  - Network error: "Failed to create building. Please try again."
  - Server error: Display error message from backend

### Edit Building (Admin/Manager only)

- [ ] **AC19**: Building details có button "Edit"
- [ ] **AC20**: Edit modal pre-fills với current data
- [ ] **AC21**: Có thể sửa tất cả fields (giống Create form)
- [ ] **AC22**: Validation giống Create form
- [ ] **AC23**: Nếu thay đổi totalFloors:
  - Warning nếu giảm số tầng và đã có floors tồn tại
  - "Cannot reduce total floors below existing floor count"
- [ ] **AC24**: Submit → PUT `/api/properties/buildings/:id`
- [ ] **AC25**: Success:
  - Toast: "Building updated successfully"
  - Modal closes
  - Details refresh with new data
- [ ] **AC26**: Error handling tương tự Create

### Delete Building (Admin only)

- [ ] **AC27**: Building details có button "Delete" (chỉ Admin)
- [ ] **AC28**: Click Delete → Confirmation modal:
  - "Are you sure you want to delete [Building Name]?"
  - Warning: "This action cannot be undone."
- [ ] **AC29**: Validation trước khi xóa:
  - Check có floors/spaces tồn tại không
  - Nếu có → Error: "Cannot delete building with existing floors/spaces. Please delete all floors first."
- [ ] **AC30**: Nếu building empty → DELETE `/api/properties/buildings/:id`
- [ ] **AC31**: Success:
  - Toast: "Building deleted successfully"
  - Navigate to buildings list
  - Building removed from table
- [ ] **AC32**: Error handling:
  - Has dependencies: "Cannot delete building with existing data"
  - Network error: Standard error message

### Status Management

- [ ] **AC33**: Status badge colors:
  - Active: Green background
  - Inactive: Gray background
  - Maintenance: Amber background
- [ ] **AC34**: Manager có thể change status (Admin/Manager)
- [ ] **AC35**: Status change confirmation:
  - "Change status to [new status]?"
  - Explain impact (e.g., "Maintenance status will make spaces unavailable for booking")
- [ ] **AC36**: Status change → PATCH `/api/properties/buildings/:id/status`
- [ ] **AC37**: Toast notification on status change

### Permissions & Access Control

- [ ] **AC38**: Route `/properties/buildings` require roles: ['admin', 'manager']
- [ ] **AC39**: Other roles redirect to Forbidden page
- [ ] **AC40**: Delete button chỉ hiển thị với Admin
- [ ] **AC41**: Edit/Create available cho cả Admin và Manager

### Data Refresh & Loading States

- [ ] **AC42**: Loading spinner khi fetch buildings
- [ ] **AC43**: Skeleton loaders cho table rows
- [ ] **AC44**: Auto-refresh list sau Create/Update/Delete
- [ ] **AC45**: Optimistic updates (update UI trước, rollback nếu fail)

## Scenarios (Given / When / Then)

### Scenario 1: View Buildings List - Happy Path
```gherkin
Given Manager đã đăng nhập
When Navigate to /properties/buildings
Then Hiển thị danh sách 2 tòa nhà Cobi
And Stats cards show: Total: 2, Active: 2, Total Area: 6000m²
And Each building row hiển thị name, address, floors, area, status
```

### Scenario 2: Create Building - Happy Path
```gherkin
Given Admin trên Buildings page
When Click "Add Building"
And Nhập:
  - Name: "Cobi Building 3"
  - Address: "789 Hai Bà Trưng, Q3, HCMC"
  - Total Floors: 10
  - Total Area: 4000
  - Status: Active
And Click "Create"
Then POST /api/properties/buildings với data
And Toast hiển thị "Building created successfully"
And Modal đóng
And Building mới xuất hiện trong table
```

### Scenario 3: Delete Building - Has Floors
```gherkin
Given Admin xem Building 1 details
And Building 1 có 5 floors với spaces
When Click "Delete"
And Confirm deletion
Then Backend check dependencies
And Error: "Cannot delete building with existing floors/spaces"
And Building không bị xóa
And Toast hiển thị error message
```

### Scenario 4: Search Buildings
```gherkin
Given Buildings list với 3 buildings
When User type "Cobi 1" vào search box
Then Chỉ hiển thị "Cobi Building 1"
And Stats cards update: Total: 1
When Clear search
Then Hiển thị lại all 3 buildings
```

### Scenario 5: Filter by Status
```gherkin
Given 2 Active buildings, 1 Maintenance building
When Select filter "Active"
Then Chỉ hiển thị 2 active buildings
And Count shows: 2 results
When Select "All Status"
Then Hiển thị lại all 3 buildings
```

### Scenario 6: Update Building Status
```gherkin
Given Manager xem Active building
When Click "Change Status" → select "Maintenance"
And Confirm với warning về impact
Then PATCH /api/properties/buildings/:id/status
And Status badge chuyển sang amber "Maintenance"
And Toast: "Building status updated"
```

## API Contracts

### GET /api/properties/buildings
**Query Params:**
- `status` (optional): active | inactive | maintenance
- `search` (optional): string

**Response 200:**
```json
[
  {
    "id": "bld-1",
    "name": "Cobi Building 1",
    "address": "123 Nguyen Trai, Dist 1, HCMC",
    "totalFloors": 5,
    "totalArea": 2500,
    "status": "active",
    "imageUrl": "https://...",
    "description": "Main building",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/properties/buildings
**Request Body:**
```json
{
  "name": "Cobi Building 3",
  "address": "789 Hai Ba Trung, Q3, HCMC",
  "totalFloors": 10,
  "totalArea": 4000,
  "status": "active",
  "imageUrl": "https://...",
  "description": "New expansion"
}
```

**Response 201:** (same structure as GET single)

### PUT /api/properties/buildings/:id
**Request Body:** (same as POST)
**Response 200:** (updated building)

### DELETE /api/properties/buildings/:id
**Response 204:** No content
**Response 400:** `{ "error": "Cannot delete building with existing floors" }`

## Dependencies

**Blocked by:**
- None (Foundation feature)

**Blocks:**
- F-08 (Floors Management) - cần building ID
- F-09 (Workspaces Management) - cần building + floor
- F-10 (Meeting Rooms) - cần building + floor

## Technical Notes

### Frontend Implementation
- **Page:** `src/pages/properties/BuildingsPage.tsx` ✅ Created
- **Types:** `src/types/property.ts` (Building interface) ✅ Created
- **Hooks:** `useBuildings()`, `useCreateBuilding()`, etc. ✅ Created
- **Service:** `buildingService` in `propertyService.ts` ✅ Created

### Backend Implementation
- **Model:** Building (Prisma/MongoDB)
- **Controller:** BuildingsController
- **Routes:** `/api/properties/buildings/*`
- **Validation:** Joi/Zod schema
- **Middleware:** Role check (admin/manager)

### Database Schema (Prisma example)
```prisma
model Building {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  name         String   @unique
  address      String
  totalFloors  Int
  totalArea    Float
  status       BuildingStatus
  imageUrl     String?
  description  String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  floors       Floor[]
  
  @@map("buildings")
}

enum BuildingStatus {
  active
  inactive
  maintenance
}
```

## Testing Checklist

### Unit Tests
- [ ] Building validation logic
- [ ] Status change rules
- [ ] Dependency check before delete

### Integration Tests
- [ ] GET /api/properties/buildings with filters
- [ ] POST create building
- [ ] PUT update building
- [ ] DELETE building (success + blocked by floors)
- [ ] PATCH status change

### E2E Tests
- [ ] Manager can view buildings list
- [ ] Admin can create new building
- [ ] Search and filter work correctly
- [ ] Cannot delete building with floors
- [ ] Sale user redirected to Forbidden page

### Accessibility
- [ ] Keyboard navigation trong table
- [ ] Screen reader labels cho buttons
- [ ] Focus management trong modals
- [ ] ARIA labels cho status badges

## Done Definition

- [ ] All acceptance criteria passed
- [ ] Unit tests coverage >= 80%
- [ ] E2E tests for happy path
- [ ] Code review approved
- [ ] Documentation updated
- [ ] No critical/high bugs
- [ ] Performance: Page load < 2s
- [ ] Responsive on mobile/tablet
- [ ] Accessibility audit passed
