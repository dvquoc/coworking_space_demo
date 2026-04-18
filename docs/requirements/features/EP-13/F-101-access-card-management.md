# F-101 – Quản lý thẻ ra vào (Access Card Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-101 |
| Epic | EP-13 - Access Control & Visitor Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Manager** cấp, thu hồi và quản lý access cards (RFID hoặc QR code) cho customers. Mỗi card được gán quyền ra vào theo building, ngày trong tuần và khung giờ. Hệ thống quản lý trạng thái card: active, suspended, expired, lost.

**Business Rationale:**
- Kiểm soát an ninh tòa nhà
- Giới hạn quyền truy cập theo hợp đồng (building, giờ)
- Quản lý vòng đời card: cấp mới → sử dụng → thu hồi/hết hạn

**Business Rules:**
- Mỗi customer có thể có nhiều access cards
- Card expiry date mặc định = ngày hết hạn hợp đồng
- Card status `lost` → tự động tạo mới card thay thế (tùy chọn)
- Khi contract kết thúc → cards liên quan tự động chuyển `expired`
- Không cấp card cho customer chưa có contract active

## User Story

> Là **Manager**, tôi muốn **cấp access card cho customer** để **cho phép ra vào tòa nhà**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Access Cards

- [ ] **AC1**: Route `/access-cards` hiển thị danh sách cards
- [ ] **AC2**: Columns: Card Number, Customer, Type (RFID/QR), Buildings, Ngày cấp, Ngày hết hạn, Trạng thái, Hành động
- [ ] **AC3**: Search theo card number, customer name
- [ ] **AC4**: Filter theo type, status, building

### Cấp Card

- [ ] **AC5**: Chọn customer (chỉ customer có contract active)
- [ ] **AC6**: Chọn loại card: RFID (nhập tag number) hoặc QR code (generate tự động)
- [ ] **AC7**: Set expiry date (default: contract end date)
- [ ] **AC8**: Set access rights: chọn buildings, days of week, time range (vd: 08:00 – 18:00)
- [ ] **AC9**: Card status → `active` sau khi cấp

### Quản lý Card

- [ ] **AC10**: Suspend card → tạm khóa, customer không thể ra vào
- [ ] **AC11**: Reactivate card → mở lại card đã suspend
- [ ] **AC12**: Report lost → chuyển status `lost`, tùy chọn cấp card mới
- [ ] **AC13**: Thu hồi card → status `expired`, xóa quyền ra vào
