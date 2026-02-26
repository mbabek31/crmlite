# CRM Lite MVP Plan

## Recommendation on repo structure
Because this CRM is a different product from Planit Event, keep it in a **separate repository** if possible.

- Cleaner issue tracking and release process
- Cleaner CI/CD and deployment settings
- Easier to open source or hand over later

If you must keep it in this repo short-term, isolate it under a dedicated top-level folder (for example, `apps/crm-lite`) and avoid coupling shared code until the product direction stabilizes.

## Confirmed product requirements (from your answers)

### Team and data model
- Multi-user team CRM
- Shared account records (not tied to one owner for visibility)
- All users can view all accounts and activity history

### Authentication and access
- Google sign-in for login
- Owner-based edit/delete controls
- Easy admin flow to grant permissions to new users

### Accounts
- Create/delete account pages
- Freeform fields for:
  - Use Case
  - Vertical

### Activities
- Add call/meeting activities on account pages
- Each activity includes notes and date timestamps
- Shared timeline visible to all users

### Pipeline
- Fixed (non-customizable) stages for MVP

### Search
- Search by account name (highest priority)
- Also search by vertical and use case

### Export
- CSV export for **all** activities/notes

### Integrations
- No calendar/email/slack integrations for MVP

## Suggested MVP stack (fast + scalable)
- **Frontend/Backend**: Next.js (App Router)
- **Auth + DB + Storage**: Supabase
  - Google OAuth via Supabase Auth
  - Postgres for accounts/activities/users
  - Built-in Row Level Security for owner/admin controls
- **Deployment**: Vercel

This stack is generally the easiest to ship quickly while staying production-ready.

## Proposed fixed pipeline stages (v1)
1. Lead
2. Qualified
3. Discovery
4. Proposal
5. Negotiation
6. Closed Won
7. Closed Lost

## Suggested permission model (simple and safe)
- **Viewer**: can read everything
- **Editor**: can create/update accounts and activities
- **Admin**: editor rights + manage users/roles + delete accounts/activities

Owner-based controls for delete/update can be layered as:
- Account/activity creator can edit own records
- Admin can edit/delete any record

(If this feels restrictive, switch to “all editors can edit all records” to reduce friction.)

## Core database entities
- `users`
  - id, email, full_name, role, created_at
- `accounts`
  - id, name, vertical, use_case, pipeline_stage, created_by, created_at, updated_at
- `activities`
  - id, account_id, type (call/meeting), notes, activity_date, created_by, created_at
- `audit_log` (optional but useful)
  - id, actor_id, entity_type, entity_id, action, metadata, created_at

## MVP feature checklist
1. Google login/logout
2. Account list page
3. Account detail page with:
   - Use case/vertical fields
   - Pipeline stage dropdown
   - Activity timeline
4. Add/edit/delete account
5. Add/edit/delete activity with timestamp
6. Global search (name, vertical, use case)
7. CSV export (all activities)
8. Admin user management page

## Delivery plan (2-week style)

### Phase 1: Foundation (Days 1–3)
- Project setup (Next.js + Supabase)
- Auth with Google
- Role model + RLS policies

### Phase 2: Core CRM (Days 4–8)
- Accounts CRUD
- Account detail pages
- Activities timeline CRUD
- Pipeline stage updates

### Phase 3: Productivity features (Days 9–11)
- Search across account fields
- CSV export of all activities

### Phase 4: Hardening (Days 12–14)
- Permission edge cases
- Basic audit logging
- Empty/error/loading state polish

## Remaining decisions to unblock implementation
1. Should delete operations be soft-delete (recoverable) or hard-delete?
2. Should activities be editable after creation by everyone, owner-only, or admin-only?
3. Do you want account-level tags in MVP (beyond vertical/use case)?
4. Should CSV export include only activities, or accounts + activities joined in one file?

## Suggested next step
If you want, next I can generate:
- the exact Supabase schema + RLS SQL,
- Next.js route/page structure,
- and a day-by-day implementation checklist you can hand directly to a developer.
