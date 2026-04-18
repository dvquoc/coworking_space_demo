# F-46C – Theo dõi thanh toán một phần (Partial Payment Tracking)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-46C |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Theo dõi thanh toán một phần (partial payment) cho invoice. Khi khách thanh toán chưa đủ tổng tiền, invoice chuyển trạng thái `partial` và hiển thị số tiền đã trả / còn nợ.

**Business Rationale:**
- Cho phép thu tiền nhiều lần (deposit + balance, hoặc trả góp)
- Kế toán luôn biết chính xác công nợ còn lại

**Business Rules:**
- `paidAmount` tích lũy qua nhiều lần thanh toán
- Nếu `paidAmount < totalAmount` → `paymentStatus = 'partial'`
- Nếu `paidAmount >= totalAmount` → `paymentStatus = 'paid'`
- Hiển thị "Đã TT: Xđ" dưới tổng tiền ở danh sách invoice

## User Story

> Là **Kế toán**, tôi muốn **theo dõi thanh toán một phần** để **biết chính xác công nợ còn lại**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Invoice list hiển thị "Đã TT: Xđ" bên dưới tổng tiền nếu partial
- [ ] **AC2**: Invoice detail hiển thị: Tổng tiền, Đã thanh toán, Còn nợ
- [ ] **AC3**: Record Payment modal hiển thị "Còn nợ" và mặc định `payAmount = remaining`
- [ ] **AC4**: Sau mỗi lần Record Payment → `paidAmount += amount`
- [ ] **AC5**: Khi `paidAmount >= totalAmount` → status tự chuyển `paid`
- [ ] **AC6**: Badge `partial` hiển thị màu cam (bg-orange-50 text-orange-700)
