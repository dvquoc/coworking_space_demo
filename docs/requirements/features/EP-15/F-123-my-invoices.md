# F-123 – Hóa đơn của tôi (My Invoices)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-123 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Customer** xem danh sách invoices và lịch sử thanh toán trên portal. Hiển thị chi tiết invoice: items, amount, trạng thái thanh toán.

**Business Rationale:**
- Customer tự tra cứu invoices, không cần hỏi staff
- Minh bạch về các khoản phí
- Kết hợp với F-124 (Online Payment) để thanh toán nhanh

**Business Rules:**
- Chỉ hiển thị invoices của customer đang login
- Phân loại: Pending (chưa thanh toán), Paid (đã thanh toán)
- Hiển thị chi tiết: invoice items, subtotal, VAT, total
- Không cho phép modify invoices (read-only)

## User Story

> Là **Customer**, tôi muốn **xem invoices của tôi** để **biết các khoản phí và trạng thái thanh toán**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Invoices

- [ ] **AC1**: Route `/portal/my-invoices` hiển thị invoices của customer
- [ ] **AC2**: Tab: Pending | Paid | All
- [ ] **AC3**: Columns: Invoice Number, Ngày, Items tóm tắt, Total Amount, Trạng thái, Hành động
- [ ] **AC4**: Sort: mới nhất trước

### Chi tiết Invoice

- [ ] **AC5**: Click invoice → xem chi tiết: items, quantity, unit price, subtotal
- [ ] **AC6**: Hiển thị VAT, total amount
- [ ] **AC7**: Hiển thị payment history: ngày thanh toán, phương thức, amount

### Thanh toán

- [ ] **AC8**: Nút "Pay Now" cho invoices pending → navigate tới F-124 (Online Payment)
