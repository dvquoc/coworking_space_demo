# F-74: Lịch sử giao dịch Credit

## Mục tiêu
Cho phép Manager/Kế toán xem toàn bộ lịch sử nạp/dùng/bonus/refund credits.

## Mô tả
- Hiển thị tất cả CreditTransactions theo thứ tự mới nhất.
- Filter theo: account, loại giao dịch (top_up/bonus/payment/refund), khoảng ngày.
- Company account: cột "Nhân viên" hiển thị employeeName cho payment transactions.
- Mỗi dòng hiển thị balanceBefore → balanceAfter để audit.

## Acceptance Criteria
- [ ] Bảng giao dịch: ngày, tài khoản, mô tả, loại, credits (+/-), số dư sau
- [ ] Filter theo: account (dropdown), type (chip filter: Tất cả / Nạp / Bonus / TT / Hoàn), date range
- [ ] Company transactions: cột nhân viên (nếu type=payment)
- [ ] Click vào transaction: xem chi tiết (modal hoặc mở rộng dòng)
- [ ] Phân trang: 10 items/trang
- [ ] Export danh sách ra Excel (Phase 2)

## UI Notes
- Tab "Lịch sử giao dịch" trong CreditPage
- Credits dương (+) hiển thị màu xanh, âm (-) màu đỏ
- Badge loại giao dịch: Nạp (xanh), Bonus (tím), TT (xanh dương), Hoàn (cam)
