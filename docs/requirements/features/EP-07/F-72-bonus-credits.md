# F-72: Bonus Credits (Cấp credits khuyến mãi)

## Mục tiêu
Cho phép Manager tạo chiến dịch cấp phát credits thưởng cho customers (loyalty, referral, birthday, compensation...).

## Mô tả
- Tạo `BonusCreditCampaign` với tên, mô tả, target group, số credits, thời hạn sử dụng.
- Preview danh sách accounts sẽ nhận trước khi phát.
- Phát credits → tạo `CreditTransaction type = bonus` cho từng account.
- Có thể cấp nhanh bonus cho 1 account cụ thể mà không qua campaign.

## Acceptance Criteria
- [ ] Danh sách campaigns với: code, tên, target, bonusCredits, status, totalIssued, ngày tạo
- [ ] Tạo campaign: nhập tên, loại target (all/individual/company/specific), số credits, creditExpiryDays
- [ ] Preview: "X tài khoản sẽ nhận Y credits"
- [ ] Phát → status chuyển sang `active`, tạo CreditTransaction cho từng account
- [ ] Cancel campaign (nếu còn draft)
- [ ] Cấp bonus nhanh (quick bonus): chọn account → nhập credits → lý do → xác nhận

## UI Notes
- Tab riêng "Chiến dịch Bonus" trong CreditPage
- Badge status: Draft (xám) / Active (xanh) / Completed (tím) / Cancelled (đỏ)
- Quick bonus: modal nhỏ từ account card
