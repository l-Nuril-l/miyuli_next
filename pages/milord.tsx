import axios from "axios";
import { GetServerSideProps, Metadata, NextPage } from "next";
import Head from "next/head";

interface PlayerPageProps {
  video: IVideo;
}

interface IVideo {
  id: string;
  title: string;
  description: string;
}

export async function generateMetadata({ video }: PlayerPageProps): Promise<Metadata> {
  return {
    title: "Milord",
    description: "Test SSR",
    openGraph: {
      title: "Milord Video",
      type: "video.other",
      url: "/milord",
      images: {
        url: `http://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`,
        secureUrl: `https://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`,
      },
      videos: {
        url: `http://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`,
        secureUrl: `https://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`,
        width: 1280,
        height: 720,
        type: "text/html",
      },
    },
  };
}

const PlayerPage: NextPage<PlayerPageProps> = ({ video }) => {
  return (
    <>
      <Head>
        <meta name="title" content={video.title} />
        <meta name="og:title" content={"og" + video.title} />
        <meta name="description" content={"og" + video.description} />
        <meta name="og:description" content={video.description} />
      </Head>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/1"></video>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async () => {
  const video = (await axios.get<IVideo>(`https://miyulibackend.pp.ua/api/video/1`)).data;

  return { props: { video } };
};

export default PlayerPage;
