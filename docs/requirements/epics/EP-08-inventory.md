# EP-08 – Inventory & Asset Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-08 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý tài sản vật chất của building: bàn ghế, máy tính, máy in, điều hòa, tủ lạnh, máy chiếu, whiteboard, dụng cụ pantry. Theo dõi serial number, trạng thái, vị trí, lịch sử bảo trì, phân bổ vào spaces.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-61 | Asset catalog | Danh mục tài sản với serial tracking | Draft |
| F-62 | Asset assignment | Phân bổ asset vào space | Draft |
| F-63 | Maintenance log | Ghi nhận bảo trì, sửa chữa | Draft |
| F-64 | Asset lifecycle | Theo dõi trạng thái (active → broken → retired) | Draft |

### Phase 2 - Advanced Features
- F-65: Asset depreciation tracking
- F-66: Scheduled maintenance reminders
- F-67: Asset QR code labels (scan to view info)

## Data Models

### Asset
```typescript
interface Asset {
  id: string;
  assetCode: string;            // "AST-001", auto-generated
  name: string;                 // "Dell Monitor 24-inch"
  category: AssetCategory;
  
  // Tracking
  serialNumber?: string;        // Serial number từ nhà sản xuất
  manufacturer?: string;        // "Dell", "Samsung"
  model?: string;               // "U2422H"
  
  // Ownership & Location
  buildingId: string;
  spaceId?: string;             // Asset assigned to specific space
  
  // Financial
  purchaseDate?: Date;
  purchaseCost: number;
  warrantyExpiryDate?: Date;
  
  // Status
  status: AssetStatus;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum AssetCategory {
  FURNITURE = 'furniture',       // Bàn, ghế, sofa
  IT_EQUIPMENT = 'it_equipment', // Máy tính, monitor, keyboard
  APPLIANCE = 'appliance',       // Điều hòa, tủ lạnh, microwave
  OFFICE_EQUIPMENT = 'office_equipment', // Máy in, máy chiếu, whiteboard
  PANTRY = 'pantry',             // Máy pha cà phê, bình đun nước
  OTHER = 'other'
}

enum AssetStatus {
  ACTIVE = 'active',             // Đang sử dụng
  AVAILABLE = 'available',       // Available nhưng chưa assign
  MAINTENANCE = 'maintenance',   // Đang bảo trì
  BROKEN = 'broken',             // Hỏng, cần sửa/thay thế
  RETIRED = 'retired'            // Đã loại bỏ
}
```

### MaintenanceLog
```typescript
interface MaintenanceLog {
  id: string;
  assetId: string;
  
  // Maintenance Details
  type: 'routine' | 'repair' | 'inspection';
  description: string;          // "Replace broken screen"
  scheduledDate?: Date;
  completedDate?: Date;
  
  // Cost & Vendor
  cost: number;
  vendor?: string;              // Nhà cung cấp dịch vụ bảo trì
  
  // Result
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  resultNotes?: string;
  
  // Metadata
  performedBy: string;          // Staff ID
  createdAt: Date;
}
```

### AssetAssignment (Optional - track movement history)
```typescript
interface AssetAssignment {
  id: string;
  assetId: string;
  fromSpaceId?: string;
  toSpaceId: string;
  assignedDate: Date;
  assignedBy: string;
  notes?: string;
}
```

## User Stories

### US-61: Add asset to inventory
> Là **Admin/Manager**, tôi muốn **thêm asset mới vào hệ thống** để **theo dõi tài sản**

**Acceptance Criteria**:
- [ ] Form: name, category, serial number, manufacturer, purchase cost
- [ ] Auto-generate assetCode: "AST-001", "AST-002"
- [ ] Assign to building
- [ ] Initial status: available

### US-62: Assign asset to space
> Là **Manager**, tôi muốn **phân bổ asset vào space** để **track vị trí asset**

**Acceptance Criteria**:
- [ ] Select asset (status available/active)
- [ ] Choose target space (Room 101, Meeting Room A)
- [ ] Asset.spaceId updated, status → active
- [ ] Movement history recorded (optional)

### US-63: Log maintenance record
> Là **Bảo trì**, tôi muốn **ghi nhận bảo trì asset** để **track maintenance history**

**Acceptance Criteria**:
- [ ] Select asset
- [ ] Enter: type (routine/repair), description, cost, vendor
- [ ] Mark scheduled date or completed date
- [ ] Maintenance log saved
- [ ] If type = repair → asset.status → maintenance

### US-64: View asset details with history
> Là **Manager**, tôi muốn **xem thông tin chi tiết asset** để **kiểm tra trạng thái, lịch sử**

**Acceptance Criteria**:
- [ ] Asset details: serial, model, purchase date, warranty
- [ ] Tabs: Overview, Maintenance History, Movement Log
- [ ] Status badge: active/maintenance/broken
- [ ] Quick actions: "Report broken", "Schedule maintenance"

## Scenarios

### Scenario 1: Add monitor và assign to space
```
Given Manager mua 10 monitors Dell U2422H
When Add 10 assets:
  - name: "Dell Monitor 24-inch"
  - category: it_equipment
  - serial: "DELL001", "DELL002", ..., "DELL010"
  - purchaseCost: 5,000,000 VND each
Then 10 assets created với status available
And Manager assign 5 monitors to "Meeting Room A"
Then 5 assets.spaceId → "MR-A", status → active
```

### Scenario 2: Report broken asset
```
Given Asset "AST-042" (Air Conditioner) đang active
When Staff báo hỏng: "Unit not cooling"
And Create maintenance log:
  - type: repair
  - description: "Compressor failure"
  - scheduledDate: 2026-04-20
Then Asset.status → broken
And Maintenance log created with status scheduled
```

### Scenario 3: Complete maintenance
```
Given Asset "AST-042" status broken, has maintenance log scheduled
When Bảo trì complete repair: cost 2,500,000 VND
And Mark completedDate: 2026-04-22
And Result: "Replaced compressor, testing OK"
Then Maintenance log status → completed
And Asset.status → active
And Asset.condition → good
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-02: Property (assets belongs to building, assigned to space)

## Out of Scope Phase 1
- Asset depreciation calculation
- Scheduled maintenance reminders (cronjob)
- QR code labels for assets
- Asset transfer between buildings

## Technical Notes

### Auto-generation
- **assetCode**: Format "AST-{counter}" - "AST-001", "AST-002"

### Business Rules
- Asset phải có building
- Asset có thể không assign vào space (status = available)
- Khi assign asset vào space → status = active
- Asset broken → không thể assign cho space khác

### Indexes
- `assets.serialNumber` (unique)
- `assets.buildingId, assets.status`
- `assets.spaceId`

## Ghi chú
- Phase 1: Basic CRUD, manual maintenance logging
- Phase 2: Depreciation tracking, scheduled reminders, QR labels
- Quan trọng: Serial number tracking giúp warranty claims
