import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/milord3",
    images: {
      url: "http://miyulibackend.pp.ua/api/video/thumbnail/1",
      secureUrl: "https://miyulibackend.pp.ua/video/thumbnail/1",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1.mp4",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/1.mp4",
      width: 1280,
      height: 720,
      type: "text/html",
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
