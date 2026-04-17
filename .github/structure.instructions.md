---
applyTo: "src/**"
---

# Cấu trúc thư mục – Coworking Space

## `src/`

```
src/
├── App.tsx                     # Router gốc – định nghĩa tất cả routes
├── main.tsx                    # Entry point React
├── index.css                   # Global styles + Tailwind import
├── App.css                     # (trống – không dùng)
├── assets/                     # Ảnh, SVG tĩnh
├── contexts/
├── data/
│   └── tenants.ts              # Dữ liệu & interface Tenant, RentalHistory (dùng chung)
├── components/
│   ├── router/
│   │   └── AuthGuard.tsx       # ProtectedRoute + GuestRoute
│   ├── layout/
│   │   ├── AuthLayout.tsx      # Layout trang auth (split: branding trái + form phải)
│   │   ├── DashboardLayout.tsx # Layout dashboard (Sidebar + Outlet)
│   │   ├── Sidebar.tsx         # Navigation sidebar (fixed, slate-900)
│   │   └── Header.tsx          # Top header (title, search, notifications, avatar)
└── pages/
    ├── DashboardPage.tsx       # Trang chủ dashboard
    ├── SettingsPage.tsx        # Cài đặt tài khoản (form profile)
    ├── NotFoundPage.tsx        # Trang 404 (standalone, không dùng layout)
    └── auth/
        ├── LoginPage.tsx          # Đăng nhập (email/pwd + Google/Microsoft)
        ├── ForgotPasswordPage.tsx # Quên mật khẩu (gửi OTP qua email)
        ├── OtpPage.tsx            # Nhập mã OTP 6 chữ số + countdown
        └── ResetPasswordPage.tsx  # Đặt lại mật khẩu + strength bar
```

## `docs/`

```
docs/
├── PROJECT_STRUCTURE.md        # Kiến trúc tổng quan chi tiết
├── flows/                      # Tài liệu từng luồng nghiệp vụ
│   ├── README.md               # Index danh sách tất cả flows
│   └── 01-auth-flow.md         # Flow xác thực người dùng
└── requirements/               # Tài liệu yêu cầu nghiệp vụ (BA)
    ├── README.md               # Index epics & features
    ├── epics/                  # Yêu cầu cấp Epic (EP-NN-tên.md)
    ├── features/               # User Story / Feature (F-NN-tên.md)
    └── non-functional/         # Yêu cầu phi chức năng (NFR-NN-tên.md)
```

## Quy ước đặt tên file

- **Pages**: PascalCase + hậu tố `Page` (e.g., `DashboardPage.tsx`)
- **Components**: PascalCase (e.g., `StatsCard.tsx`, `AuthGuard.tsx`)
- **Contexts**: PascalCase + hậu tố `Context` (e.g., `AuthContext.tsx`)
- **Layouts**: PascalCase + hậu tố `Layout` (e.g., `DashboardLayout.tsx`)
- **Data files**: camelCase, không hậu tố (e.g., `tenants.ts`) – export interface + const array
