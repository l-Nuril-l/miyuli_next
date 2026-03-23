"use server";

import { cookies } from "next/headers";

export async function setTokenCookie() {
    (await cookies()).set("token", Math.random().toString(36).slice(2), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
    });

    return Math.random().toString(36).slice(2);
}