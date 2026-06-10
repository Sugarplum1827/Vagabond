import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vagabond — Forge Your Path Beyond Borders",
  description: "Upload your transcript and discover universities worldwide for Filipino students. Free, private, and instant.",
  keywords: "Filipino students, university search, scholarships, study abroad, GPA, transcript",
  openGraph: {
    title: "Vagabond — Forge Your Path Beyond Borders",
    description: "Upload your transcript and discover universities worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
