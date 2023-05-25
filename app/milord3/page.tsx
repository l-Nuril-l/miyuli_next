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
    },
    videos: {
      url: "http://h.zipdox.net/thursday/embed.webm",
      secureUrl: "https://h.zipdox.net/thursday/embed.webm",
      width: 1280,
      height: 720,
      type: "text/html",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = () => {
  return (
    <>
      <video controls src="http://h.zipdox.net/thursday/embed.webm"></video>
    </>
  );
};

export default PlayerPage;
