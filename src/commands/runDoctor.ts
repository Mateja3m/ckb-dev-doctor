import { runDiagnosticsWithCore } from '../adapters/coreAdapter';
import { resolveChecks, supportedCommands } from '../checks';
import { formatHumanReport, formatJsonReport } from '../reporting/format';
import type { CheckContext, CheckResult, CliOptions } from '../types';

export interface CommandRunResult {
  command: string;
  results: CheckResult[];
  output: string;
  exitCode: number;
}

export async function runDoctorCommand(
  command: string,
  options: CliOptions = { json: false }
): Promise<CommandRunResult> {
  if (!supportedCommands.includes(command)) {
    return {
      command,
      results: [],
      output: `Unknown command "${command}". Supported commands: ${supportedCommands.join(', ')}`,
      exitCode: 1
    };
  }

  const context: CheckContext = {
    configPath: options.configPath,
    timeoutMs: options.timeoutMs ?? 5_000
  };

  const checks = resolveChecks(command);
  const results = await runDiagnosticsWithCore(checks, context);
  const output = options.json ? formatJsonReport(results) : await formatHumanReport(results);

  const hasFailure = results.some((result) => result.status === 'fail');
  return {
    command,
    results,
    output,
    exitCode: hasFailure ? 1 : 0
  };
}
