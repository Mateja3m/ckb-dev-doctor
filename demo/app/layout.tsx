import type { Metadata } from 'next';
import { AppProviders } from '../components/AppProviders';

export const metadata: Metadata = {
  title: 'CKB Dev Doctor Demo',
  description: 'Demo UI for CKB developer diagnostics and onboarding checks.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
