---
name: Industry Miner project setup
description: How the monorepo workflows must be started and why they fail without explicit env vars.
---

## Rule
Workflow commands must explicitly set `PORT` and `BASE_PATH` because the artifact's managed env injection only applies when workflows are run through the Replit artifact system (`createArtifact`), not when manually configured via `configureWorkflow`.

**Frontend:** `PORT=23279 BASE_PATH=/ pnpm --filter @workspace/industry-miner run dev`
**API:** `PORT=8080 pnpm --filter @workspace/api-server run dev`

**Why:** The `artifact.toml` `[services.env]` block sets these automatically for artifact-managed workflows. `configureWorkflow` bypasses that injection, so PORT is missing and both servers throw at startup.

**How to apply:** Always include PORT (and BASE_PATH for the frontend) when manually configuring these workflows.
