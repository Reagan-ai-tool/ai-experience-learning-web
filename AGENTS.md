# AGENTS.md

## Project Overview

- Project name: 把前人經驗，變成你的判斷力
- System: AI 真人經驗情境互動學習系統
- Current website includes:
  - CASE005 whitelist review writeback
  - SITE-OPS-001 version announcement module
  - CASE-STATUS-001 read-only case status page

## Working Rules

- Work only on feature branches
- Before reporting a task as ready, run:
  - `npm test`
  - `npm run build`
  - `git diff --check`
- Report changed files, test results, risk points, and next step
- Do not expand the task scope without human approval

## Strict Safety Boundaries

- Do not merge
- Do not production deploy
- Do not modify Airtable
- Do not modify tokens
- Do not expose token values
- Do not add whitelist entries
- Do not modify publish status
- Do not trigger auto-publish
- Do not modify API routes unless explicitly authorized by the human

## Current Case Status

- CASE005: may write back only 6 review fields under whitelist restrictions, but is not publishable
- CASE006: read-only / not writable / not publishable
- CASE004: candidate only / not writable / not publishable

## High-Risk Operation Gate

- Any change involving Airtable, tokens, whitelist, API routes, publish status, production deploy, or merge requires explicit human confirmation
- Preview success does not equal Production approval
- Writeback success does not equal publish approval

## Reporting Format

When finishing a task, respond with:

- Changed files
- Test / build / diff-check result
- API / Airtable / token / writeback risk
- Secret / dependency risk
- Next recommended step
