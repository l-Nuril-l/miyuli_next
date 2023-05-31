import axios from "axios";
import { GetServerSideProps, Metadata } from "next";
import Head from "next/head";
import { FunctionComponent } from "react";

interface PlayerPageProps {
  video: IVideo;
}

interface IVideo {
  id: number;
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/milord2",
    images: {
      url: "http://miyulibackend.pp.ua/api/video/thumbnail/5",
      secureUrl: "https://miyulibackend.pp.ua/video/thumbnail/5",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/5.mp4",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/5.mp4",
      width: 1280,
      height: 720,
      type: "text/html",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = ({ video }) => {
  return (
    <>
      <Head>
        <meta name="title" content={video.title} />
        <meta name="og:title" content={"og" + video.title} />
        <meta name="description" content={"og" + video.description} />
        <meta name="og:description" content={video.description} />
        <meta name="og:video:url" content="http://miyulibackend.pp.ua/api/video/stream/5.mp4" />
        <meta name="og:video:secure_url" content="https://miyulibackend.pp.ua/api/video/stream/5.mp4" />
      </Head>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/5"></video>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async () => {
  const video = (await axios.get<IVideo>(`https://miyulibackend.pp.ua/api/video/5`)).data;
  return { props: { video } };
};

export default PlayerPage;
