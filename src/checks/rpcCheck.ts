import type { CheckDefinition } from '../types';
import { makeResult, withTimeout } from './utils';

export const rpcCheck: CheckDefinition = {
  id: 'rpc',
  title: 'RPC endpoint',
  async run(context) {
    const startedAt = Date.now();
    const config = context.config;

    if (!config) {
      return makeResult({
        id: 'rpc',
        title: 'RPC endpoint',
        status: 'skip',
        message: 'Skipping RPC probe because config has not been loaded.',
        startedAt
      });
    }

    const timeoutMs = config.timeoutMs ?? context.timeoutMs;
    const payload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_tip_block_number',
      params: []
    };

    try {
      const response = await withTimeout(
        fetch(config.rpcUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        }),
        timeoutMs
      );

      if (!response.ok) {
        return makeResult({
          id: 'rpc',
          title: 'RPC endpoint',
          status: 'fail',
          message: `RPC endpoint returned HTTP ${response.status}.`,
          startedAt,
          details: {
            rpcUrl: config.rpcUrl
          }
        });
      }

      const data = (await response.json()) as { result?: string; error?: { message?: string } };
      if (data.error) {
        return makeResult({
          id: 'rpc',
          title: 'RPC endpoint',
          status: 'fail',
          message: `RPC error: ${data.error.message ?? 'Unknown error'}`,
          startedAt
        });
      }

      return makeResult({
        id: 'rpc',
        title: 'RPC endpoint',
        status: 'pass',
        message: 'RPC endpoint is reachable and returned tip block data.',
        startedAt,
        details: {
          tipBlockNumber: data.result,
          rpcUrl: config.rpcUrl
        }
      });
    } catch (error) {
      return makeResult({
        id: 'rpc',
        title: 'RPC endpoint',
        status: 'fail',
        message: `RPC probe failed: ${error instanceof Error ? error.message : String(error)}`,
        startedAt,
        extensionHint:
          'For deeper RPC verification, add project-specific method checks in src/checks/rpcCheck.ts.'
      });
    }
  }
};
