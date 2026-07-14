# Production-Safe Merge — Reality Check & Phased Plan

## What I found

**Current project (Project A — running):**
- Pure frontend TanStack Start UI demo
- 75 dashboard modules, all UI-only stubs
- **No Lovable Cloud enabled** (no `supabase/`, no `src/integrations/`, no `.env`)
- No real database, no real auth, no server functions calling a DB
- Sidebar, routing, command palette, dashboards — all client-side mock data

**Old project (Project B — uploaded):**
- Full enterprise stack with real backend
- **100+ SQL migrations** (`migrations/001…200_partner_manager.sql`) — XP, badges, hall of fame, marketplace, vendor/reseller/affiliate/franchise/partner managers, RBAC, audit, event bus, notifications, etc.
- `src/integrations/database/` — auth middleware, auth-attacher, generated types, admin client
- `src/features/author-manager/` + `src/lib/*.functions.ts` — real server functions (auth, ams, blackbox, franchise, affiliate, author, chat-ai)
- Nginx / PM2 / ecosystem configs, i18n (`src/locales/`), 92 route files

## The honest problem

Your instructions say "keep current APIs, current database, current auth, current i18n" — **but Project A has none of these.** It's a UI shell. There is nothing to merge *into* on the backend side.

A literal "safe merge of every valuable backend capability" means:
1. Enable Lovable Cloud (adds Supabase / auth / server functions to Project A)
2. Port ~100 migrations (many overlap, some conflict — HoF/XP/badge tables exist in two numbering series)
3. Port `integrations/database` (auth middleware, types)
4. Port selected `src/lib/*.functions.ts` server functions
5. Wire the existing 75 UI dashboards to the new real data (biggest risk of visible change)

This is many hours of work and **will change runtime behavior** the moment real auth/DB is wired in — that contradicts "look exactly the same."

## Proposed phased plan (each phase independently shippable, each ends green)

### Phase 0 — Setup (no user-visible change)
- Enable Lovable Cloud on Project A.
- Add `src/integrations/supabase/` (managed) — the generated equivalent of old `integrations/database/`.
- No UI changes.

### Phase 1 — Foundation schema (safe additive migrations)
Port the *foundational* tables only, deduped and renumbered as one migration per concern:
- `profiles` + `user_roles` + `has_role()` (standard Lovable pattern, replaces old RBAC)
- `audit_logs`
- `notifications`
- `app_records` (from `001_create_app_records.sql`)

All additive. No UI wired yet.

### Phase 2 — Achievement / Hall of Fame backend
The old project's strongest area, and matches what we already built in the UI:
- XP, badges, trophies, achievements, hall_of_fame, reputation, recognition tables (migrations 005–013 in the `_create_*` series — skip the duplicated `_center` series unless you want them).
- Server functions: `award_xp`, `grant_badge`, `induct_hall_of_fame`.
- Wire the existing Achievements dashboard's "Hall of Fame" tab to read real data (behind a feature flag — falls back to mock if table empty, so UI stays identical for empty DB).

### Phase 3 — Marketplace + Manager backends
Migrations `100–200` (marketplace_core, product/ams/author/vendor/reseller/affiliate/influencer/franchise/partner managers). Additive. Wire dashboards optionally, flag-gated.

### Phase 4 — Cross-cutting infra
- Event bus (`059_master_event_bus_center`)
- Master notification center (`060`)
- Workflow center (`061`)
- Observability (`064`)

### Phase 5 — i18n
Port `src/locales/` translation JSON files into a new `src/locales/` in current project + install `i18next` (current project has no i18n today, so this is purely additive).

### What I will NOT do
- Not delete or rename anything in Project A.
- Not replace the sidebar, routing, dashboards, theme, or 75-module structure.
- Not run migrations blindly — each phase's SQL is reviewed and deduped first.
- Not port PM2/Nginx/Docker configs (Project A runs on Lovable's Cloudflare Workers runtime, incompatible).
- Not port the duplicate `_center` migration series without your say — many overlap the `_create_*` series and would create conflicting tables.

## Decision needed from you

Pick one to start:
- **A. Phase 0 + Phase 1 only** (enable Cloud + foundation schema, ~1 turn, zero UI change)
- **B. Phase 0 + 1 + 2** (also wire Hall of Fame to real data, flag-gated)
- **C. Full phases 0–5** (biggest scope, several turns, I'll report at each phase gate)
- **D. Something else** — tell me which specific old-project capability matters most and I'll target that.

I'm holding off touching anything until you confirm the phase — the alternative is a blind mass-port that will either do nothing safe or break your running UI, and neither matches what you asked for.
