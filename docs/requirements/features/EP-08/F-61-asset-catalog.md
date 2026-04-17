# F-61 – Danh mục Tài sản (Asset Catalog)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-61 |
| Epic | EP-08 - Inventory & Asset Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Manager** xem, thêm, sửa và xóa tài sản vật chất trong hệ thống. Mỗi asset được gán mã tự động (AST-001…), theo dõi serial number, nhà sản xuất, ngày mua, giá mua, warrany và trạng thái hiện tại.

**Business Rationale:**
- Tài sản là tài nguyên vật lý quan trọng, cần được theo dõi chặt chẽ
- Biết vị trí từng asset để tra cứu nhanh
- Có cơ sở dữ liệu chi phí khi lập báo cáo tài chính

**Business Rules:**
- `assetCode` auto-generate: "AST-001", "AST-002", ... không được trùng
- Asset phải thuộc 1 building
- Asset có thể không assign vào space (status = `available`)
- Không thể xóa asset đang có maintenance log đang chạy (status = `in_progress`)

## User Story

> Là **Admin/Manager**, tôi muốn **xem danh sách tài sản và thêm mới asset** để **theo dõi toàn bộ tài sản vật chất trong building**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Asset List

- [ ] **AC1**: Route `/inventory` chỉ accessible cho Admin, Manager, Maintenance
- [ ] **AC2**: Stats cards đầu trang:
  - Total Assets (tổng số tài sản)
  - Active (đang sử dụng)
  - In Maintenance (đang bảo trì)
  - Broken (hỏng)
- [ ] **AC3**: Bảng danh sách asset với columns: Code, Tên, Category, Building/Space, Status, Condition, Actions
- [ ] **AC4**: Search theo tên, assetCode, serialNumber
- [ ] **AC5**: Filter theo: category, status, building
- [ ] **AC6**: Status badge màu sắc rõ ràng theo từng trạng thái

### Create Asset

- [ ] **AC7**: Button "Thêm tài sản" → mở modal tạo mới
- [ ] **AC8**: Form fields:
  - **Tên tài sản** (required, max 150 chars)
  - **Danh mục** (required, dropdown: furniture/it_equipment/appliance/office_equipment/pantry/other)
  - **Serial Number** (optional)
  - **Nhà sản xuất** (optional)
  - **Model** (optional)
  - **Building** (required, dropdown)
  - **Space** (optional, dropdown, filtered theo building)
  - **Ngày mua** (optional, date picker)
  - **Giá mua** (optional, number, VND)
  - **Bảo hành đến** (optional, date picker)
  - **Tình trạng ban đầu** (required, dropdown: excellent/good/fair/poor)
  - **Ghi chú** (optional, textarea)
- [ ] **AC9**: assetCode auto-generate, hiển thị preview (read-only)
- [ ] **AC10**: Status mặc định là `available` khi tạo chưa assign space, `active` nếu đã chọn space

### Edit Asset

- [ ] **AC11**: Click Edit → modal edit với dữ liệu hiện tại
- [ ] **AC12**: Không cho sửa assetCode
- [ ] **AC13**: Cho phép thay đổi building/space → ghi nhận movement

### Delete Asset

- [ ] **AC14**: Chỉ Admin được xóa
- [ ] **AC15**: Confirm dialog trước khi xóa
- [ ] **AC16**: Không xóa được nếu có maintenance log đang `in_progress`

## Màn hình & Layout

```
[Stats: Total | Active | In Maintenance | Broken]

[Search ___________] [Category ▼] [Status ▼] [Building ▼]  [+ Thêm tài sản]

┌─────────────────────────────────────────────────────────────────┐
│ Code    │ Tên              │ Category    │ Vị trí     │ Status   │
├─────────┼──────────────────┼─────────────┼────────────┼──────────┤
│ AST-001 │ Dell Monitor 24" │ IT Equipment│ CB1/F2/P01 │ 🟢 Active│
│ AST-002 │ Điều hòa Daikin  │ Appliance   │ CB1/F3     │ 🔴 Broken│
└─────────────────────────────────────────────────────────────────┘
```

## Phụ thuộc

- EP-02: cần Buildings & Spaces để assign asset
