import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Build Crew — Model Cost Estimator",
  description: "Choose the least expensive AI model that meets your workload and quality bar.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "AI Build Crew", description: "Pick the right model. Know the cost.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
