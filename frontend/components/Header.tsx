"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",       kanji: "旅", label: "JOURNEY" },
  { href: "/upload", kanji: "書", label: "RECORDS" },
  { href: "/search", kanji: "道", label: "DISCOVER" },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="relative z-50 border-b border-[rgba(28,21,16,0.18)]"
      style={{ background: "rgba(226,213,190,0.97)", backdropFilter: "blur(8px)" }}>
      <div className="site-wrap flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link href="/" className="flex items-start gap-2.5 group">
          <span className="font-jp text-4xl font-black text-[var(--ink)] leading-none">旅</span>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-cinzel text-sm font-bold tracking-[0.22em] text-[var(--ink)] uppercase">
              Vagabond
            </span>
            <span className="font-cinzel text-[9px] tracking-[0.25em] text-[var(--red)] uppercase mt-0.5">
              Journey
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-end gap-8">
          {NAV.map(({ href, kanji, label }) => {
            const active = path === href || (href !== "/" && path.startsWith(href));
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-0.5 group">
                <span className={`font-jp text-lg leading-none transition-colors ${
                  active ? "text-[var(--ink)]" : "text-[var(--ink-pale)] group-hover:text-[var(--ink)]"
                }`}>{kanji}</span>
                <span className={`font-cinzel text-[9px] tracking-[0.2em] transition-colors ${
                  active ? "text-[var(--ink)]" : "text-[var(--ink-pale)] group-hover:text-[var(--ink)]"
                }`}>{label}</span>
                {active && (
                  <span className="block w-4 h-[1.5px] bg-[var(--red)] mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile circle */}
        <div className="w-9 h-9 rounded-full border-2 border-[var(--ink-mid)] flex items-center justify-center cursor-pointer hover:border-[var(--red)] transition-colors">
          <Link href="/search" className="btn-primary text-sm py-2 px-5">
            Find Universities
          </Link>
        </div>
      </div>
    </header>
  );
}
