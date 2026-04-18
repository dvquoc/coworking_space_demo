# F-103 – Check-in / Check-out

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-103 |
| Epic | EP-13 - Access Control & Visitor Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Xử lý check-in/check-out tại cổng tòa nhà bằng scan QR code, RFID card, hoặc manual (lễ tân nhập). Hệ thống validate quyền truy cập và ghi nhận access log. Hiển thị kết quả: Welcome hoặc Access Denied.

**Business Rationale:**
- Kiểm soát ra vào realtime
- Tự động validate quyền truy cập (building, ngày, giờ)
- Ghi nhận lịch sử ra vào cho mục đích an ninh

**Business Rules:**
- Scan QR/RFID → system validate: card active, building allowed, ngày/giờ allowed
- Valid → AccessLog (status: granted), hiển thị "Welcome, [Name]"
- Invalid → AccessLog (status: denied), hiển thị "Access Denied" + lý do
- Manual check-in: lễ tân nhập tên/mã → check-in thủ công (cho visitor hoặc trường hợp quên card)
- Check-out: scan lại hoặc lễ tân bấm check-out

## User Story

> Là **Customer/Visitor**, tôi muốn **scan QR code tại cổng** để **check-in nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Scan Check-in

- [ ] **AC1**: Scan QR code / RFID tại gate scanner
- [ ] **AC2**: Validate: card status = active
- [ ] **AC3**: Validate: building nằm trong danh sách allowed buildings
- [ ] **AC4**: Validate: ngày hiện tại nằm trong allowedDays
- [ ] **AC5**: Validate: giờ hiện tại nằm trong allowedTimeRange
- [ ] **AC6**: Valid → tạo AccessLog (action: check_in, status: granted)
- [ ] **AC7**: Invalid → tạo AccessLog (action: check_in, status: denied, deniedReason)
- [ ] **AC8**: Hiển thị kết quả trên màn hình gate: "Welcome, [Name]" hoặc "Access Denied: [Reason]"

### Manual Check-in

- [ ] **AC9**: Lễ tân search visitor/customer → bấm check-in
- [ ] **AC10**: AccessLog ghi method = `manual`

### Check-out

- [ ] **AC11**: Scan lại QR/RFID → tạo AccessLog (action: check_out)
- [ ] **AC12**: Lễ tân bấm check-out thủ công cho visitor
