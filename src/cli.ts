#!/usr/bin/env node
import { runDoctorCommand } from './commands/runDoctor';
import type { CliOptions } from './types';

function printUsage(): void {
  console.log(`ckb-doctor

Usage:
  ckb-doctor <command> [options]
  ckb-doctor doctor <command> [options]

Commands:
  env       Check local Node/npm assumptions
  config    Validate CKB config file shape and values
  rpc       Validate config and probe CKB RPC endpoint
  indexer   Validate config and probe CKB indexer endpoint
  workflow  Validate basic local workflow readiness assumptions
  report    Run all checks and emit a combined diagnostics report

Options:
  --json                 Output JSON report
  --config <path>        Path to config file (default: ckb-doctor.config.json)
  --timeout-ms <number>  Request timeout in milliseconds
  -h, --help             Show help
`);
}

function parseArgs(argv: string[]): { command: string | null; options: CliOptions } {
  const options: CliOptions = { json: false };
  const args = [...argv];

  if (args.includes('-h') || args.includes('--help')) {
    return { command: null, options };
  }

  if (args[0] === 'doctor') {
    args.shift();
  }

  const command = args.shift() ?? null;

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--config') {
      const value = args.shift();
      if (!value) {
        throw new Error('Missing value for --config');
      }
      options.configPath = value;
      continue;
    }

    if (arg === '--timeout-ms') {
      const value = args.shift();
      if (!value) {
        throw new Error('Missing value for --timeout-ms');
      }

      const timeout = Number(value);
      if (!Number.isInteger(timeout) || timeout <= 0) {
        throw new Error('Invalid --timeout-ms value. Use a positive integer.');
      }
      options.timeoutMs = timeout;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { command, options };
}

async function main(): Promise<void> {
  try {
    const parsed = parseArgs(process.argv.slice(2));
    if (!parsed.command) {
      printUsage();
      process.exit(0);
      return;
    }

    const result = await runDoctorCommand(parsed.command, parsed.options);
    if (result.output) {
      console.log(result.output);
    }

    process.exit(result.exitCode);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    printUsage();
    process.exit(1);
  }
}

void main();

export { parseArgs };
