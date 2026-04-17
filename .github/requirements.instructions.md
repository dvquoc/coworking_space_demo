---
applyTo: "docs/requirements/**"
---

# Requirements – Coworking Space

## Vị trí lưu trữ

Tất cả tài liệu yêu cầu nghiệp vụ nằm trong `docs/requirements/`:

```
docs/requirements/
├── README.md                  # Index toàn bộ epics & features
├── epics/                     # Yêu cầu cấp Epic (EP-NN-tên.md)
├── features/
│   ├── EP-02/                 # Features thuộc EP-02
│   ├── EP-03/                 # Features thuộc EP-03
│   └── ...                    # Mỗi epic có thư mục riêng
└── non-functional/            # Yêu cầu phi chức năng (NFR-NN-tên.md)
```

## Quy ước đặt tên

| Loại | Tiền tố | Ví dụ |
|------|---------|-------|
| Epic | `EP-[NN]-[tên].md` | `EP-02-property.md` |
| Feature / User Story | `F-[NN]-[tên].md` | `features/EP-02/F-07-add-property.md` |
| Phi chức năng | `NFR-[NN]-[tên].md` | `NFR-02-security.md` |

## Khi thêm requirement mới

1. Chọn đúng thư mục con (`epics/`, `non-functional/`)
2. Feature phải đặt trong `features/[MÃ-EPIC]/` (VD: `features/EP-03/F-10-abc.md`)
3. Nếu thư mục epic chưa có, tạo mới theo mã epic
4. Cập nhật bảng index trong `docs/requirements/README.md`

## Cấu trúc một file Feature

```markdown
# [Tiêu đề yêu cầu]

## Thông tin chung
| Trường | Giá trị |
|--------|---------|
| ID | F-XX |
| Epic | EP-XX |
| Độ ưu tiên | Must / Should / Could |
| Người tạo | [Tên BA] |
| Ngày tạo | DD/MM/YYYY |
| Trạng thái | Draft / Review / Approved / Done |

## Mô tả nghiệp vụ
Mô tả ngắn gọn mục đích và bối cảnh.

## User Story
> Là [vai trò], tôi muốn [hành động] để [mục đích].

## Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] AC1: ...
- [ ] AC2: ...

## Dữ liệu / Fields
Liệt kê các trường dữ liệu cần nhập cho tính năng này.

| Trường | Kiểu | Bắt buộc | Ràng buộc | Ghi chú |
|--------|-------|----------|------------|----------|
| [Tên trường] | Text / Số / Date / Image | Có / Không | ... | ... |

## Scenarios (Given / When / Then)
Mô tả chi tiết từng trường hợp — dùng để dev implement và tester viết test case.

**Scenario 1: [Tên happy path]**
```
Given [trạng thái đầu / điều kiện tiên quyết]
When [hành động của người dùng]
Then [kết quả mong đợi]
```

**Scenario 2: [Tên edge case / alternative flow]**
```
Given ...
When ...
Then ...
```

## Phụ thuộc (Dependencies)
- Phụ thuộc vào: F-XX, EP-XX (nếu có)
- Được sử dụng bởi: F-XX (nếu có)

## Out of Scope
Những gì **không** thuộc feature này (để tránh scope creep):
- ...

## Màn hình / Luồng liên quan
Link tới flow doc hoặc mô tả UI.

## Ghi chú
Ràng buộc kỹ thuật hoặc nghiệp vụ cần lưu ý.
```
