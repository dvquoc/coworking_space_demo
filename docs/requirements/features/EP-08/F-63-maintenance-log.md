# F-63 – Nhật ký Bảo trì (Maintenance Log)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-63 |
| Epic | EP-08 - Inventory & Asset Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin, Manager và Maintenance staff** ghi nhận các lần bảo trì, sửa chữa hoặc kiểm tra định kỳ cho từng asset. Mỗi log có thể được tạo từ maintenance tab hoặc trực tiếp từ asset detail.

**Business Rationale:**
- Theo dõi chi phí bảo trì để có số liệu tài chính chính xác
- Có lịch sử để đánh giá tuổi thọ và quyết định thay thế asset
- Bảo trì định kỳ giúp giảm hỏng hóc bất ngờ

**Business Rules:**
- Khi tạo log với type `repair` → asset.status → `maintenance` (nếu đang `active/available`)
- Khi hoàn thành (status → `completed`): asset.status → `active`, asset.condition được update
- Khi log bị cancel: asset.status rollback về trước khi bảo trì
- Chi phí (cost) phải ≥ 0

## User Story

> Là **Maintenance Staff**, tôi muốn **ghi nhận lịch sử bảo trì asset** để **theo dõi chi phí và lịch sử sửa chữa theo từng asset**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Maintenance Logs

- [ ] **AC1**: Tab "Bảo trì" trong InventoryPage hiển thị tất cả maintenance logs
- [ ] **AC2**: Columns: Asset (code + tên), Loại, Mô tả, Ngày lên lịch, Ngày hoàn thành, Chi phí, Nhà thầu, Trạng thái
- [ ] **AC3**: Filter theo: type, status, asset
- [ ] **AC4**: Sort theo ngày (mới nhất lên đầu)

### Create Maintenance Log

- [ ] **AC5**: Button "Ghi nhận bảo trì" → modal
- [ ] **AC6**: Form fields:
  - **Asset** (required, searchable dropdown)
  - **Loại bảo trì** (required): routine (Kiểm tra định kỳ), repair (Sửa chữa), inspection (Kiểm tra)
  - **Mô tả công việc** (required, textarea)
  - **Ngày lên lịch** (optional, date)
  - **Ngày hoàn thành** (optional, date)
  - **Chi phí** (required, number ≥ 0, VND)
  - **Nhà thầu/Nhà cung cấp** (optional)
  - **Kết quả/Ghi chú** (optional, textarea)
- [ ] **AC7**: Status mặc định: `scheduled` (nếu có ngày lên lịch), `in_progress` (nếu không)
- [ ] **AC8**: Nếu type = `repair` → cảnh báo "Asset sẽ chuyển sang trạng thái Đang bảo trì"

### Complete/Cancel Maintenance

- [ ] **AC9**: Từ danh sách log, có Actions: "Hoàn thành", "Hủy" (với log `scheduled` hoặc `in_progress`)
- [ ] **AC10**: Khi hoàn thành: điền completedDate, resultNotes, cập nhật asset.condition
- [ ] **AC11**: Khi hủy: log → `cancelled`, asset.status rollback nếu đang `maintenance`

### Maintenance in Asset Detail

- [ ] **AC12**: Tab "Lịch sử bảo trì" trong asset detail chỉ hiển thị logs của asset đó
- [ ] **AC13**: Có thể tạo log mới trực tiếp từ asset detail (asset pre-selected)
