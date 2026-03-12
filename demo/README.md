# Demo

Minimal Next.js + Material UI demo for CKB Dev Doctor.

## Purpose

The demo shows:
- project summary
- check list
- sample CLI commands
- sample plain-text and JSON reports

It uses mock data only.

## Quick test customization

To test different demo scenarios, edit:

- `demo/components/sampleData.ts`
  - change check statuses/messages (`pass`, `warn`, `fail`)
  - add/remove checks in the list
- `demo/app/page.tsx`
  - update sample CLI block
  - update sample plain-text report block
  - update sample JSON report block

After edits, refresh the page in `npm run demo:dev`.

## Run from repo root

```bash
npm install
npm run demo:dev
```

Open `http://localhost:3000`.

## Run from demo folder

```bash
cd demo
npm install
npm run dev
```
