"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload Transcript" },
    { href: "/search", label: "Search" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(61,53,48,0.12)]"
      style={{ background: "rgba(242,237,223,0.92)", backdropFilter: "blur(12px)" }}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Ink-drop mark */}
            <span
              className="w-7 h-7 flex items-center justify-center rounded-sm text-[var(--parchment)] text-xs font-serif font-bold transition-colors group-hover:bg-[var(--brush-red)]"
              style={{ background: "var(--ink)", letterSpacing: "0.02em" }}
            >
              旅
            </span>
            <span className="font-display text-xl text-[var(--ink)] tracking-tight group-hover:text-[var(--brush-red)] transition-colors">
              Vagabond
            </span>
            <span
              className="text-[10px] font-mono bg-[rgba(184,150,12,0.15)] text-[#7A6200] px-2 py-0.5 rounded-sm font-semibold tracking-widest"
            >
              BETA
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm ${
                  pathname === item.href
                    ? "bg-[rgba(139,26,15,0.08)] text-[var(--brush-red)]"
                    : "text-[var(--ink-pale)] hover:text-[var(--ink)] hover:bg-[rgba(26,20,16,0.05)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/search" className="btn-primary text-sm py-2 px-5">
            Find Universities
          </Link>
        </div>
      </div>
    </header>
  );
}
