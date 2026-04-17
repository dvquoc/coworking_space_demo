# F-05 – Đăng xuất (Logout)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-05 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép user **đăng xuất** khỏi hệ thống một cách an toàn:
1. Clear auth state (access token, user info)
2. Clear refresh token cookie
3. Redirect to login page
4. Log logout action (audit trail)

**Business Rationale:**
- **Security**: Clear all auth data to prevent unauthorized access
- **Shared devices**: Important for users on shared computers
- **Session management**: Clean up server-side sessions (if any)
- **Audit**: Track when users logout

## User Story

> Là **Staff**, tôi muốn **đăng xuất khỏi hệ thống** để **bảo mật tài khoản** khi rời khỏi máy tính.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Logout Trigger

- [ ] **AC1**: User avatar/menu in navbar hiển thị "Đăng xuất" option
- [ ] **AC2**: Click "Đăng xuất" → Show confirmation dialog (optional):
  - "Bạn có chắc muốn đăng xuất?"
  - [Hủy] [Đăng xuất]
- [ ] **AC3**: Alternative: Direct logout without confirmation (faster UX)

### Logout Flow

- [ ] **AC4**: User clicks "Đăng xuất"
- [ ] **AC5**: Frontend calls POST `/api/auth/logout`
- [ ] **AC6**: Backend:
  - Mark refresh token as revoked (if using token blacklist)
  - Clear refresh token cookie
  - Log logout action
- [ ] **AC7**: Frontend:
  - Clear Zustand auth store (accessToken, user)
  - Clear any other auth-related storage (sessionStorage, localStorage)
  - Refresh token cookie cleared by server (Set-Cookie with Max-Age=0)
- [ ] **AC8**: Redirect to `/login`
- [ ] **AC9**: Show toast: "Đã đăng xuất thành công"

### Session Cleanup

- [ ] **AC10**: Access token removed from memory (Zustand store)
- [ ] **AC11**: Refresh token cookie removed (httpOnly, Set-Cookie)
- [ ] **AC12**: All protected routes inaccessible after logout
- [ ] **AC13**: Attempting to use old access token → 401 Unauthorized

### Security

- [ ] **AC14**: Refresh token revoked on server (cannot be reused)
- [ ] **AC15**: Access token blacklisted (optional, or rely on expiry)
- [ ] **AC16**: CSRF protection on logout endpoint (if needed)

### Audit Trail

- [ ] **AC17**: Log logout action:
  - userId, action: "logout", timestamp, ipAddress, userAgent

### Auto-Logout Scenarios

- [ ] **AC18**: Logout when access token expired AND refresh token invalid
- [ ] **AC19**: Logout when user changes password (invalidate all sessions)
- [ ] **AC20**: Logout when admin suspends user account

## Dữ liệu / Fields

### Logout Request

```typescript
interface LogoutRequest {
  // No body needed (auth via cookie/header)
}
```

### Logout Response

```typescript
interface LogoutResponse {
  success: true;
  message: string;
}
```

### Logout Log

```typescript
interface LogoutLog {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Normal logout

```
Given User "manager@cobi.vn" logged in
And Access token in Zustand store
And Refresh token in httpOnly cookie
And User on dashboard page

When User clicks avatar menu → "Đăng xuất"
And Clicks "Đăng xuất" in confirmation dialog

Then Frontend POST to "/api/auth/logout":
  • Headers: Authorization: Bearer {accessToken}
  • Cookie: refreshToken={xxx}
And Backend:
  • Extract userId from access token
  • Revoke refresh token (add to blacklist table)
  • Clear refresh token cookie: Set-Cookie: refreshToken=; Max-Age=0; HttpOnly
  • Create logout log: userId, timestamp, IP
And Backend responds:
  • success: true
  • message: "Logged out successfully"
And Frontend:
  • Clear Zustand: setAuth(null, null)
  • Clear sessionStorage/localStorage (if any auth data)
  • Redirect to "/login"
  • Show toast: "Đã đăng xuất thành công"
And User now on login page, cannot access dashboard
```

### Scenario 2: Logout without confirmation

```
Given User on any page
When User clicks "Đăng xuất" (no confirmation dialog)

Then Immediately execute logout flow:
  • POST /api/auth/logout
  • Clear auth state
  • Redirect to /login
And No delay, instant logout
```

### Scenario 3: Logout after token expiry

```
Given User's access token expired 1 hour ago
And Refresh token also expired
And User tries to access protected page

Then Auto-logout triggered:
  • Frontend detects no valid tokens
  • Clear auth state automatically
  • Redirect to /login
  • Show message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
And NO API call needed (tokens already invalid)
```

### Scenario 4: Logout from multiple devices

```
Given User logged in on 2 devices:
  • Device A: Desktop
  • Device B: Laptop
And User logs out from Device A

Then Device A:
  • Logout successful
  • Refresh token A revoked
And Device B:
  • Still logged in (different refresh token)
  • Can continue working
And Note: Single logout does NOT logout all devices (unless "Logout everywhere" feature)
```

### Scenario 5: Logout after password change

```
Given User changed password via forgot-password flow (F-04)
And Backend optionally invalidates ALL refresh tokens

Then All devices logged out automatically:
  • Refresh tokens revoked
  • Next API call → 401 Unauthorized
  • Auto-redirect to login
  • Message: "Mật khẩu đã thay đổi. Vui lòng đăng nhập lại."
```

### Scenario 6: Logout log created

```
Given User logs out
Then Backend creates log:
  • Table: logout_logs (or reuse login_logs)
  • Fields:
    - userId: "U001"
    - action: "logout"
    - ipAddress: "192.168.1.100"
    - userAgent: "Mozilla/5.0..."
    - timestamp: "2026-04-16 14:30:00"
And Log visible in admin audit trail
```

## UI/UX Design

### Navbar User Menu

```
┌──────────────────────────────────────────┐
│  Dashboard                    [👤 Admin ▼]│
├──────────────────────────────────────────┤
│                                          │
│  User Dropdown:                          │
│  ┌────────────────────────────┐         │
│  │ 👤 Admin                    │         │
│  │ admin@cobi.vn               │         │
│  ├────────────────────────────┤         │
│  │ ⚙️  Cài đặt tài khoản        │         │
│  │ 🚪 Đăng xuất                 │ ← Click │
│  └────────────────────────────┘         │
└──────────────────────────────────────────┘
```

### Logout Confirmation Dialog (Optional)

```
┌────────────────────────────────────┐
│  Xác nhận đăng xuất                │
├────────────────────────────────────┤
│  Bạn có chắc muốn đăng xuất?       │
│                                    │
│  [Hủy]          [Đăng xuất]        │
└────────────────────────────────────┘
```

### Success Toast

```
┌────────────────────────────────────┐
│  ✅ Đã đăng xuất thành công         │
└────────────────────────────────────┘
```

## API Endpoints

```typescript
// Logout
POST /api/auth/logout
Headers: {
  Authorization: Bearer {accessToken}
}
Cookie: refreshToken={xxx}

Response: {
  success: true;
  message: string;
}
Set-Cookie: refreshToken=; Max-Age=0; HttpOnly; Secure; SameSite=Strict
```

## Technical Notes

### Backend Implementation

```typescript
router.post('/api/auth/logout', async (req, res) => {
  try {
    // 1. Get user from access token
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.sub;
    } catch (err) {
      // Token invalid/expired, still allow logout
      // Clear cookie anyway
    }
    
    // 2. Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    // 3. Revoke refresh token (add to blacklist)
    if (refreshToken) {
      await db.revokedTokens.create({
        token: refreshToken,
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    }
    
    // 4. Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // 5. Log logout
    if (userId) {
      await db.logoutLogs.create({
        userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      });
    }
    
    // 6. Response
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    // Still return success (logout is forgiving)
    return res.json({
      success: true,
      message: 'Logged out'
    });
  }
});
```

### Frontend Implementation

```typescript
// Zustand store: src/stores/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  
  logout: async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${get().accessToken}`
        },
        credentials: 'include' // Include cookies
      });
    } catch (err) {
      console.error('Logout API error:', err);
      // Continue with client-side cleanup anyway
    }
    
    // Clear auth state
    set({ accessToken: null, user: null });
    
    // Clear storage
    sessionStorage.clear();
    localStorage.removeItem('rememberedEmail'); // Keep remembered email (optional)
    
    // Redirect
    window.location.href = '/login';
  }
}));
```

```typescript
// Component: User menu with logout
import { useAuthStore } from '@/stores/authStore';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleLogout = () => {
    // Option 1: With confirmation
    setShowConfirm(true);
    
    // Option 2: Direct logout (uncomment below)
    // logout();
  };
  
  return (
    <div className="user-menu">
      <button onClick={toggleMenu}>
        {user?.name} ▼
      </button>
      
      <div className="dropdown">
        <a href="/account">⚙️ Cài đặt tài khoản</a>
        <button onClick={handleLogout}>🚪 Đăng xuất</button>
      </div>
      
      {showConfirm && (
        <div className="modal">
          <h3>Xác nhận đăng xuất</h3>
          <p>Bạn có chắc muốn đăng xuất?</p>
          <button onClick={() => setShowConfirm(false)}>Hủy</button>
          <button onClick={() => { logout(); setShowConfirm(false); }}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
```

### Token Blacklist Table

```sql
CREATE TABLE revoked_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  revoked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Auto-cleanup expired tokens (cronjob)
DELETE FROM revoked_tokens WHERE expires_at < NOW();
```

### Middleware: Check Token Blacklist

```typescript
async function isTokenRevoked(token: string): Promise<boolean> {
  const revoked = await db.revokedTokens.findOne({ token });
  return !!revoked;
}

// In protected route middleware
if (await isTokenRevoked(refreshToken)) {
  return res.status(401).json({ error: 'Token revoked' });
}
```

## Dependencies

**Phụ thuộc vào:**
- F-01: Login (must be logged in to logout)

**Được sử dụng bởi:**
- F-06: Protected routes (redirect on logout)

## Out of Scope

**Phase 1 không làm:**
- "Logout everywhere" button (revoke all devices) → Phase 2
- Remember device (skip logout for 30 days) → Phase 2
- Idle timeout auto-logout → Phase 2

## Testing Checklist

- [ ] Logout clears access token from Zustand
- [ ] Logout clears refresh token cookie
- [ ] Redirect to /login works
- [ ] Success toast displays
- [ ] Logout log created
- [ ] Cannot access protected routes after logout
- [ ] Old access token returns 401
- [ ] Old refresh token revoked (blacklisted)
- [ ] Confirmation dialog works (if implemented)
- [ ] Logout works even if API fails (client-side cleanup)

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
