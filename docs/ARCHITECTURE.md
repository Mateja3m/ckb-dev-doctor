# Architecture

## Design goals

- stay thin and chain-specific
- delegate reusable generic behavior to shared `@idoa/dev-doctor-*` packages
- keep checks explicit, testable, and safe by default

## Shared package boundary

- `@idoa/dev-doctor-core`
- `@idoa/dev-doctor-types`
- `@idoa/dev-doctor-utils`
- `@idoa/dev-doctor-reporter`
- `@idoa/dev-doctor-cli-kit`

This repo should remain a small CKB adapter/wrapper around those packages.

## Layers

1. CLI layer (`src/cli.ts`)
   - parses commands/options
   - dispatches to `runDoctorCommand`

2. Command layer (`src/commands/runDoctor.ts`)
   - resolves check set
   - calls diagnostics engine adapter
   - formats output

3. Adapter layer (`src/adapters/coreAdapter.ts`)
   - integrates with `@idoa/dev-doctor-core` when available
   - keeps local fallback behavior minimal

4. Check layer (`src/checks/*`)
   - CKB-specific checks
   - independent and composable
   - includes a bounded `workflow` readiness check for Spark PoC needs

5. Reporting/config layer
   - zod schema validation (`src/config`)
   - text + JSON report formatting (`src/reporting`)

## Safety stance

- no secret handling or key material usage
- no fake deep on-chain verification
- explicit extension hints where deeper validation should be added by integrators
