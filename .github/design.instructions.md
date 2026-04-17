---
applyTo: "src/**"
---

# Design System – Coworking Space

## Bảng màu

| Mục đích | Class Tailwind |
|---|---|
| Primary action / Active nav | `#b11e29` |
| Primary hover | `#b11e29` |
| Background trang | `bg-slate-100` |
| Sidebar | `bg-slate-900` |
| Card / Panel | `bg-white rounded-2xl shadow-sm border border-slate-100` |
| Status: thành công | `bg-emerald-100 text-emerald-700` |
| Status: đang xử lý | `bg-amber-100 text-amber-700` |
| Status: chờ duyệt | `bg-[#D1F0E1] text-[#118A4F]` |
| Status: huỷ / lỗi | `bg-rose-100 text-rose-700` |

## Quy ước component

- **Button primary**: `bg-[#b11e29] hover:bg-[#b11e29] text-white rounded-xl px-4 py-2`
- **Button secondary**: `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl`
- **Input**: `border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#15A05C] focus:border-transparent`
- **Sidebar width**: fixed `w-64`
- **Font**: `font-family: 'Inter', system-ui, -apple-system, sans-serif` (khai báo trong `body` của `index.css`)

## Tailwind v4 – Lưu ý quan trọng

- **KHÔNG có `tailwind.config.js`** – không tạo file này
- Tailwind load qua plugin trong `vite.config.ts`: plugin `@tailwindcss/vite`
- Import duy nhất trong `src/index.css`:
  ```css
  @import "tailwindcss";
  ```
- Custom variables/tokens → khai báo trong `@layer base` hoặc `@theme` bên trong `index.css`

## Recharts – Lưu ý TypeScript

Tooltip `formatter` không được type cứng `value: number` vì kiểu thực tế là `ValueType | undefined`:

```tsx
// ❌ Sai – gây lỗi TypeScript
formatter={(value: number) => [`${value.toLocaleString()} VNĐ`]}

// ✅ Đúng – cast qua Number()
formatter={(value) => [`${Number(value).toLocaleString()} VNĐ`]}
```

## Header component

```tsx
<Header title="Tên trang" subtitle="Mô tả ngắn" />
```

Dùng bên trong mỗi page, không nhúng vào layout chung.
