# EP-02 – Property Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-02 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý tài sản vật lý của Coworking Space: 2 tòa nhà Cobi(Và Sau có thể thêm nhiều tòa khác), các tầng, không gian làm việc (Hot desk, Dedicated desk, Private office, Open space), và phòng họp (Meeting rooms, Conference rooms, Training rooms, Event spaces). Bao gồm cấu hình giá thuê theo giờ/ngày/tuần/tháng/năm cho từng loại space.

**Foundation Epic**: EP-02 là nền tảng cho toàn bộ hệ thống - tất cả features khác (Booking, Contract, Cusotmer, Payment...) đều phụ thuộc vào Property data.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-07 | Quản lý tòa nhà (Buildings) | CRUD 2 tòa nhà Cobi, thông tin địa chỉ, tổng diện tích | Draft |
| F-08 | Quản lý tầng (Floors) | CRUD các tầng thuộc building, floor number, diện tích | Draft |
| F-09 | Quản lý không gian làm việc (Workspaces) | Hot desk, Dedicated desk, Private office, Open space với capacity | Draft |
| F-10 | Quản lý phòng họp (Meeting Rooms) | Meeting/Conference/Training/Event rooms với equipment list | Draft |
| F-11 | Cấu hình giá thuê (Pricing) | Pricing rules theo loại space, thời gian (giờ/ngày/tuần/tháng) | Draft |

### Phase 2 - Advanced Features (Not in scope Phase 1)
- F-12: Floor plan upload & visual mapping
- F-13: Capacity planning & optimization
- F-14: Space utilization analytics
- F-15: Bulk import/export properties

## Data Models

### Building
```typescript
interface Building {
  id: string;
  name: string;                 // "Cobi Building 1", "Cobi Building 2"
  address: string;              // "123 Nguyen Trai, Dist 1, HCMC"
  totalFloors: number;
  totalArea: number;            // m²
  status: 'active' | 'inactive' | 'maintenance';
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Floor
```typescript
interface Floor {
  id: string;
  buildingId: string;           // FK to Building
  floorNumber: number;          // 1, 2, 3, ..., or -1 (basement)
  floorName?: string;           // "Ground Floor", "Mezzanine"
  area: number;                 // m²
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Space (Workspace hoặc Meeting Room)
```typescript
interface Space {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;                 // "Hot Desk Zone A", "Meeting Room 101"
  type: SpaceType;
  capacity: number;             // số người
  area: number;                 // m²
  amenities: string[];          // ["WiFi", "Projector", "Whiteboard"]
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  contractRequired: boolean;    // true = Formal Contract (EP-05), false = T&C only (F-36)
  imageUrls: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum SpaceType {
  HOT_DESK = 'hot_desk',               // Chỗ ngồi tự do
  DEDICATED_DESK = 'dedicated_desk',   // Bàn cố định riêng
  PRIVATE_OFFICE = 'private_office',   // Phòng riêng cho team/công ty
  OPEN_SPACE = 'open_space',           // Khu làm việc chung lớn
  MEETING_ROOM = 'meeting_room',       // Phòng họp nhỏ
  CONFERENCE_ROOM = 'conference_room', // Phòng hội nghị lớn
  TRAINING_ROOM = 'training_room',     // Phòng đào tạo
  EVENT_SPACE = 'event_space'          // Không gian sự kiện
}
```

### PricingRule
```typescript
interface PricingRule {
  id: string;
  spaceId: string;              // FK to Space (hoặc null nếu apply cho all spaces của 1 type)
  spaceType?: SpaceType;        // Nếu apply chung cho loại space
  buildingId?: string;          // Nếu giá khác nhau giữa 2 tòa nhà
  
  pricePerHour?: number;        // Giá theo giờ (VND)
  pricePerDay?: number;         // Giá theo ngày
  pricePerWeek?: number;        // Giá theo tuần
  pricePerMonth?: number;       // Giá theo tháng
  
  // Discounts
  weekendDiscount?: number;     // % discount cuối tuần
  longTermDiscount?: {          // Discount cho thuê dài hạn
    months: number;
    discountPercent: number;
  }[];
  
  effectiveFrom: Date;
  effectiveTo?: Date;           // null = áp dụng mãi mãi
  createdAt: Date;
  updatedAt: Date;
}
```

## User Stories

### US-07: Quản lý tòa nhà
> Là **Manager**, tôi muốn **xem danh sách 2 tòa nhà Cobi** để **biết tổng quan tài sản đang quản lý**

**Acceptance Criteria**:
- [ ] Hiển thị list 2 buildings với name, address, total floors, status
- [ ] Filter theo status (active/inactive)
- [ ] View building details (address, area, số tầng, hình ảnh)
- [ ] Edit building info (chỉ Admin/Manager)
- [ ] Không cho phép delete building nếu đã có floors/spaces

### US-08: Quản lý tầng
> Là **Manager**, tôi muốn **thêm/sửa/xóa tầng trong building** để **cấu trúc tòa nhà chính xác**

**Acceptance Criteria**:
- [ ] Add floor với floor number, area
- [ ] Hiển thị list floors theo building
- [ ] Sort floors theo floor number
- [ ] Edit floor info
- [ ] Delete floor (chỉ nếu không có spaces nào trên tầng đó)

### US-09: Quản lý không gian làm việc
> Là **Manager**, tôi muốn **tạo các zones hot desk, dedicated desk, private offices** để **sẵn sàng cho booking**

**Acceptance Criteria**:
- [ ] Create space với type, capacity, amenities
- [ ] Assign space to building + floor
- [ ] Upload hình ảnh space (tùy chọn)
- [ ] Set status: available /occupied/maintenance
- [ ] View list spaces với filter theo type, building, floor, status
- [ ] Edit space details
- [ ] Delete space (chỉ nếu chưa có bookings)

### US-10: Quản lý phòng họp
> Là **Manager**, tôi muốn **tạo meeting rooms với equipment list** để **khách có thể book phòng họp**

**Acceptance Criteria**:
- [ ] Create meeting room với capacity, amenities (projector, whiteboard, etc.)
- [ ] Differentiate meeting room types (meeting/conference/training/event)
- [ ] View room availability status
- [ ] Edit room details
- [ ] Mark room maintenance (unavailable for booking)

### US-11: Cấu hình giá thuê
> Là **Kế toán**, tôi muốn **set giá thuê cho từng loại space** để **tính invoice chính xác**

**Acceptance Criteria**:
- [ ] Set pricing rule cho space type (e.g., Hot desk: 50k/giờ, 300k/ngày, 5tr/tháng)
- [ ] Set pricing khác nhau cho từng building nếu cần
- [ ] Configure discounts (weekend, long-term)
- [ ] View pricing history (effective from/to dates)
- [ ] Update pricing → áp dụng cho bookings mới (không ảnh hưởng bookings cũ)

## Scenarios (Given / When / Then)

### Scenario 1: Tạo building mới
```
Given Admin đăng nhập
When Vào Property Management → Buildings → "Add Building"
And Nhập name "Cobi Building 3", address, total floors
And Click "Save"
Then Building được tạo với status "active"
And Hiển thị trong building list
```

### Scenario 2: Xóa floor có spaces
```
Given Floor 3 của Building 1 đã có 5 spaces
When Manager click "Delete Floor 3"
Then Hiển thị error "Cannot delete floor with existing spaces"
And Floor không bị xóa
```

### Scenario 3: Set pricing cho Hot Desk
```
Given Kế toán vào Pricing Management
When Chọn Space Type "Hot Desk"
And Set price: 50,000 VND/giờ, 300,000 VND/ngày, 5,000,000 VND/tháng
And Set effective from "01/05/2026"
And Click "Save"
Then Pricing rule được tạo
And Áp dụng cho tất cả Hot Desk bookings từ 01/05/2026
```

### Scenario 4: Update space status sang maintenance
```
Given Meeting Room 201 đang "available"
When Manager click "Mark as Maintenance"
And Nhập lý do "Fixing projector"
Then Space status → "maintenance"
And Space không hiển thị trong booking calendar (unavailable)
And Existing bookings (nếu có) được notify
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào**:
- EP-01: Authentication (cần login để manage properties)

**Được sử dụng bởi**:
- EP-04: Booking & Reservation (cần spaces để book)
- EP-05: Contract Management (contract link to spaces)
- EP-08: Inventory & Asset Management (assets gắn với spaces)
- EP-11: Role-based Dashboards (hiển thị occupancy rate)

## Out of Scope (Phase 1)

**Không làm trong Phase 1**:
- Floor plan visualization / interactive map
- Capacity optimization algorithms
- Space utilization heatmap
- Bulk import properties từ Excel
- Integration với IoT sensors (occupancy detection)
- 3D models / virtual tours

## Technical Notes

### Database Indexes
```sql
CREATE INDEX idx_spaces_building_floor ON spaces(building_id, floor_id);
CREATE INDEX idx_spaces_type_status ON spaces(type, status);
CREATE INDEX idx_pricing_space_effective ON pricing_rules(space_id, effective_from);
```

### Validation Rules
- Building name: required, max 100 chars, unique
- Floor number: integer, can be negative (basement), unique per building
- Space capacity: positive integer, max 500 (realistic limit)
- Pricing: all prices >= 0, at least one price type required

### Business Rules
- Cannot delete building if has floors
- Cannot delete floor if has spaces
- Cannot delete space if has future bookings
- Pricing rules: effectiveTo >= effectiveFrom
- When create space, default status = "available"

### Contract Requirements by Space Type

| Space Type | Default Contract | Payment | Chi tiết |
|------------|------------------|---------|----------|
| **Dedicated Desk** | ✅ Formal Contract (EP-05) | Invoice theo hợp đồng | Thuê dài hạn, cần hợp đồng chính thức |
| **Private Office** | ✅ Formal Contract (EP-05) | Invoice theo hợp đồng | Thuê dài hạn, cần hợp đồng chính thức |
| Hot Desk | ❌ T&C only (F-36) | Credit system | Thuê ngắn hạn, chấp nhận T&C khi book |
| Open Space | ❌ T&C only (F-36) | Credit system | Thuê ngắn hạn, chấp nhận T&C khi book |
| Meeting Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Conference Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Training Room | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |
| Event Space | ❌ T&C only (F-36) | Credit system | Book theo giờ, chấp nhận T&C |

**Field**: `Space.contractRequired: boolean` - Có thể override default khi tạo space
**Constant**: `CONTRACT_REQUIRED_SPACE_TYPES = [DEDICATED_DESK, PRIVATE_OFFICE]` - Default values
**Helper**: `requiresContract(spaceType): boolean` - Lấy default theo type

## Ghi chú

- **2 tòa nhà Cobi**: Dữ liệu sẽ được seeded sẵn 2 buildings trong Phase 1
- **Giá thuê flexible**: Có thể set giá theo space cụ thể hoặc chung cho loại space
- **Multi-building support**: Architecture sẵn sàng cho > 2 buildings (chỉ cần add data)
- **Phase 1 focus**: CRUD cơ bản, đủ để support bookings. Advanced features để Phase 2-3
