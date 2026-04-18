# F-132 – Đánh giá dịch vụ (Service Ratings)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-132 |
| Epic | EP-16 - Feedback & Quality Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Customer** đánh giá chất lượng dịch vụ theo các tiêu chí: cleanliness, facilities, staff. Rating 1-5 sao kèm comment tùy chọn.

**Business Rationale:**
- Thu thập đánh giá chi tiết theo từng tiêu chí
- Phát hiện điểm yếu cần cải thiện (vd: cleanliness thấp)
- Theo dõi trend chất lượng theo thời gian

**Business Rules:**
- Rating scale: 1-5 stars cho mỗi tiêu chí
- Tiêu chí mặc định: cleanliness, facilities, staff
- Overall rating = trung bình các tiêu chí
- Comment là optional
- Customer có thể rate nhiều lần (mỗi lần là 1 record riêng)

## User Story

> Là **Customer**, tôi muốn **đánh giá chất lượng dịch vụ** để **giúp coworking space cải thiện**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Submit Rating

- [ ] **AC1**: Customer truy cập form rating (từ portal hoặc link email)
- [ ] **AC2**: Rate cleanliness: 1-5 sao
- [ ] **AC3**: Rate facilities: 1-5 sao
- [ ] **AC4**: Rate staff: 1-5 sao
- [ ] **AC5**: Overall rating tự động tính trung bình
- [ ] **AC6**: Comment (optional, textarea)
- [ ] **AC7**: Submit → lưu Feedback record

### Xem Ratings (Manager view)

- [ ] **AC8**: Danh sách ratings: Customer, Date, Cleanliness, Facilities, Staff, Overall, Comment
- [ ] **AC9**: Filter theo date range, rating range
- [ ] **AC10**: Average rating per tiêu chí hiển thị ở header
