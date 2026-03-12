export const sampleChecks = [
  {
    id: 'env',
    title: 'Developer environment',
    status: 'pass',
    message: 'Node.js 20.x and npm 10.x detected',
    durationMs: 8
  },
  {
    id: 'config',
    title: 'Configuration',
    status: 'pass',
    message: 'Config validated for testnet endpoints',
    durationMs: 5
  },
  {
    id: 'rpc',
    title: 'RPC endpoint',
    status: 'pass',
    message: 'get_tip_block_number returned a valid value',
    durationMs: 42
  },
  {
    id: 'indexer',
    title: 'Indexer endpoint',
    status: 'warn',
    message: 'Endpoint reachable, but response latency is high',
    durationMs: 280
  },
  {
    id: 'workflow',
    title: 'Workflow readiness',
    status: 'pass',
    message: 'build/lint/test/typecheck scripts are available for onboarding flow',
    durationMs: 6
  },
  {
    id: 'indexer-sync',
    title: 'Indexer sync freshness',
    status: 'fail',
    message: 'Indexer tip is behind expected network tip for local onboarding checks',
    durationMs: 17
  }
] as const;
