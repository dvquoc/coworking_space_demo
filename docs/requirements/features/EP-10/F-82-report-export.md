# F-82 – Report Export (PDF / Excel)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-82 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép người dùng export bất kỳ báo cáo nào trong EP-10 ra định dạng PDF hoặc Excel để lưu trữ, chia sẻ và báo cáo internal.

**Business Rules:**
- Không export khi không có dữ liệu trong kỳ đã chọn
- File name format: `[report-type]-[YYYY-MM]-export.[ext]` (VD: `revenue-2026-04-export.xlsx`)
- PDF giữ nguyên filter đã áp dụng trong header của file
- Excel: mỗi section/breakdown = 1 sheet; sheet đầu tiên = Summary
- MVP: chỉ export bảng số liệu (không cần include charts vào file)

## User Story

> Là **Kế toán / Nhà đầu tư**, tôi muốn **export báo cáo ra PDF hoặc Excel** để **lưu trữ và trình bày với ban lãnh đạo**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Nút "Export PDF" và "Export Excel" xuất hiện trên mọi tab báo cáo
- [ ] **AC2**: Cả 2 nút bị disabled khi đang loading hoặc không có dữ liệu
- [ ] **AC3**: PDF header bao gồm: tên công ty, tên báo cáo, kỳ báo cáo, ngày xuất, filter đang áp dụng
- [ ] **AC4**: PDF body: bảng số liệu summary + bảng breakdown chi tiết
- [ ] **AC5**: Excel: sheet "Summary" chứa summary metrics; các sheet tiếp theo chứa bảng breakdown
- [ ] **AC6**: File name đúng format quy định
- [ ] **AC7**: Sau khi click export → browser tự download file (không mở tab mới)
- [ ] **AC8**: MVP: export đồng bộ (synchronous), không cần async/notify

## Ghi chú kỹ thuật

- Dùng thư viện `xlsx` (SheetJS) cho Excel export
- Dùng `jsPDF` + `jspdf-autotable` hoặc browser print API cho PDF
- Export function được gọi client-side trên dữ liệu đã fetch — không cần API endpoint riêng

## Phụ thuộc

- F-76 đến F-80: các báo cáo sử dụng tính năng export này
