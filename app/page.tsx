import { Metadata } from "next";

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

export default function Home() {
  return <main className="flex min-h-screen flex-col items-center justify-between p-24">HELLO</main>;
}
