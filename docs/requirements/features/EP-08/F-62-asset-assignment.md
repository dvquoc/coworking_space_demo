# F-62 – Phân bổ Tài sản vào Không gian (Asset Assignment)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-62 |
| Epic | EP-08 - Inventory & Asset Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Manager** phân bổ (assign) asset vào một space cụ thể, hoặc thu hồi asset về kho (unassign). Mỗi lần di chuyển được ghi lại thành **movement history** để có thể truy vết vị trí asset qua thời gian.

**Business Rationale:**
- Biết chính xác mỗi asset đang ở phòng nào để quản lý và kiểm tra
- Khi khách hàng báo hỏng thiết bị, tra cứu ngay được thông tin asset

**Business Rules:**
- Chỉ assign asset có status `available` hoặc `active`
- Không thể assign asset đang `maintenance`, `broken`, `retired`
- Khi assign: `asset.spaceId = targetSpaceId`, `asset.status = active`
- Khi unassign: `asset.spaceId = null`, `asset.status = available`
- Movement history lưu: fromSpaceId, toSpaceId, assignedDate, assignedBy, notes

## User Story

> Là **Manager**, tôi muốn **phân bổ asset vào space** để **biết vị trí chính xác của từng tài sản và theo dõi lịch sử di chuyển**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Assign Asset to Space

- [ ] **AC1**: Từ asset detail hoặc danh sách asset, click "Phân bổ" → mở modal assign
- [ ] **AC2**: Modal assign có:
  - Thông tin asset hiện tại (tên, code, trạng thái)
  - Dropdown chọn Building (required)
  - Dropdown chọn Space (required, filtered theo building)
  - Ghi chú (optional)
  - Nút xác nhận
- [ ] **AC3**: Sau khi assign: asset.spaceId cập nhật, status → `active`
- [ ] **AC4**: Movement record được tạo với assignedDate = now

### Unassign Asset (Thu hồi về kho)

- [ ] **AC5**: Từ asset detail, nút "Thu hồi" (chỉ hiển thị khi đang assigned)
- [ ] **AC6**: Confirm dialog: "Xác nhận thu hồi asset về kho?"
- [ ] **AC7**: Sau khi unassign: `asset.spaceId = null`, status → `available`
- [ ] **AC8**: Movement record tạo với toSpaceId = null

### Movement History

- [ ] **AC9**: Tab "Lịch sử di chuyển" trong asset detail
- [ ] **AC10**: Hiển thị danh sách movements: Từ, Đến, Ngày, Người thực hiện, Ghi chú
- [ ] **AC11**: Sắp xếp mới nhất trên cùng
