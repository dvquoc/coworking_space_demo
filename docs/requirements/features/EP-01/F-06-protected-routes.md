# F-06 – Bảo vệ Route (Protected Routes & Guest Routes)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-06 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Implement **route guards** để kiểm soát quyền truy cập:

1. **ProtectedRoute**: Chỉ cho phép user đã đăng nhập
   - Nếu chưa login → redirect to `/login`
   - Nếu đã login nhưng role không đủ → show 403 Forbidden

2. **GuestRoute**: Chỉ cho phép user CHƯA đăng nhập
   - Nếu đã login → redirect to dashboard/home
   - Dùng cho `/login`, `/forgot-password`, `/verify-otp`, `/reset-password`

3. **Role-based access**: Route chỉ cho phép role cụ thể
   - Admin-only routes: `/users`, `/settings`
   - Accountant-only: `/invoices`, `/payments`
   - Etc.

**Business Rationale:**
- **Security**: Prevent unauthorized access to sensitive pages
- **UX**: Auto-redirect to appropriate pages
- **Role separation**: Different users see different features

## User Story

> Là **Hệ thống**, tôi muốn **kiểm tra quyền truy cập** cho mỗi route để **đảm bảo chỉ user có quyền mới truy cập được**.

> Là **Staff**, khi tôi **truy cập route cần đăng nhập** mà chưa login, tôi muốn **được chuyển đến trang login** tự động.

> Là **Logged-in User**, khi tôi **truy cập trang login** (đã login rồi), tôi muốn **được chuyển đến dashboard** thay vì thấy form login.

## Tiêu chí chấp nhận (Acceptance Criteria)

### ProtectedRoute Component

- [ ] **AC1**: Component `<ProtectedRoute>` wrapper cho route cần auth
- [ ] **AC2**: Check user logged in (accessToken exists in Zustand)
- [ ] **AC3**: Nếu KHÔNG login:
  - Redirect to `/login`
  - Save original URL: `/login?redirect=/dashboard` (return after login)
- [ ] **AC4**: Nếu ĐÃ login:
  - Render child component (trang được protect)
- [ ] **AC5**: Loading state khi checking auth (avoid flash)

### GuestRoute Component

- [ ] **AC6**: Component `<GuestRoute>` wrapper cho login/forgot-password pages
- [ ] **AC7**: Check user logged in
- [ ] **AC8**: Nếu ĐÃ login:
  - Redirect to user's default page (dashboard/home)
- [ ] **AC9**: Nếu CHƯA login:
  - Render child component (login form, etc.)

### Role-based Access

- [ ] **AC10**: `<ProtectedRoute>` accepts `allowedRoles` prop
- [ ] **AC11**: Example: `<ProtectedRoute allowedRoles={['admin', 'manager']}>`
- [ ] **AC12**: Check user.role in allowedRoles
- [ ] **AC13**: Nếu role KHÔNG match:
  - Show 403 Forbidden page
  - Message: "Bạn không có quyền truy cập trang này"
  - Link to dashboard: "Quay lại trang chủ"
- [ ] **AC14**: Nếu role match:
  - Render trang

### Redirect After Login

- [ ] **AC15**: Khi redirect to `/login`, save original URL
- [ ] **AC16**: URL format: `/login?redirect=/bookings/create`
- [ ] **AC17**: After login success:
  - Read `redirect` param from URL
  - Navigate to saved URL
  - If no redirect param: Navigate to default page by role

### Default Pages by Role

- [ ] **AC18**: After login, redirect to:
  - Admin/Manager → `/dashboard`
  - Sale → `/customers`
  - Accountant → `/invoices`
  - Maintenance → `/maintenance`
  - Investor → `/reports`

### Token Refresh Integration

- [ ] **AC19**: ProtectedRoute integrates with token refresh logic
- [ ] **AC20**: Before rendering, check if access token near expiry
- [ ] **AC21**: If yes, auto-refresh token (F-01 refresh mechanism)
- [ ] **AC22**: If refresh fails → logout and redirect to login

### 404 Not Found

- [ ] **AC23**: Route không tồn tại → show 404 page
- [ ] **AC24**: Không cần protect, public page
- [ ] **AC25**: Link: "Quay lại trang chủ" or "Đăng nhập"

### Route Definitions

```typescript
// Protected routes
/dashboard             - All logged-in users
/customers             - Admin, Manager, Sale
/bookings              - Admin, Manager, Sale
/invoices              - Admin, Manager, Accountant
/payments              - Admin, Accountant
/reports               - Admin, Manager, Investor
/users                 - Admin only
/settings              - Admin only
/maintenance           - Maintenance only

// Guest routes (only if NOT logged in)
/login
/forgot-password
/verify-otp
/reset-password

// Public routes (no auth check)
/404
/500
```

## Dữ liệu / Fields

### ProtectedRoute Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional, if not set = all logged-in users
}
```

### GuestRoute Props

```typescript
interface GuestRouteProps {
  children: React.ReactNode;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Access protected route without login

```
Given User NOT logged in (no accessToken)
When User navigates to "/dashboard" (protected)

Then ProtectedRoute detects: no auth
And Redirect to "/login?redirect=/dashboard"
And Login page displayed
And After login:
  • Read redirect param = "/dashboard"
  • Navigate to "/dashboard"
And Dashboard renders successfully
```

### Scenario 2: Access guest route when logged in

```
Given User already logged in (accessToken exists)
And User role = "manager"
When User navigates to "/login"

Then GuestRoute detects: user logged in
And Redirect to "/dashboard" (manager's default page)
And User sees dashboard instead of login form
```

### Scenario 3: Role-based access - Admin only

```
Given User logged in, role = "sale"
When User navigates to "/users" (admin-only route)

Then ProtectedRoute checks:
  • User logged in: ✓
  • allowedRoles: ['admin']
  • User role "sale" NOT in allowedRoles: ✗
And Show 403 Forbidden page:
  • Title: "Truy cập bị từ chối"
  • Message: "Bạn không có quyền truy cập trang này"
  • Button: [Quay lại trang chủ] → redirect to "/customers" (sale's default)
```

### Scenario 4: Role-based access - Multiple roles

```
Given User logged in, role = "accountant"
When User navigates to "/invoices" (allowed: admin, manager, accountant)

Then ProtectedRoute checks:
  • User logged in: ✓
  • allowedRoles: ['admin', 'manager', 'accountant']
  • User role "accountant" IN allowedRoles: ✓
And Render "/invoices" page successfully
```

### Scenario 5: Token expired during browsing

```
Given User logged in 2 hours ago
And Access token expired (15min TTL)
And Refresh token still valid
And User on "/dashboard"
When User clicks link to "/bookings"

Then ProtectedRoute detects: access token expired
And Automatically call refresh token API
And Get new access token
And Update Zustand store
And Render "/bookings" page (no redirect to login)

# If refresh token also expired:
Then Redirect to "/login?redirect=/bookings"
And Show message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
```

### Scenario 6: Direct URL access

```
Given User NOT logged in
When User pastes URL "/bookings/create" in browser

Then Navigate to "/login?redirect=/bookings/create"
And After login: Auto-redirect to "/bookings/create"
```

### Scenario 7: 404 Not Found

```
Given User navigates to "/nonexistent-page"
Then Router matches no route
And Render 404 page:
  • Title: "404 - Trang không tồn tại"
  • Message: "Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa"
  • Link: "Quay lại trang chủ" → "/"
```

### Scenario 8: Loading state

```
Given User logged in
And Page refreshed (F5)
And Auth state not hydrated yet (loading from storage)

When React Router rendering

Then ProtectedRoute shows:
  • Loading spinner: "Đang kiểm tra quyền truy cập..."
  • Delay 100-200ms
And After auth loaded:
  • If logged in: Render page
  • If not: Redirect to login
And Avoid flash of wrong page
```

## UI/UX Design

### 403 Forbidden Page

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🚫 Truy cập bị từ chối              │
│                                                  │
│  Bạn không có quyền truy cập trang này.          │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │      Quay lại trang chủ                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 404 Not Found Page

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          404 - Trang không tồn tại               │
│                                                  │
│  Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.│
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │      Quay lại trang chủ                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Loading State

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              ⏳ Đang tải...                       │
│                                                  │
│              (Loading spinner)                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Routes Configuration

```typescript
// src/routes/index.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import GuestRoute from '@/components/GuestRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes */}
        <Route path="/login" element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        
        <Route path="/forgot-password" element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        } />
        
        {/* Protected Routes - All logged-in users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Specific roles */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        } />
        
        <Route path="/invoices" element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>
            <InvoicesPage />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Technical Notes

### ProtectedRoute Component

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { accessToken, user, isLoading } = useAuthStore();
  
  // Loading state
  if (isLoading) {
    return <div className="loading">Đang kiểm tra quyền truy cập...</div>;
  }
  
  // Not logged in
  if (!accessToken || !user) {
    // Save current URL for redirect after login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // Role-based access check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="forbidden">
        <h1>🚫 Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập trang này.</p>
        <a href="/dashboard">Quay lại trang chủ</a>
      </div>
    );
  }
  
  // Authorized
  return <>{children}</>;
}
```

### GuestRoute Component

```typescript
// src/components/GuestRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { accessToken, user } = useAuthStore();
  
  // Already logged in
  if (accessToken && user) {
    // Redirect to default page by role
    const defaultPages = {
      admin: '/dashboard',
      manager: '/dashboard',
      sale: '/customers',
      accountant: '/invoices',
      maintenance: '/maintenance',
      investor: '/reports'
    };
    
    const redirectTo = defaultPages[user.role] || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }
  
  // Not logged in, allow access to guest page
  return <>{children}</>;
}
```

### Redirect After Login

```typescript
// src/pages/Login.tsx
import { useSearchParams, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useLogin();
  
  const onSubmit = async (data) => {
    await login.mutateAsync(data);
    
    // Check if there's a redirect URL
    const redirectUrl = searchParams.get('redirect');
    
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      // Default redirect by role
      const role = login.data.user.role;
      const defaultPages = {
        admin: '/dashboard',
        manager: '/dashboard',
        sale: '/customers',
        accountant: '/invoices',
        maintenance: '/maintenance',
        investor: '/reports'
      };
      navigate(defaultPages[role] || '/dashboard');
    }
  };
  
  return <LoginForm onSubmit={onSubmit} />;
}
```

### Token Refresh Integration

```typescript
// src/stores/authStore.ts
export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isLoading: true,
  
  // Initialize auth state (on app load)
  init: async () => {
    try {
      // Try to refresh token on app start
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ accessToken: data.accessToken, user: data.user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },
  
  // Auto-refresh if token near expiry
  ensureValidToken: async () => {
    const { accessToken } = get();
    if (!accessToken) return false;
    
    // Decode JWT to check expiry
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresIn = payload.exp * 1000 - Date.now();
    
    // If expires in < 2 minutes, refresh
    if (expiresIn < 2 * 60 * 1000) {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ accessToken: data.accessToken });
        return true;
      } else {
        // Refresh failed, logout
        get().clearAuth();
        return false;
      }
    }
    
    return true;
  }
}));

// Call init on app start
useAuthStore.getState().init();
```

### Route Permissions Configuration

```typescript
// src/config/permissions.ts
export const ROUTE_PERMISSIONS = {
  '/dashboard': ['admin', 'manager', 'sale', 'accountant', 'maintenance', 'investor'],
  '/users': ['admin'],
  '/settings': ['admin'],
  '/customers': ['admin', 'manager', 'sale'],
  '/bookings': ['admin', 'manager', 'sale'],
  '/invoices': ['admin', 'manager', 'accountant'],
  '/payments': ['admin', 'accountant'],
  '/reports': ['admin', 'manager', 'investor'],
  '/maintenance': ['maintenance', 'admin']
};

export function canAccessRoute(route: string, userRole: string): boolean {
  const allowedRoles = ROUTE_PERMISSIONS[route];
  if (!allowedRoles) return true; // No restrictions
  return allowedRoles.includes(userRole);
}
```

## Dependencies

**Phụ thuộc vào:**
- F-01: Login (auth state)
- F-05: Logout (clear auth)

**Được sử dụng bởi:**
- All protected pages in the app

## Out of Scope

**Phase 1 không làm:**
- Permission-based (granular) access control → Phase 2
  - E.g., "can_edit_invoices", "can_delete_users"
- Dynamic permissions from database → Phase 2
- Session timeout idle detection → Phase 2

## Testing Checklist

- [ ] Unauthenticated user redirected to /login
- [ ] Authenticated user can access protected routes
- [ ] Guest route redirects logged-in user to dashboard
- [ ] Role-based access works (admin-only route blocks non-admin)
- [ ] 403 Forbidden page displays correctly
- [ ] 404 Not Found page displays for invalid routes
- [ ] Redirect to original URL after login works
- [ ] Default page by role works
- [ ] Token refresh on protected route works
- [ ] Expired refresh token logs out user

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
