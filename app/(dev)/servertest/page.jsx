"use server";

import ClientComponent from "@/components/ClientComponent";
import ServerComponent from "@/components/ServerComponent";

export default async function Page() {
    console.log("SERVER TEST PAGE ASSDFGGG");
    return (
        <>
            <ServerComponent />
            <ClientComponent />
        </>
    )
}
