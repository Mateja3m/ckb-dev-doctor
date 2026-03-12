import type { CheckContext, CheckDefinition, CheckResult } from '../types';

type CoreCheck = {
  id: string;
  title: string;
  run: (context: CheckContext) => Promise<CheckResult>;
};

type CoreRunFn = (checks: CoreCheck[], context: CheckContext) => Promise<CheckResult[]>;
type CoreFormatFn = (results: CheckResult[], options?: { showDetails?: boolean }) => string;

type CoreModule = {
  runChecks?: CoreRunFn;
  formatReport?: CoreFormatFn;
};

async function loadCoreModule(): Promise<CoreModule | null> {
  try {
    const mod = (await import('@idoa/dev-doctor-core')) as CoreModule;
    return mod;
  } catch {
    return null;
  }
}

export async function runDiagnosticsWithCore(
  checks: CheckDefinition[],
  context: CheckContext
): Promise<CheckResult[]> {
  const core = await loadCoreModule();
  if (core?.runChecks) {
    return core.runChecks(checks, context);
  }

  const results: CheckResult[] = [];
  for (const check of checks) {
    results.push(await check.run(context));
  }
  return results;
}

export async function formatWithCore(
  results: CheckResult[],
  options?: { showDetails?: boolean }
): Promise<string | null> {
  const core = await loadCoreModule();
  if (!core?.formatReport) {
    return null;
  }

  return core.formatReport(results, options);
}
