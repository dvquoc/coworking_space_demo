# NFR-05 – Internationalization (i18n)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | NFR-05 |
| Loại | Non-Functional Requirement |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Độ ưu tiên | Could have (Phase 3) |

## Mô tả

Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Hàn) cho giao diện người dùng, với Tiếng Việt là ngôn ngữ mặc định. Cho phép user chuyển đổi ngôn ngữ dễ dàng.

## Supported Languages

### Phase 3
1. **🇻🇳 Tiếng Việt** - Default, priority 100%
2. **🇬🇧 English** - For international customers
3. **🇰🇷 한국어 (Korean)** - For Korean customers/investors

### Future (if needed)
- 🇯🇵 Japanese
- 🇨🇳 Chinese (Simplified)

## Scope of Translation

### ✅ UI Translation (Labels, Buttons, Messages)
**To be translated**:
- Navigation menus
- Button labels ("Save", "Cancel", "Delete", etc.)
- Form field labels ("Name", "Email", "Phone", etc.)
- Error messages ("This field is required", "Invalid email format")
- Success messages ("Booking created successfully")
- Dashboard widget titles
- Table headers
- Tooltips & placeholders

**Examples**:
```json
{
  "common.save": {
    "vi": "Lưu",
    "en": "Save",
    "ko": "저장"
  },
  "dashboard.title": {
    "vi": "Trang chủ",
    "en": "Dashboard",
    "ko": "대시보드"
  },
  "booking.create": {
    "vi": "Tạo đặt chỗ",
    "en": "Create Booking",
    "ko": "예약 만들기"
  }
}
```

### ❌ Content Translation (User-generated data)
**NOT translated** (Phase 3):
- Property names (e.g., "Cobi Building 1")
- Customer names
- Service descriptions
- Contract terms
- Email templates (chỉ default language)
- Invoice items

**Rationale**: Content translation rất phức tạp và tốn kém. Phase 3 chỉ làm UI translation. Nếu cần content translation, xem xét Phase 4.

## Implementation Approach

### 1. i18n Library
**Recommendation**: **react-i18next**
- Popular, well-maintained
- 50KB bundle size
- Support lazy loading translations
- Context-aware translations
- Pluralization support

**Installation**:
```bash
npm install react-i18next i18next
```

### 2. Folder Structure
```
src/
├── locales/
│   ├── vi/
│   │   ├── common.json      # Shared labels
│   │   ├── dashboard.json
│   │   ├── booking.json
│   │   └── errors.json
│   ├── en/
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── ...
│   └── ko/
│       ├── common.json
│       └── ...
└── i18n.ts                  # i18n config
```

### 3. Language Switcher UI
**Location**: Top-right header (next to user avatar)

**UI Design**:
```
[ 🇻🇳 Tiếng Việt ▾ ]
    ├── 🇻🇳 Tiếng Việt
    ├── 🇬🇧 English
    └── 🇰🇷 한국어
```

**Behavior**:
- Click → dropdown menu với 3 options
- Select language → reload page với new language
- Language preference lưu trong localStorage: `coworking_preferred_locale`
- Persist across sessions

### 4. Default Language Detection
**Priority order**:
1. User's saved preference trong localStorage (nếu có)
2. Browser language (`navigator.language`)
3. Fallback: Tiếng Việt

**Examples**:
- Browser: `vi-VN` → Load Tiếng Việt
- Browser: `en-US` → Load English
- Browser: `ko-KR` → Load Korean
- Browser: `zh-CN` → Fallback to Tiếng Việt (not supported yet)

### 5. Date & Number Formatting
**Locale-aware formatting**:

| Data Type | Vietnamese | English | Korean |
|-----------|------------|---------|--------|
| Date | 16/04/2026 | 04/16/2026 | 2026-04-16 |
| Time | 14:30 | 2:30 PM | 오후 2:30 |
| Number | 1.234.567 | 1,234,567 | 1,234,567 |
| Currency | 50.000 đ | $50 | ₩50,000 |

**Implementation**: Use `Intl` API
```typescript
const formatter = new Intl.NumberFormat(locale);
const dateFormatter = new Intl.DateTimeFormat(locale);
```

### 6. Right-to-Left (RTL) Support
**Not needed** for Phase 3 (Vietnamese, English, Korean are all LTR)

If adding Arabic/Hebrew in future, need RTL support.

## Translation Workflow

### Phase 3 - Initial Setup
1. **Developer**: Implement i18n framework, add Vietnamese translations
2. **BA**: Create translation sheet cho 2 languages (English, Korean)
3. **Translator**: Translate từ Tiếng Việt → English, Korean
4. **QA**: Review translations, check context accuracy
5. **Developer**: Load translations vào app

### Ongoing Maintenance
- New features → add Vietnamese first
- BA export new strings → send to translator
- Translator return translations → dev load vào app
- Release note mention new languages supported

## Acceptance Criteria

### Phase 3
- [ ] i18n framework integrated (react-i18next)
- [ ] Language switcher in header
- [ ] 100% UI labels translated cho 3 languages (vi, en, ko)
- [ ] Date/number formatting theo locale
- [ ] Language preference persisted trong localStorage
- [ ] All pages support language switching (không cần reload)

### Not Required (Phase 3)
- [ ] Content translation (property names, email templates)
- [ ] Multi-language content editor
- [ ] RTL support
- [ ] Auto-translation (Google Translate API)

## Testing Criteria

### Functional Tests
- [ ] Switch to English → all UI labels change to English
- [ ] Switch to Korean → all labels Korean
- [ ] Reload page → language persisted from localStorage
- [ ] Clear localStorage → fallback to browser language
- [ ] Browser Vietnamese → default Tiếng Việt
- [ ] Browser English → default English

### Translation Quality
- [ ] No missing translations (không có keys như `dashboard.title` hiển thị)
- [ ] Context-appropriate translations (e.g., "Save" button vs "Save money")
- [ ] Pluralization works (1 booking vs 2 bookings)
- [ ] Date format follows locale standards

### Visual Tests
- [ ] Long Korean text không break layout
- [ ] English text không overflow containers
- [ ] Language switcher visible trên mobile

## Translation Coverage

### Phase 3 Estimate
- **~500-800 UI strings** cần translate
- **Breakdown**:
  - Common: ~100 strings (Save, Cancel, Edit, Delete, etc.)
  - Dashboard: ~80 strings
  - Property Management: ~60 strings
  - Booking: ~100 strings
  - Customer: ~70 strings
  - Payment: ~90 strings
  - etc.

### Translation Cost Estimate
- **Professional translation**: ~$0.10-0.15 per word
- **800 strings × 10 words avg = 8,000 words**
- **Cost**: ~$800-1,200 per language
- **Timeline**: 1-2 tuần cho translator

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor translations | Medium | Hire professional translator, not Google Translate |
| Missing translations | Medium | Fallback to Vietnamese for missing keys |
| Layout break with long text | Low | Test với all languages, use truncation if needed |
| Translation out of sync | Medium | Automated check cho missing keys khi deploy |

## Dependencies
- All Epics (UI everywhere needs translation)
- Phase 3 priority (không block Phase 1-2)

## Out of Scope (Phase 3)
- Content translation (emails, property descriptions, contract templates)
- Multi-language SEO
- Language-specific content (different images per language)
- Auto-translation services
- Crowdsourced translation platform

## Tools & Resources
- **Translation Management**: [Localazy](https://localazy.com/) hoặc Google Sheets cho simple approach
- **QA**: [i18n-checker](https://www.npmjs.com/package/i18n-checker) để detect missing keys
- **Testing**: Manual testing với native speakers

## Ghi chú
- i18n nên làm từ đầu (Phase 1 architecture support) nhưng chỉ load translations Phase 3
- Hardcode Vietnamese strings Phase 1-2 OK, refactor sang i18n Phase 3
- Consider professional translation services (Gengo, TransPerfect) instead of Google Translate
