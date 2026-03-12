import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { doctorConfigSchema } from './schema';
import type { DoctorConfig } from '../types';

export const DEFAULT_CONFIG_FILE = 'ckb-doctor.config.json';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export async function loadDoctorConfig(configPath?: string): Promise<DoctorConfig> {
  const resolvedPath = path.resolve(configPath ?? process.env.CKB_CONFIG_PATH ?? DEFAULT_CONFIG_FILE);
  const fileContent = await readFile(resolvedPath, 'utf8').catch(() => {
    throw new ConfigError(
      `Config file not found at ${resolvedPath}. Create ${DEFAULT_CONFIG_FILE} or pass --config.`
    );
  });

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(fileContent);
  } catch {
    throw new ConfigError(`Config file at ${resolvedPath} is not valid JSON.`);
  }

  const parsed = doctorConfigSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ConfigError(`Invalid config: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }

  return parsed.data;
}
