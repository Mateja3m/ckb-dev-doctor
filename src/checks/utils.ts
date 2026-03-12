import type { CheckResult, CheckStatus } from '../types';

export function makeResult(params: {
  id: string;
  title: string;
  status: CheckStatus;
  message: string;
  startedAt: number;
  details?: Record<string, unknown>;
  extensionHint?: string;
}): CheckResult {
  return {
    id: params.id,
    title: params.title,
    status: params.status,
    message: params.message,
    details: params.details,
    extensionHint: params.extensionHint,
    durationMs: Date.now() - params.startedAt
  };
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error(`Timed out after ${timeoutMs}ms`));
        });
      })
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
