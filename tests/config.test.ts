import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { ConfigError, loadDoctorConfig } from '../src/config/loadConfig';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe('loadDoctorConfig', () => {
  it('loads a valid config file', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'ckb-doctor-'));
    tempDirs.push(dir);

    const configPath = path.join(dir, 'ckb-doctor.config.json');
    await writeFile(
      configPath,
      JSON.stringify({
        network: 'testnet',
        rpcUrl: 'https://rpc.example.com',
        indexerUrl: 'https://indexer.example.com',
        timeoutMs: 4000
      })
    );

    const config = await loadDoctorConfig(configPath);
    expect(config.network).toBe('testnet');
    expect(config.timeoutMs).toBe(4000);
  });

  it('throws ConfigError when file is missing', async () => {
    await expect(loadDoctorConfig('/tmp/does-not-exist.json')).rejects.toBeInstanceOf(ConfigError);
  });

  it('throws ConfigError when schema is invalid', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'ckb-doctor-'));
    tempDirs.push(dir);

    const configPath = path.join(dir, 'invalid.json');
    await writeFile(
      configPath,
      JSON.stringify({
        network: 'testnet',
        rpcUrl: 'not-a-url',
        indexerUrl: 'https://indexer.example.com'
      })
    );

    await expect(loadDoctorConfig(configPath)).rejects.toBeInstanceOf(ConfigError);
  });
});
