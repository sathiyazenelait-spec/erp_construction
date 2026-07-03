# BuildCon ERP — Complete Project Pipeline Documentation
### Zenelait Infotech Private Limited | Enterprise Construction ERP Platform

> **Purpose**: This document describes every dashboard, every tab, every button, and every data flow in the ERP system. Intended for new users, developers, and administrators.

---

## 🏗️ System Architecture Overview

```
FRONTEND (Next.js 14)          BACKEND (Spring Boot)          DATABASE (MySQL)
─────────────────────          ─────────────────────          ────────────────
localhost:3000             ←→  localhost:8081 (REST API)  ←→  MySQL 8.x
                               localhost:8001 (Python AI)
```

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, TailwindCSS, Recharts |
| Backend | Spring Boot 3, Java 17, Spring Security, JWT Auth |
| AI Server | Python FastAPI, Uvicorn (port 8001) |
| Database | MySQL 8.x — all data 100% dynamic |
| Auth | JWT Bearer Token + Role-Based Access Control (RBAC) |

---

## 🌐 LANDING PAGE — `/ (Home)`

### Purpose
Central entry point for the entire ERP system. Authenticates organizational access before showing any portal.

### Sections & Functions

#### 1. Navbar
| Element | Action |
|---|---|
| `Zenelait Infotech` logo | Displays brand identity |
| `About` link | Scrolls to About section |
| `Get Into →` button | Opens the OTP Authentication Modal |
| `Lock Portals` button | Appears after unlock — re-locks the portal selection |

#### 2. Hero Section
| Element | Action |
|---|---|
| Background image | Randomly chosen from 5 construction site photos on each load |
| `Get Into Portal` button | Triggers OTP modal |
| `Enter Portals →` button | Visible after unlock — scrolls to portal cards |

#### 3. Stats Bar
| Metric | Value |
|---|---|
| Enterprise Clients | 50+ |
| Active Projects | 120+ |
| Workforce Tracked | 15,000+ |
| Platform Uptime | 99.9% |

#### 4. OTP Authentication Gate
```
FLOW: Select Organization → Click "Send OTP" → Get 4-digit code (displayed in popup)
      → Enter code in field → Click "Verify & Enter Portals" → Portals unlocked
```
| Element | Function |
|---|---|
| Organization dropdown | Select org (fetched from `GET /api/organizations`) |
| `Send OTP` button | Generates time-based 4-digit OTP (changes every 30s) |
| OTP popup (bottom-right) | Shows current OTP + countdown timer |
| OTP input field | User enters the 4-digit code |
| `Verify & Enter Portals` | Validates OTP — accepts current + 2 previous windows |
| Countdown timer `⏱` | Shows seconds until OTP refreshes |

#### 5. Portal Cards (Unlocked State)
| Portal | Route | Allowed Roles |
|---|---|---|
| **Chairman Portal** | `/login/chairman` | Chairman |
| **Directors Portal** | `/login/director` | Managing Director, Project Director, Business Director, Finance Director |
| **Teams & Staff Portal** | `/login/manager` | Project Manager, Construction Manager, QS, Procurement, Finance, HR, Digital Marketing, Sales, Site Engineer, Subcontractor, Labour |

> **Subscription Tier Control**: Growth tier hides Directors Portal and shows fewer manager roles. Premium tier shows subset. Enterprise shows all.

---

## 🔐 LOGIN PAGES

### Routes
- `/login/chairman` — Chairman only
- `/login/director` — Director roles
- `/login/manager` — All manager/staff roles

### Login Flow
```
Enter Username + Password → POST /api/auth/signin
→ JWT Token stored in localStorage("buildcon_token")
→ Session stored in localStorage("buildcon_session") with { organizationId, role }
→ Redirect to role-specific dashboard
```

### Signup Route — `/signup`
```
Enter Name + Email + Username + Password + Role + Organization
→ POST /api/auth/signup
→ Account created in MySQL
→ Redirect to login
```

---

## 👑 CHAIRMAN DASHBOARD — `/chairman`

### Sidebar Tabs
| Tab | Purpose |
|---|---|
| **Executive Summary** | KPI cards, alerts, charts |
| **Portfolio** | All projects overview |
| **Financial** | Budget/expense analysis |
| **Workforce** | Staff & labour counts |
| **Clients** | Client relationship data |
| **Board** | Board-level documents |
| **Investments** | Investment tracking |
| **Strategy** | Strategic plans |
| **Sales** | Sales pipeline |
| **Safety** | Safety incidents |
| **Approvals** | Pending approvals queue |
| **AI Assistant** | Generative AI chat |
| **Settings** | Dashboard config |

### Tab: Executive Summary (Main)

#### KPI Cards (from `GET /api/chairman/dashboard/{orgId}`)
| Card | Data Source |
|---|---|
| Total Projects | `projects` table count |
| Total Budget Value | Sum of all project budgets |
| Claims Expense (MTD) | Sum of approved progress claims |
| Active Staff | Count from all manager accounts |
| Equipment Status | Static display (94%) |

#### Alert Banners
| Alert Type | Source | Button |
|---|---|---|
| **DB AI Delay Alerts** | `GET /api/alerts/org/{orgId}` | `Remove Warning & Notify` → `PUT /api/alerts/{id}/resolve` |
| **Live AI Site Alert** | localStorage `chairman_delay_alert_msg` (set by Site Engineer) | `Remove Warning & Notify` → clears localStorage |

> Both alerts respect **Notification Settings** — curing/budget/material alerts can be toggled individually.

#### Charts
| Chart | Data |
|---|---|
| Revenue Trend (6 months) | Static demo data (Jan–Jun ₹ Cr) |
| Profit Trend (6 months) | Static demo data |
| Projects by Status (Donut) | Static: On Track 12, Delayed 4, Critical 2 |

#### AI Insights Panel
- Static text bullets showing budget variance and cash flow health

#### AI Post-Project Performance Audits
- Static cards for 3 completed projects with efficiency %, cost variance, and remarks

#### AI Assistant Bar
- Suggestion chips: "Show delayed projects", "Revenue forecast", "Department performance", "Cash flow prediction"
- Sends typed queries to AI endpoint

---

## 💼 MANAGING DIRECTOR DASHBOARD — `/md`

### Sidebar Tabs
Same structure as Chairman but focused on operational management rather than board-level strategy.

### Key Features
- Project pipeline overview
- Team performance metrics
- Approval workflows
- AI Operations chat

---

## 💰 FINANCE & ACCOUNTS DASHBOARD — `/finance-accounts`

### Purpose
Control all accounts payable/receivable, tax filings, cash flow forecasts, and payout vouchers.

### Sidebar Tabs & Features

#### 1. Finance Ledger (Default Tab)
**KPI Cards** — all computed from `fa_transactions` table:
| Card | Formula |
|---|---|
| Accounts Receivables | Sum of all `type=Receivable` transactions |
| Accounts Payables | Sum of all `type=Payable` transactions |
| Net Cash Flow Surplus | `totalInflow - totalOutflow` from `fa_cashflow_forecast` |
| Pending Approvals | Count of `progress_claims` with `status=APPROVED` |

**All Transactions Ledger Table**:
| Column | Source |
|---|---|
| TX ID | Server-generated `TX-%04d` (DB row count) |
| Party Name | User input, saved to `fa_transactions` |
| Transaction Type | `Receivable` or `Payable` |
| Amount (₹) | User input |
| Due Date | Server: `LocalDate.now() + 30 days` |
| Status | `Paid` / `Pending` / `Overdue` |

#### 2. Accounts Receivables
**Add Receivable Form**:
| Field | Required | API |
|---|---|---|
| Debtor Party Name | ✅ | Body param |
| Expected Amount (₹) | ✅ | Body param |
| `Add Receivable` button | — | `POST /api/finance-accounts/transaction` → saves to MySQL |

**Receivables Invoice Schedule** — lists all `type=Receivable` transactions from DB.

#### 3. Accounts Payables
- Lists all `type=Payable` transactions from `fa_transactions`
- Voucher Ref = TX ID from server
- Due dates from server

#### 4. Cash Flow Forecast
- **Area Chart** — Inflow vs Outflow per month
- Data source: `fa_cashflow_forecast` table → `GET /api/finance-accounts/dashboard/org/{orgId}`
- Two series: `Inflow Receipts` (green) and `Outflow Payments` (blue)

#### 5. Payout Approvals
- Lists all `progress_claims` with `status=APPROVED` from `GET /api/progress-claims/status/APPROVED`

| Button | Action | API |
|---|---|---|
| `Release` | Releases payout voucher | `POST /api/progress-claims/{id}/pay?paymentReference=PAY-TXN-{random}` |
| `Hold` | Puts claim on hold in DB | `POST /api/progress-claims/{id}/hold` → sets `status=HOLD` |

#### 6. Tax & Compliance
- Displays compliance items from `dashboard_shell_config` → `compliance_tax` key (pipe-separated)
- Default: GST Filings MTD + Subcontractor TDS Deductions
- Status badges: `Filed Successfully` (green) / `Filing due` (amber)

#### 7. AI Expense Audits
**Chat Window**:
| Element | Action |
|---|---|
| Greeting message | `"Hello {profileName}! I'm your AI Expense & Cashflow Assistant..."` — uses real DB name |
| User message bubble | Green — user's typed message |
| Bot reply bubble | Dark — server AI response |
| Input field + Send button | `POST /api/finance-accounts/ai-chat` with `{message, organizationId}` |

**AI Diagnostic Options** (Quick Buttons):
- `🔮 Predict working capital cash flows.`
- `🔮 Audit recent vendor invoice variances.`
- `🔮 Check subcontractor TDS filing compliance.`
- Each button auto-sends the query to the AI chat

#### 8. Settings
| Field | Editable | API on Save |
|---|---|---|
| Full Name | ✅ Yes | `PUT /api/finance-accounts/profile/update` |
| Email | ✅ Yes | `PUT /api/finance-accounts/profile/update` |
| `Save to Database` button | — | Updates `finance_accounts` table in MySQL |

### Sidebar Footer
| Element | Data Source |
|---|---|
| Avatar initials | Derived: `profileName.split(' ').map(n=>n[0]).join('')` |
| Profile name | `finance_accounts.username` |
| Role label | Static: "Finance & Accounts" |
| Logout button | Clears session → redirects to `/login/manager` |

---

## 👷 WORKFORCE & LABOUR DASHBOARD — `/workforce-manager`

### Purpose
Audit daily worker headcount, verify Aadhaar identities, validate subcontractor crew attendance.

### Sidebar Tabs & Features

#### 1. Workforce Overview
**KPI Cards** — all computed dynamically:
| Card | Formula |
|---|---|
| Active Labourers | `workers.length` from `workers` table |
| Subcontractor Crews | Count of unique `worker.subcontractor` values |
| Aadhaar Verified % | `(verifiedWorkers / totalWorkers) × 100` |
| Attendance Rate Today | Server: `(totalActual / totalExpected) × 100` from `wm_headcount_audit` |

**Weekly Attendance Chart** — Area chart from `wm_attendance_trend` table:
- 3 series: Masons (amber), Carpenters (blue), Labourers (green)
- Data per weekday (Mon–Fri)

#### 2. Worker Database
**Register Worker Form**:
| Field | Required |
|---|---|
| Full Worker Name | ✅ |
| Mobile Contact | ✅ |
| Aadhaar UID Number | ✅ |
| `Register Profile` button | `POST /api/workforce-manager/workers` |

> Worker ID is **server-generated**: `WRK-{DB count + 1}` — no client-side randomness.
> Verification Status auto-set to `"Pending Verification"` by server.

**Registered Workers Directory Table**:
| Column | Source |
|---|---|
| Worker ID | `workers.worker_id` (server-generated) |
| Name (Category) | `workers.name + workers.category` |
| Contact | `workers.mobile` |
| Aadhaar | `workers.aadhaar` |
| Contractor | `workers.subcontractor` |
| Photo | `workers.photo_uploaded` boolean |
| Status | `Verified` / `Pending Verification` / `Unverified` |

#### 3. Headcount Audits
- Lists all `wm_headcount_audit` records from DB
- Shows: Contractor name | Expected Crew | Actual Count | Variance | Status badge

#### 4. Payroll Integration
- Displays payroll guidelines from `dashboard_shell_config` → `guidelines` key
- 3 rules: (1) WM not responsible for salary, (2) Subcontractor billing via progress claims, (3) Direct cash payments by subcontractors

#### 5. AI Workforce Planner
**Chat Window**:
| Element | Action |
|---|---|
| AI greeting | `"Hello {profileName}! I'm your AI Workforce Assistant..."` — from DB name |
| Input + Send button | `POST /api/workforce-manager/ai-chat` with `{message, organizationId}` |

**Diagnostics Commands** (Quick Buttons):
- `🔮 Audit worker Aadhaar verification statuses.`
- `🔮 Optimize critical path labor allocation.`
- `🔮 Explain payroll integration rules.`

#### 6. Settings
| Field | Action |
|---|---|
| Full Name (editable) | Updates `workforce_manager.username` |
| Email (editable) | Updates `workforce_manager.email` |
| `Save to Database` | `PUT /api/workforce-manager/profile/update` |

---

## 🏢 HR MANAGER DASHBOARD — `/hr-manager`

### Sidebar Tabs
| Tab | Key Features |
|---|---|
| **Overview** | KPI cards — total employees, active, on leave, payroll MTD |
| **Employees** | Employee directory table, add/edit employees |
| **Recruitment** | Job postings, applicant tracking, interview scheduling |
| **Payroll** | Payroll run, salary slips, deductions |
| **Performance** | Appraisal forms, performance scores, review cycles |
| **Attendance** | Attendance log, present/absent/late tracking |
| **Leave** | Leave applications, approval workflow |
| **Training** | Training programs, completion tracking |
| **Compliance** | Labour law compliance, PF/ESI tracking |
| **Engagement** | Employee satisfaction surveys |
| **Workforce** | Headcount analytics |
| **AI HR** | AI chat for HR queries |
| **Settings** | Profile update |

---

## 🏗️ PROJECT MANAGER DASHBOARD — `/project-manager`

### Key Features
- Project milestones and timeline (Gantt-style)
- Progress claim creation and submission to Finance
- Site delay reporting → triggers Chairman alert
- Material requisition tracking
- Subcontractor management
- AI project planner chat

### Progress Claim Pipeline
```
PM creates claim → POST /api/progress-claims
→ Claim status: PENDING
→ QS reviews → Approves/Rejects
→ If APPROVED → visible in Finance Payout Approvals
→ Finance clicks Release → POST /api/progress-claims/{id}/pay
→ Claim status: PAID
```

---

## 🔢 QUANTITY SURVEYOR DASHBOARD — `/quantity-surveyor`

### Key Features
- Bill of Quantities (BOQ) management
- Progress claim verification and approval
- Cost variance analysis
- Material measurement and reconciliation
- Approve/Reject progress claims: `PUT /api/progress-claims/{id}/approve` or `/reject`

---

## 🔨 CONSTRUCTION MANAGER DASHBOARD — `/construction-manager`

### Key Features
- Site execution logs
- Concrete compression test results
- Equipment and crane management
- Daily site diary entries
- Material delivery confirmation

---

## 🏭 PROCUREMENT MANAGER DASHBOARD — `/procurement-manager`

### Key Features
- Purchase requisitions
- Vendor comparison and selection
- Purchase orders (PO) generation
- Material delivery tracking
- Inventory stock levels

---

## 👷 SENIOR SITE ENGINEER DASHBOARD — `/senior-site-engineer`

### Key Features
- Daily site log entries
- AI-powered delay alert system (sends alerts to Chairman)
- Concrete compression test logging
- Safety incident reporting

### Alert Pipeline
```
Site Engineer enters delay details → AI analysis
→ POST /api/alerts (creates alert in DB)
→ localStorage("chairman_delay_alert_msg") set
→ Chairman dashboard displays red alert banner
→ Chairman clicks "Remove Warning & Notify" → PUT /api/alerts/{id}/resolve
```

---

## 🏠 SUBCONTRACTOR DASHBOARD — `/subcontractor`

### Key Features
- Progress claim submission
- View claim status (Pending/Approved/Paid/Hold)
- Billing documentation upload
- Attendance headcount submission

### Progress Claim Flow
```
Subcontractor fills form → POST /api/progress-claims
→ Status: PENDING
→ QS approves → Status: APPROVED
→ Finance releases → Status: PAID
→ Finance holds → Status: HOLD
```

---

## 📊 SITE MANAGEMENT DASHBOARD — `/site-management`

### Key Features
- Live site heatmap
- Daily manpower logs
- Equipment utilization tracking
- Safety inspection checklists

---

## 📱 DIGITAL MARKETING — `/digital-marketing-tl` & `/digital-marketing-executive`

### Key Features
- Campaign management
- Lead generation tracking
- Social media performance
- Content calendar

---

## 💼 SALES EXECUTIVE DASHBOARD — `/sales-executive`

### Key Features
- Lead pipeline (CRM-style)
- Proposal generation
- Client follow-up scheduling
- Sales target vs actuals

---

## 🎯 MARKETING MANAGER DASHBOARD — `/marketing-manager`

### Key Features
- Marketing budget management
- Campaign ROI analysis
- Brand assets library
- Team task assignments

---

## 🏛️ SUPER ADMIN DASHBOARD — `/super-admin`

### Sidebar Tabs
| Tab | Purpose |
|---|---|
| **Overview** | Platform health, all orgs, system stats |
| **Organizations** | Create/edit/delete organizations |
| **Modules** | Enable/disable modules per org |
| **Subscriptions** | Manage tier (Growth/Premium/Enterprise) |
| **Health** | Server status, DB connections, API response times |
| **AI** | AI engine configuration |
| **Settings** | Platform-wide settings |

### Key Functions
| Action | API |
|---|---|
| View all organizations | `GET /api/organizations` |
| Create organization | `POST /api/organizations` |
| Update subscription tier | `PUT /api/organizations/{id}` |
| View system health | `GET /api/super-admin/health` |

---

## 🔄 API ENDPOINT REFERENCE

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signin` | Login — returns JWT token |
| `POST` | `/api/auth/signup` | Register new account |

### Finance & Accounts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/finance-accounts/dashboard/org/{orgId}` | Full dashboard data |
| `POST` | `/api/finance-accounts/transaction` | Add new transaction |
| `PUT` | `/api/finance-accounts/profile/update` | Update profile in DB |
| `POST` | `/api/finance-accounts/ai-chat` | AI expense chat |

### Progress Claims
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress-claims/status/APPROVED` | Get approved claims |
| `POST` | `/api/progress-claims` | Create new claim |
| `POST` | `/api/progress-claims/{id}/pay` | Release payout |
| `POST` | `/api/progress-claims/{id}/hold` | Hold claim |
| `PUT` | `/api/progress-claims/{id}/approve` | Approve claim |
| `PUT` | `/api/progress-claims/{id}/reject` | Reject claim |

### Workforce Manager
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workforce-manager/dashboard/org/{orgId}` | Full dashboard data |
| `POST` | `/api/workforce-manager/workers` | Register new worker |
| `GET` | `/api/workforce-manager/workers/org/{orgId}` | Get all workers |
| `PUT` | `/api/workforce-manager/profile/update` | Update profile |
| `POST` | `/api/workforce-manager/ai-chat` | AI workforce chat |

### Chairman
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chairman/dashboard/{orgId}` | KPI stats |
| `GET` | `/api/alerts/org/{orgId}` | Project delay alerts |
| `PUT` | `/api/alerts/{id}/resolve` | Dismiss alert |
| `GET` | `/api/chairman/settings` | Notification prefs |

### Organizations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/organizations` | All organizations |
| `POST` | `/api/organizations` | Create organization |

---

## 🗄️ DATABASE TABLES REFERENCE

| Table | Purpose |
|---|---|
| `users` | Core auth accounts (username, password hash, role) |
| `organizations` | Organization profiles (name, tier) |
| `projects` | Project records per organization |
| `finance_accounts` | Finance manager profiles |
| `fa_transactions` | All ledger transactions (Receivable/Payable) |
| `fa_cashflow_forecast` | Monthly inflow/outflow forecasts |
| `progress_claims` | Subcontractor billing claims |
| `workers` | Individual worker profiles with Aadhaar |
| `workforce_manager` | Workforce manager profiles |
| `wm_headcount_audit` | Daily contractor headcount records |
| `wm_attendance_trend` | Weekly attendance data by category |
| `dashboard_shell_configs` | Remote UI config (sidebar menus, dates, text) |
| `alerts` | Project delay/risk alerts from site engineers |
| `hr_employees` | HR employee records |
| `performance_appraisals` | Employee performance evaluations |

---

## 🔐 Session & Security Flow

```
1. Landing page OTP → organization selected + unlocked
2. Role login page → POST /api/auth/signin
3. JWT stored → all API calls use Authorization: Bearer {token}
4. Session stored → { organizationId, role, username }
5. Each dashboard reads organizationId from session
6. All data is scoped per organizationId (multi-tenant)
7. Logout → localStorage cleared → redirect to /login
```

---

## 🎨 UI Design System

| Design Token | Value |
|---|---|
| Primary dark bg | `#0A1120` |
| Card bg | `#111C30` |
| Inner card | `#0e1628` |
| Finance accent | `emerald-500` / `teal-500` |
| Workforce accent | `amber-600` / `orange-500` |
| Chairman accent | `yellow-400` / `blue-400` |
| HR accent | `violet-500` / `purple-500` |
| Font | System sans-serif + `font-mono` for IDs |
| Border | `border-slate-800` |
| Text primary | `text-white` |
| Text secondary | `text-slate-400` |

---

## 📋 Quick Reference: Every Dashboard → Role → Route

| Dashboard | Role | Route |
|---|---|---|
| Landing | Public | `/` |
| Login | All roles | `/login/chairman`, `/login/director`, `/login/manager` |
| Signup | New users | `/signup` |
| Chairman | Chairman | `/chairman` |
| Managing Director | MD | `/md` |
| Project Director | Project Director | `/project-director` |
| Business Director | Business Director | `/business-director` |
| Finance Director | Finance Director | `/finance-director` |
| Finance & Accounts | Finance Manager | `/finance-accounts` |
| HR Manager | HR Manager | `/hr-manager` |
| Project Manager | Project Manager | `/project-manager` |
| Construction Manager | Construction Manager | `/construction-manager` |
| Quantity Surveyor | QS | `/quantity-surveyor` |
| Procurement Manager | Procurement | `/procurement-manager` |
| Workforce Manager | Workforce Supervisor | `/workforce-manager` |
| Senior Site Engineer | SSE | `/senior-site-engineer` |
| Site Management | Site Management | `/site-management` |
| Subcontractor | Subcontractor | `/subcontractor` |
| Digital Marketing TL | DM Team Lead | `/digital-marketing-tl` |
| Digital Marketing Exec | DM Executive | `/digital-marketing-executive` |
| Sales Executive | Sales | `/sales-executive` |
| Marketing Manager | Marketing | `/marketing-manager` |
| Super Admin | Platform Admin | `/super-admin` |

---

*© 2026 Zenelait Infotech Private Limited. BuildCon ERP Documentation v2.0*
