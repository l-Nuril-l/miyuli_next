"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookiesStore = await cookies();
  redirect(cookiesStore.has("auth") ? "feed" : "login");
}
