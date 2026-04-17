# Cowoking Space – Copilot Instructions

Đây là ứng dụng **Admin Dashboard SPA** cho nền tảng quản lý bất động sản **Cowoking Space**.

## Stack & Công nghệ

| Thành phần | Thư viện / Công cụ |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 + `@vitejs/plugin-react` + `@rolldown/plugin-babel` (React Compiler) |
| Styling | **Tailwind CSS v4** – `@import "tailwindcss"` trong `index.css`, KHÔNG dùng `tailwind.config.js` |
| Routing | React Router DOM v7 |
| State Management | **Zustand** – stores nằm trong `src/stores/` |
| Server State | **TanStack Query v5** – query hooks nằm trong `src/hooks/`, service functions trong `src/services/` |
| Charts | Recharts v3 |
| Icons | Lucide React |

## Lệnh thường dùng

```bash
npm run dev       # Khởi động dev server (thường ở port 5173 hoặc 5174)
npm run build     # Build production
npm run lint      # Kiểm tra ESLint
npm run preview   # Preview bản build
```

## Hướng dẫn chi tiết

Xem thêm trong `.github/`:

| File | Nội dung |
|---|---|
| `structure.instructions.md` | Cấu trúc thư mục `src/` và `docs/` |
| `routing.instructions.md` | Routing, Auth system, ProtectedRoute/GuestRoute |
| `design.instructions.md` | Quy ước màu sắc, component, Tailwind gotchas |
| `flows.instructions.md` | Quy ước viết flow doc trong `docs/flows/` |
| `requirements.instructions.md` | Quy ước viết yêu cầu nghiệp vụ trong `docs/requirements/` |
