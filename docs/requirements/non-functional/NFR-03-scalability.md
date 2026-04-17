# NFR-03 – Scalability

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | NFR-03 |
| Loại | Non-Functional Requirement |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Độ ưu tiên | Should have |

## Mô tả

Đảm bảo hệ thống có khả năng mở rộng khi Cobi tăng trưởng: thêm tòa nhà mới, tăng số lượng khách hàng, và xử lý concurrent bookings.

## Yêu cầu khả năng mở rộng

### 1. Data Scalability
**Hiện tại (Phase 1)**:
- 2 tòa nhà Cobi
- Ước tính ~100-200 customers
- ~500 bookings/tháng
- Single database instance

**Mục tiêu mở rộng (Phase 2-3)**:
- Lên đến 5 tòa nhà
- ~1,000+ customers
- ~5,000 bookings/tháng
- Database có thể scale horizontal (read replicas)

**Architecture Decision**:
- **Single-tenant với building_id filter** (Phase 1-3)
  - Tất cả data trong 1 database
  - Filter theo `building_id` để tách dữ liệu 2 tòa nhà
  - Pros: Đơn giản, dễ maintain, đủ cho 2-5 tòa nhà
  - Cons: Không scale nếu lên 50+ tòa nhà

- **Multi-tenancy** (Future - chỉ khi cần):
  - Chỉ xem xét nếu Cobi muốn cho thuê hệ thống cho công ty khác
  - Hoặc khi scale lên 10+ tòa nhà

### 2. Performance Targets

#### Response Time
- **Page load**: < 2 giây (first contentful paint)
- **API calls**: < 500ms cho 95% requests
- **Search**: < 1 giây cho search queries
- **Dashboard refresh**: < 3 giây

#### Concurrent Users
- **Phase 1**: Support 20 concurrent users (6 staff + 14 customers/visitors)
- **Phase 2**: Support 50 concurrent users
- **Phase 3**: Support 100 concurrent users (khi có customer portal)

#### Database
- **Query performance**: < 100ms for 95% of queries
- **Indexing strategy**: Index on `building_id`, `customer_id`, `booking_date`, `status`
- **Connection pooling**: Max 20 connections Phase 1, scale đến 50 Phase 2-3

### 3. Booking Concurrency
**Problem**: 2 users book cùng 1 chỗ cùng lúc → conflict

**Solution**:
- **Phase 1**: Optimistic locking với `version` field
  - Khi save booking, check version còn match không
  - Nếu conflict → show error "This space has just been booked, please try another time slot"
  
- **Phase 2-3** (nếu conflicts xảy ra nhiều):
  - WebSocket real-time updates: User A book → User B instantly see chỗ đó unavailable
  - Pessimistic locking: Lock space khi user đang fill booking form (auto-release sau 5 phút)

### 4. Infrastructure Scalability

#### Deployment Architecture
**Phase 1 (MVP)**:
- Single server (VPS hoặc cloud instance)
- Frontend + Backend trên cùng 1 server
- Single PostgreSQL/MySQL database
- Nginx reverse proxy

**Phase 2** (khi traffic tăng):
- Separate frontend (static hosting: Vercel/Netlify)
- Separate backend API server
- Database read replicas cho reporting queries
- CDN cho static assets

**Phase 3** (high availability):
- Load balancer cho backend API
- Database clustering (master-slave replication)
- Redis cache cho frequently-accessed data
- Horizontal scaling: Add more API servers nếu cần

### 5. Storage Scalability
- **File uploads** (contracts, images):
  - Phase 1: Local file storage (đủ cho vài GB)
  - Phase 2: Cloud storage (AWS S3, Google Cloud Storage) khi > 10GB
  
- **Database size estimation**:
  - Year 1: ~2GB (2 tòa nhà, 200 customers, 6,000 bookings/year)
  - Year 3: ~10GB (5 tòa nhà, 1,000 customers, 60,000 bookings)

### 6. Code Scalability
- **Modular architecture**: Mỗi Epic/module có thể develop độc lập
- **API versioning**: `/api/v1/` để support breaking changes trong future
- **Feature flags**: Enable/disable features per building (nếu cần A/B testing)
- **Microservices consideration**: Phase 1-3 dùng monolith, chỉ split thành microservices nếu > 10 buildings

## Acceptance Criteria

### Phase 1
- [ ] Hệ thống support 2 tòa nhà với building_id filter
- [ ] 20 concurrent users không ảnh hưởng performance
- [ ] Page load < 3 giây
- [ ] Database có indexes trên key fields

### Phase 2
- [ ] Có thể thêm tòa nhà thứ 3 chỉ bằng cách add data (không cần code changes)
- [ ] 50 concurrent users
- [ ] API response time < 500ms
- [ ] Read replicas cho reporting queries

### Phase 3
- [ ] Support 100+ concurrent users với customer portal
- [ ] Horizontal scaling ready (load balancer + multiple API instances)
- [ ] Cache layer (Redis) cho frequently-accessed data

## Testing Criteria

### Load Testing
- [ ] **Concurrent bookings**: 10 users book đồng thời → all processed correctly, no double-bookings
- [ ] **Dashboard load**: 20 managers refresh dashboard cùng lúc → all load < 3 giây
- [ ] **Database stress test**: 1,000 bookings trong database → queries vẫn < 100ms

### Scalability Tests
- [ ] Add building thứ 3 → tất cả features hoạt động bình thường với building mới
- [ ] 500 customers trong database → search vẫn < 1 giây
- [ ] 10,000 bookings → reports generate < 5 giây

## Bottlenecks & Mitigation

| Bottleneck | When | Mitigation |
|------------|------|------------|
| Database queries slow | > 5,000 bookings | Add indexes, query optimization, read replicas |
| Concurrent booking conflicts | > 50 concurrent users | WebSocket + pessimistic locking |
| File storage full | > 50GB files | Migrate to cloud storage (S3) |
| Single server overload | > 100 concurrent users | Load balancer + horizontal scaling |
| Memory leaks | Long-running processes | Regular server restarts, memory profiling |

## Dependencies
- EP-02: Property Management (cần support multi-building)
- EP-04: Booking & Reservation (concurrency handling)
- EP-11: Dashboards (caching for performance)

## Out of Scope (Phase 1-3)
- Auto-scaling infrastructure
- Global CDN distribution
- Geo-redundancy / disaster recovery
- Multi-region deployment
- Kubernetes orchestration

## Monitoring & Metrics
- **Phase 1**: Basic server monitoring (CPU, memory, disk)
- **Phase 2**: APM (Application Performance Monitoring) - track API response times
- **Phase 3**: Real-time alerts khi performance degrade

## Ghi chú
- Scalability cần balance với complexity - đừng over-engineer Phase 1
- Measure first, optimize later - chỉ scale khi thực sự cần
- Database indexing là low-hanging fruit - làm ngay từ Phase 1
