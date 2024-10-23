"use server";

import ClientComponent from "@/components/ClientComponent";
import ServerComponent from "@/components/ServerComponent";

export default async function Page() {
    return (
        <>
            <ServerComponent />
            <ClientComponent />
        </>
    )
}
