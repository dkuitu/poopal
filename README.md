# Poopal - AI-Powered Digestive Health Companion

An intelligent digestive health tracking platform that combines photo-based stool analysis, meal correlation, and AI-powered insights to help users understand and optimize their gut health. Built to showcase sophisticated full-stack development, computer vision integration, and empathetic UX design for health tech.

## Project Vision

Poopal transforms the taboo topic of digestive health into an approachable, data-driven wellness tool. Users track their bowel movements through photo analysis, log meals and symptoms, and receive personalized AI insights about patterns and triggers. The platform gamifies gut health optimization while maintaining medical-grade privacy and accuracy.

### The Problem We're Solving

- **40-45% of people** suffer from digestive issues (IBS, IBD, food intolerances)
- Existing tracking is manual, inconsistent, and embarrassing to discuss
- Identifying food triggers takes months of trial-and-error
- Doctor visits require patient recall (often inaccurate)
- No centralized platform correlates diet, lifestyle, and digestive outcomes

### Our Solution

- **AI Photo Analysis**: Upload stool photos → instant Bristol Scale classification
- **Multi-Modal Tracking**: Correlate meals, symptoms, mood, sleep, and medications
- **Pattern Recognition**: AI identifies triggers and predicts digestive responses
- **Exportable Reports**: Share comprehensive data with healthcare providers
- **Privacy-First**: Photos processed and deleted, only metadata stored
- **Gamification**: Make gut health tracking engaging and habit-forming

---

## Unique Value Proposition

### What Sets Poopal Apart

1. **AI-Powered Bristol Scale Analysis**
   - DeepSeek multimodal model analyzes stool photos
   - Automatic classification (Type 1-7) with confidence scores
   - Detailed analysis: consistency, color, size, abnormalities
   - Privacy: photos processed instantly and never stored

2. **Correlation Engine**
   - Cross-reference meals, stool, symptoms, medications, sleep
   - Machine learning identifies patterns: "Gluten → Type 6 in 4-6 hours"
   - Predictive insights: "Today's meals may cause discomfort tonight"
   - Personalized trigger identification

3. **Comprehensive Health Dashboard**
   - Calendar heatmap of gut health scores (0-100)
   - Interactive Bristol Scale trends over time
   - Meal-to-stool correlation graphs
   - Symptom frequency charts
   - Exportable PDF reports for doctors

4. **Gamification for Engagement**
   - Daily gut health score based on consistency, frequency, diet
   - Achievements: "7-Day Healthy Streak", "Identified 3 Triggers"
   - Social accountability groups (optional, anonymized)
   - Challenges: "Try eliminating dairy for 2 weeks"

5. **AI Health Coach**
   - Personalized dietary recommendations
   - Recipe suggestions using gut-friendly foods
   - Educational content about microbiome, fiber, hydration
   - Motivational messages and progress tracking

---

## Objective Goals

### 1. Core Functionality
- **CRUD Operations**: Users, Logs (stool/meal/symptom), Foods, Triggers, Groups, Achievements, Reports
- **RESTful API**: Fully compliant REST architecture with proper HTTP methods and status codes
- **Photo Upload/Processing**: Secure image handling with automatic deletion after analysis
- **Data Export**: PDF generation with charts for medical consultations

### 2. Authentication & Security
- JWT-based authentication with refresh token rotation
- Role-based access control (User, Premium User, Healthcare Provider, Admin)
- Password hashing with bcrypt (cost factor: 12)
- HIPAA-aware design principles:
  - Photos encrypted in transit and at rest
  - Processed and deleted within 60 seconds
  - No third-party image storage
  - Audit logs for sensitive data access
- Rate limiting on API endpoints
- Input validation and sanitization

### 3. Database Design (Sophisticated Schema)
- **Complexity**: 9+ tables with complex relationships
- **Tables**:
  - Users (auth, profile, preferences)
  - StoolLogs (Bristol type, color, notes, metadata, timestamp)
  - MealLogs (description, photo_url, ingredients, timestamp)
  - SymptomLogs (type, severity, timestamp)
  - LifestyleLogs (sleep_hours, exercise_minutes, stress_level, medications)
  - Foods (name, category, common_triggers)
  - Triggers (user_id, food_id, confidence_score, identified_at)
  - Patterns (user_id, pattern_type, description, frequency)
  - Groups (name, description, privacy_level)
  - GroupMembers (many-to-many)
  - Achievements (title, description, icon, criteria)
  - UserAchievements (many-to-many with unlock timestamp)
  - Reports (generated PDFs for doctor visits)
- **Features**:
  - Composite indexes for time-series queries
  - Soft deletes for audit trail
  - Database migrations with version control
  - Optimized for analytics queries

### 4. Frontend Excellence (Portfolio-Quality UI/UX)
- **Design Patterns**:
  - Component-based architecture (atomic design)
  - Custom hooks for reusable logic
  - Context API + useReducer for state management
  - Responsive design (mobile-first, PWA-ready)
  - Dark/light/auto theme support
  - WCAG 2.1 AA accessibility compliance
- **UX Features**:
  - Photo upload with crop/preview
  - Instant feedback on uploads
  - Loading skeletons for async operations
  - Toast notifications for success/errors
  - Smooth page transitions (Framer Motion)
  - Optimistic UI updates
  - Interactive charts (zoom, filter, export)
  - Calendar heatmap visualization
  - Privacy controls (blur photos by default)
- **Sophisticated Interactions**:
  - Drag-and-drop photo upload
  - Swipe gestures on mobile
  - Keyboard shortcuts for power users
  - Multi-select for bulk operations
  - Infinite scroll with virtualization

### 5. AI Integration (DeepSeek API)
- **Computer Vision Use Cases**:
  - Bristol Stool Scale classification (1-7)
  - Color analysis (brown, green, black, red flags)
  - Consistency assessment (hard, soft, liquid)
  - Abnormality detection (blood, mucus, undigested food)
  - Confidence scoring for medical disclaimers
- **Natural Language Processing**:
  - Daily personalized health insights
  - Pattern summaries: "You tend to have Type 6 after dairy"
  - Recipe generation based on gut-friendly foods
  - Motivational messages
  - Report generation for doctors (plain language summaries)
- **Prompt Engineering**:
  - System prompts for medical accuracy
  - Few-shot learning for Bristol Scale
  - Temperature tuning for consistent classifications
  - Retry logic with exponential backoff

### 6. Testing Coverage
- **Unit Tests**: 80%+ coverage
  - Business logic (pattern detection, scoring algorithms)
  - Utility functions (date helpers, calculators)
  - React components (Testing Library)
- **Integration Tests**:
  - API endpoints (Supertest)
  - Database operations (test DB with migrations)
  - AI service integration (mocked responses)
- **E2E Tests** (Critical Flows):
  - User registration → onboarding → first stool log
  - Photo upload → AI analysis → results display
  - Meal log → correlation detection → insight generation
  - Report generation → PDF download
- **Test Types**:
  - Backend: Jest + Supertest
  - Frontend: Vitest + React Testing Library
  - E2E: Playwright with visual regression
  - Performance: Lighthouse CI (score >90)

---

## Technical Architecture

### Proposed Tech Stack

**Backend**
- **Runtime**: Node.js 20+ with Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT with bcrypt, Passport.js
- **Validation**: Zod for runtime type safety
- **File Upload**: Multer with size/type restrictions
- **PDF Generation**: Puppeteer or PDFKit
- **Caching**: Redis for AI response caching
- **Testing**: Jest + Supertest
- **Logging**: Winston with structured JSON logs

**Frontend**
- **Framework**: React 18+ with Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3+ with custom design system
- **Animation**: Framer Motion for smooth transitions
- **State**: React Context + useReducer (or Zustand if needed)
- **HTTP**: Axios with interceptors for auth/errors
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics
- **Calendar**: Custom heatmap component
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React

**AI Integration**
- DeepSeek API for multimodal analysis
- Custom prompt templates for medical accuracy
- Response caching in Redis (24-hour TTL)
- Fallback mechanisms for API failures

**DevOps & Deployment**
- Docker + Docker Compose for local development
- Environment-based configuration (.env files)
- GitHub Actions for CI/CD
- Nginx for reverse proxy
- PostgreSQL container with volume persistence
- Redis container for caching

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Log View │  │ Insights │  │ Profile  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
                      ▼ HTTPS (JWT in headers)
        ┌─────────────────────────────────────┐
        │         API Gateway (Express)        │
        │    ┌──────────────────────────┐     │
        │    │ Auth Middleware (JWT)     │     │
        │    └──────────────────────────┘     │
        │    ┌──────────────────────────┐     │
        │    │ Rate Limiting Middleware  │     │
        │    └──────────────────────────┘     │
        └─────────────┬───────────────────────┘
                      │
        ┌─────────────┼───────────────────────┐
        ▼             ▼                       ▼
┌───────────┐  ┌──────────────┐      ┌──────────────┐
│PostgreSQL │  │ DeepSeek API │      │    Redis     │
│ Database  │  │ (AI Analysis)│      │   (Cache)    │
└───────────┘  └──────────────┘      └──────────────┘
```

### Database Schema Overview

```sql
-- Core Users Table
Users
├── id (UUID, PK)
├── email (UNIQUE, NOT NULL)
├── username (UNIQUE)
├── password_hash (NOT NULL)
├── avatar_url
├── onboarding_completed (BOOLEAN)
├── theme_preference (enum: light/dark/auto)
├── created_at
├── updated_at
└── deleted_at (soft delete)

-- Stool Tracking
StoolLogs
├── id (UUID, PK)
├── user_id (FK → Users)
├── bristol_type (1-7, NOT NULL)
├── color (enum)
├── consistency (enum)
├── size (enum: small/medium/large)
├── urgency (1-5)
├── completeness (1-5)
├── blood_present (BOOLEAN)
├── mucus_present (BOOLEAN)
├── undigested_food (BOOLEAN)
├── notes (TEXT)
├── photo_analyzed (BOOLEAN)
├── ai_confidence_score (DECIMAL)
├── ai_analysis_notes (TEXT)
├── logged_at (TIMESTAMP, NOT NULL)
├── created_at
└── updated_at

-- Meal Tracking
MealLogs
├── id (UUID, PK)
├── user_id (FK → Users)
├── meal_type (enum: breakfast/lunch/dinner/snack)
├── description (TEXT)
├── photo_url (TEXT, temporary CDN link)
├── ingredients (JSON array)
├── estimated_fiber_g (DECIMAL)
├── estimated_water_ml (DECIMAL)
├── logged_at (TIMESTAMP, NOT NULL)
├── created_at
└── updated_at

-- Symptom Tracking
SymptomLogs
├── id (UUID, PK)
├── user_id (FK → Users)
├── symptom_type (enum: bloating/cramps/gas/nausea/pain/other)
├── severity (1-10)
├── duration_minutes (INTEGER)
├── notes (TEXT)
├── logged_at (TIMESTAMP, NOT NULL)
└── created_at

-- Lifestyle Factors
LifestyleLogs
├── id (UUID, PK)
├── user_id (FK → Users)
├── date (DATE, NOT NULL)
├── sleep_hours (DECIMAL)
├── sleep_quality (1-5)
├── exercise_minutes (INTEGER)
├── exercise_type (TEXT)
├── stress_level (1-5)
├── water_intake_ml (INTEGER)
├── medications (JSON array)
└── created_at

-- Food Database
Foods
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── category (enum: dairy/gluten/meat/vegetable/fruit/etc)
├── common_allergen (BOOLEAN)
├── fiber_content (enum: high/medium/low)
├── is_probiotic (BOOLEAN)
├── is_fermented (BOOLEAN)
└── created_at

-- Identified Triggers
Triggers
├── id (UUID, PK)
├── user_id (FK → Users)
├── food_id (FK → Foods)
├── trigger_type (enum: causes_diarrhea/causes_constipation/causes_bloating)
├── confidence_score (0-100)
├── occurrences (INTEGER)
├── last_detected_at (TIMESTAMP)
├── identified_at (TIMESTAMP)
└── user_confirmed (BOOLEAN)

-- AI-Detected Patterns
Patterns
├── id (UUID, PK)
├── user_id (FK → Users)
├── pattern_type (enum: temporal/dietary/lifestyle/correlation)
├── description (TEXT)
├── example_dates (JSON array)
├── confidence_score (0-100)
├── detected_at (TIMESTAMP)
└── user_acknowledged (BOOLEAN)

-- Social Accountability
Groups
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── description (TEXT)
├── privacy_level (enum: private/invite_only/public)
├── created_by (FK → Users)
├── created_at
└── updated_at

GroupMembers (Many-to-Many)
├── group_id (FK → Groups)
├── user_id (FK → Users)
├── role (enum: admin/member)
├── joined_at
└── PRIMARY KEY (group_id, user_id)

-- Gamification
Achievements
├── id (UUID, PK)
├── title (TEXT, NOT NULL)
├── description (TEXT)
├── icon (TEXT)
├── category (enum: consistency/logging/health/social)
├── requirement_type (enum: streak/count/trigger_identification)
├── requirement_value (INTEGER)
└── created_at

UserAchievements (Many-to-Many)
├── user_id (FK → Users)
├── achievement_id (FK → Achievements)
├── unlocked_at (TIMESTAMP)
└── PRIMARY KEY (user_id, achievement_id)

-- Reports for Doctors
Reports
├── id (UUID, PK)
├── user_id (FK → Users)
├── title (TEXT)
├── date_range_start (DATE)
├── date_range_end (DATE)
├── pdf_url (TEXT, temporary)
├── generated_at (TIMESTAMP)
└── expires_at (TIMESTAMP)

-- Indexes for Performance
CREATE INDEX idx_stool_logs_user_date ON StoolLogs(user_id, logged_at DESC);
CREATE INDEX idx_meal_logs_user_date ON MealLogs(user_id, logged_at DESC);
CREATE INDEX idx_symptom_logs_user_date ON SymptomLogs(user_id, logged_at DESC);
CREATE INDEX idx_triggers_user ON Triggers(user_id, confidence_score DESC);
CREATE INDEX idx_patterns_user ON Patterns(user_id, detected_at DESC);
```

### API Endpoint Structure

```
Authentication
POST   /api/auth/register            # Create account
POST   /api/auth/login               # Get JWT tokens
POST   /api/auth/refresh             # Refresh access token
POST   /api/auth/logout              # Invalidate refresh token
POST   /api/auth/forgot-password     # Request password reset
POST   /api/auth/reset-password      # Complete password reset

Users
GET    /api/users/me                 # Get current user profile
PUT    /api/users/me                 # Update profile
DELETE /api/users/me                 # Soft delete account
GET    /api/users/me/stats           # Overall health stats
PATCH  /api/users/me/preferences     # Update theme, notifications

Stool Logs
GET    /api/stool-logs               # List with pagination/filters
POST   /api/stool-logs               # Create manual entry
POST   /api/stool-logs/analyze       # Upload photo for AI analysis
GET    /api/stool-logs/:id           # Get single log
PUT    /api/stool-logs/:id           # Update log
DELETE /api/stool-logs/:id           # Delete log
GET    /api/stool-logs/stats         # Bristol type distribution, trends

Meal Logs
GET    /api/meal-logs                # List with pagination/filters
POST   /api/meal-logs                # Create entry (with photo upload)
GET    /api/meal-logs/:id            # Get single log
PUT    /api/meal-logs/:id            # Update log
DELETE /api/meal-logs/:id            # Delete log

Symptom Logs
GET    /api/symptom-logs             # List with pagination/filters
POST   /api/symptom-logs             # Create entry
GET    /api/symptom-logs/:id         # Get single log
PUT    /api/symptom-logs/:id         # Update log
DELETE /api/symptom-logs/:id         # Delete log

Lifestyle Logs
GET    /api/lifestyle-logs           # List with pagination (by date)
POST   /api/lifestyle-logs           # Create/update daily entry
GET    /api/lifestyle-logs/:date     # Get specific date
PUT    /api/lifestyle-logs/:date     # Update specific date

Foods
GET    /api/foods                    # Search food database
GET    /api/foods/:id                # Get food details
POST   /api/foods                    # Add custom food (user-specific)

Triggers
GET    /api/triggers                 # Get user's identified triggers
POST   /api/triggers/:id/confirm     # User confirms AI-detected trigger
DELETE /api/triggers/:id             # Remove false positive

Patterns
GET    /api/patterns                 # Get AI-detected patterns
POST   /api/patterns/:id/acknowledge # Mark pattern as seen
DELETE /api/patterns/:id             # Dismiss pattern

Insights (AI-Powered)
GET    /api/insights/daily           # Daily personalized message
GET    /api/insights/correlations    # Meal → stool correlations
GET    /api/insights/recommendations # Diet/lifestyle suggestions
POST   /api/insights/predict         # Predict digestive response

Groups
GET    /api/groups                   # List user's groups
POST   /api/groups                   # Create accountability group
GET    /api/groups/:id               # Get group details
PUT    /api/groups/:id               # Update group (admin only)
DELETE /api/groups/:id               # Delete group (admin only)
POST   /api/groups/:id/members       # Add member (invite)
DELETE /api/groups/:id/members/:userId # Remove member
GET    /api/groups/:id/activity      # Anonymized group stats

Achievements
GET    /api/achievements             # List all achievements
GET    /api/achievements/unlocked    # User's unlocked achievements
GET    /api/achievements/progress    # Progress toward locked achievements

Reports
POST   /api/reports/generate         # Generate PDF report
GET    /api/reports                  # List user's reports
GET    /api/reports/:id/download     # Download PDF
DELETE /api/reports/:id              # Delete report

Health
GET    /api/health                   # API health check
GET    /api/health/db                # Database connectivity
```

---

## Implementation Roadmap

### Phase 1: Foundation & Database (Days 1-2)
- [ ] Initialize monorepo structure (backend + frontend)
- [ ] Configure TypeScript, ESLint, Prettier for both
- [ ] Set up Docker Compose (PostgreSQL, Redis, backend, frontend)
- [ ] Design comprehensive database schema
- [ ] Implement Prisma schema with all tables
- [ ] Create initial migrations
- [ ] Set up environment configuration (.env templates)
- [ ] Configure CORS, security headers, rate limiting

### Phase 2: Backend Core (Days 3-5)
- [ ] Implement authentication system (register, login, JWT, refresh)
- [ ] Build user management endpoints
- [ ] Create CRUD endpoints for StoolLogs
- [ ] Create CRUD endpoints for MealLogs
- [ ] Create CRUD endpoints for SymptomLogs
- [ ] Create CRUD endpoints for LifestyleLogs
- [ ] Implement request validation with Zod
- [ ] Add comprehensive error handling
- [ ] Set up Winston logging
- [ ] Write backend unit tests (Jest)

### Phase 3: AI Integration (Days 6-7)
- [ ] Set up DeepSeek API client with error handling
- [ ] Implement photo upload endpoint (Multer)
- [ ] Create Bristol Scale classification prompt
- [ ] Build AI analysis service with caching (Redis)
- [ ] Implement pattern detection algorithm
- [ ] Build correlation engine (meal → stool timing)
- [ ] Create trigger identification logic
- [ ] Build insights generation endpoints
- [ ] Add predictive analysis endpoint
- [ ] Test AI features with sample data
- [ ] Write integration tests for AI service

### Phase 4: Backend Advanced (Day 8)
- [ ] Implement groups and social features
- [ ] Build achievements system with unlock logic
- [ ] Create PDF report generation (Puppeteer/PDFKit)
- [ ] Add analytics endpoints (stats, trends)
- [ ] Implement data export functionality
- [ ] Write integration tests for API (Supertest)

### Phase 5: Frontend Foundation (Days 9-10)
- [ ] Set up React + Vite + TypeScript
- [ ] Create design system (Tailwind config)
  - Color palette (primary, secondary, success, warning, error)
  - Typography scale
  - Spacing system
  - Shadow/elevation utilities
- [ ] Build component library:
  - Button, Input, Select, Textarea
  - Card, Modal, Toast
  - Loading states (spinner, skeleton)
  - Error boundary
- [ ] Implement authentication flow (login, register)
- [ ] Create protected route wrapper
- [ ] Build main layout with navigation
- [ ] Implement theme toggle (dark/light)

### Phase 6: Frontend Core Features (Days 11-13)
- [ ] Build Dashboard page:
  - Daily gut health score widget
  - Quick log buttons (stool, meal, symptom)
  - Recent activity timeline
  - Today's insights card
- [ ] Create Stool Log interface:
  - Photo upload with preview/crop
  - Manual Bristol Scale selector
  - Quick notes input
  - AI analysis results display
  - Bristol Scale educational modal
- [ ] Build Meal Log interface:
  - Photo upload
  - Meal type selector (breakfast/lunch/dinner/snack)
  - Ingredients autocomplete
  - Time picker
- [ ] Create Symptom Log interface:
  - Symptom type multi-select
  - Severity slider (1-10)
  - Duration input
  - Notes textarea
- [ ] Build Calendar view:
  - Heatmap visualization (gut health score)
  - Day detail modal
  - Date range filters

### Phase 7: Frontend Advanced Features (Days 14-16)
- [ ] Build Insights page:
  - Daily AI-generated message
  - Detected patterns cards
  - Correlation graphs (Recharts)
  - Identified triggers list
  - Dietary recommendations
- [ ] Create Analytics/Trends page:
  - Bristol type distribution chart (pie/bar)
  - Frequency over time (line chart)
  - Meal timing vs. stool timing correlation
  - Symptom frequency heatmap
  - Export data button
- [ ] Build Profile page:
  - User info editing
  - Avatar upload
  - Preferences (theme, notifications)
  - Privacy settings
  - Account deletion
- [ ] Implement Groups feature:
  - Group list/create/join
  - Group dashboard (anonymized stats)
  - Invite members
- [ ] Create Achievements showcase:
  - Unlocked achievements grid
  - Progress bars for locked achievements
  - Achievement detail modal
- [ ] Build Reports interface:
  - Date range selector
  - Report preview
  - Generate PDF button
  - Download past reports

### Phase 8: Polish & UX (Days 17-18)
- [ ] Add loading states to all async operations
- [ ] Implement toast notifications (success/error/info)
- [ ] Add smooth page transitions (Framer Motion)
- [ ] Create onboarding flow for new users
- [ ] Add empty states with helpful CTAs
- [ ] Implement form validation with error messages
- [ ] Add confirmation dialogs for destructive actions
- [ ] Create keyboard shortcuts
- [ ] Add swipe gestures on mobile (stool log navigation)
- [ ] Implement infinite scroll for logs
- [ ] Optimize images (lazy loading, WebP)
- [ ] Add accessibility features (ARIA labels, focus management)

### Phase 9: Testing (Days 19-20)
- [ ] Write frontend unit tests (Vitest):
  - Utility functions
  - Custom hooks
  - Component logic
- [ ] Write frontend integration tests:
  - React Testing Library for components
  - Form submissions
  - API interaction (mocked)
- [ ] Write E2E tests (Playwright):
  - Registration → onboarding → first log
  - Photo upload → AI analysis → results
  - Meal log → correlation detection
  - Report generation → download
- [ ] Run Lighthouse audits (target: 90+ score)
- [ ] Test responsiveness (mobile, tablet, desktop)
- [ ] Accessibility audit with axe-core
- [ ] Security testing (OWASP checklist)

### Phase 10: Deployment & Documentation (Days 21-22)
- [ ] Create production Docker images
- [ ] Set up environment variables for production
- [ ] Configure database with SSL
- [ ] Set up Redis in production
- [ ] Deploy backend API (Render/Railway/DigitalOcean)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure CDN for assets
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Write inline code comments
- [ ] Update README with setup instructions
- [ ] Create architecture diagrams
- [ ] Record demo video

---

## Success Criteria

### Functional Requirements ✓
- [ ] Users can register, login, and manage sessions securely
- [ ] Users can upload stool photos and receive AI Bristol Scale classification
- [ ] Users can manually log stool, meals, symptoms, lifestyle data
- [ ] AI detects patterns and correlations across data types
- [ ] AI identifies likely food triggers with confidence scores
- [ ] Users receive daily personalized insights and recommendations
- [ ] Users can view comprehensive analytics (charts, trends, heatmaps)
- [ ] Users can generate and download PDF reports for doctors
- [ ] Achievements unlock based on user activity
- [ ] Groups enable social accountability (optional)
- [ ] All CRUD operations work correctly across entities
- [ ] Data export works (CSV, JSON, PDF)

### Quality Benchmarks
- **Code Quality**:
  - TypeScript strict mode, no `any` types
  - ESLint/Prettier enforced
  - Consistent naming conventions
  - Comprehensive JSDoc comments
- **Test Coverage**:
  - Backend: >85% line coverage
  - Frontend: >75% line coverage
  - All critical paths covered by E2E tests
- **Performance**:
  - Initial load: <3 seconds (3G network)
  - API response: <200ms (p95)
  - Time to Interactive: <5 seconds
  - Lighthouse Performance: >90
- **Accessibility**:
  - WCAG 2.1 AA compliance
  - Keyboard navigation fully functional
  - Screen reader tested (VoiceOver/NVDA)
  - Color contrast ratios >4.5:1
- **Security**:
  - No critical/high vulnerabilities (npm audit)
  - OWASP Top 10 addressed
  - HIPAA-aware practices (data encryption, audit logs)
  - Rate limiting prevents abuse
- **UX**:
  - Intuitive navigation (user testing with 5+ people)
  - Responsive on mobile/tablet/desktop
  - Error messages helpful and actionable
  - Loading states clear and non-blocking

### Portfolio Quality Showcases
- **Backend**:
  - Clean architecture (controllers → services → repositories)
  - Advanced TypeScript patterns (generics, utility types)
  - Comprehensive error handling with custom error classes
  - Efficient database queries (proper indexing, N+1 prevention)
  - Caching strategy (Redis for AI responses)
- **Frontend**:
  - Atomic design component structure
  - Custom hooks for complex logic (useStoolLog, useCorrelations)
  - Advanced state management patterns
  - Compound components for complex UI (Calendar, Charts)
  - Smooth animations (Framer Motion)
  - Progressive enhancement (works without JS for critical flows)
- **AI Integration**:
  - Multimodal prompt engineering (vision + text)
  - Confidence scoring and uncertainty handling
  - Graceful degradation when API fails
  - Response caching for cost optimization
- **DevOps**:
  - Docker Compose for reproducible local development
  - CI/CD pipeline with automated testing
  - Environment-based configuration
  - Structured logging for observability

---

## Development Setup

### Prerequisites
- Node.js 20+ and npm/yarn/pnpm
- Docker and Docker Compose
- Git
- DeepSeek API key (for AI features)
- (Optional) PostgreSQL 15+ and Redis 7+ if not using Docker

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd poopal
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**

**Backend `.env`**:
```env
# Database
DATABASE_URL="postgresql://poopal_user:poopal_pass@localhost:5432/poopal_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# AI
DEEPSEEK_API_KEY="sk-42c27769f29c47f488b22092ad48514c"
DEEPSEEK_API_URL="https://api.deepseek.com/v1"
AI_CACHE_TTL_SECONDS=86400

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_IMAGE_TYPES="image/jpeg,image/png,image/webp"

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

**Frontend `.env`**:
```env
VITE_API_URL="http://localhost:3000/api"
VITE_APP_NAME="Poopal"
VITE_MAX_PHOTO_SIZE_MB=10
```

4. **Start services with Docker Compose**
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run database migrations
cd backend
npx prisma migrate dev
npx prisma db seed  # Optional: seed with sample data and achievements
```

5. **Run the application**

**Backend** (Terminal 1):
```bash
cd backend
npm run dev  # Starts on http://localhost:3000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev  # Starts on http://localhost:5173
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- API Health: http://localhost:3000/api/health

### Running Tests

```bash
# Backend tests
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report

# Frontend tests
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report

# E2E tests (requires apps running)
npm run test:e2e         # Headless mode
npm run test:e2e:ui      # Interactive mode
```

### Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio  # Opens on http://localhost:5555
```

### Linting and Formatting

```bash
# Backend
cd backend
npm run lint       # Check for linting errors
npm run lint:fix   # Auto-fix linting errors
npm run format     # Format with Prettier

# Frontend
cd frontend
npm run lint
npm run lint:fix
npm run format
```

---

## Project Structure

```
poopal/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── stool-log.controller.ts
│   │   │   ├── meal-log.controller.ts
│   │   │   ├── insights.controller.ts
│   │   │   └── ...
│   │   ├── routes/             # Express route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── stool-log.routes.ts
│   │   │   └── index.ts
│   │   ├── services/           # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── pattern-detection.service.ts
│   │   │   ├── correlation.service.ts
│   │   │   └── report.service.ts
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── utils/              # Helper functions
│   │   │   ├── logger.ts
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── date-helpers.ts
│   │   ├── types/              # TypeScript types/interfaces
│   │   │   ├── express.d.ts
│   │   │   ├── ai-response.types.ts
│   │   │   └── ...
│   │   ├── config/             # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── constants.ts
│   │   └── server.ts           # App entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Sample data seeder
│   │   └── migrations/         # Version-controlled migrations
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── uploads/                # Temporary file storage (gitignored)
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/             # Base components (Button, Input, etc.)
│   │   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   │   ├── stool/          # Stool-specific components
│   │   │   ├── meal/           # Meal-specific components
│   │   │   ├── charts/         # Chart components
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StoolLog.tsx
│   │   │   ├── Insights.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useStoolLog.ts
│   │   │   ├── useCorrelations.ts
│   │   │   └── ...
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── services/           # API client services
│   │   │   ├── api.ts          # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── stool-log.service.ts
│   │   │   └── ...
│   │   ├── utils/              # Helper functions
│   │   │   ├── date-format.ts
│   │   │   ├── validation.ts
│   │   │   └── bristol-helpers.ts
│   │   ├── types/              # TypeScript types
│   │   │   ├── api.types.ts
│   │   │   ├── stool-log.types.ts
│   │   │   └── ...
│   │   ├── styles/             # Global styles
│   │   │   └── index.css
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── bristol-chart.svg   # Educational resources
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml          # Local development setup
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous integration
│       └── deploy.yml          # Deployment pipeline
├── docs/
│   ├── api.md                  # API documentation
│   ├── architecture.md         # System architecture
│   └── deployment.md           # Deployment guide
├── .gitignore
├── LICENSE
└── README.md
```

---

## Medical Disclaimer

**Poopal is a wellness tracking tool and NOT a medical device or diagnostic tool.**

- This app is for informational and educational purposes only
- AI analysis is not a substitute for professional medical advice
- Always consult a healthcare provider for medical concerns
- Do not use this app to diagnose or treat medical conditions
- If you see blood, black stools, or severe symptoms, seek immediate medical attention
- The Bristol Stool Scale is a clinical tool; app results may vary in accuracy

By using Poopal, you acknowledge these limitations and agree to use the app responsibly.

---

## Privacy & Data Security

### Data We Collect
- Account info (email, username, password hash)
- Health data (stool logs, meal logs, symptom logs, lifestyle data)
- Photos (processed immediately, never stored)
- Usage analytics (anonymized)

### How We Protect Your Data
- **Encryption**: All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Photo Handling**:
  - Photos uploaded over HTTPS
  - Processed by AI within 60 seconds
  - Automatically deleted after processing
  - Only metadata (Bristol type, color, etc.) stored
  - No third-party image storage or CDN
- **Access Control**: JWT-based authentication, role-based permissions
- **Audit Logs**: All sensitive data access logged
- **Compliance**: HIPAA-aware design (not HIPAA certified)

### Your Rights
- Export all data (CSV, JSON, PDF)
- Delete account and all associated data
- Opt out of anonymized analytics
- Control photo blur settings

For full privacy policy, see [PRIVACY.md](./PRIVACY.md).

---

## API Key Security Notice

**WARNING**: The DeepSeek API key shown in this README is a placeholder example.

**In production**:
- ✅ Store in environment variables
- ✅ Never commit to version control (use `.env.example` templates)
- ✅ Rotate keys regularly (monthly)
- ✅ Use secret management services (AWS Secrets Manager, HashiCorp Vault)
- ✅ Monitor usage for anomalies
- ✅ Implement rate limiting per API key
- ❌ Never hardcode in source code
- ❌ Never expose in client-side code

---

## Contributing

This is a portfolio/demonstration project, but contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Run linting and tests
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow existing TypeScript/React patterns
- Write tests for new features
- Update documentation
- Follow commit message conventions (Conventional Commits)

---

## Roadmap (Future Enhancements)

### V2 Features
- [ ] Mobile apps (React Native)
- [ ] Wearable integration (Apple Health, Google Fit)
- [ ] Microbiome test integration (uBiome, Thorne)
- [ ] Telemedicine integration (share reports with doctors)
- [ ] Advanced AI: predictive models for flare-ups
- [ ] Community forums (moderated, anonymized)
- [ ] Meal planning based on gut-friendly foods
- [ ] Grocery shopping list generator
- [ ] Restaurant finder (filter by dietary restrictions)

### V3 Features
- [ ] Research participation (opt-in data donation)
- [ ] Clinical trial matching
- [ ] Integration with electronic health records (EHR)
- [ ] Multi-language support
- [ ] Voice logging ("Hey Poopal, log a Type 4 stool")

---

## Tech Debt & Known Issues

(To be populated during development)

---

## License

MIT License - See [LICENSE](./LICENSE) file for details

---

## Acknowledgments

- **Bristol Stool Chart**: Developed by Dr. Ken Heaton at the University of Bristol
- **Medical Advisors**: (To be added if consulting with healthcare professionals)
- **Open Source Libraries**: See `package.json` files for full list

---

## Support & Feedback

- **Issues**: https://github.com/yourusername/poopal/issues
- **Discussions**: https://github.com/yourusername/poopal/discussions
- **Email**: support@poopal.app (placeholder)

---

**Built with care to help people take control of their digestive health.**

*Poopal: Your gut's best friend.* 💩✨
