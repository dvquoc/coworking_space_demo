# F-113 – Check-in sự kiện (Event Check-in)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-113 |
| Epic | EP-14 - Community & Events Management |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Staff** check-in attendees tại sự kiện bằng scan QR code hoặc search tên. Đánh dấu trạng thái tham gia thực tế, phân biệt với no-show.

**Business Rationale:**
- Theo dõi ai thực sự tham gia event
- Đánh giá effectiveness của event (attendance rate)
- Phát hiện no-show để cải thiện targeting

**Business Rules:**
- Chỉ check-in attendees đã registered (status = registered)
- Check-in → status chuyển thành `checked_in`, ghi checkInTime
- Attendee registered nhưng không check-in → đánh dấu `no_show` sau event kết thúc
- Hỗ trợ walk-in: đăng ký + check-in ngay (nếu còn capacity)

## User Story

> Là **Staff**, tôi muốn **check-in attendees** để **biết ai thực sự tham gia event**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Check-in Attendees

- [ ] **AC1**: Màn hình check-in cho event đang ongoing
- [ ] **AC2**: Scan QR code → tìm registration → mark checked_in
- [ ] **AC3**: Search tên customer → tìm registration → mark checked_in
- [ ] **AC4**: Ghi checkInTime vào EventRegistration
- [ ] **AC5**: Hiển thị thông báo "Check-in successful: [Customer Name]"

### Walk-in

- [ ] **AC6**: Bấm "Walk-in" → đăng ký + check-in ngay (nếu còn capacity)
- [ ] **AC7**: Capacity đầy → không cho walk-in

### Statistics

- [ ] **AC8**: Hiển thị realtime: registered vs checked_in count
- [ ] **AC9**: Sau event → auto mark `no_show` cho registered nhưng chưa checked_in
