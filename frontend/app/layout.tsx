import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vagabond — Search Universities Worldwide",
  description:
    "Search scholarships & universities worldwide for Filipino students. Upload your transcript, find your GPA, discover matching universities.",
  keywords: "Filipino students, university search, scholarships, study abroad, GPA",
  openGraph: {
    title: "Vagabond — Search Universities Worldwide",
    description: "Search scholarships & universities worldwide for Filipino students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
