# F-104 – Lịch sử ra vào (Access Logs)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-104 |
| Epic | EP-13 - Access Control & Visitor Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Hiển thị lịch sử ra vào tòa nhà để **Manager/Security** giám sát an ninh. Hỗ trợ filter theo nhiều tiêu chí và export CSV.

**Business Rationale:**
- Giám sát an ninh: ai vào/ra khi nào
- Phát hiện truy cập trái phép (status: denied)
- Báo cáo cho building owner về tần suất sử dụng

**Business Rules:**
- Access logs không được xóa (audit trail)
- Chỉ Manager và Security role có quyền xem
- Dữ liệu lưu trữ tối thiểu 12 tháng
- Export CSV giới hạn 10,000 records/lần

## User Story

> Là **Manager/Security**, tôi muốn **xem access logs** để **monitor building security**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Logs

- [ ] **AC1**: Route `/access-logs` hiển thị danh sách access logs
- [ ] **AC2**: Columns: Thời gian, Tên, Loại (Customer/Visitor/Staff), Hành động (Check-in/Check-out), Building, Gate, Phương thức, Kết quả (Granted/Denied)
- [ ] **AC3**: Mặc định hiển thị logs hôm nay
- [ ] **AC4**: Sort theo thời gian mới nhất trước

### Filter & Search

- [ ] **AC5**: Filter theo date range
- [ ] **AC6**: Filter theo building
- [ ] **AC7**: Filter theo user type (customer/visitor/staff)
- [ ] **AC8**: Filter theo action (check_in/check_out)
- [ ] **AC9**: Filter theo status (granted/denied)
- [ ] **AC10**: Search theo tên user

### Export

- [ ] **AC11**: Export CSV với các columns đã chọn
- [ ] **AC12**: Giới hạn 10,000 records/lần export
