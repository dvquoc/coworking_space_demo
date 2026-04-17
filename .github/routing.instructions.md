---
applyTo: "src/**"
---

# Routing & Auth – Coworking Space

## Routing Map

```
/                     → DashboardPage      (ProtectedRoute → DashboardLayout)
/settings             → SettingsPage       (ProtectedRoute → DashboardLayout)

/auth/login           → LoginPage          (GuestRoute → AuthLayout)
/auth/forgot-password → ForgotPasswordPage (GuestRoute → AuthLayout)
/auth/otp             → OtpPage            (GuestRoute → AuthLayout)
/auth/reset-password  → ResetPasswordPage  (GuestRoute → AuthLayout)

*                     → NotFoundPage       (standalone)
```

## Hệ thống Auth

- Lưu trạng thái đăng nhập vào `localStorage` key `coworking_space_auth`
- Expose: `user: AuthUser | null`, `isAuthenticated: boolean`, `login(email)`, `logout()`
- `AuthUser`: `{ email: string; name: string }`
- Luôn đọc từ `useAuth()` hook, **không bao giờ** truy cập localStorage trực tiếp ngoài context này

### `ProtectedRoute` (`src/components/router/AuthGuard.tsx`)

- Chưa đăng nhập → `<Navigate to="/auth/login" state={{ from: location }} replace />`
- Đã đăng nhập → render `<Outlet />`

### `GuestRoute` (`src/components/router/AuthGuard.tsx`)

- Đã đăng nhập → `<Navigate to={location.state?.from?.pathname ?? '/'} replace />`
- Chưa đăng nhập → render `<Outlet />`

### Luồng redirect sau đăng nhập

```
User truy cập /dashboard (chưa login)
  → ProtectedRoute lưu { from: { pathname: '/dashboard' } } vào state
  → Redirect /auth/login
  → LoginPage gọi login(email), navigate(from, { replace: true })
  → User về đúng /dashboard
```

### Truyền dữ liệu giữa trang auth

Dùng `location.state` (không dùng URL params hoặc localStorage):

```
ForgotPasswordPage → navigate('/auth/otp', { state: { email } })
OtpPage            → navigate('/auth/reset-password', { state: { email, code } })
```

### Đăng xuất

```ts
// Sidebar.tsx
const handleLogout = () => {
  logout()  // xoá localStorage
  navigate('/auth/login', { replace: true })
}
```
