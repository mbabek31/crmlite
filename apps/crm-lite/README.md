# CRM Lite App (Next.js + Supabase)

## Quick start
1. Create a Supabase project.
2. Enable Google OAuth in Supabase Auth.
3. Run `supabase/schema.sql` in SQL editor.
4. Copy `.env.example` to `.env.local` and fill in values.
5. Install dependencies and run app:
   - `npm install`
   - `npm run dev`

## MVP included in this scaffold
- Google login page (`/login`)
- Shared account list + search (`/accounts`)
- Account detail with activities + pipeline update (`/accounts/[id]`)
- CSV export of all activities (`/api/export/activities`)
- Basic user admin view (`/admin/users`)

## Notes
- Role assignment is initially managed in Supabase table editor.
- RLS policies enforce viewer/editor/admin access patterns and owner/admin delete/update rules.
