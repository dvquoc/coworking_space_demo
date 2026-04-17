# F-71: Nạp Credits (Top-up)

## Mục tiêu
Cho phép Lễ tân/Kế toán ghi nhận việc nạp credits vào tài khoản của customer.

## Mô tả
- Nhập số tiền VND muốn nạp (tối thiểu 100,000 VND = 100 credits).
- Hệ thống tự quy đổi: 1,000 VND = 1 credit.
- Chọn phương thức thanh toán: VNPay / MoMo / ZaloPay / Tiền mặt.
- Sau khi xác nhận, balance được cộng vào CreditAccount.
- Tự động tạo CreditTransaction type = `top_up` và Invoice loại `credit_topup`.

## Acceptance Criteria
- [ ] Form modal với: chọn account, nhập VND, hiển thị quy đổi credits real-time
- [ ] Validation: tối thiểu 100,000 VND (= 100 credits)
- [ ] Chọn phương thức: VNPay / MoMo / ZaloPay / Tiền mặt
- [ ] Preview: "Số dư hiện tại: X → Sau khi nạp: X + Y = Z credits"
- [ ] Xác nhận → cộng balance, tạo CreditTransaction type=top_up
- [ ] Màn hình success với số credits đã nạp
- [ ] Nút "Gửi email xác nhận" cho customer (optional)

## UI Notes
- Modal size nhỏ (max-w-sm)
- Input VND, bên dưới hiển thị "= X credits" màu đỏ primary
- Nhấn nạp disabled nếu credits < 100
