import { describe, expect, it, vi } from 'vitest';

import { runDoctorCommand } from '../src/commands/runDoctor';
import { runDiagnosticsWithCore } from '../src/adapters/coreAdapter';

vi.mock('../src/adapters/coreAdapter', () => {
  return {
    runDiagnosticsWithCore: vi.fn(async (checks) => {
      return checks.map((check: { id: string; title: string }) => ({
        id: check.id,
        title: check.title,
        status: 'pass' as const,
        message: 'ok',
        durationMs: 1
      }));
    }),
    formatWithCore: vi.fn(async () => null)
  };
});

describe('runDoctorCommand', () => {
  it('returns exitCode 1 for unknown commands', async () => {
    const result = await runDoctorCommand('unknown', { json: false });
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('Unknown command');
  });

  it('returns JSON output when requested', async () => {
    const result = await runDoctorCommand('env', { json: true });
    const parsed = JSON.parse(result.output) as { summary: { pass: number } };
    expect(parsed.summary.pass).toBe(1);
    expect(result.exitCode).toBe(0);
  });

  it('returns text output when JSON is not requested', async () => {
    const result = await runDoctorCommand('report', { json: false });
    expect(result.output).toContain('CKB Dev Doctor Report');
    expect(result.exitCode).toBe(0);
  });

  it('keeps structured JSON output when failures happen', async () => {
    vi.mocked(runDiagnosticsWithCore).mockResolvedValueOnce([
      {
        id: 'config',
        title: 'Configuration',
        status: 'fail',
        message: 'Invalid config',
        durationMs: 1
      },
      {
        id: 'rpc',
        title: 'RPC endpoint',
        status: 'skip',
        message: 'Skipping RPC probe because config has not been loaded.',
        durationMs: 1
      }
    ]);

    const result = await runDoctorCommand('rpc', { json: true });
    const parsed = JSON.parse(result.output) as { checks: Array<{ id: string; status: string }> };
    expect(parsed.checks).toHaveLength(2);
    expect(parsed.checks[0]).toMatchObject({ id: 'config', status: 'fail' });
    expect(parsed.checks[1]).toMatchObject({ id: 'rpc', status: 'skip' });
    expect(result.exitCode).toBe(1);
  });
});
