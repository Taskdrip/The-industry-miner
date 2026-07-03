---
name: Admin panel API field names and pricing units
description: Correct field names from the course API, pricing unit convention, and how to handle 204 DELETE responses.
---

## Pricing units rule
`priceCents` and `originalPriceCents` are stored in **Kobo** (1/100 Naira), not raw Naira.
Display value = `priceCents / 100`. Always use the shared `formatNairaFromKobo(kobo)` helper at `artifacts/industry-miner/src/lib/currency.ts`.

**Why:** Fields kept legacy "Cents" suffix but the app's currency is NGN Naira with Kobo as the minor unit. Formatting without dividing overstates prices by 100×.

## API field names
`GET /api/courses/:id` returns `{ curriculum: Module[] }` — **NOT** `curriculumModules`.

## 204 DELETE handling
`DELETE /api/admin/lessons/:id` returns HTTP 204 No Content. Any `apiFetch` helper must check `res.status === 204` before calling `res.json()`, otherwise the JSON parse throws and the deletion appears to fail in the UI even though it succeeded server-side.
