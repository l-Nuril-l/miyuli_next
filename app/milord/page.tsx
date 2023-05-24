import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/player",
    images: {
      url: "http://miyulibackend.pp.ua/api/photo/68",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1",
      width: 1280,
      height: 720,
      type: "video/mpeg",
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
