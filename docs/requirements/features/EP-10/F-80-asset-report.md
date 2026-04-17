# F-80 – Asset & Maintenance Report

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-80 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Tổng hợp dữ liệu từ EP-08 Inventory để cung cấp cho **Admin và Manager** cái nhìn toàn cảnh về tình trạng tài sản, chi phí bảo trì và thông tin khấu hao. Hỗ trợ lập kế hoạch ngân sách bảo trì và thay thế tài sản.

**Business Rules:**
- Chi phí bảo trì = tổng `cost` của các maintenance logs có status = completed trong kỳ
- Khấu hao tuyến tính (Straight-line): giả định tuổi thọ 5 năm, giá trị còn lại = purchaseCost × (1 - số_năm_đã_dùng / 5)
- Nếu tuổi thọ > 5 năm → giá trị còn lại = 0 (đã khấu hao hoàn toàn)

## User Story

> Là **Admin / Manager**, tôi muốn **xem tình trạng tài sản và chi phí bảo trì** để **lập kế hoạch ngân sách và ưu tiên xử lý**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Summary Cards

- [ ] **AC1**: 5 summary cards:
  - Tổng tài sản
  - Đang hoạt động (active + available)
  - Đang bảo trì (maintenance)
  - Hỏng (broken)
  - Tổng chi phí bảo trì kỳ này

### Charts

- [ ] **AC2**: **Tài sản theo danh mục** (pie chart): furniture, IT equipment, appliance, v.v.
- [ ] **AC3**: **Chi phí bảo trì theo tháng** (bar chart): trong kỳ filter
- [ ] **AC4**: **Tình trạng tài sản** (donut chart): active / available / maintenance / broken / retired

### Bảng Tài sản cần chú ý

- [ ] **AC5**: Bảng "Tài sản cần xử lý": hiển thị assets có status = broken HOẶC có maintenance log scheduled trong 7 ngày tới
- [ ] **AC6**: Columns: Code | Tên | Danh mục | Trạng thái | Vị trí | Hành động cần làm
- [ ] **AC7**: Click vào asset → navigate tới tab Assets của InventoryPage

### Bảng Khấu hao

- [ ] **AC8**: Bảng khấu hao: Code | Tên | Ngày mua | Giá mua | Tuổi tài sản | Giá trị còn lại | % đã khấu hao
- [ ] **AC9**: Filter: chỉ hiện assets có purchaseCost > 0
- [ ] **AC10**: Sort theo giá trị còn lại (để biết assets nào sắp hết giá trị)

### Bộ lọc

- [ ] **AC11**: Filter theo tòa nhà, danh mục tài sản
- [ ] **AC12**: Date range filter áp dụng cho phần chi phí bảo trì

### Export

- [ ] **AC13**: Export Excel: sheet 1 = summary, sheet 2 = danh sách tài sản + khấu hao (F-82)

## Phụ thuộc

- EP-08: Asset data, MaintenanceLog data
- EP-02: Building data
