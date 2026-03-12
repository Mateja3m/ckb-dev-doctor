# Security Policy

## Supported Versions

Only the latest `main` branch is actively supported with security updates.

## Reporting a Vulnerability

Please report vulnerabilities privately by opening a security advisory or contacting maintainers directly.

Include:
- affected version and environment
- reproduction steps
- impact assessment
- potential mitigations

Do not publish proof-of-concept exploits publicly before a fix is available.

## Security Principles

- no embedded secrets or private keys
- strict input validation for CLI and config
- safe network timeouts on RPC/indexer probes
- explicit extension points for deeper on-chain verification
