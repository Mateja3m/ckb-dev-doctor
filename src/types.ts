export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';

export interface CheckResult {
  id: string;
  title: string;
  status: CheckStatus;
  message: string;
  details?: Record<string, unknown> | undefined;
  durationMs: number;
  extensionHint?: string | undefined;
}

export interface DoctorConfig {
  network: 'mainnet' | 'testnet' | 'devnet' | 'custom';
  rpcUrl: string;
  indexerUrl: string;
  timeoutMs?: number | undefined;
}

export interface CheckContext {
  configPath?: string | undefined;
  config?: DoctorConfig | undefined;
  timeoutMs: number;
}

export interface CliOptions {
  json: boolean;
  configPath?: string | undefined;
  timeoutMs?: number | undefined;
}

export type CheckRunner = (context: CheckContext) => Promise<CheckResult>;

export interface CheckDefinition {
  id: string;
  title: string;
  run: CheckRunner;
}
