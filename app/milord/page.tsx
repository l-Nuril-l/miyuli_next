import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/milord",
    images: {
      url: "http://miyulibackend.pp.ua/api/photo/68",
      secureUrl: "https://miyulibackend.pp.ua/api/photo/68",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/30",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/30",
      width: 1280,
      height: 720,
      type: "text/html",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = () => {
  return (
    <>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/30"></video>
    </>
  );
};

export default PlayerPage;
