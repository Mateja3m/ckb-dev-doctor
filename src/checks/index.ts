import { configCheck } from './configCheck';
import { envCheck } from './envCheck';
import { indexerCheck } from './indexerCheck';
import { rpcCheck } from './rpcCheck';
import { workflowCheck } from './workflowCheck';
import type { CheckDefinition } from '../types';

const CHECKS_BY_COMMAND: Record<string, CheckDefinition[]> = {
  env: [envCheck],
  config: [configCheck],
  rpc: [configCheck, rpcCheck],
  indexer: [configCheck, indexerCheck],
  workflow: [workflowCheck],
  report: [envCheck, configCheck, rpcCheck, indexerCheck, workflowCheck]
};

export function resolveChecks(command: string): CheckDefinition[] {
  return CHECKS_BY_COMMAND[command] ?? [];
}

export const supportedCommands = Object.keys(CHECKS_BY_COMMAND);
