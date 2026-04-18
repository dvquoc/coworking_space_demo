# F-102 – Đăng ký khách vãng lai (Visitor Registration)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-102 |
| Epic | EP-13 - Access Control & Visitor Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Lễ tân (Receptionist)** đăng ký khách vãng lai (visitor) khi đến thăm tòa nhà. Thu thập thông tin khách, mục đích thăm, và customer chủ nhà (host). Hệ thống in visitor badge với QR code để check-in/check-out.

**Business Rationale:**
- Quản lý an ninh: biết ai đang ở trong tòa nhà
- Lưu trữ thông tin khách để tra cứu sau
- Hỗ trợ host customer biết khách đã đến

**Business Rules:**
- Visitor phải có ít nhất: fullName, phone, purpose
- Host customer (optional) – nếu có, hệ thống notify host
- Lễ tân có quyền approve trực tiếp (không cần manager)
- Visitor badge có QR code unique, valid trong ngày
- Visitor chưa check-out cuối ngày → hệ thống cảnh báo security

## User Story

> Là **Lễ tân**, tôi muốn **đăng ký visitor** để **track khách vãng lai ra vào tòa nhà**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Visitors

- [ ] **AC1**: Route `/visitors` hiển thị danh sách visitors hôm nay
- [ ] **AC2**: Columns: Tên, SĐT, Công ty, Mục đích, Host Customer, Check-in, Check-out, Trạng thái
- [ ] **AC3**: Filter theo ngày, status (pending/approved/checked_in/checked_out)

### Đăng ký Visitor

- [ ] **AC4**: Form: fullName (required), phone (required), company, idNumber (CMND/CCCD), purpose (required), host customer (dropdown)
- [ ] **AC5**: Upload ảnh visitor (optional)
- [ ] **AC6**: Status: approved (lễ tân approve trực tiếp)
- [ ] **AC7**: Print visitor badge với QR code

### Quản lý Visitor

- [ ] **AC8**: Manual check-in: lễ tân bấm check-in cho visitor
- [ ] **AC9**: Manual check-out: lễ tân bấm check-out
- [ ] **AC10**: Reject visitor: từ chối khách (nhập lý do)
- [ ] **AC11**: Cảnh báo cuối ngày nếu có visitor chưa check-out
