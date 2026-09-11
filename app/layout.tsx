import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Degree Compass · NUS Computer Science Planner',
  description: 'A private, local-first degree checklist and semester planner for NUS Computer Science, AY2022/23.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
