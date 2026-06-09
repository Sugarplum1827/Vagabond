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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e4ef]">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display text-[#0d0d14] tracking-tight group-hover:text-[#ff5c47] transition-colors">
              Vagabond
            </span>
            <span
              className="text-xs font-mono bg-[#f5c842] text-[#0d0d14] px-2 py-0.5 rounded-full font-semibold"
              style={{ letterSpacing: "0.05em" }}
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-[#fff0ee] text-[#ff5c47]"
                    : "text-[#6b7a99] hover:text-[#0d0d14] hover:bg-[#f4f5fa]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/search" className="btn-primary text-sm py-2 px-4">
            Find Universities
          </Link>
        </div>
      </div>
    </header>
  );
}
