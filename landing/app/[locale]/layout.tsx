import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import {routing} from '../../i18n/routing';
import {notFound} from 'next/navigation';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devskill.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'devskill | Upgrade your AI\'s Brain',
  description: 'Equip Cursor, Windsurf, Cline, Claude Code, Codex, GitHub Copilot and other AI agents with expert-level coding knowledge via a single CLI command. 299+ skills available.',
  keywords: ['AI coding', 'developer tools', 'CLI', 'Cursor', 'Claude Code', 'Windsurf', 'GitHub Copilot', 'AI skills', 'code quality'],
  openGraph: {
    title: 'devskill | Upgrade your AI\'s Brain',
    description: 'Equip your AI agents with expert-level coding knowledge. 299+ curated skills for Vue, Phoenix, Elixir, and more.',
    type: 'website',
    siteName: 'devskill',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'devskill — Upgrade Your AI\'s Brain' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'devskill | Upgrade your AI\'s Brain',
    description: 'Equip your AI agents with expert-level coding knowledge. 299+ curated skills for Vue, Phoenix, Elixir, and more.',
    images: ['/og.png'],
  },
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
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
 
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'devskill',
        url: siteUrl,
        description: 'Equip AI agents with expert-level coding knowledge via a single CLI command.',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'devskill',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        url: siteUrl,
        description: 'CLI tool that equips Cursor, Claude Code, Windsurf, GitHub Copilot and other AI agents with 299+ expert coding skills.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        softwareVersion: '2.0',
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
