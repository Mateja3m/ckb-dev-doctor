import { z } from 'zod';

export const doctorConfigSchema = z.object({
  network: z.enum(['mainnet', 'testnet', 'devnet', 'custom']),
  rpcUrl: z.string().url(),
  indexerUrl: z.string().url(),
  timeoutMs: z.number().int().positive().max(60_000).optional()
});

export type DoctorConfigSchema = z.infer<typeof doctorConfigSchema>;
