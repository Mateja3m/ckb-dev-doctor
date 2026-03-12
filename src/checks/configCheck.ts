import { ConfigError, loadDoctorConfig } from '../config/loadConfig';
import type { CheckDefinition } from '../types';
import { makeResult } from './utils';

export const configCheck: CheckDefinition = {
  id: 'config',
  title: 'Configuration',
  async run(context) {
    const startedAt = Date.now();

    try {
      const config = await loadDoctorConfig(context.configPath);
      context.config = config;

      return makeResult({
        id: 'config',
        title: 'Configuration',
        status: 'pass',
        message: 'CKB configuration loaded and validated.',
        startedAt,
        details: {
          network: config.network,
          rpcUrl: config.rpcUrl,
          indexerUrl: config.indexerUrl,
          timeoutMs: config.timeoutMs ?? context.timeoutMs
        }
      });
    } catch (error) {
      if (error instanceof ConfigError) {
        return makeResult({
          id: 'config',
          title: 'Configuration',
          status: 'fail',
          message: error.message,
          startedAt,
          extensionHint:
            'Add a ckb-doctor.config.json file and extend it with project-specific assertions as needed.'
        });
      }

      return makeResult({
        id: 'config',
        title: 'Configuration',
        status: 'fail',
        message: 'Unexpected config loader failure.',
        startedAt,
        details: {
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }
};
