# F-74 – Nhật ký hoạt động (Activity Logs)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-74 |
| Epic | EP-09 - Staff & Permission Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Ghi lại và hiển thị log mọi hành động quan trọng của staff trong hệ thống: tạo/sửa/xóa dữ liệu, login/logout, thay đổi quyền. Hỗ trợ audit trail và bảo mật.

**Business Rationale:**
- Audit trail cho mọi thay đổi trong hệ thống
- Truy vết khi có sự cố
- Compliance requirement

**Business Rules:**
- Log tự động khi có action: create, update, delete trên bất kỳ entity nào
- Log chứa: timestamp, user, action, module, target ID, IP address
- Logs chỉ Admin mới được xem
- Không cho phép xóa logs

## User Story

> Là **Admin**, tôi muốn **xem activity logs** để **audit mọi hành động trong hệ thống**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Route `/activity-logs` chỉ Admin truy cập
- [ ] **AC2**: Danh sách log: Thời gian, Người dùng, Hành động, Module, Đối tượng
- [ ] **AC3**: Filter theo: staff (dropdown), module (dropdown), khoảng thời gian (date range)
- [ ] **AC4**: Search theo action hoặc target ID
- [ ] **AC5**: Log entries bao gồm: timestamp, user name, action description, module, target entity ID, IP address
- [ ] **AC6**: Pagination cho danh sách log
- [ ] **AC7**: Không cho phép xóa hoặc sửa log entries
