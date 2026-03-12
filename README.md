# CKB Dev Doctor

Lightweight developer diagnostics and onboarding toolkit for CKB builders.

- npm package name: `@idoa/dev-doctor-ckb`
- CLI binary: `ckb-doctor`

## What this repo is

This repository is a small CKB-specific wrapper around shared Dev Doctor packages:
- `@idoa/dev-doctor-core`
- `@idoa/dev-doctor-types`
- `@idoa/dev-doctor-utils`
- `@idoa/dev-doctor-reporter`
- `@idoa/dev-doctor-cli-kit`

It focuses only on Spark-sized PoC scope:
- local environment checks
- config validation
- RPC/indexer reachability
- basic workflow readiness
- plain-text and JSON reports

## Quick start (local repo)

```bash
npm install
npm run build
npm run doctor -- --help
```

Run checks:

```bash
npm run doctor -- env
npm run doctor -- config --config ./ckb-doctor.config.json
npm run doctor -- rpc --config ./ckb-doctor.config.json
npm run doctor -- indexer --config ./ckb-doctor.config.json
npm run doctor -- workflow
npm run doctor -- report --json --config ./ckb-doctor.config.json
```

Run without build:

```bash
npm run doctor:dev -- report --json --config ./ckb-doctor.config.json
```

## If package is published on npm

```bash
npx --yes --package @idoa/dev-doctor-ckb ckb-doctor --help
npx --yes --package @idoa/dev-doctor-ckb ckb-doctor report --json --config ./ckb-doctor.config.json
```

## CLI commands

- `env`
- `config`
- `rpc`
- `indexer`
- `workflow`
- `report`

## Example output

Plain-text:

```text
CKB Dev Doctor Report
=====================
PASS  Developer environment
PASS  Configuration
PASS  RPC endpoint
WARN  Indexer endpoint
PASS  Workflow readiness

Summary: 4 pass, 1 warn, 0 fail, 0 skip
```

JSON:

```json
{
  "summary": { "pass": 4, "warn": 1, "fail": 0, "skip": 0 },
  "checks": [
    { "id": "env", "status": "pass" },
    { "id": "config", "status": "pass" },
    { "id": "rpc", "status": "pass" },
    { "id": "indexer", "status": "warn" },
    { "id": "workflow", "status": "pass" }
  ]
}
```

## Demo app

```bash
npm install
npm run demo:dev
```

Open `http://localhost:3000`.

The demo is mock-data based and does not run local diagnostics in the browser.

## Repository layout

- `src/` CLI implementation and checks
- `tests/` Vitest tests
- `demo/` Next.js + MUI demo app
- `docs/` architecture notes

## Validation commands

```bash
npm run build
npm run lint
npm run test
npm run typecheck
```
