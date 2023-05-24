import { Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    images: {
      url: "http://miyulibackend.pp.ua/api/photo/68",
    },
    url: "/player",
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1",
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
