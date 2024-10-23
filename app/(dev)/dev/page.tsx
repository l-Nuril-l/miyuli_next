"use server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { useParams } from "next/navigation";
import Button from "./(dev)/button";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "GENERATED TITLE",
    description: "GEN DES",
    openGraph: {
      title: "OTG",
      url: "/",
    },
  };
}

export async function setTokenCookie() {
  "use server";
  (await cookies()).set("token", Math.random().toString(36).slice(2), {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Math.random().toString(36).slice(2);
}

export default async function Home() {
  const cookiesStore = await cookies();
  const params = useParams();
  const headerStore = await headers();
  const token = cookiesStore.get("token");
  const theme = cookiesStore.get("theme");
  const locale = cookiesStore.get("NEXT_LOCALE");
  const userAgent = headerStore.get("user-agent") || "";
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      HELLO
      {t("adminPanel")}
      {token?.value}-{theme?.value}-{locale?.value}-{userAgent}
      <Button />
    </main>
  );
}
