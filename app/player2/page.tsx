import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  metadataBase: new URL("https://miyulibackend.pp.ua/api"),
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    images: {
      url: "http://miyulibackend.pp.ua/api/photo/68",
      secureUrl: "https://miyulibackend.pp.ua/api/photo/68",
    },
    url: "/video/stream/1",
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/1",
      width: 1280,
      height: 720,
      type: "video/mpeg",
    },
    type: "video.other",
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
