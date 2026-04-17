# F-95 – Campaign Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-95 |
| Epic | EP-12 – Lead Management & Marketing (CRM) |
| Độ ưu tiên | Could have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Manager tạo và quản lý chiến dịch marketing (email/SMS/Facebook Ads). Campaign có thể kèm promo code và nhắm đến tập leads khác nhau.

**Business Rules:**
- Chỉ Manager/Admin mới tạo/sửa campaign
- Campaign status: draft → active → completed (không đảo ngược)
- Promo code (nếu có) phải unique trong hệ thống
- endDate phải sau startDate
- Tracking sent/open/click count: Phase 3

## User Story

> Là **Manager**, tôi muốn **tạo email campaign** để **tiếp cận leads và tăng tỷ lệ chuyển đổi**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Route `/crm/campaigns` hiển thị danh sách campaigns có thống kê
- [ ] **AC2**: Button "Tạo Campaign" mở modal form
- [ ] **AC3**: Form: Tên*, Loại*, Đối tượng*, Promo code, Discount %, Ngày bắt đầu*, Ngày kết thúc*
- [ ] **AC4**: Table hiển thị: tên, loại, đối tượng, trạng thái, ngày, số lượng đã gửi
- [ ] **AC5**: Actions: Activate (draft→active), Complete (active→completed), View Stats

## Dữ liệu / Fields

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|-------|----------|---------|
| name | Text | Có | Tên campaign |
| type | Enum | Có | email/sms/facebook_ad |
| targetAudience | Enum | Có | all_leads/hot_leads/cold_leads |
| promoCode | Text | Không | Phải unique |
| discount | Number | Không | % giảm giá 0-100 |
| startDate | Date | Có | |
| endDate | Date | Có | Sau startDate |

## Scenarios

**Scenario 1: Tạo campaign email**
```
Given Manager ở trang /crm/campaigns
When Click "Tạo Campaign" → điền form → Submit
Then Campaign được tạo với status=draft
And Hiển thị trong bảng
```

**Scenario 2: Kích hoạt campaign**
```
Given Campaign status=draft
When Click "Kích hoạt"
Then Campaign.status = active
And Bắt đầu gửi đến target leads
```
