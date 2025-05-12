import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Levelin - Decentralized Proof-of-Work Platform",
  description:
    "Levelin is a decentralized platform on the Solana blockchain that empowers professionals to prove their expertise through challenges. Level up your career with blockchain-based proof-of-work.",
  keywords: [
    "Levelin",
    "decentralized platform",
    "proof-of-work",
    "Solana blockchain",
    "career challenges",
    "blockchain technology",
    "professional growth",
    "crypto challenges",
    "Web3 platform",
    "Solana ecosystem",
    "blockchain-based career",
    "decentralized applications",
    "blockchain innovation",
    "proof-of-skill",
    "blockchain for professionals",
    "Solana dApps",
    "career advancement",
    "blockchain expertise",
    "decentralized career growth",
    "build-in-public",
    "Accountability as a Service",
    "Web3 accountability",
    "Web3 career",
    "Web3 challenges",
    "Web3 proof-of-work",
  ],
  authors: [{ name: "Levelin Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
