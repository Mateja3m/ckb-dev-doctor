import { describe, expect, it, vi } from 'vitest';

import { formatHumanReport, formatJsonReport } from '../src/reporting/format';
import type { CheckResult } from '../src/types';

vi.mock('../src/adapters/coreAdapter', () => {
  return {
    formatWithCore: vi.fn(async () => null)
  };
});

const results: CheckResult[] = [
  {
    id: 'env',
    title: 'Developer environment',
    status: 'pass',
    message: 'Environment ready',
    durationMs: 4
  },
  {
    id: 'rpc',
    title: 'RPC endpoint',
    status: 'fail',
    message: 'RPC probe failed',
    durationMs: 7
  }
];

describe('report formatting', () => {
  it('formats readable report', async () => {
    const text = await formatHumanReport(results);
    expect(text).toContain('CKB Dev Doctor Report');
    expect(text).toContain('Summary: 1 pass, 0 warn, 1 fail, 0 skip');
  });

  it('formats JSON report', () => {
    const json = formatJsonReport(results);
    const parsed = JSON.parse(json) as { summary: { fail: number } };
    expect(parsed.summary.fail).toBe(1);
  });
});
