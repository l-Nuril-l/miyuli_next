import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  metadataBase: new URL("https://miyulibackend.pp.ua/api"),
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    images: {
      url: "/photo/68",
      secureUrl: "/photo/68",
    },
    url: "/video/stream/1",
    videos: {
      url: "/video/stream/1",
      secureUrl: "/video/stream/1",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = () => {
  return (
    <>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/1"></video>
    </>
  );
};

export default PlayerPage;
