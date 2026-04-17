# F-73: Thanh toán bằng Credits (Pay by Credit)

## Mục tiêu
Cho phép customer thanh toán booking/services bằng credits thay vì tiền mặt hoặc gateway.

## Mô tả
- Khi ghi nhận thanh toán invoice (EP-06 F-44), Kế toán có thể chọn "Credit" làm phương thức.
- Hệ thống kiểm tra balance của customer đủ hay không.
- Nếu đủ: trừ credits, tạo CreditTransaction type=payment, cập nhật invoice status=paid.
- Với company account: bắt buộc ghi nhận employeeId/employeeName.

## Acceptance Criteria
- [ ] Trong modal Record Payment (EP-06), hiển thị option "Thanh toán bằng Credit"
- [ ] Khi chọn Credit: hiển thị số dư hiện tại và số credits cần dùng (= totalAmount / 1000)
- [ ] Nếu balance đủ: nút "Xác nhận" active
- [ ] Nếu balance không đủ: hiển thị "Thiếu X credits", nút "Nạp thêm" và "Đổi phương thức"
- [ ] Company account: dropdown chọn nhân viên trước khi xác nhận
- [ ] Sau xác nhận: CreditTransaction type=payment được tạo, invoice → paid

## UI Notes
- Tích hợp trong InvoicesPage (EP-06), không phải trang riêng
- Hiển thị balance dưới dạng "350 credits ≈ 350,000 VND"
