import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { CheckDefinition } from '../types';
import { makeResult } from './utils';

const REQUIRED_SCRIPTS = ['build', 'lint', 'test', 'typecheck'] as const;

export const workflowCheck: CheckDefinition = {
  id: 'workflow',
  title: 'Workflow readiness',
  async run() {
    const startedAt = Date.now();
    const packageJsonPath = path.resolve('package.json');

    try {
      const packageJsonContent = await readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent) as { scripts?: Record<string, string> };
      const scripts = packageJson.scripts ?? {};

      const missing = REQUIRED_SCRIPTS.filter((script) => !scripts[script]);
      if (missing.length > 0) {
        return makeResult({
          id: 'workflow',
          title: 'Workflow readiness',
          status: 'warn',
          message: `Missing recommended npm scripts: ${missing.join(', ')}.`,
          startedAt,
          extensionHint: 'Keep workflow checks lightweight and focused on onboarding tasks.'
        });
      }

      return makeResult({
        id: 'workflow',
        title: 'Workflow readiness',
        status: 'pass',
        message: 'Basic local workflow scripts are present for onboarding diagnostics.',
        startedAt,
        details: {
          scripts: REQUIRED_SCRIPTS
        }
      });
    } catch (error) {
      return makeResult({
        id: 'workflow',
        title: 'Workflow readiness',
        status: 'warn',
        message: 'Unable to inspect local workflow scripts.',
        startedAt,
        details: {
          error: error instanceof Error ? error.message : String(error)
        },
        extensionHint: 'Workflow diagnostics are intentionally lightweight in this Spark-sized PoC.'
      });
    }
  }
};
