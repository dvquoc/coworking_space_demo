# F-46G – Thanh toán bằng Credits (Pay by Credit)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-46G |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép kế toán chọn phương thức **"Pay by Credit"** khi ghi nhận thanh toán invoice, sử dụng số dư credit của customer (tích hợp với EP-07 Credit Account Management).

**Business Rationale:**
- Customer đã nạp credit trước → có thể dùng credit để thanh toán invoice
- Giảm thao tác thu tiền, tăng trải nghiệm

**Business Rules:**
- Kiểm tra balance credit đủ trước khi xác nhận
- Nếu đủ: trừ credits, invoice → `paid`, `paymentMethod = 'credit'`
- Nếu không đủ: hiển thị thông báo lỗi, gợi ý nạp thêm
- EP-07 xử lý logic trừ credits và ghi transaction

## User Story

> Là **Kế toán**, tôi muốn **chọn phương thức "Pay by Credit"** để **sử dụng số dư credit của customer thanh toán invoice**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Trong modal Record Payment, thêm method "Credit" vào danh sách phương thức
- [ ] **AC2**: Khi chọn Credit → hiển thị số dư credit hiện tại của customer (lấy từ EP-07)
- [ ] **AC3**: Kiểm tra balance ≥ invoice amount trước khi cho phép xác nhận
- [ ] **AC4**: Nếu đủ: invoice `paymentStatus = 'paid'`, `paymentMethod = 'credit'`
- [ ] **AC5**: EP-07 trừ credits tương ứng, tạo credit transaction
- [ ] **AC6**: Nếu không đủ: hiển thị "Số dư không đủ" + gợi ý nạp thêm
- [ ] **AC7**: Gửi email biên lai cho customer
