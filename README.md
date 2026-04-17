# Coworking Space - Admin Dashboard SPA

React 19 + TypeScript + Vite 8 Single Page Application cho nền tảng quản lý coworking space.

## 🚀 Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 + React Compiler
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Server State**: TanStack Query v5
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Charts**: Recharts v3

## 📁 Cấu trúc dự án

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.tsx
│   ├── GuestRoute.tsx
│   └── UserMenu.tsx
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── VerifyOTPPage.tsx
│   │   └── ResetPasswordPage.tsx
│   ├── DashboardPage.tsx
│   ├── CustomersPage.tsx
│   ├── InvoicesPage.tsx
│   ├── MaintenancePage.tsx
│   ├── ReportsPage.tsx
│   ├── ForbiddenPage.tsx
│   └── NotFoundPage.tsx
├── stores/             # Zustand stores
│   └── authStore.ts
├── hooks/              # Custom hooks
│   └── useAuth.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── auth.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔧 Cài đặt

1. **Clone repository và cài dependencies**:
```bash
npm install
```

2. **Tạo file `.env`** từ `.env.example`:
```bash
cp .env.example .env
```

3. **Cấu hình API endpoint** trong `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

4. **Chạy development server**:
```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:5173`

## 🔐 Authentication Features (EP-01)

### ✅ F-01: Login
- Email + password authentication
- Remember me (lưu email trong localStorage)
- Role-based redirect sau khi đăng nhập
- Rate limiting (5 lần/15 phút)
- Form validation với React Hook Form
- **Route**: `/login`

### ✅ F-02: Forgot Password
- Gửi email OTP (6 chữ số)
- Rate limiting (3 yêu cầu/60 phút)
- Email enumeration prevention
- **Route**: `/forgot-password`

### ✅ F-03: Verify OTP
- 6 input boxes với auto-focus
- Paste support ("123456" tự động điền)
- Countdown timer 10 phút
- Resend OTP (cooldown 60s)
- Auto-submit khi đủ 6 số
- **Route**: `/verify-otp?email=xxx`

### ✅ F-04: Reset Password
- Password strength indicator (Weak/Medium/Strong)
- 5 tiêu chí validation:
  - ≥ 8 ký tự
  - Chữ hoa (A-Z)
  - Chữ thường (a-z)
  - Số (0-9)
  - Ký tự đặc biệt (@#$%^&*!)
- Confirm password matching
- **Route**: `/reset-password?token=xxx`

### ✅ F-05: Logout
- Confirmation dialog
- Revoke refresh token
- Clear Zustand store
- Redirect về `/login`

### ✅ F-06: Protected Routes
- **ProtectedRoute**: Kiểm tra auth + role-based access
- **GuestRoute**: Redirect nếu đã đăng nhập
- Token auto-refresh (nếu expires < 2 phút)
- Loading state (tránh flash)
- 403 Forbidden page
- 404 Not Found page

## 👥 User Roles & Default Pages

| Role | Default Page | Allowed Routes |
|------|-------------|----------------|
| Admin | `/dashboard` | All routes |
| Manager | `/dashboard` | Dashboard, Customers, Invoices |
| Sale | `/customers` | Customers |
| Accountant | `/invoices` | Invoices |
| Maintenance | `/maintenance` | Maintenance |
| Investor | `/reports` | Reports |

## 🔌 API Integration

App này là **SPA frontend-only**, cần kết nối với backend API:

### Required Endpoints

```typescript
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/verify-otp
POST /api/auth/reset-password
```

### Axios Configuration

- **Base URL**: `VITE_API_BASE_URL/api`
- **Credentials**: `withCredentials: true` (httpOnly cookies)
- **Authorization**: `Bearer <accessToken>` trong header
- **Auto-retry**: 401 errors tự động refresh token

## 🎨 Tailwind CSS v4

**QUAN TRỌNG**: Project dùng **Tailwind CSS v4** với cú pháp mới:

```css
/* src/index.css */
@import "tailwindcss";
```

- **KHÔNG** có `tailwind.config.js`
- **KHÔNG** dùng cú pháp `@tailwind base/components/utilities`
- Classes vẫn giữ nguyên như v3

## 📝 Scripts

```bash
npm run dev      # Chạy dev server (port 5173)
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## 🧪 Testing

Để test authentication flow cần backend API với:

1. **Mock users** với roles: admin, manager, sale, accountant, maintenance, investor
2. **JWT tokens**: access (15min) + refresh (7 days, httpOnly cookie)
3. **OTP service**: Email SMTP hoặc mock OTP
4. **Rate limiting**: 5 login/15min, 3 OTP/60min

## 📚 Tài liệu

- **Epic**: `docs/requirements/epics/EP-01-auth.md`
- **Features**: `docs/requirements/features/EP-01/`
  - F-01: Login
  - F-02: Forgot Password
  - F-03: Verify OTP
  - F-04: Reset Password
  - F-05: Logout
  - F-06: Protected Routes

## 🤝 Contributing

1. Đọc `.github/copilot-instructions.md` để hiểu project structure
2. Đọc `.github/design.instructions.md` cho UI/UX guidelines
3. Follow coding style trong `.github/requirements.instructions.md`

## 📄 License

© 2026 Coworking Space. All rights reserved.
