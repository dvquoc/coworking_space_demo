# F-01 – Đăng nhập (Login)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-01 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Staff (Admin, Manager, Sale, Accountant, Maintenance, Investor)** đăng nhập vào hệ thống Admin Dashboard bằng **email + password**. Sau khi đăng nhập thành công, user nhận được:
- **Access Token (JWT)**: Lưu trong memory/state (Zustand)
- **Refresh Token**: Lưu trong httpOnly cookie (secure)

**Business Rationale:**
- **Security**: JWT-based authentication với access/refresh token rotation
- **Session management**: Auto-refresh token khi sắp hết hạn
- **Role-based access**: Mỗi user có role khác nhau (Admin, Manager, Sale,...)
- **Audit trail**: Log mọi login attempts (success/failure)

**Out of Scope:**
- Customer login (portal) → EP-15 Customer Portal
- Social login (Google, Facebook) → Phase 2
- Two-factor authentication (2FA) → Phase 2

## User Story

> Là **Staff**, tôi muốn **đăng nhập vào Admin Dashboard bằng email và password** để **truy cập hệ thống quản lý**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Login Form UI

- [ ] **AC1**: Route `/login` hiển thị login page
- [ ] **AC2**: Form có 2 fields:
  - Email (type: email, required, validation)
  - Password (type: password, required, min 8 chars)
- [ ] **AC3**: "Hiện/Ẩn mật khẩu" toggle button (eye icon)
- [ ] **AC4**: "Ghi nhớ đăng nhập" checkbox (remember me)
- [ ] **AC5**: "Quên mật khẩu?" link → navigate to `/forgot-password`
- [ ] **AC6**: Submit button: "Đăng nhập"
- [ ] **AC7**: Loading state khi đang submit (button disabled + spinner)

### Validation (Client-side)

- [ ] **AC8**: Email field:
  - Required: "Email không được để trống"
  - Format: "Email không đúng định dạng"
- [ ] **AC9**: Password field:
  - Required: "Mật khẩu không được để trống"
  - Min length 8: "Mật khẩu tối thiểu 8 ký tự"
- [ ] **AC10**: Validation real-time (onChange hoặc onBlur)
- [ ] **AC11**: Submit disabled nếu form invalid

### Authentication Flow (Happy Path)

- [ ] **AC12**: User nhập email + password hợp lệ
- [ ] **AC13**: Click "Đăng nhập" → POST `/api/auth/login`
- [ ] **AC14**: Backend verify credentials:
  - Check user exists (by email)
  - Verify password (bcrypt compare)
  - Check user status = "active"
- [ ] **AC15**: If valid → Backend response:
  - accessToken (JWT, expires in 15 minutes)
  - refreshToken (stored in httpOnly cookie)
  - user object (id, name, email, role)
- [ ] **AC16**: Frontend stores:
  - accessToken → Zustand store (memory)
  - user info → Zustand store
  - refreshToken → automatic (httpOnly cookie)
- [ ] **AC17**: Redirect to dashboard:
  - Admin/Manager → `/dashboard`
  - Sale → `/customers`
  - Accountant → `/invoices`
  - Maintenance → `/maintenance`
  - Investor → `/reports`

### Error Handling

- [ ] **AC18**: Invalid credentials (wrong email/password):
  - Error message: "Email hoặc mật khẩu không chính xác"
  - Do NOT reveal which one is wrong (security)
- [ ] **AC19**: User not found:
  - Same error: "Email hoặc mật khẩu không chính xác"
- [ ] **AC20**: User inactive/suspended:
  - Error: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin."
- [ ] **AC21**: Network error:
  - Error: "Lỗi kết nối. Vui lòng thử lại."
- [ ] **AC22**: Server error (500):
  - Error: "Lỗi hệ thống. Vui lòng thử lại sau."
- [ ] **AC23**: Error dismissible (có nút X để đóng)

### Remember Me Feature

- [ ] **AC24**: Nếu "Ghi nhớ đăng nhập" checked:
  - Save email to localStorage
  - Next visit: Pre-fill email field
- [ ] **AC25**: Nếu unchecked:
  - Do NOT save email
  - Clear saved email from localStorage

### Rate Limiting

- [ ] **AC26**: Backend rate limit: Max 5 login attempts per email per 15 minutes
- [ ] **AC27**: After 5 failed attempts:
  - Error: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút."
  - HTTP 429 (Too Many Requests)
- [ ] **AC28**: Lock account after 10 failed attempts (security)
  - Status → "locked"
  - Email admin notification

### Session Management

- [ ] **AC29**: Access token expires in 15 minutes
- [ ] **AC30**: Refresh token expires in 7 days
- [ ] **AC31**: Auto-refresh mechanism:
  - Before API call, check if access token expires in <2 minutes
  - If yes, call POST `/api/auth/refresh` with refresh token
  - Get new access token, update Zustand store
- [ ] **AC32**: If refresh token invalid/expired:
  - Clear auth state
  - Redirect to `/login`
  - Show message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."

### Security

- [ ] **AC33**: Password never exposed in logs/responses
- [ ] **AC34**: HTTPS only (redirect HTTP → HTTPS in production)
- [ ] **AC35**: CSRF protection (SameSite cookie)
- [ ] **AC36**: Log all login attempts:
  - Timestamp, email, IP address, user agent, result (success/failure)

### Audit Trail

- [ ] **AC37**: Create LoginLog record on every login attempt:
  - userId (if success)
  - email (attempted)
  - ipAddress
  - userAgent
  - status: "success" | "failed"
  - failureReason?: string
  - timestamp

## Dữ liệu / Fields

### Login Request

```typescript
interface LoginRequest {
  email: string;       // example@cobi.vn
  password: string;    // Plain text (will be hashed on server)
  rememberMe?: boolean; // Default false
}
```

### Login Response (Success)

```typescript
interface LoginResponse {
  success: true;
  accessToken: string;  // JWT token
  // Refresh token in httpOnly cookie (not in response body)
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'sale' | 'accountant' | 'maintenance' | 'investor';
    avatarUrl?: string;
    permissions: string[]; // Array of permission keys
  };
}
```

### Login Response (Error)

```typescript
interface LoginErrorResponse {
  success: false;
  error: {
    code: string;       // "INVALID_CREDENTIALS", "ACCOUNT_INACTIVE", "RATE_LIMIT_EXCEEDED"
    message: string;    // User-facing message
  };
}
```

### JWT Payload

```typescript
interface JWTPayload {
  sub: string;         // User ID
  email: string;
  role: string;
  iat: number;         // Issued at (timestamp)
  exp: number;         // Expires at (timestamp)
}
```

### Login Log Table

```typescript
interface LoginLog {
  id: string;
  userId?: string;     // NULL if login failed
  email: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  failureReason?: string;
  timestamp: Date;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Login thành công - Admin

```
Given User vào trang login "http://localhost:5173/login"
And Form displayed với 2 fields: Email, Password
And User nhập:
  • Email: "admin@cobi.vn"
  • Password: "Admin@123"
And Check "Ghi nhớ đăng nhập"

When User click "Đăng nhập"

Then Frontend POST to "/api/auth/login":
  • Body: { email: "admin@cobi.vn", password: "Admin@123", rememberMe: true }
And Backend verifies:
  • User exists with email "admin@cobi.vn"
  • Password matches (bcrypt)
  • User status = "active"
  • User role = "admin"
And Backend responds:
  • accessToken: "eyJhbGc..." (15min expiry)
  • Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict (7days)
  • user: { id: "U001", name: "Admin", email: "admin@cobi.vn", role: "admin" }
And Frontend saves:
  • Zustand store: { accessToken, user }
  • LocalStorage: email = "admin@cobi.vn" (remember me)
  • Cookie: refreshToken (automatic)
And Redirect to "/dashboard"
And Create LoginLog:
  • userId: "U001", email: "admin@cobi.vn", status: "success"
And Dashboard loads with user name "Admin" in navbar
```

### Scenario 2: Login thất bại - Sai mật khẩu

```
Given User on login page
When User nhập:
  • Email: "manager@cobi.vn"
  • Password: "WrongPassword123!"
And Click "Đăng nhập"

Then POST to "/api/auth/login"
And Backend verifies:
  • User exists with email "manager@cobi.vn"
  • Password does NOT match
And Backend responds:
  • status: 401 Unauthorized
  • error: { code: "INVALID_CREDENTIALS", message: "Email hoặc mật khẩu không chính xác" }
And Create LoginLog:
  • userId: NULL, email: "manager@cobi.vn", status: "failed", failureReason: "Invalid password"
And Frontend shows error:
  • Red alert box: "Email hoặc mật khẩu không chính xác"
  • Password field cleared
  • Email field retains value
And User remains on login page
```

### Scenario 3: User không tồn tại

```
Given User on login page
When User nhập:
  • Email: "notexist@cobi.vn"
  • Password: "Any@Password123"
And Click "Đăng nhập"

Then Backend verifies:
  • User NOT found with email "notexist@cobi.vn"
And Backend responds (same as wrong password):
  • error: "Email hoặc mật khẩu không chính xác"
And Frontend shows same error
And LoginLog created:
  • email: "notexist@cobi.vn", status: "failed", failureReason: "User not found"
```

### Scenario 4: Account bị vô hiệu hóa

```
Given User "sale@cobi.vn" has status = "inactive"
When User login with correct credentials

Then Backend detects user.status = "inactive"
And Responds:
  • error: { code: "ACCOUNT_INACTIVE", message: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin." }
And Frontend shows error
And LoginLog:
  • status: "failed", failureReason: "Account inactive"
```

### Scenario 5: Rate limiting - Quá nhiều lần thử

```
Given User "hacker@example.com" đã login fail 5 lần trong 10 phút
When User tries login lần 6

Then Backend rate limiter blocks request
And Responds:
  • status: 429 Too Many Requests
  • error: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút."
And Frontend shows error
And Submit button disabled for 15 minutes (optional client-side)
```

### Scenario 6: Remember me - Pre-fill email

```
Given User đã login trước đó với "Ghi nhớ đăng nhập" checked
And LocalStorage has email = "sale@cobi.vn"
When User vào login page

Then Email field auto-filled với "sale@cobi.vn"
And Password field empty (security)
And "Ghi nhớ đăng nhập" checked
And User chỉ cần nhập password
```

### Scenario 7: Client-side validation

```
Given User on login page
When User nhập email: "invalidemail" (no @)
And Blur email field

Then Show validation error: "Email không đúng định dạng"
And Email field border = red
And Submit button disabled

When User fixes email: "valid@cobi.vn"
And Validation passes

Then Error hidden
And Border = normal
And Submit button enabled (if password valid)
```

### Scenario 8: Redirect sau khi login theo role

```
# Admin
Given User login with role = "admin"
Then Redirect to "/dashboard"

# Manager
Given User login with role = "manager"
Then Redirect to "/dashboard"

# Sale
Given User login with role = "sale"
Then Redirect to "/customers"

# Accountant
Given User login with role = "accountant"
Then Redirect to "/invoices"

# Maintenance
Given User login with role = "maintenance"
Then Redirect to "/maintenance"

# Investor
Given User login with role = "investor"
Then Redirect to "/reports"
```

## UI/UX Design

### Login Form

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🏢 Cobi Coworking                   │
│           Admin Dashboard Login                  │
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  Email *                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ example@cobi.vn                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Mật khẩu *                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ ••••••••••                            [👁️] │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ☑ Ghi nhớ đăng nhập                             │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Đăng nhập                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  <a href="/forgot-password">Quên mật khẩu?</a>  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Error State

```
┌──────────────────────────────────────────────────┐
│  ⚠️ Email hoặc mật khẩu không chính xác      [×]│
├──────────────────────────────────────────────────┤
│  Email *                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ manager@cobi.vn                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Mật khẩu * (border red)                         │
│  ┌────────────────────────────────────────────┐ │
│  │                                       [👁️] │ │
│  └────────────────────────────────────────────┘ │
│  ❌ Email hoặc mật khẩu không chính xác          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Loading State

```
┌──────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────┐ │
│  │   ⏳ Đang đăng nhập...                     │ │
│  └────────────────────────────────────────────┘ │
│  (Button disabled)                               │
└──────────────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Login
POST /api/auth/login
Body: {
  email: string;
  password: string;
  rememberMe?: boolean;
}
Response (Success): {
  success: true;
  accessToken: string;
  user: UserInfo;
}
Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

Response (Error): {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

## Technical Notes

### Backend Implementation (Node.js + Express)

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const user = await db.users.findOne({ email });
    if (!user) {
      await logLoginAttempt(null, email, req, 'User not found');
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác'
        }
      });
    }
    
    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await logLoginAttempt(null, email, req, 'Invalid password');
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác'
        }
      });
    }
    
    // 3. Check user status
    if (user.status !== 'active') {
      await logLoginAttempt(user.id, email, req, 'Account inactive');
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin.'
        }
      });
    }
    
    // 4. Generate tokens
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // 5. Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // 6. Log success
    await logLoginAttempt(user.id, email, req, null);
    
    // 7. Response
    return res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        permissions: user.permissions
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      }
    });
  }
});
```

### Frontend Implementation (React + Zustand + TanStack Query)

```typescript
// Zustand store: src/stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: UserInfo | null;
  setAuth: (token: string, user: UserInfo) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null })
}));
```

```typescript
// TanStack Query hook: src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include' // Include cookies
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      
      // Remember me
      if (credentials.rememberMe) {
        localStorage.setItem('rememberedEmail', credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    }
  });
}
```

```typescript
// Login component: src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useLogin';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const login = useLogin();
  
  const onSubmit = async (data) => {
    try {
      await login.mutateAsync(data);
      
      // Redirect based on role
      const role = login.data.user.role;
      if (role === 'admin' || role === 'manager') {
        navigate('/dashboard');
      } else if (role === 'sale') {
        navigate('/customers');
      } else if (role === 'accountant') {
        navigate('/invoices');
      } // ... etc
      
    } catch (error) {
      // Error handled by useMutation
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register('email', { 
          required: 'Email không được để trống',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email không đúng định dạng'
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      {/* ... password field, submit button ... */}
      
      {login.error && <div className="error">{login.error.message}</div>}
    </form>
  );
}
```

### Security Considerations

- **Password Storage**: bcrypt with salt rounds 10
- **Token Expiry**: Access 15min, Refresh 7days
- **HTTPS Only**: Force HTTPS in production
- **Rate Limiting**: Express-rate-limit middleware
- **IP Logging**: For audit and security analysis
- **CSRF Protection**: SameSite cookies

## Dependencies

**Phụ thuộc vào:**
- EP-09: Staff Management (users table)
- Database: users, login_logs tables

**Được sử dụng bởi:**
- Tất cả features khác (cần authentication)
- F-06: Protected routes

## Out of Scope

**Phase 1 không làm:**
- Social login (Google, Facebook) → Phase 2
- Two-factor authentication (2FA) → Phase 2
- Login with phone number + OTP → Phase 2
- Passwordless login (magic link) → Phase 3

## Testing Checklist

- [ ] Login with valid credentials succeeds
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] User not found shows generic error
- [ ] Inactive account blocked
- [ ] Rate limiting works after 5 failures
- [ ] Remember me saves email
- [ ] Tokens stored correctly (Zustand + cookie)
- [ ] Redirect based on role works
- [ ] Login log created for all attempts

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
