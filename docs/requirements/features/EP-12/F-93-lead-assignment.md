# F-93 – Lead Assignment

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-93 |
| Epic | EP-12 – Lead Management & Marketing (CRM) |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Manager có thể giao (assign) lead cho sales rep cụ thể. Hệ thống hỗ trợ reassign bất kỳ lúc nào. Lead Details page cho phép thay đổi người phụ trách và xem lịch sử assign.

**Business Rules:**
- Chỉ Manager/Admin mới có thể assign/reassign lead cho người khác
- Sales chỉ có thể xem leads được assign cho mình
- Khi tạo lead mới: Manager gán thủ công hoặc để trống

## User Story

> Là **Manager**, tôi muốn **giao lead cho sales rep** để **đảm bảo mỗi lead có người phụ trách**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Lead Details có dropdown "Người phụ trách" (chỉ Manager/Admin mới edit được)
- [ ] **AC2**: Dropdown liệt kê tất cả sales reps đang active
- [ ] **AC3**: Khi reassign → ghi nhận activity log: "Assigned to {name}"
- [ ] **AC4**: Filter "Tất cả / Lead của tôi" trên Kanban và List view
- [ ] **AC5**: Table column "Người phụ trách" hiển thị avatar + tên

## Scenarios

**Scenario 1: Giao lead cho sales rep**
```
Given Manager đang xem Lead Details LEAD-042
When Chọn "Nguyễn Sale" trong dropdown Người phụ trách → Save
Then Lead.assignedTo = Nguyễn Sale
And Activity log ghi: "Chuyển giao cho Nguyễn Sale"
```
