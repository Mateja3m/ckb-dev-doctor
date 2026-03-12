# src

Core CLI code for `@idoa/dev-doctor-ckb`.

- `cli.ts`: CLI entrypoint and argument parsing
- `commands/`: command execution flow
- `checks/`: env/config/rpc/indexer/workflow checks
- `config/`: config schema and loading
- `reporting/`: plain-text and JSON formatting
- `adapters/`: integration boundary to shared packages
- `types.ts`: local types used by this wrapper
