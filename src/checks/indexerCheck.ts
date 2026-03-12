import type { CheckDefinition } from '../types';
import { makeResult, withTimeout } from './utils';

export const indexerCheck: CheckDefinition = {
  id: 'indexer',
  title: 'Indexer endpoint',
  async run(context) {
    const startedAt = Date.now();
    const config = context.config;

    if (!config) {
      return makeResult({
        id: 'indexer',
        title: 'Indexer endpoint',
        status: 'skip',
        message: 'Skipping indexer probe because config has not been loaded.',
        startedAt
      });
    }

    const timeoutMs = config.timeoutMs ?? context.timeoutMs;
    const payload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_indexer_tip',
      params: []
    };

    try {
      const response = await withTimeout(
        fetch(config.indexerUrl, {
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
          id: 'indexer',
          title: 'Indexer endpoint',
          status: 'fail',
          message: `Indexer endpoint returned HTTP ${response.status}.`,
          startedAt,
          details: {
            indexerUrl: config.indexerUrl
          }
        });
      }

      const data = (await response.json()) as {
        result?: { block_number?: string; block_hash?: string };
        error?: { message?: string };
      };

      if (data.error) {
        return makeResult({
          id: 'indexer',
          title: 'Indexer endpoint',
          status: 'fail',
          message: `Indexer error: ${data.error.message ?? 'Unknown error'}`,
          startedAt
        });
      }

      return makeResult({
        id: 'indexer',
        title: 'Indexer endpoint',
        status: 'pass',
        message: 'Indexer endpoint is reachable and returned tip metadata.',
        startedAt,
        details: {
          indexerUrl: config.indexerUrl,
          tip: data.result
        }
      });
    } catch (error) {
      return makeResult({
        id: 'indexer',
        title: 'Indexer endpoint',
        status: 'fail',
        message: `Indexer probe failed: ${error instanceof Error ? error.message : String(error)}`,
        startedAt,
        extensionHint:
          'Add project-specific indexer assertions in src/checks/indexerCheck.ts for deeper confidence.'
      });
    }
  }
};
