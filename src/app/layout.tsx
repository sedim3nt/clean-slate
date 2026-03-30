import type { Metadata, Viewport } from "next";
import { Bitter, Karla } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clean Slate — Your Recovery Companion",
  description:
    "A private, free daily companion for addiction recovery. Journal, milestones, tools, and reflections — all on your device.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Clean Slate",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

const navItems = [
  { href: "/", label: "Today", icon: "☀" },
  { href: "/journal", label: "Journal", icon: "✎" },
  { href: "/milestones", label: "Milestones", icon: "◉" },
  { href: "/tools", label: "Tools", icon: "⚒" },
  { href: "/meetings", label: "Meetings", icon: "⚑" },
  { href: "/reflections", label: "Reflections", icon: "✦" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bitter.variable} ${karla.variable}`}>
      <body className="min-h-screen bg-warm-white text-sumi">
        {/* Desktop nav */}
        <header className="hidden md:block border-b border-paper/50 sticky top-0 bg-warm-white/95 backdrop-blur-sm z-50">
          <nav className="max-w-[1220px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-sumi"
            >
              Clean Slate
            </Link>
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-diluted hover:text-sumi transition-colors duration-300 text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Mobile header */}
        <header className="md:hidden border-b border-paper/50 sticky top-0 bg-warm-white/95 backdrop-blur-sm z-50">
          <div className="px-4 h-14 flex items-center justify-center">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight text-sumi"
            >
              Clean Slate
            </Link>
          </div>
        </header>

        <main className="max-w-[1220px] mx-auto px-4 md:px-6 py-6 md:py-10">
          {children}
        </main>

        <footer className="hidden md:block border-t border-paper/30 mt-16">
          <div className="max-w-[1220px] mx-auto px-6 py-6 text-center text-diluted text-xs">
            <p>
              This is a companion tool, not a substitute for professional
              treatment.
            </p>
            <p className="mt-1">
              Crisis? Call{" "}
              <a href="tel:988" className="underline">
                988
              </a>{" "}
              or{" "}
              <a href="tel:1-800-662-4357" className="underline">
                SAMHSA 1-800-662-4357
              </a>
            </p>
          </div>
        </footer>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-warm-white/95 backdrop-blur-sm border-t border-paper/50 z-50">
          <ul className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 text-diluted hover:text-sumi transition-colors duration-300"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </body>
    </html>
  );
}
