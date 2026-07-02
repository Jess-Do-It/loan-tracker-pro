# Loan Tracker Pro — recovered from Lovable

This project was extracted directly from your Lovable project's live dev
sandbox (all files served raw from the TanStack Start dev server) after
Lovable's code editor hit its daily free-credit limit and blocked
whole-project download / GitHub sync.

## What's included

Everything Lovable generated **except** the standard shadcn/ui primitives
(`src/components/ui/*.tsx` — accordion, button, dialog, etc.) and the
auto-generated `src/routeTree.gen.ts`, `bun.lock`. Those are 100% stock
library output, not custom code, so they're faster to regenerate than copy.

## Setup

```bash
# 1. Install dependencies (bun is what Lovable used, npm also works)
bun install   # or: npm install

# 2. Regenerate the shadcn/ui component library
npx shadcn@latest add accordion alert-dialog alert aspect-ratio avatar badge \
  breadcrumb button calendar card carousel chart checkbox collapsible command \
  context-menu dialog drawer dropdown-menu form hover-card input-otp input label \
  menubar navigation-menu pagination popover progress radio-group resizable \
  scroll-area select separator sheet sidebar skeleton slider sonner switch table \
  tabs textarea toggle-group toggle tooltip

# 3. routeTree.gen.ts regenerates automatically on first dev run
bun run dev   # or: npm run dev
```

The app is a TanStack Start (React 19 + Vite + Tailwind v4) mobile-style
loan/expense/savings tracker, currently backed entirely by in-memory mock
data via `useSyncExternalStore` services in `src/services/` — no real
persistence yet (see `.lovable/plan.md` for the original feature plan).

## Recovering full Lovable history / future access

- To avoid this happening again: connect GitHub sync in Lovable (Project →
  GitHub), which pushes commits automatically regardless of credit balance.
- Your daily free credits reset — check the Lovable dashboard for the reset
  time — after which the in-app "Download Project" / full code export will
  work normally again too.
