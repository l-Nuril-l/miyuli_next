"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

export default async function Home() {
  const cookiesStore = await cookies();
  permanentRedirect(cookiesStore.has("auth") ? "feed" : "login");
}
