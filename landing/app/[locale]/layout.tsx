import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter, Fira_Code } from "next/font/google";
import "../globals.css";
import {routing} from '../../i18n/routing';
import {notFound} from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'devskill | Upgrade your AI\'s Brain',
  description: 'Equip Cursor, Windsurf, Cline, Antigravity, Claude Code, Codex, GitHub Copilot and other AI Agents with expert programming superpowers via a single interactive prompt.',
  openGraph: {
    title: 'devskill | Upgrade your AI\'s Brain',
    description: 'Equip Cursor, Windsurf, Cline, Antigravity, Claude Code, Codex, GitHub Copilot and other AI Agents with expert programming superpowers via a single interactive prompt.',
    type: 'website',
  }
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "en" | "vi")) {
    notFound();
  }
 
  // Obtaining messages for the client components
  const messages = await getMessages();
 
  return (
    <html lang={locale} className={`${inter.variable} ${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
