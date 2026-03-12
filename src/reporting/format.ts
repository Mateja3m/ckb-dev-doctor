import { formatWithCore } from '../adapters/coreAdapter';
import type { CheckResult } from '../types';

const symbols: Record<CheckResult['status'], string> = {
  pass: 'PASS',
  warn: 'WARN',
  fail: 'FAIL',
  skip: 'SKIP'
};

export async function formatHumanReport(results: CheckResult[]): Promise<string> {
  const coreFormatted = await formatWithCore(results, { showDetails: true });
  if (coreFormatted) {
    return coreFormatted;
  }

  const lines: string[] = [];
  lines.push('CKB Dev Doctor Report');
  lines.push('=====================');

  for (const result of results) {
    lines.push(`${symbols[result.status]}  ${result.title}`);
    lines.push(`  - ${result.message}`);
    lines.push(`  - duration: ${result.durationMs}ms`);

    if (result.extensionHint) {
      lines.push(`  - extension: ${result.extensionHint}`);
    }

    if (result.details && Object.keys(result.details).length > 0) {
      lines.push(`  - details: ${JSON.stringify(result.details)}`);
    }
  }

  const counts = {
    pass: results.filter((r) => r.status === 'pass').length,
    warn: results.filter((r) => r.status === 'warn').length,
    fail: results.filter((r) => r.status === 'fail').length,
    skip: results.filter((r) => r.status === 'skip').length
  };

  lines.push('');
  lines.push(`Summary: ${counts.pass} pass, ${counts.warn} warn, ${counts.fail} fail, ${counts.skip} skip`);

  return lines.join('\n');
}

export function formatJsonReport(results: CheckResult[]): string {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        pass: results.filter((r) => r.status === 'pass').length,
        warn: results.filter((r) => r.status === 'warn').length,
        fail: results.filter((r) => r.status === 'fail').length,
        skip: results.filter((r) => r.status === 'skip').length
      },
      checks: results
    },
    null,
    2
  );
}
