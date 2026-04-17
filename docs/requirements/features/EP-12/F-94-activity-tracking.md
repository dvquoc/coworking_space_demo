# F-94 – Activity Tracking

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-94 |
| Epic | EP-12 – Lead Management & Marketing (CRM) |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Sales ghi nhận các tương tác (calls, emails, meetings, notes) với lead. Các hoạt động này hiển thị theo timeline trên Lead Details page.

**Business Rules:**
- 4 loại activity: call, email, meeting, note
- activityDate có thể là quá khứ hoặc tương lai (note lịch hẹn)
- Activity không thể xóa/sửa sau khi tạo (audit trail)
- Timeline sắp xếp theo activityDate DESC

## User Story

> Là **Sale**, tôi muốn **ghi nhận call/meeting** để **track lịch sử tương tác với lead**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Lead Details page có section "Lịch sử hoạt động"
- [ ] **AC2**: Button "Thêm Hoạt Động" mở form inline hoặc modal
- [ ] **AC3**: Form: Loại (call/email/meeting/note)*, Tiêu đề*, Mô tả*, Ngày thực hiện*
- [ ] **AC4**: Submit → Activity lưu, hiển thị ngay trong timeline
- [ ] **AC5**: Timeline hiển thị: icon theo type, tiêu đề, mô tả, người thực hiện, ngày giờ

## Dữ liệu / Fields

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|-------|----------|---------|
| type | Enum | Có | call/email/meeting/note |
| subject | Text | Có | Tiêu đề ngắn |
| description | Text | Có | Nội dung chi tiết |
| activityDate | DateTime | Có | Ngày thực hiện |

## Scenarios

**Scenario 1: Ghi nhận cuộc gọi**
```
Given Sales đang xem Lead Details LEAD-042
When Click "Thêm Hoạt Động" → chọn type=call → nhập subject, description, date → Save
Then Activity được tạo và hiển thị đầu timeline
And Icon điện thoại + subject + tên Sales + ngày giờ
```

**Scenario 2: Timeline empty state**
```
Given Lead mới tạo, chưa có activity
When Vào Lead Details
Then Hiển thị "Chưa có hoạt động nào. Thêm hoạt động đầu tiên!"
```
