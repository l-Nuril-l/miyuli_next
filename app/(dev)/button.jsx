'use client'
import { useAppSelector } from "@/lib/hooks";
import { setCookie } from "cookies-next";
import { setTokenCookie } from "../page";

export default function Button() {
    const store = useAppSelector((x) => x.theme);
    return (
        <div>
            <div>theme:{store?.theme}</div>
            <button onClick={async () => await setTokenCookie().then(x => console.log(x))}> 123</button >
            <button onClick={async () => await setCookie("theme", Math.random().toString(36))}>TEST THEME</button >
        </div>
    )
}
