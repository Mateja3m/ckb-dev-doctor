import { describe, expect, it } from 'vitest';

import { resolveChecks, supportedCommands } from '../src/checks';

describe('CKB checks wiring', () => {
  it('exposes expected command names', () => {
    expect(supportedCommands).toEqual(['env', 'config', 'rpc', 'indexer', 'workflow', 'report']);
  });

  it('wires report command to all primary checks', () => {
    const checks = resolveChecks('report');
    expect(checks.map((c) => c.id)).toEqual(['env', 'config', 'rpc', 'indexer', 'workflow']);
  });

  it('wires rpc command to config + rpc checks', () => {
    const checks = resolveChecks('rpc');
    expect(checks.map((c) => c.id)).toEqual(['config', 'rpc']);
  });

  it('wires workflow command to workflow check', () => {
    const checks = resolveChecks('workflow');
    expect(checks.map((c) => c.id)).toEqual(['workflow']);
  });
});
