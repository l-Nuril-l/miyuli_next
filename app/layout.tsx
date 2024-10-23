import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "../styles/root_colors.scss";
import Providers from "./_providers/providers";
import "./App.scss";
import "./globals.css";
import "./index.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Miyuli",
  charset: "utf-8",
  icon: "/favicon.ico",
  description: "Social network",
  openGraph: {
    title: "Miyuli",
    type: "website",
    siteName: "Miyuli",
    url: "", // Specify the URL here
    image: "/logo300.png",
  },
  googleSiteVerification: "cbOF2bCL4tHhiHoouQs7nzN9jalfP3-c4mE8lFZ1w9k",
  appleTouchIcon: "/logo192.png",
  manifest: "/manifest.json",
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.formSerializer = {
  indexes: null,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
