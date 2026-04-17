# F-26: Thanh toán booking

## Mục tiêu
Xác nhận đặt chỗ thông qua thanh toán.

## Mô tả
- Chọn phương thức thanh toán (VNPay, MoMo, ZaloPay, tiền mặt...)
- Xác nhận thanh toán.
- Nếu thanh toán thành công: booking chuyển trạng thái "confirmed", hệ thống giữ chỗ cho khách.
- Nếu thanh toán thất bại: booking bị hủy.

## Acceptance Criteria
- [ ] Chọn phương thức thanh toán
- [ ] Xác nhận thanh toán
- [ ] Nếu thanh toán thành công → booking chuyển trạng thái "confirmed"
- [ ] Nếu thanh toán thất bại → booking bị hủy
