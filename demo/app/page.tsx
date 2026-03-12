'use client';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography
} from '@mui/material';

import { sampleChecks } from '../components/sampleData';

const sampleCli = `ckb-doctor env\nckb-doctor rpc --config ./ckb-doctor.config.json\nckb-doctor report --json --config ./ckb-doctor.config.json`;

const sampleTextReport = `CKB Dev Doctor Report
=====================
PASS  Developer environment
  - Node.js and npm look ready for CKB development workflows.
PASS  Configuration
  - CKB configuration loaded and validated.
PASS  RPC endpoint
  - RPC endpoint is reachable and returned tip block data.
WARN  Indexer endpoint
  - Endpoint reachable but response latency is high.
PASS  Workflow readiness
  - Basic local workflow scripts are present for onboarding diagnostics.

Summary: 4 pass, 1 warn, 0 fail, 0 skip`;

const sampleJsonReport = `{
  "generatedAt": "2026-03-11T10:00:00.000Z",
  "summary": { "pass": 4, "warn": 1, "fail": 0, "skip": 0 },
  "checks": [
    { "id": "env", "status": "pass" },
    { "id": "config", "status": "pass" },
    { "id": "rpc", "status": "pass" },
    { "id": "indexer", "status": "warn" },
    { "id": "workflow", "status": "pass" }
  ]
}`;

function statusColor(status: string): 'success' | 'error' | 'warning' | 'default' {
  if (status === 'pass') return 'success';
  if (status === 'fail') return 'error';
  if (status === 'warn') return 'warning';
  return 'default';
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'pass') return <CheckCircleOutlineRoundedIcon color="success" />;
  if (status === 'fail') return <ErrorOutlineRoundedIcon color="error" />;
  return <WarningAmberRoundedIcon color="warning" />;
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const pass = sampleChecks.filter((c) => c.status === 'pass').length;
  const warn = sampleChecks.filter((c) => c.status === 'warn').length;
  const fail = sampleChecks.filter((c) => c.status === 'fail').length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(180deg, #eaf3ff 0%, #f4f7fb 45%, #ffffff 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              CKB Dev Doctor
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Lightweight diagnostics and onboarding checks for Nervos CKB builders.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Why this PoC matters
              </Typography>
              <Typography color="text.secondary">
                New contributors lose time on setup drift. This Spark-sized PoC makes local readiness checks
                repeatable and easy to demo, helping CKB teams onboard faster.
              </Typography>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  PASS
                </Typography>
                <Typography variant="h4">{pass}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  WARN
                </Typography>
                <Typography variant="h4">{warn}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  FAIL
                </Typography>
                <Typography variant="h4">{fail}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Checks in scope
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                env, config, rpc, indexer, workflow
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {sampleChecks.map((check) => (
                  <Card key={check.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <StatusIcon status={check.status} />
                          <Typography variant="h6">{check.title}</Typography>
                        </Stack>
                        <Chip
                          size="small"
                          label={check.status.toUpperCase()}
                          color={statusColor(check.status)}
                        />
                      </Stack>
                      <Typography sx={{ mt: 1.5 }} color="text.secondary">
                        {check.message}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Block title="Sample CLI usage" text={sampleCli} />
          <Block title="Sample plain-text report" text={sampleTextReport} />
          <Block title="Sample JSON report" text={sampleJsonReport} />

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demo note
              </Typography>
              <Typography color="text.secondary">
                Browser demo uses mock data only. Run CLI locally to execute real diagnostics on your machine.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
