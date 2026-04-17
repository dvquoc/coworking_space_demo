---
applyTo: "docs/**"
---

# Flow Documentation – Coworking Space

## Vị trí lưu trữ

Tất cả flow doc nằm trong `docs/flows/`:

```
docs/flows/
├── README.md          # Index tất cả flows (luôn cập nhật khi thêm mới)
└── 01-auth-flow.md    # Flow xác thực người dùng
```

## Quy ước đặt tên

```
[số thứ tự 2 chữ số]-[tên-flow-kebab-case]-flow.md
```

Ví dụ: `02-property-create-flow.md`, `03-agent-onboarding-flow.md`

## Khi thêm flow mới

1. Tạo file `docs/flows/[NN]-[tên]-flow.md`
2. Cập nhật bảng index trong `docs/flows/README.md`

## Cấu trúc một file flow

```markdown
# [Tên Flow]

## Tổng quan
Mô tả ngắn mục đích của flow.

## Các bước
1. ...
2. ...

## Sơ đồ
(ASCII diagram hoặc mô tả dạng text)

## File liên quan
Bảng map file → vai trò trong flow.

## Giới hạn hiện tại
Những gì chưa implement.
```

## Flow hiện có

| STT | File | Mô tả |
|-----|------|--------|
| 01 | `01-auth-flow.md` | Đăng nhập, quên mật khẩu, OTP, đặt lại mật khẩu, logout |
