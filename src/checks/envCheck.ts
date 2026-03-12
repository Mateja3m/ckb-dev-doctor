import { execFileSync } from 'node:child_process';

import type { CheckDefinition } from '../types';
import { makeResult } from './utils';

const MIN_NODE_MAJOR = 18;

export const envCheck: CheckDefinition = {
  id: 'env',
  title: 'Developer environment',
  async run() {
    const startedAt = Date.now();
    const nodeMajor = Number(process.versions.node.split('.')[0]);

    let npmVersion = 'unknown';
    try {
      npmVersion = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
    } catch {
      return makeResult({
        id: 'env',
        title: 'Developer environment',
        status: 'fail',
        message: 'npm is not available in PATH.',
        startedAt
      });
    }

    if (nodeMajor < MIN_NODE_MAJOR) {
      return makeResult({
        id: 'env',
        title: 'Developer environment',
        status: 'fail',
        message: `Node.js ${process.versions.node} detected. Required major version is >= ${MIN_NODE_MAJOR}.`,
        startedAt,
        details: {
          node: process.versions.node,
          npm: npmVersion
        }
      });
    }

    return makeResult({
      id: 'env',
      title: 'Developer environment',
      status: 'pass',
      message: 'Node.js and npm look ready for CKB development workflows.',
      startedAt,
      details: {
        node: process.versions.node,
        npm: npmVersion,
        platform: process.platform,
        arch: process.arch
      }
    });
  }
};
