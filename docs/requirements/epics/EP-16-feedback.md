# EP-16 – Feedback & Quality Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-16 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |
| Độ ưu tiên | Should have |

## Mô tả

Thu thập feedback từ customers: NPS surveys, service ratings, cleanliness ratings, issue reporting. Phân tích feedback để cải thiện service quality.

## Features thuộc Epic này

### Phase 2 Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-131 | Feedback surveys | Gửi surveys (NPS, satisfaction) | Draft |
| F-132 | Service ratings | Customers rate services/facilities | Draft |
| F-133 | Feedback dashboard | Visualize feedback trends | Draft |
| F-134 | Issue reporting | Customers báo issues (AC broken, dirty) | Draft |

## Data Models

### Feedback
```typescript
interface Feedback {
  id: string;
  customerId: string;
  
  // Survey Type
  type: 'nps' | 'satisfaction' | 'service_rating' | 'issue_report';
  
  // NPS
  npsScore?: number;            // 0-10
  
  // Satisfaction
  overallRating?: number;       // 1-5 stars
  cleanlinessRating?: number;
  facilitiesRating?: number;
  staffRating?: number;
  
  // Text Feedback
  comment?: string;
  
  // Issue Report
  issueCategory?: 'cleanliness' | 'facility_broken' | 'noise' | 'internet' | 'other';
  issueDescription?: string;
  issueSeverity?: 'low' | 'medium' | 'high';
  
  // Response
  status: 'pending' | 'acknowledged' | 'resolved';
  responseBy?: string;
  responseText?: string;
  resolvedAt?: Date;
  
  createdAt: Date;
}
```

### Survey
```typescript
interface Survey {
  id: string;
  title: string;
  type: 'nps' | 'satisfaction';
  questions: SurveyQuestion[];
  
  // Targeting
  targetAudience: 'all_customers' | 'active_customers' | 'specific_segment';
  
  // Schedule
  startDate: Date;
  endDate: Date;
  
  status: 'draft' | 'active' | 'completed';
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple_choice';
  options?: string[];           // For multiple choice
  required: boolean;
}
```

## User Stories

### US-131: Send NPS survey
> Là **Manager**, tôi muốn **gửi NPS survey** để **measure customer loyalty**

**Acceptance Criteria**:
- [ ] Create survey: "How likely are you to recommend Cobi? (0-10)"
- [ ] Send to all active customers
- [ ] Customers receive email with survey link
- [ ] Responses collected

### US-132: Customer rates service
> Là **Customer**, tôi muốn **rate services** để **provide feedback**

**Acceptance Criteria**:
- [ ] Check-out from space → Prompt to rate
- [ ] Rate: Cleanliness (1-5), Facilities (1-5), Staff (1-5)
- [ ] Optional comment
- [ ] Feedback saved

### US-133: View feedback dashboard
> Là **Manager**, tôi muốn **xem feedback trends** để **improve quality**

**Acceptance Criteria**:
- [ ] NPS score (current month): 45 (Promoters: 60%, Detractors: 15%)
- [ ] Average ratings: Cleanliness 4.2, Facilities 4.5
- [ ] Recent feedback list
- [ ] Filter by date, rating

### US-134: Customer reports issue
> Là **Customer**, tôi muốn **báo issue** để **được fix nhanh**

**Acceptance Criteria**:
- [ ] Form: category (cleanliness/facility/noise), description
- [ ] Upload photo
- [ ] Issue feedback created, status pending
- [ ] Manager notified
- [ ] Staff resolves → status resolved, notify customer

## Scenarios

### Scenario 1: NPS survey
```
Given Manager creates NPS survey
When Send to 100 customers
Then 100 emails sent với survey link
And 45 customers respond trong 1 tuần
Then NPS calculated:
  - Promoters (9-10): 30 customers (67%)
  - Passives (7-8): 10 customers (22%)
  - Detractors (0-6): 5 customers (11%)
  - NPS Score: 67% - 11% = 56
```

### Scenario 2: Customer reports AC broken
```
Given Customer in Room 205, AC not working
When Customer submits issue:
  - category: facility_broken
  - description: "AC unit not cooling"
  - severity: high
And Upload photo
Then Feedback created, status pending
And Manager receives notification
And Assign to Bảo trì staff
And Staff fixes → mark resolved
And Customer receives email: "Issue resolved. Thank you!"
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-08: Asset (link issues to assets)

## Out of Scope Phase 2
- Sentiment analysis (AI) → Phase 3
- Automated issue routing → Phase 3

## Technical Notes

### NPS Calculation
```typescript
function calculateNPS(responses: number[]): number {
  const promoters = responses.filter(r => r >= 9).length;
  const detractors = responses.filter(r => r <= 6).length;
  const total = responses.length;
  
  return ((promoters / total) - (detractors / total)) * 100;
}
```

## Ghi chú
- Phase 2 vì feedback là critical for quality improvement
- NPS benchmark: >50 là good, >70 là excellent
