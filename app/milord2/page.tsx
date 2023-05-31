import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/milord2",
    images: {
      url: "http://miyulibackend.pp.ua/api/photo/68",
      secureUrl: "https://miyulibackend.pp.ua/api/photo/68",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1.webm",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/1.webm",
      width: 1280,
      height: 720,
      type: "text/html",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = () => {
  return (
    <>
      <video controls src="http://miyulibackend.pp.ua/api/video/stream/1"></video>
    </>
  );
};

export default PlayerPage;
