# F-45 – Theo dõi thanh toán (Payment Tracking)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-45 |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Trang danh sách hóa đơn với KPIs, filter theo trạng thái (unpaid/partial/paid/overdue/cancelled), tìm kiếm, phân trang. Hệ thống tự động đánh dấu overdue khi quá hạn thanh toán.

**Business Rationale:**
- Kế toán cần tổng quan nhanh về tình hình công nợ
- Phát hiện nợ quá hạn kịp thời để nhắc nhở
- Theo dõi doanh thu thu được theo tháng

**Business Rules:**
- Invoice chuyển `overdue` tự động khi `dueDate < today` và `paymentStatus` ∈ {`unpaid`, `partial`}
- KPIs: Tổng nợ, Số quá hạn, Thu trong tháng, Tổng invoice

## User Story

> Là **Kế toán**, tôi muốn **xem danh sách invoices với filter theo trạng thái** để **theo dõi tình hình thu tiền**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### KPI Cards

- [ ] **AC1**: Tổng công nợ chưa thu (unpaid + partial)
- [ ] **AC2**: Số invoice quá hạn (overdue)
- [ ] **AC3**: Đã thu trong tháng (paid invoices tháng hiện tại)
- [ ] **AC4**: Tổng số hóa đơn

### Status Tabs

- [ ] **AC5**: Tabs: Tất cả | Chưa TT | Một phần | Quá hạn | Đã TT | Đã hủy
- [ ] **AC6**: Mỗi tab hiển thị badge count
- [ ] **AC7**: Click tab → filter danh sách

### Danh sách Invoice

- [ ] **AC8**: Columns: Mã HĐ, Khách hàng, Nguồn, Ngày tạo, Hạn TT, Tổng tiền, Trạng thái, Hành động
- [ ] **AC9**: Search theo mã HĐ, tên khách hàng, mã nguồn
- [ ] **AC10**: Pagination (8 items/page)
- [ ] **AC11**: Invoice quá hạn highlight đỏ ở cột hạn thanh toán
- [ ] **AC12**: Actions: Xem chi tiết, Ghi nhận thanh toán (nếu chưa paid)

### Auto Overdue Detection

- [ ] **AC13**: Hệ thống tự chuyển `overdue` khi `dueDate` < today
- [ ] **AC14**: Real-time check trên client (computedStatus)
